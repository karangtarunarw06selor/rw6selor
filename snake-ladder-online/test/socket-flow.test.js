"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { io: Client } = require("socket.io-client");
const { server, io, rooms } = require("../server");

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
