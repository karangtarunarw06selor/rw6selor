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
