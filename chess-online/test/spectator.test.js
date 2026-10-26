"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { io: Client } = require("socket.io-client");
const { server, io, rooms } = require("../server");

const waitFor = (socket, event, predicate = () => true) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => { socket.off(event, listener); reject(new Error(`Timeout ${event}`)); }, 1500);
  const listener = (payload) => { if (!predicate(payload)) return; clearTimeout(timer); socket.off(event, listener); resolve(payload); };
  socket.on(event, listener);
});
const connect = (port) => new Promise((resolve, reject) => {
  const socket = Client(`http://127.0.0.1:${port}`, { path: "/chess/socket.io", transports: ["websocket"], forceNew: true });
  socket.once("connect", () => resolve(socket)); socket.once("connect_error", reject);
});
const join = async (socket, code) => { const result = waitFor(socket, "joinedRoom"); socket.emit("joinRoom", code); return result; };

test("late chess joins are spectators with chat but no move or reset authority", async (context) => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const clients = [await connect(port), await connect(port), await connect(port), await connect(port)];
  context.after(() => { clients.forEach((socket) => socket.close()); io.close(); server.close(); Object.keys(rooms).forEach((code) => delete rooms[code]); });
  const code = "LATE01";
  assert.equal((await join(clients[0], code)).color, "white");
  assert.equal((await join(clients[1], code)).color, "black");
  const spectator = await join(clients[2], code);
  assert.equal(spectator.color, "spectator");
  assert.equal(spectator.status, "playing");
  assert.equal(spectator.players, 3);

  const invalidMove = waitFor(clients[2], "invalidMove");
  clients[2].emit("movePiece", { roomCode: code, fromRow: 6, fromCol: 0, toRow: 5, toCol: 0 });
  assert.match(await invalidMove, /giliran|player/i);
  const invalidReset = waitFor(clients[2], "invalidMove"); clients[2].emit("resetGame");
  assert.match(await invalidReset, /Penonton/);

  const chat = waitFor(clients[0], "room:chat"); clients[2].emit("room:chat", { text: "Halo <img src=x>" });
  const message = await chat;
  assert.equal(message.sender, "Penonton");
  assert.equal(message.text, "Halo <img src=x>");

  const stopped = waitFor(clients[1], "roomUpdate", (room) => room.status === "finished");
  clients[0].close();
  await stopped;
  const fourth = await join(clients[3], code);
  assert.equal(fourth.color, "spectator");
  assert.equal(fourth.status, "finished");
  const reset = waitFor(clients[1], "boardUpdated");
  clients[1].emit("resetGame");
  const nextGame = await reset;
  assert.equal(nextGame.status, "playing");
  assert.equal(nextGame.players, 3);
});
