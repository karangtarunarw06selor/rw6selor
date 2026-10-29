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
const emit = (socket, event, payload = {}) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`Event ${event} tidak membalas.`)), 2_000);
  socket.emit(event, payload, (response) => { clearTimeout(timer); resolve(response); });
});

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

test("public lobby chat carries names, history, room codes, and stays site-isolated", async () => {
  const mmsSender = await connect();
  const mmsReader = await connect();
  const ktReader = await connect();
  assert.equal((await emit(mmsSender, "lobby:chat:join", { siteId: "MMS" })).ok, true);
  assert.equal((await emit(mmsReader, "lobby:chat:join", { siteId: "MMS" })).ok, true);
  assert.equal((await emit(ktReader, "lobby:chat:join", { siteId: "KT" })).ok, true);
  const announced = new Promise((resolve) => mmsReader.once("lobby:chat:message", resolve));
  const created = await emit(mmsSender, "room:create", { name: "Budi", siteId: "MMS" });
  const code = created.room.code;
  assert.equal((await announced).roomCode, code);
  const received = new Promise((resolve) => mmsReader.once("lobby:chat:message", resolve));
  const sent = await emit(mmsSender, "lobby:chat:send", { siteId: "MMS", name: "Budi", text: `Masuk room ${code}` });
  assert.equal(sent.ok, true);
  assert.equal(sent.message.name, "Budi");
  assert.equal(sent.message.roomCode, code);
  assert.equal((await received).text, `Masuk room ${code}`);
  const history = await emit(mmsReader, "lobby:chat:history", { siteId: "MMS" });
  assert.equal(history.messages.at(-1).roomCode, code);
  assert.deepEqual((await emit(ktReader, "lobby:chat:history", { siteId: "KT" })).messages, []);
  assert.equal((await emit(mmsSender, "lobby:chat:send", { siteId: "MMS", name: "", text: "halo" })).ok, false);
  assert.equal((await emit(mmsSender, "lobby:chat:send", { siteId: "MMS", name: "Budi", text: "x".repeat(281) })).ok, false);
  const removed = new Promise((resolve) => mmsReader.once("lobby:chat:remove-room", resolve));
  mmsSender.disconnect();
  assert.deepEqual(await removed, { roomCode: code });
  const cleaned = await emit(mmsReader, "lobby:chat:history", { siteId: "MMS" });
  assert.equal(cleaned.messages.some((message) => message.roomCode === code), false);
});

test("room chat is membership-scoped, bounded, and available before game starts", async () => {
  const host = await connect();
  const guest = await connect();
  const outsider = await connect();
  const otherHost = await connect();
  const created = await emit(host, "room:create", { name: "Host", siteId: "MMS" });
  assert.equal((await emit(guest, "room:join", { name: "Guest", code: created.room.code, siteId: "MMS" })).ok, true);
  assert.equal((await emit(otherHost, "room:create", { name: "Other", siteId: "MMS" })).ok, true);
  assert.equal((await emit(outsider, "room:chat:send", { text: "menyusup" })).ok, false);
  const received = new Promise((resolve) => guest.once("room:chat:message", resolve));
  let leaked = false;
  otherHost.once("room:chat:message", () => { leaked = true; });
  const sent = await emit(host, "room:chat:send", { text: "  halo   room  " });
  assert.equal(sent.ok, true);
  assert.equal(sent.message.text, "halo room");
  assert.equal((await received).name, "Host");
  await new Promise((resolve) => setTimeout(resolve, 25));
  assert.equal(leaked, false);
  const history = await emit(guest, "room:chat:history");
  assert.equal(history.messages.length, 1);
  assert.equal(history.messages[0].text, "halo room");
  assert.equal((await emit(host, "room:chat:send", { text: "" })).ok, false);
});

test("host kicks an offline waiting-room player while guests cannot kick", async () => {
  const host = await connect();
  const guest = await connect();
  const created = await emit(host, "room:create", { name: "Host", siteId: "MMS" });
  const joined = await emit(guest, "room:join", { name: "Guest", code: created.room.code, siteId: "MMS" });
  assert.equal((await emit(guest, "room:kick", { playerId: created.playerId })).ok, false);
  guest.disconnect();
  const updated = new Promise((resolve) => {
    const onState = (room) => {
      if (room.players.some((player) => player.id === joined.playerId)) return;
      host.off("room:state", onState);
      resolve(room);
    };
    host.on("room:state", onState);
  });
  assert.equal((await emit(host, "room:kick", { playerId: joined.playerId })).ok, true);
  assert.equal((await updated).players.length, 1);
  assert.equal((await emit(host, "room:kick", { playerId: created.playerId })).ok, false);
});

test("explicit waiting-room leave removes the seat and transfers host without reload", async () => {
  const host = await connect();
  const guest = await connect();
  const created = await emit(host, "room:create", { name: "Host", siteId: "MMS" });
  const joined = await emit(guest, "room:join", { name: "Guest", code: created.room.code, siteId: "MMS" });
  const updated = new Promise((resolve) => {
    const onState = (room) => {
      if (room.players.length !== 1) return;
      guest.off("room:state", onState);
      resolve(room);
    };
    guest.on("room:state", onState);
  });
  assert.equal((await emit(host, "room:leave")).ok, true);
  const room = await updated;
  assert.equal(room.players.length, 1);
  assert.equal(room.players[0].id, joined.playerId);
  assert.equal(room.hostId, joined.playerId);
  assert.equal((await emit(host, "room:get")).ok, false);
});

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
  await emit(host, "room:mode", { mode: "holdem" });
  await emit(guest, "room:ready", { ready: true });
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

test("holdem stays at the table until every funded player confirms the next hand", async () => {
  const host = await connect();
  const guest = await connect();
  const created = await emit(host, "room:create", { name: "Host", siteId: "MMS" });
  const joined = await emit(guest, "room:join", { name: "Guest", code: created.room.code, siteId: "MMS" });
  await emit(host, "room:mode", { mode: "holdem" });
  await emit(guest, "room:ready", { ready: true });
  await emit(host, "game:start");
  let room = (await emit(host, "room:get")).room;
  const sockets = new Map([[created.playerId, host], [joined.playerId, guest]]);
  let actionNumber = 0;
  while (room.phase !== "finished") {
    const player = room.players.find((entry) => entry.id === room.turnId);
    const type = room.currentBet > player.bet ? "call" : "check";
    assert.equal((await emit(sockets.get(room.turnId), "game:action", { type, actionId: `showdown-${actionNumber++}` })).ok, true);
    room = (await emit(host, "room:get")).room;
  }
  assert.equal(room.matchFinished, false);
  assert.equal(room.lastResult.showdown.length, 2);
  assert.equal((await emit(host, "game:continue", { ready: true })).ok, true);
  room = (await emit(host, "room:get")).room;
  assert.equal(room.phase, "finished");
  assert.deepEqual(room.continueReadyIds, [created.playerId]);
  assert.equal((await emit(guest, "game:continue", { ready: true })).ok, true);
  room = (await emit(host, "room:get")).room;
  assert.equal(room.phase, "preflop");
  assert.equal(room.handNumber, 2);
});

test("host starts with ready players while resting players remain connected as spectators", async () => {
  const host = await connect();
  const ready = await connect();
  const resting = await connect();
  const created = await emit(host, "room:create", { name: "Host", siteId: "MMS" });
  const joinedReady = await emit(ready, "room:join", { name: "Ready", code: created.room.code, siteId: "MMS" });
  const joinedResting = await emit(resting, "room:join", { name: "Resting", code: created.room.code, siteId: "MMS" });
  assert.equal((await emit(host, "room:mode", { mode: "samgong" })).ok, true);
  assert.equal((await emit(host, "game:start")).ok, false);
  assert.equal((await emit(resting, "room:ready", { ready: true })).ok, true);
  assert.equal((await emit(resting, "room:ready", { ready: false })).ok, true);
  assert.equal((await emit(ready, "room:ready", { ready: true })).ok, true);
  assert.equal((await emit(host, "game:start")).ok, true);
  const hostView = (await emit(host, "room:get")).room;
  const readyView = (await emit(ready, "room:get")).room;
  const restingView = (await emit(resting, "room:get")).room;
  assert.equal(hostView.players.find((player) => player.id === created.playerId).playingRound, true);
  assert.equal(readyView.players.find((player) => player.id === joinedReady.playerId).playingRound, true);
  const spectator = restingView.players.find((player) => player.id === joinedResting.playerId);
  assert.equal(spectator.playingRound, false);
  assert.equal(spectator.cardCount, 0);
  assert.equal(restingView.readyIds.length, 0);
  assert.notEqual(restingView.turnId, joinedResting.playerId);
  assert.equal((await emit(resting, "game:action", { type: "reveal", actionId: "spectator-action" })).ok, false);
});

test("late joiner spectates the active hand, can use media, and waits for the next hand", async () => {
  const host = await connect();
  const guest = await connect();
  const spectator = await connect();
  const created = await emit(host, "room:create", { name: "Host", siteId: "MMS" });
  await emit(guest, "room:join", { name: "Guest", code: created.room.code, siteId: "MMS" });
  await emit(host, "room:mode", { mode: "holdem" });
  await emit(guest, "room:ready", { ready: true });
  assert.equal((await emit(host, "game:start")).ok, true);

  const joined = await emit(spectator, "room:join", { name: "Penonton", code: created.room.code, siteId: "MMS" });
  assert.equal(joined.ok, true);
  const seat = joined.room.players.find((player) => player.id === joined.playerId);
  assert.equal(seat.playingRound, false);
  assert.deepEqual(seat.hole, []);
  assert.notEqual(joined.room.turnId, joined.playerId);
  assert.equal((await emit(spectator, "game:action", { type: "fold", actionId: "late-spectator" })).ok, false);
  assert.equal((await emit(spectator, "media:join", { audio: true, video: false })).ok, true);
  assert.equal((await emit(spectator, "room:ready", { ready: true })).ok, false);

  for (let step = 0; step < 12; step += 1) {
    const state = (await emit(host, "room:get")).room;
    const spectatorState = state.players.find((player) => player.id === joined.playerId);
    assert.equal(spectatorState.playingRound, false);
    assert.deepEqual(spectatorState.hole, []);
    assert.notEqual(state.turnId, joined.playerId);
    if (state.phase === "finished") break;
    const actor = state.turnId === created.playerId ? host : guest;
    const actorState = state.players.find((player) => player.id === state.turnId);
    const action = state.currentBet > actorState.bet ? "call" : "check";
    assert.equal((await emit(actor, "game:action", { type: action, actionId: `finish-hand-${step}` })).ok, true);
  }

  const finished = (await emit(spectator, "room:get")).room;
  assert.equal(finished.phase, "finished");
  assert.equal(finished.players.find((player) => player.id === joined.playerId).playingRound, false);
  assert.equal((await emit(spectator, "room:ready", { ready: true })).ok, true);
});

test("host selects a mode only after another player joins and mode locks during play", async () => {
  const host = await connect();
  const guest = await connect();
  const created = await emit(host, "room:create", { name: "Host", siteId: "MMS" });
  assert.equal((await emit(host, "room:mode", { mode: "cangkulan" })).ok, false);
  await emit(guest, "room:join", { name: "Guest", code: created.room.code, siteId: "MMS" });
  assert.equal((await emit(guest, "room:mode", { mode: "cangkulan" })).ok, false);
  assert.equal((await emit(host, "game:start")).ok, false);
  assert.equal((await emit(host, "room:mode", { mode: "cangkulan" })).ok, true);
  const selected = (await emit(host, "room:get")).room;
  assert.equal(selected.mode, "cangkulan");
  await emit(guest, "room:ready", { ready: true });
  assert.equal((await emit(host, "game:start")).ok, true);
  assert.equal((await emit(host, "room:mode", { mode: "holdem" })).ok, false);
});

test("capsa banting requires all votes, resolves a tie to classic, and deals 13 private cards", async () => {
  const host = await connect();
  const guest = await connect();
  const created = await emit(host, "room:create", { name: "Host", siteId: "KT" });
  const joined = await emit(guest, "room:join", { name: "Guest", code: created.room.code, siteId: "KT" });
  assert.equal((await emit(host, "room:mode", { mode: "capsa-banting" })).ok, true);
  assert.equal((await emit(host, "game:start")).ok, false);
  assert.equal((await emit(guest, "room:ready", { ready: true })).ok, true);
  assert.equal((await emit(host, "capsa:vote", { rule: "free" })).ok, true);
  assert.equal((await emit(host, "game:start")).ok, false);
  assert.equal((await emit(guest, "capsa:vote", { rule: "wheel" })).ok, true);
  const voted = (await emit(host, "room:get")).room;
  assert.equal(voted.voteResult, "classic");
  assert.equal(voted.voteCount, 2);
  assert.equal((await emit(host, "game:start")).ok, true);
  const hostState = (await emit(host, "room:get")).room;
  assert.equal(hostState.mode, "capsa-banting");
  assert.equal(hostState.straightRule, "classic");
  assert.equal(hostState.players.find((p) => p.id === created.playerId).hand.length, 13);
  assert.deepEqual(hostState.players.find((p) => p.id === joined.playerId).hand, Array(13).fill(null));
});

test("capsa banting rejects selection when lobby has more than four players", async () => {
  const host = await connect();
  const created = await emit(host, "room:create", { name: "Host", siteId: "MMS" });
  for (let index = 1; index <= 4; index += 1) {
    const guest = await connect();
    assert.equal((await emit(guest, "room:join", { name: `P${index}`, code: created.room.code, siteId: "MMS" })).ok, true);
  }
  const denied = await emit(host, "room:mode", { mode: "capsa-banting" });
  assert.equal(denied.ok, false);
  assert.match(denied.error, /maksimal empat/i);
});

test("minuman enforces the house from server state and keeps hands private", async () => {
  const host = await connect();
  const guest = await connect();
  const created = await emit(host, "room:create", { name: "Host", siteId: "MMS" });
  await emit(guest, "room:join", { name: "Guest", code: created.room.code, siteId: "MMS" });
  await emit(host, "room:mode", { mode: "cangkulan" });
  await emit(guest, "room:ready", { ready: true });
  await emit(host, "game:start");
  const state = (await emit(host, "room:get")).room;
  const actorSocket = state.turnId === created.playerId ? host : guest;
  const observerSocket = actorSocket === host ? guest : host;
  const actorId = state.turnId;
  const actorState = (await emit(actorSocket, "room:get")).room;
  const hand = actorState.players.find((player) => player.id === actorId).hand;
  assert.equal(Boolean(actorState.openingCard), true);
  assert.equal(actorState.houseSuit, actorState.openingCard.suit);
  assert.deepEqual(actorState.currentTrick, []);
  const playable = hand.findIndex((card) => card.suit === actorState.houseSuit);
  const blocked = hand.findIndex((card) => card.suit !== actorState.houseSuit);
  if (blocked >= 0) assert.equal((await emit(actorSocket, "game:action", { type: "play", cardIndex: blocked, actionId: "blocked-card" })).ok, false);
  const action = playable >= 0
    ? { type: "play", cardIndex: playable, actionId: "legal-card" }
    : { type: "draw", actionId: "legal-drink" };
  assert.equal((await emit(actorSocket, "game:action", action)).ok, true);
  const next = (await emit(host, "room:get")).room;
  if (action.type === "play") {
    assert.notEqual(next.turnId, actorId);
    assert.equal(next.currentTrick.length, 1);
  } else {
    assert.equal(next.turnId, actorId);
    assert.equal(next.currentTrick.length, 0);
  }
  const observerView = (await emit(observerSocket, "room:get")).room;
  const hidden = observerView.players.find((player) => player.id === actorId).hand;
  assert.equal(hidden.length > 0, true);
  assert.equal(hidden.every((card) => card === null), true);
});

test("samgong deals three private cards, reveals in turn, and settles virtual scores", async () => {
  const host = await connect();
  const guest = await connect();
  const created = await emit(host, "room:create", { name: "Bandar", siteId: "MMS" });
  const joined = await emit(guest, "room:join", { name: "Tamu", code: created.room.code, siteId: "MMS" });
  assert.equal((await emit(host, "room:mode", { mode: "samgong" })).ok, true);
  assert.equal((await emit(guest, "room:ready", { ready: true })).ok, true);
  assert.equal((await emit(host, "game:start")).ok, true);
  let hostState = await emit(host, "room:get");
  let guestState = await emit(guest, "room:get");
  assert.equal(hostState.room.players.find((player) => player.id === created.playerId).hand.every(Boolean), true);
  assert.deepEqual(hostState.room.players.find((player) => player.id === joined.playerId).hand, [null, null, null]);
  assert.deepEqual(guestState.room.players.find((player) => player.id === created.playerId).hand, [null, null, null]);
  const firstSocket = hostState.room.turnId === created.playerId ? host : guest;
  const secondSocket = firstSocket === host ? guest : host;
  assert.equal((await emit(firstSocket, "game:action", { type: "reveal", actionId: "samgong-1" })).ok, true);
  assert.equal((await emit(secondSocket, "game:action", { type: "reveal", actionId: "samgong-2" })).ok, true);
  hostState = await emit(host, "room:get");
  assert.equal(hostState.room.phase, "finished");
  assert.equal(hostState.room.players.every((player) => player.hand.every(Boolean)), true);
  assert.equal(hostState.room.players.reduce((sum, player) => sum + player.score, 0), 0);
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
  await emit(host, "room:mode", { mode: "holdem" });
  await emit(guests[0], "room:ready", { ready: true });
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
  await emit(host, "room:mode", { mode: "holdem" });
  await emit(guest, "room:ready", { ready: true });
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
