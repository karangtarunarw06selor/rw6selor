"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { io: Client } = require("socket.io-client");
const { server, io, rooms, lobbyChats } = require("../server");

const emit = (socket, event, payload = {}) => new Promise((resolve) => socket.emit(event, payload, resolve));
const connect = (port) => new Promise((resolve, reject) => {
  const socket = Client(`http://127.0.0.1:${port}`, { path: "/ular-tangga/socket.io", transports: ["websocket"] });
  socket.once("connect", () => resolve(socket));
  socket.once("connect_error", reject);
});

test("two players create, join, and receive a server-authoritative roll", async (context) => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const host = await connect(port);
  const guest = await connect(port);
  context.after(() => { host.close(); guest.close(); io.close(); server.close(); rooms.clear(); });

  const created = await emit(host, "room:create", { name: "Host" });
  assert.equal(created.ok, true);
  assert.match(created.room.code, /^[A-F0-9]{6}$/);

  const joined = await emit(guest, "room:join", { name: "Teman", code: created.room.code });
  assert.equal(joined.ok, true);
  assert.equal(joined.room.players.length, 2);

  const rolled = await emit(host, "game:roll");
  assert.equal(rolled.ok, true);
  assert.ok(rolled.move.dice >= 1 && rolled.move.dice <= 6);
  assert.equal(rooms.get(created.room.code).turn, joined.playerId);

  const rejected = await emit(host, "game:roll");
  assert.equal(rejected.ok, false);
  assert.match(rejected.error, /giliran/i);
});

test("late joiner spectates until reset while active racers are ranked", async (context) => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const host = await connect(port);
  const second = await connect(port);
  const last = await connect(port);
  const crypto = require("node:crypto");
  const randomInt = crypto.randomInt;
  context.after(() => {
    crypto.randomInt = randomInt;
    host.close(); second.close(); last.close(); io.close(); server.close(); rooms.clear();
  });

  const created = await emit(host, "room:create", { name: "Juara", siteId: "MMS" });
  const joinedSecond = await emit(second, "room:join", { name: "Runner Up", code: created.room.code, siteId: "MMS" });
  const joinedLast = await emit(last, "room:join", { name: "Terakhir", code: created.room.code, siteId: "MMS" });
  const room = rooms.get(created.room.code);
  room.players.find((player) => player.id === created.playerId).position = 99;
  room.players.find((player) => player.id === joinedSecond.playerId).position = 99;
  room.players.find((player) => player.id === joinedLast.playerId).position = 42;
  crypto.randomInt = () => 1;

  const firstFinish = await emit(host, "game:roll");
  assert.equal(firstFinish.move.won, true);
  assert.deepEqual(room.finishOrder, [created.playerId, joinedSecond.playerId]);
  assert.equal(room.status, "finished");
  assert.equal(room.turn, null);
  assert.equal((await emit(host, "game:roll")).ok, false);
  assert.equal((await emit(last, "game:roll")).ok, false);
  assert.equal(room.players.find((player) => player.id === joinedLast.playerId).position, 42);
  assert.equal(room.activeIds.has(joinedLast.playerId), false);

  assert.equal((await emit(host, "game:reset")).ok, true);
  assert.equal(room.activeIds.has(joinedLast.playerId), true);
  assert.equal(room.status, "playing");
});

test("host kicks an offline player while guests and self-kick are rejected", async (context) => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const host = await connect(port);
  const guest = await connect(port);
  context.after(() => { host.close(); guest.close(); io.close(); server.close(); rooms.clear(); });

  const created = await emit(host, "room:create", { name: "Host", siteId: "MMS" });
  const joined = await emit(guest, "room:join", { name: "Teman", code: created.room.code, siteId: "MMS" });
  assert.equal((await emit(guest, "room:kick", { playerId: created.playerId })).ok, false);
  assert.equal((await emit(host, "room:kick", { playerId: created.playerId })).ok, false);
  guest.disconnect();
  assert.equal((await emit(host, "room:kick", { playerId: joined.playerId })).ok, true);
  assert.equal(rooms.get(created.room.code).players.length, 1);
  const retry = await connect(port);
  context.after(() => retry.close());
  assert.equal((await emit(retry, "room:reconnect", { code: created.room.code, playerId: joined.playerId, reconnectToken: joined.reconnectToken, siteId: "MMS" })).ok, false);
});

test("leaving a room removes the seat and reconnect session immediately", async (context) => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const host = await connect(port);
  const guest = await connect(port);
  context.after(() => { host.close(); guest.close(); io.close(); server.close(); rooms.clear(); });

  const created = await emit(host, "room:create", { name: "Host", siteId: "MMS" });
  const joined = await emit(guest, "room:join", { name: "Teman", code: created.room.code, siteId: "MMS" });
  assert.equal(joined.ok, true);
  const left = await emit(host, "room:leave");
  assert.equal(left.ok, true);
  assert.equal(rooms.get(created.room.code).players.some((player) => player.id === created.playerId), false);
  const reconnect = await emit(host, "room:reconnect", {
    code: created.room.code,
    playerId: created.playerId,
    reconnectToken: created.reconnectToken,
    siteId: "MMS",
  });
  assert.equal(reconnect.ok, false);
});

test("rooms are isolated by site identity", async (context) => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const host = await connect(port);
  const outsider = await connect(port);
  context.after(() => { host.close(); outsider.close(); io.close(); server.close(); rooms.clear(); });

  const created = await emit(host, "room:create", { name: "Karang Taruna", siteId: "KT" });
  assert.equal(created.ok, true);
  assert.equal(created.room.siteId, "KT");

  const wrongSite = await emit(outsider, "room:join", { name: "Muda Mudi", code: created.room.code, siteId: "MMS" });
  assert.equal(wrongSite.ok, false);
  assert.match(wrongSite.error, /situs ini/i);
});

test("public lobby chat is realtime, validated, and site-isolated", async (context) => {
  lobbyChats.set("MMS", []); lobbyChats.set("KT", []);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const mms = await connect(port);
  const mmsPeer = await connect(port);
  const kt = await connect(port);
  context.after(() => {
    mms.close(); mmsPeer.close(); kt.close(); io.close(); server.close(); rooms.clear();
    lobbyChats.set("MMS", []); lobbyChats.set("KT", []);
  });

  assert.equal((await emit(mms, "lobby:chat:join", { siteId: "MMS" })).ok, true);
  assert.equal((await emit(mmsPeer, "lobby:chat:join", { siteId: "MMS" })).ok, true);
  assert.equal((await emit(kt, "lobby:chat:join", { siteId: "KT" })).ok, true);
  const received = new Promise((resolve) => mmsPeer.once("lobby:chat:message", resolve));
  const sent = await emit(mms, "lobby:chat:send", { siteId: "MMS", name: "Ayu", text: "  Ayo main nanti malam  " });
  assert.equal(sent.ok, true);
  assert.equal((await received).text, "Ayo main nanti malam");
  assert.equal(lobbyChats.get("KT").length, 0);
  assert.equal((await emit(mms, "lobby:chat:send", { siteId: "MMS", name: "Ayu", text: "spam" })).ok, false);
  assert.equal((await emit(kt, "lobby:chat:send", { siteId: "MMS", name: "Luar", text: "salah situs" })).ok, false);
});

test("creating a room publishes a clickable lobby announcement only for its site", async (context) => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const host = await connect(port);
  const watcher = await connect(port);
  context.after(() => {
    host.close(); watcher.close(); io.close(); server.close(); rooms.clear();
    lobbyChats.set("MMS", []); lobbyChats.set("KT", []);
  });
  await emit(watcher, "lobby:chat:join", { siteId: "KT" });
  const announced = new Promise((resolve) => watcher.once("lobby:chat:message", resolve));
  const created = await emit(host, "room:create", { name: "Bima", siteId: "KT" });
  const message = await announced;
  assert.equal(message.roomCode, created.room.code);
  assert.match(message.text, new RegExp(created.room.code));
  assert.equal(lobbyChats.get("MMS").length, 0);
});

test("a disconnected player keeps the room and securely reconnects", async (context) => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const first = await connect(port);
  const created = await emit(first, "room:create", { name: "Ayu", siteId: "MMS" });
  const { code } = created.room;
  first.close();
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(rooms.has(code), true);
  assert.equal(rooms.get(code).players[0].connected, false);

  const resumed = await connect(port);
  context.after(() => {
    resumed.close(); io.close(); server.close(); rooms.clear();
    lobbyChats.set("MMS", []); lobbyChats.set("KT", []);
  });
  const rejected = await emit(resumed, "room:reconnect", { code, siteId: "MMS", playerId: created.playerId, reconnectToken: "wrong" });
  assert.equal(rejected.ok, false);
  const restored = await emit(resumed, "room:reconnect", { code, siteId: "MMS", playerId: created.playerId, reconnectToken: created.reconnectToken });
  assert.equal(restored.ok, true);
  assert.equal(restored.playerId, created.playerId);
  assert.equal(restored.room.players[0].connected, true);
});

test("voice signaling is limited to joined peers in the same room", async (context) => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const host = await connect(port);
  const guest = await connect(port);
  const outsider = await connect(port);
  context.after(() => { host.close(); guest.close(); outsider.close(); io.close(); server.close(); rooms.clear(); });

  const created = await emit(host, "room:create", { name: "Host", siteId: "KT" });
  const joined = await emit(guest, "room:join", { name: "Teman", code: created.room.code, siteId: "KT" });
  const otherRoom = await emit(outsider, "room:create", { name: "Luar", siteId: "KT" });
  assert.equal(joined.ok, true);
  assert.equal(otherRoom.ok, true);

  const hostVoiceState = new Promise((resolve) => guest.once("room:state", resolve));
  assert.equal((await emit(host, "voice:join")).ok, true);
  assert.equal((await hostVoiceState).players.find((player) => player.id === created.playerId).voice, true);
  const guestVoice = await emit(guest, "voice:join");
  assert.deepEqual(guestVoice.peers, [{ id: created.playerId, name: "Host" }]);

  const relayed = new Promise((resolve) => guest.once("voice:signal", resolve));
  const offer = { description: { type: "offer", sdp: "v=0\r\n" } };
  assert.equal((await emit(host, "voice:signal", { targetId: joined.playerId, signal: offer })).ok, true);
  assert.deepEqual((await relayed).signal, offer);

  const crossRoom = await emit(host, "voice:signal", { targetId: otherRoom.playerId, signal: offer });
  assert.equal(crossRoom.ok, false);
  const invalid = await emit(host, "voice:signal", { targetId: joined.playerId, signal: { arbitrary: true } });
  assert.equal(invalid.ok, false);
});
