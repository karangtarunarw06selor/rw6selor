"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { io: Client } = require("socket.io-client");

let server;
let baseUrl;
const clients = [];

const connect = () => new Promise((resolve, reject) => {
  const socket = Client(baseUrl, { path: "/poker/socket.io", transports: ["websocket"], forceNew: true });
  clients.push(socket);
  socket.once("connect", () => resolve(socket));
  socket.once("connect_error", reject);
});
const emit = (socket, event, payload = {}) => new Promise((resolve) => socket.emit(event, payload, resolve));

function freshServer() {
  delete require.cache[require.resolve("../server")];
  return require("../server");
}

test.before(async () => {
  ({ server } = freshServer());
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.afterEach(() => { while (clients.length) clients.pop().disconnect(); });
test.after(async () => { await new Promise((resolve) => server.close(resolve)); });

test("rooms are isolated by site and expose only viewer hole cards", async () => {
  const host = await connect();
  const guest = await connect();
  const outsider = await connect();
  const created = await emit(host, "room:create", { name: "Host", siteId: "MMS" });
  assert.equal(created.ok, true);
  const denied = await emit(outsider, "room:join", { name: "KT", code: created.room.code, siteId: "KT" });
  assert.equal(denied.ok, false);
  const joined = await emit(guest, "room:join", { name: "Guest", code: created.room.code, siteId: "MMS" });
  assert.equal(joined.ok, true);
  const started = await emit(host, "game:start");
  assert.equal(started.ok, true);
  assert.equal((await emit(host, "game:start")).ok, false);
  const hostState = await emit(host, "room:get");
  const guestState = await emit(guest, "room:get");
  assert.equal(hostState.room.players.find((p) => p.id === created.playerId).hole.every(Boolean), true);
  assert.deepEqual(hostState.room.players.find((p) => p.id === joined.playerId).hole, [null, null]);
  assert.equal(guestState.room.players.find((p) => p.id === joined.playerId).hole.every(Boolean), true);
  const actorSocket = hostState.room.turnId === created.playerId ? host : guest;
  assert.equal((await emit(actorSocket, "game:action", { type: "call" })).ok, false);
});

test("reconnect token restores the same player seat and replaces the old socket", async () => {
  const first = await connect();
  const created = await emit(first, "room:create", { name: "Reconnect", siteId: "MMS" });
  const replaced = new Promise((resolve) => first.once("session:replaced", resolve));
  const second = await connect();
  const result = await emit(second, "room:reconnect", { code: created.room.code, siteId: "MMS", token: created.token });
  await replaced;
  assert.equal(result.ok, true);
  assert.equal(result.playerId, created.playerId);
  assert.equal(first.connected, false);
  assert.equal((await emit(second, "room:get")).ok, true);
  const third = await connect();
  const denied = await emit(third, "room:reconnect", { code: created.room.code, siteId: "MMS", token: "wrong" });
  assert.equal(denied.ok, false);
});

test("only host starts and table accepts at most six players", async () => {
  const host = await connect();
  const created = await emit(host, "room:create", { name: "P1", siteId: "KT" });
  const guests = [];
  for (let index = 2; index <= 7; index += 1) {
    const socket = await connect();
    guests.push(socket);
    const result = await emit(socket, "room:join", { name: `P${index}`, code: created.room.code, siteId: "KT" });
    assert.equal(result.ok, index <= 6);
  }
  const denied = await emit(guests[0], "game:start");
  assert.equal(denied.ok, false);
  assert.equal((await emit(host, "game:start")).ok, true);
});

test("one socket cannot create or join multiple rooms", async () => {
  const socket = await connect();
  const created = await emit(socket, "room:create", { name: "One", siteId: "MMS" });
  assert.equal(created.ok, true);
  assert.equal((await emit(socket, "room:create", { name: "Two", siteId: "MMS" })).ok, false);
  assert.equal((await emit(socket, "room:join", { name: "Two", code: created.room.code, siteId: "MMS" })).ok, false);
});

test("duplicate action does not extend the next player's deadline", async () => {
  const host = await connect();
  const guest = await connect();
  const created = await emit(host, "room:create", { name: "Host", siteId: "MMS" });
  await emit(guest, "room:join", { name: "Guest", code: created.room.code, siteId: "MMS" });
  await emit(host, "game:start");
  const initial = (await emit(host, "room:get")).room;
  const actor = initial.turnId === created.playerId ? host : guest;
  const actionId = "duplicate-deadline";
  assert.equal((await emit(actor, "game:action", { type: "call", actionId })).ok, true);
  const afterAction = (await emit(host, "room:get")).room;
  await new Promise((resolve) => setTimeout(resolve, 10));
  assert.equal((await emit(actor, "game:action", { type: "call", actionId })).ok, true);
  const afterDuplicate = (await emit(host, "room:get")).room;
  assert.equal(afterDuplicate.turnDeadline, afterAction.turnDeadline);
  assert.notEqual(afterDuplicate.turnId, initial.turnId);
});

test("media signaling stays in room and limits active video publishers to four", async () => {
  const host = await connect();
  const created = await emit(host, "room:create", { name: "P1", siteId: "MMS" });
  const members = [{ socket: host, id: created.playerId }];
  for (let index = 2; index <= 5; index += 1) {
    const socket = await connect();
    const joined = await emit(socket, "room:join", { name: `P${index}`, code: created.room.code, siteId: "MMS" });
    members.push({ socket, id: joined.playerId });
  }
  for (const member of members) assert.equal((await emit(member.socket, "media:join", { audio: true, video: false })).ok, true);
  for (let index = 0; index < 4; index += 1) assert.equal((await emit(members[index].socket, "media:status", { audio: true, video: true })).ok, true);
  const fifth = await emit(members[4].socket, "media:status", { audio: true, video: true });
  assert.equal(fifth.ok, false);
  const signalReceived = new Promise((resolve) => members[1].socket.once("media:signal", resolve));
  const sent = await emit(host, "media:signal", { targetId: members[1].id, signal: { description: { type: "offer", sdp: "v=0" } } });
  assert.equal(sent.ok, true);
  assert.equal((await signalReceived).peerId, created.playerId);
});
