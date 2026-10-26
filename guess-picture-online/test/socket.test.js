"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { io: Client } = require("socket.io-client");
const { server, io, rooms, lobbyMessages } = require("../server");
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
  lobbyMessages.clear();
  context.after(() => { host.close(); guest.close(); io.close(); server.close(); rooms.clear(); lobbyMessages.clear(); });
  const created = await emit(host, "room:create", { name: "Ayu", siteId: "MMS" });
  const joined = await emit(guest, "room:join", { name: "Bima", code: created.room.code, siteId: "MMS" });
  return { host, guest, created, joined };
};

test("public lobby chat discovers active same-site rooms without cross-tenant leaks", async (context) => {
  const { host, guest, created } = await setup(context);
  const kt = await connect(server.address().port);
  context.after(() => kt.close());
  const hostLobby = await emit(host, "lobby:join", { siteId: "MMS" });
  const guestLobby = await emit(guest, "lobby:join", { siteId: "MMS" });
  const ktLobby = await emit(kt, "lobby:join", { siteId: "KT" });
  assert.deepEqual(hostLobby.rooms.map((room) => room.code), [created.room.code]);
  assert.deepEqual(guestLobby.rooms.map((room) => room.code), [created.room.code]);
  assert.deepEqual(ktLobby.rooms, []);

  const received = waitFor(guest, "lobby:chat", (message) => message.text.includes(created.room.code));
  let leaked = false; kt.on("lobby:chat", () => { leaked = true; });
  const sent = await emit(host, "lobby:chat", { siteId: "MMS", name: "<Ayu>", text: `Ayo gabung ${created.room.code} <img src=x>` });
  assert.equal(sent.ok, true);
  const message = await received;
  assert.equal(message.name, "Ayu");
  assert.equal(message.text, `Ayo gabung ${created.room.code} <img src=x>`);
  assert.deepEqual(message.roomCodes, [created.room.code]);
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(leaked, false);

  const limited = await emit(host, "lobby:chat", { siteId: "MMS", name: "Ayu", text: "pesan kedua" });
  assert.equal(limited.ok, false);
  assert.match(limited.error, /Tunggu/);
  const active = waitFor(guest, "lobby:state", (state) => state.rooms[0]?.status === "playing");
  assert.equal((await emit(host, "game:start")).ok, true);
  assert.equal((await active).rooms[0].code, created.room.code);
});

test("waiting room supports chat and media while one socket remains isolated to one room", async (context) => {
  const { host, guest, created } = await setup(context);
  const outsider = await connect(server.address().port); context.after(() => outsider.close());
  assert.equal((await emit(outsider, "media:update", { voice: true, video: true })).error, "Masuk ke room terlebih dahulu.");
  assert.equal((await emit(host, "media:update", { voice: true, video: true })).ok, true);
  assert.equal(created.room.messages.length, 0);
  assert.equal(rooms.get(created.room.code).messages[0].text, "Bima masuk ke room.");
  const waitingChat = await emit(host, "guess:submit", { text: "halo sebelum mulai" });
  assert.equal(waitingChat.ok, true);
  assert.equal(waitingChat.kind, "chat");
  assert.equal((await emit(host, "room:create", { name: "Ayu", siteId: "KT" })).ok, false);
  assert.equal((await emit(host, "room:join", { name: "Ayu", code: created.room.code, siteId: "MMS" })).ok, false);
  assert.equal((await emit(host, "room:reconnect", { code: created.room.code, playerId: created.playerId, reconnectToken: created.reconnectToken, siteId: "MMS" })).ok, false);
  assert.equal(rooms.get(created.room.code).players.length, 2);
  assert.equal(guest.connected, true);
});

test("late joiner spectates gameplay but can use room chat", async (context) => {
  const { host, guest, created } = await setup(context);
  assert.equal((await emit(host, "game:start")).ok, true);
  const spectator = await connect(server.address().port);
  context.after(() => spectator.close());
  let secretLeaked = false; spectator.on("round:secret", () => { secretLeaked = true; });
  const joined = await emit(spectator, "room:join", { name: "Citra", code: created.room.code, siteId: "MMS" });
  assert.equal(joined.ok, true);
  assert.equal(joined.room.status, "playing");
  assert.equal(joined.room.players.find((player) => player.id === joined.playerId).participant, false);
  const spectatorChat = waitFor(host, "room:message", (message) => message.name === "Citra");
  const spectatorReply = await emit(spectator, "guess:submit", { text: "semangat ya <b>" });
  assert.deepEqual({ ok: spectatorReply.ok, kind: spectatorReply.kind }, { ok: true, kind: "chat" });
  const chatMessage = await spectatorChat;
  assert.deepEqual({ type: chatMessage.type, playerId: chatMessage.playerId, name: chatMessage.name, text: chatMessage.text }, { type: "chat", playerId: joined.playerId, name: "Citra", text: "semangat ya <b>" });
  assert.equal((await emit(spectator, "round:report")).ok, false);
  assert.equal((await emit(spectator, "media:update", { voice: true, video: false })).ok, true);
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(secretLeaked, false);
  assert.equal(rooms.get(created.room.code).activeIds.has(joined.playerId), false);
  const room = rooms.get(created.room.code);
  assert.equal(room.activeIds.size, 2);
  assert.equal(room.players.length, 3);
  assert.equal(guest.connected, true);

  clearTimeout(room.roundTimer);
  room.status = "finished";
  room.players[0].score = 9;
  assert.equal((await emit(host, "game:start")).ok, true);
  assert.equal(room.activeIds.has(joined.playerId), true);
  assert.equal(room.activeIds.size, 3);
  assert.equal(room.players[0].score, 0);
  assert.equal(room.status, "playing");
});

test("only the drawer receives the secret question", async (context) => {
  const { host, guest } = await setup(context);
  const secret = new Promise((resolve) => host.once("round:secret", resolve));
  const guestStatePromise = waitFor(guest, "room:state", (room) => room.status === "playing");
  let leaked = false; guest.on("round:secret", () => { leaked = true; });
  const started = await emit(host, "game:start");
  assert.equal(started.ok, true);
  const [value, guestState] = await Promise.all([secret, guestStatePromise]);
  assert.ok(value.answer); assert.ok(value.image); assert.ok(value.forbidden.length);
  assert.ok(guestState.deadline - Date.now() > 299_000);
  assert.ok(guestState.deadline - Date.now() <= 5 * 60_000);
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(leaked, false);
  const encoded = JSON.stringify(guestState).toLowerCase();
  assert.equal(encoded.includes(value.answer.toLowerCase()), false);
  assert.equal(encoded.includes("aliases"), false);
  assert.equal(encoded.includes("forbidden"), false);
  assert.equal(encoded.includes("image"), false);
  const drawerLeak = await emit(host, "guess:submit", { text: `jawabannya ${value.answer}` });
  assert.equal(drawerLeak.ok, false);
  assert.match(drawerLeak.error, /rahasia/);
});

test("fastest normalized answer wins and points are recorded immediately", async (context) => {
  const { host, guest, joined } = await setup(context);
  const secretPromise = new Promise((resolve) => host.once("round:secret", resolve));
  await emit(host, "game:start"); const secret = await secretPromise;
  const answer = `  ${secret.answer.toUpperCase().replace(/ /g, "---")}!! `;
  const hostResult = waitFor(host, "room:state", (room) => room.status === "result");
  const guestResult = waitFor(guest, "room:state", (room) => room.status === "result");
  const correctMessage = waitFor(host, "room:message", (message) => message.type === "correct");
  const result = await emit(guest, "guess:submit", { text: answer });
  assert.equal(result.correct, true);
  assert.equal((await correctMessage).text, "");
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

test("wrong answers appear in room chat without affecting score", async (context) => {
  const { host, guest } = await setup(context);
  await emit(host, "game:start");
  const publicGuess = waitFor(host, "room:message", (message) => message.type === "guess");
  const result = await emit(guest, "guess:submit", { text: "jawaban salah <img>" });
  assert.deepEqual({ correct: result.correct, kind: result.kind }, { correct: false, kind: "guess" });
  const message = await publicGuess;
  assert.equal(message.text, "jawaban salah <img>");
  const limited = await emit(guest, "guess:submit", { text: "spam kedua" });
  assert.equal(limited.ok, false);
  assert.match(limited.error, /Tunggu/);
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

test("host screen-off keeps the active room for a five-minute reconnect grace", async (context) => {
  const { host, created } = await setup(context);
  await emit(host, "game:start");
  const room = rooms.get(created.room.code);
  const round = room.round;
  host.close(); await new Promise((resolve) => setTimeout(resolve, 20));
  const hostSeat = room.players.find((player) => player.id === created.playerId);
  assert.equal(room.status, "playing");
  assert.equal(room.round, round);
  assert.equal(hostSeat.connected, false);
  assert.equal(hostSeat.cleanupTimer?._idleTimeout, 5 * 60_000);
  const resumed = await connect(server.address().port); context.after(() => resumed.close());
  const restored = await emit(resumed, "room:reconnect", { code: created.room.code, siteId: "MMS", playerId: created.playerId, reconnectToken: created.reconnectToken });
  assert.equal(restored.ok, true);
  assert.equal(restored.room.status, "playing");
  assert.equal(room.players.find((player) => player.id === created.playerId).connected, true);
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
