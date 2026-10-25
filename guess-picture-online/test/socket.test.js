"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { io: Client } = require("socket.io-client");
const { server, io, rooms } = require("../server");
const emit = (socket, event, payload = {}) => new Promise((resolve) => socket.emit(event, payload, resolve));
const waitFor = (socket, event, predicate) => new Promise((resolve) => {
  const listener = (payload) => { if (predicate(payload)) { socket.off(event, listener); resolve(payload); } };
  socket.on(event, listener);
});
const connect = (port) => new Promise((resolve, reject) => { const socket = Client(`http://127.0.0.1:${port}`, { path: "/tebak-gambar/socket.io", transports: ["websocket"] }); socket.once("connect", () => resolve(socket)); socket.once("connect_error", reject); });

const setup = async (context) => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const host = await connect(port), guest = await connect(port);
  context.after(() => { host.close(); guest.close(); io.close(); server.close(); rooms.clear(); });
  const created = await emit(host, "room:create", { name: "Ayu", siteId: "MMS" });
  const joined = await emit(guest, "room:join", { name: "Bima", code: created.room.code, siteId: "MMS" });
  return { host, guest, created, joined };
};

test("only the drawer receives the secret question", async (context) => {
  const { host, guest } = await setup(context);
  const secret = new Promise((resolve) => host.once("round:secret", resolve));
  const guestStatePromise = waitFor(guest, "room:state", (room) => room.status === "playing");
  let leaked = false; guest.on("round:secret", () => { leaked = true; });
  const started = await emit(host, "game:start");
  assert.equal(started.ok, true);
  const [value, guestState] = await Promise.all([secret, guestStatePromise]);
  assert.ok(value.answer); assert.ok(value.image); assert.ok(value.forbidden.length);
  assert.ok(guestState.deadline - Date.now() > 59_000);
  assert.ok(guestState.deadline - Date.now() <= 60_000);
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(leaked, false);
  const encoded = JSON.stringify(guestState).toLowerCase();
  assert.equal(encoded.includes(value.answer.toLowerCase()), false);
  assert.equal(encoded.includes("aliases"), false);
  assert.equal(encoded.includes("forbidden"), false);
  assert.equal(encoded.includes("image"), false);
});

test("fastest normalized answer wins and points are recorded immediately", async (context) => {
  const { host, guest, joined } = await setup(context);
  const secretPromise = new Promise((resolve) => host.once("round:secret", resolve));
  await emit(host, "game:start"); const secret = await secretPromise;
  const answer = `  ${secret.answer.toUpperCase().replace(/ /g, "---")}!! `;
  const hostResult = waitFor(host, "room:state", (room) => room.status === "result");
  const guestResult = waitFor(guest, "room:state", (room) => room.status === "result");
  const result = await emit(guest, "guess:submit", { text: answer });
  assert.equal(result.correct, true);
  const [hostState, guestState] = await Promise.all([hostResult, guestResult]);
  assert.equal(hostState.result.winnerId, joined.playerId);
  assert.equal(guestState.result.winnerId, joined.playerId);
  assert.equal(hostState.answerReveal, secret.answer);
  assert.deepEqual(hostState.result, guestState.result);
  const room = [...rooms.values()][0];
  assert.equal(room.status, "result");
  assert.equal(room.players.find((p) => p.id === joined.playerId).score, 4);
  assert.equal(room.players[0].score, 3);
  assert.ok(room.result.elapsedMs >= 0);
});

test("wrong answers stay private and do not affect score", async (context) => {
  const { host, guest } = await setup(context);
  await emit(host, "game:start");
  let leaked = false; host.on("guess:feedback", () => { leaked = true; });
  const result = await emit(guest, "guess:submit", { text: "jawaban salah" });
  assert.equal(result.correct, false); await new Promise((resolve) => setTimeout(resolve, 10));
  assert.equal(leaked, false);
  assert.equal([...rooms.values()][0].players[1].score, 0);
});

test("empty timeout penalizes the drawer", async (context) => {
  const { host } = await setup(context);
  await emit(host, "game:start");
  const room = [...rooms.values()][0];
  const drawer = room.players[0];
  const { finishRound } = require("../server");
  finishRound(room, { reason: "timeout" });
  assert.equal(drawer.score, -1);
  clearTimeout(room.nextTimer);
});

test("a difficult clue with real strokes times out without penalizing the drawer", async (context) => {
  const { host } = await setup(context);
  await emit(host, "game:start");
  const room = [...rooms.values()][0];
  const drawer = room.players[0];
  assert.equal((await emit(host, "clue:stroke", { clueIndex: 0, points: [[0.1, 0.1], [0.2, 0.2]], color: "#111827", size: 5 })).ok, true);
  const { finishRound } = require("../server");
  finishRound(room, { reason: "timeout" });
  assert.equal(drawer.score, 0);
  clearTimeout(room.nextTimer);
});

test("majority reports let the host apply a violation penalty", async (context) => {
  const { host, guest } = await setup(context);
  await emit(host, "game:start");
  assert.equal((await emit(guest, "round:report")).ok, true);
  const moderated = await emit(host, "round:moderate", { action: "penalty" });
  assert.equal(moderated.ok, true);
  const room = [...rooms.values()][0];
  assert.equal(room.players[0].score, -2);
  assert.equal(room.result.reason, "violation");
  clearTimeout(room.nextTimer);
});

test("reconnect token restores the same seat and rejects impostors", async (context) => {
  const { guest, created, joined } = await setup(context);
  guest.close(); await new Promise((resolve) => setTimeout(resolve, 15));
  const resumed = await connect(server.address().port); context.after(() => resumed.close());
  assert.equal((await emit(resumed, "room:reconnect", { code: created.room.code, siteId: "MMS", playerId: joined.playerId, reconnectToken: "bad" })).ok, false);
  const restored = await emit(resumed, "room:reconnect", { code: created.room.code, siteId: "MMS", playerId: joined.playerId, reconnectToken: joined.reconnectToken });
  assert.equal(restored.ok, true); assert.equal(restored.playerId, joined.playerId);
});

test("explicit leave removes the seat and returns the socket to lobby state", async (context) => {
  const { host, guest, created, joined } = await setup(context);
  const hostUpdate = waitFor(host, "room:state", (room) => room.players.length === 1);
  const left = await emit(guest, "room:leave");
  assert.equal(left.ok, true);
  const room = await hostUpdate;
  assert.equal(room.players.some((player) => player.id === joined.playerId), false);
  assert.equal((await emit(guest, "room:reconnect", {
    code: created.room.code,
    siteId: "MMS",
    playerId: joined.playerId,
    reconnectToken: joined.reconnectToken,
  })).ok, false);
  assert.equal((await emit(guest, "room:create", { name: "Bima", siteId: "MMS" })).ok, true);
});
