"use strict";

const express = require("express");
const http = require("http");
const path = require("path");
const crypto = require("crypto");
const { Server } = require("socket.io");
const { PokerTable } = require("./poker-engine");
const { BigTwoTable, CangkulanTable, SamgongTable } = require("./game-modes");

const app = express();
const server = http.createServer(app);
const socketPath = process.env.SOCKET_PATH || "/poker/socket.io";
const io = new Server(server, { path: socketPath, cors: { origin: false }, maxHttpBufferSize: 32_768 });
const PORT = Number(process.env.PORT) || 3051;
const EMPTY_ROOM_TTL = Number(process.env.EMPTY_ROOM_TTL) || 10 * 60_000;
const rooms = new Map();
const lobbyChats = new Map([["MMS", []], ["KT", []]]);

app.use("/poker", express.static(path.join(__dirname, "public")));
app.get("/health", (_request, response) => response.json({ ok: true, rooms: rooms.size }));
app.get("/", (_request, response) => response.redirect("/poker/"));

const cleanName = (value) => String(value || "").trim().replace(/\s+/g, " ").slice(0, 20);
const cleanSiteId = (value) => String(value || "MMS").trim().toUpperCase() === "KT" ? "KT" : "MMS";
const cleanCode = (value) => String(value || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
const newCode = () => crypto.randomBytes(4).toString("hex").slice(0, 6).toUpperCase();
const roomChannel = (room) => `poker:${room.siteId}:${room.code}`;
const lobbyChannel = (siteId) => `poker:lobby:${siteId}`;
const mediaView = (player) => ({ audio: Boolean(player.media?.audio), video: Boolean(player.media?.video) });
const tokenDigest = (value) => crypto.createHash("sha256").update(String(value || "")).digest();
const validToken = (expected, received) => expected === received && crypto.timingSafeEqual(tokenDigest(expected), tokenDigest(received));

function publicView(room, viewerId) {
  const view = room.table.viewFor(viewerId);
  view.mode = room.mode;
  view.hostId = room.hostId;
  view.turnDeadline = room.turnDeadline || null;
  view.voteCount = room.capsaVotes?.size || 0;
  view.voteResult = room.capsaVoteResult || null;
  view.myVote = room.capsaVotes?.get(viewerId) || null;
  view.readyIds = [...room.readyIds];
  view.players = view.players.map((player) => {
    const source = room.table.players.find((item) => item.id === player.id);
    return { ...player, media: mediaView(source), ready: room.readyIds.has(player.id) };
  });
  return view;
}

function emitRoom(room) {
  room.table.players.forEach((player) => {
    if (player.connected && player.socketId) io.to(player.socketId).emit("room:state", publicView(room, player.id));
  });
}

function createTable(mode, room) {
  if (mode === "holdem") return new PokerTable({ code: room.code, siteId: room.siteId, smallBlind: 10, bigBlind: 20 });
  if (mode === "capsa-banting") return new BigTwoTable({ code: room.code, siteId: room.siteId, straightRule: room.capsaVoteResult || "classic" });
  if (mode === "cangkulan") return new CangkulanTable({ code: room.code, siteId: room.siteId });
  if (mode === "samgong") return new SamgongTable({ code: room.code, siteId: room.siteId });
  throw new Error("Mode permainan tidak valid.");
}

function selectMode(room, mode) {
  if (!["waiting", "finished"].includes(room.table.phase)) throw new Error("Mode terkunci selama ronde berjalan.");
  const table = createTable(mode, room);
  room.table.players.forEach((source) => {
    const player = table.addPlayer({ id: source.id, name: source.name, stack: source.stack || 1000 });
    Object.assign(player, {
      token: source.token,
      media: source.media,
      socketId: source.socketId,
      connected: source.connected,
      playingRound: source.playingRound,
    });
  });
  room.mode = mode;
  room.table = table;
  room.capsaVotes = new Map();
  room.capsaVoteResult = null;
  room.readyIds.clear();
}

function resolveCapsaVote(room) {
  const players = room.table.players.filter((player) => player.connected && (player.id === room.hostId || room.readyIds.has(player.id)));
  if (players.some((player) => !room.capsaVotes.has(player.id))) return null;
  const counts = { classic: 0, free: 0, wheel: 0 };
  players.forEach((player) => { counts[room.capsaVotes.get(player.id)] += 1; });
  const highest = Math.max(...Object.values(counts));
  const winners = Object.keys(counts).filter((rule) => counts[rule] === highest);
  return winners.length === 1 ? winners[0] : "classic";
}

function scheduleTurn(room) {
  if (room.turnTimer) clearTimeout(room.turnTimer);
  room.turnTimer = null;
  room.turnDeadline = null;
  const timedPhase = ["preflop", "flop", "turn", "river"].includes(room.table.phase) || (["capsa-banting", "samgong"].includes(room.mode) && room.table.phase === "playing");
  if (!timedPhase || !room.table.currentPlayer()) return;
  room.turnDeadline = Date.now() + 30_000;
  room.turnTimer = setTimeout(() => {
    room.table.timeoutCurrentPlayer();
    if (room.mode === "capsa-banting" && room.table.phase === "finished") {
      room.capsaVotes.clear();
      room.capsaVoteResult = null;
    }
    scheduleTurn(room);
    emitRoom(room);
  }, 30_000);
  room.turnTimer.unref();
}

function attach(socket, room, player) {
  player.socketId = socket.id;
  player.connected = true;
  socket.data.roomCode = room.code;
  socket.data.siteId = room.siteId;
  socket.data.playerId = player.id;
  socket.join(roomChannel(room));
}

function session(socket) {
  const room = rooms.get(socket.data.roomCode);
  if (!room || room.siteId !== socket.data.siteId) return {};
  return { room, player: room.table.players.find((item) => item.id === socket.data.playerId && item.socketId === socket.id) };
}

function safeSignal(signal) {
  if (!signal || typeof signal !== "object") return null;
  let serialized;
  try { serialized = JSON.stringify(signal); } catch { return null; }
  if (serialized.length > 16_384) return null;
  if (signal.description && ["offer", "answer"].includes(signal.description.type) && typeof signal.description.sdp === "string") {
    return { description: { type: signal.description.type, sdp: signal.description.sdp } };
  }
  if (signal.candidate && typeof signal.candidate.candidate === "string") {
    return { candidate: {
      candidate: signal.candidate.candidate,
      sdpMid: signal.candidate.sdpMid ?? null,
      sdpMLineIndex: signal.candidate.sdpMLineIndex ?? null,
      usernameFragment: signal.candidate.usernameFragment ?? null,
    } };
  }
  return null;
}

function leaveMedia(room, player) {
  if (!room || !player?.media || (!player.media.audio && !player.media.video)) return;
  player.media = { audio: false, video: false };
  io.to(roomChannel(room)).emit("media:peer-left", { peerId: player.id });
}

function publishLobbyMessage(siteId, name, text, roomCode = null) {
  const message = { id: crypto.randomUUID(), name, text, roomCode, createdAt: Date.now() };
  const history = lobbyChats.get(siteId);
  history.push(message);
  if (history.length > 50) history.splice(0, history.length - 50);
  io.to(lobbyChannel(siteId)).emit("lobby:chat:message", message);
  return message;
}

function removeRoomFromLobby(siteId, roomCode) {
  const history = lobbyChats.get(siteId);
  const remaining = history.filter((message) => message.roomCode !== roomCode);
  if (remaining.length === history.length) return;
  lobbyChats.set(siteId, remaining);
  io.to(lobbyChannel(siteId)).emit("lobby:chat:remove-room", { roomCode });
}

io.on("connection", (socket) => {
  socket.on("lobby:chat:join", ({ siteId: rawSiteId } = {}, reply = () => {}) => {
    const siteId = cleanSiteId(rawSiteId);
    socket.join(lobbyChannel(siteId));
    socket.data.lobbySiteId = siteId;
    reply({ ok: true, messages: lobbyChats.get(siteId) });
  });

  socket.on("lobby:chat:history", ({ siteId: rawSiteId } = {}, reply = () => {}) => {
    const siteId = cleanSiteId(rawSiteId);
    reply({ ok: true, messages: lobbyChats.get(siteId) });
  });

  socket.on("lobby:chat:send", ({ siteId: rawSiteId, name, text } = {}, reply = () => {}) => {
    const siteId = cleanSiteId(rawSiteId);
    if (socket.data.lobbySiteId !== siteId) return reply({ ok: false, error: "Gabung ke chat situs ini dahulu." });
    const playerName = cleanName(name);
    const messageText = String(text || "").trim().replace(/\s+/g, " ");
    if (!playerName) return reply({ ok: false, error: "Isi nama sebelum mengirim chat." });
    if (!messageText) return reply({ ok: false, error: "Pesan tidak boleh kosong." });
    if (messageText.length > 280) return reply({ ok: false, error: "Pesan maksimal 280 karakter." });
    const now = Date.now();
    if (socket.data.lastLobbyChatAt && now - socket.data.lastLobbyChatAt < 1_500) return reply({ ok: false, error: "Tunggu sebentar sebelum mengirim lagi." });
    socket.data.lastLobbyChatAt = now;
    const candidate = messageText.toUpperCase().match(/(?:^|\s)([A-Z0-9]{6})(?=\s|$)/)?.[1] || null;
    const roomCode = candidate && rooms.get(candidate)?.siteId === siteId ? candidate : null;
    const message = publishLobbyMessage(siteId, playerName, messageText, roomCode);
    reply({ ok: true, message });
  });

  socket.on("room:create", ({ name, siteId: rawSiteId } = {}, reply = () => {}) => {
    if (socket.data.roomCode) return reply({ ok: false, error: "Socket sudah bergabung ke room." });
    const playerName = cleanName(name);
    if (!playerName) return reply({ ok: false, error: "Nama pemain wajib diisi." });
    let code = newCode();
    while (rooms.has(code)) code = newCode();
    const siteId = cleanSiteId(rawSiteId);
    const table = new PokerTable({ code, siteId, smallBlind: 10, bigBlind: 20 });
    const player = table.addPlayer({ id: crypto.randomUUID(), name: playerName });
    player.token = crypto.randomBytes(24).toString("base64url");
    player.media = { audio: false, video: false };
    const room = { code, siteId, mode: null, table, hostId: player.id, readyIds: new Set(), capsaVotes: new Map(), capsaVoteResult: null, emptyTimer: null, turnTimer: null, turnDeadline: null };
    rooms.set(code, room);
    attach(socket, room, player);
    publishLobbyMessage(siteId, playerName, `${playerName} membuat room ${code}`, code);
    reply({ ok: true, room: publicView(room, player.id), playerId: player.id, token: player.token });
    emitRoom(room);
  });

  socket.on("room:join", ({ name, code: rawCode, siteId: rawSiteId } = {}, reply = () => {}) => {
    if (socket.data.roomCode) return reply({ ok: false, error: "Socket sudah bergabung ke room." });
    const playerName = cleanName(name);
    const code = cleanCode(rawCode);
    const siteId = cleanSiteId(rawSiteId);
    const room = rooms.get(code);
    if (!playerName) return reply({ ok: false, error: "Nama pemain wajib diisi." });
    if (!room || room.siteId !== siteId) return reply({ ok: false, error: "Room tidak ditemukan untuk situs ini." });
    if (room.mode === "capsa-banting" && room.table.players.length >= 4) return reply({ ok: false, error: "Capsa Banting maksimal empat pemain." });
    if (room.table.players.length >= 6) return reply({ ok: false, error: "Meja sudah penuh." });
    if (!["waiting", "finished"].includes(room.table.phase)) return reply({ ok: false, error: "Hand sedang berjalan. Tunggu hand selesai." });
    const player = room.table.addPlayer({ id: crypto.randomUUID(), name: playerName });
    player.token = crypto.randomBytes(24).toString("base64url");
    player.media = { audio: false, video: false };
    room.capsaVotes.clear();
    room.capsaVoteResult = null;
    attach(socket, room, player);
    reply({ ok: true, room: publicView(room, player.id), playerId: player.id, token: player.token });
    emitRoom(room);
  });

  socket.on("room:reconnect", ({ code: rawCode, siteId: rawSiteId, token } = {}, reply = () => {}) => {
    if (socket.data.roomCode) return reply({ ok: false, error: "Socket sudah bergabung ke room." });
    const code = cleanCode(rawCode);
    const siteId = cleanSiteId(rawSiteId);
    const room = rooms.get(code);
    const player = room?.table.players.find((item) => item.token && validToken(item.token, token));
    if (!room || room.siteId !== siteId || !player || player.token !== token) return reply({ ok: false, error: "Sesi reconnect tidak valid." });
    const wasInactive = room.table.players.every((item) => !item.connected);
    if (room.emptyTimer) { clearTimeout(room.emptyTimer); room.emptyTimer = null; }
    if (player.socketId && player.socketId !== socket.id) {
      const previousSocket = io.sockets.sockets.get(player.socketId);
      previousSocket?.emit("session:replaced");
      previousSocket?.disconnect(true);
    }
    attach(socket, room, player);
    if (wasInactive) publishLobbyMessage(siteId, player.name, `${player.name} membuka kembali room ${code}`, code);
    reply({ ok: true, room: publicView(room, player.id), playerId: player.id, token: player.token });
    emitRoom(room);
  });

  socket.on("room:get", (_payload, reply = () => {}) => {
    const { room, player } = session(socket);
    if (!room || !player) return reply({ ok: false, error: "Sesi tidak ditemukan." });
    reply({ ok: true, room: publicView(room, player.id) });
  });

  socket.on("room:mode", ({ mode } = {}, reply = () => {}) => {
    const { room, player } = session(socket);
    if (!room || !player) return reply({ ok: false, error: "Sesi tidak ditemukan." });
    if (room.hostId !== player.id) return reply({ ok: false, error: "Hanya pembuat room yang bisa memilih mode." });
    if (room.table.players.filter((item) => item.connected).length < 2) return reply({ ok: false, error: "Tunggu minimal dua pemain di lobby." });
    try {
      selectMode(room, String(mode || ""));
      reply({ ok: true });
      emitRoom(room);
    } catch (error) { reply({ ok: false, error: error.message }); }
  });

  socket.on("room:ready", ({ ready = true } = {}, reply = () => {}) => {
    const { room, player } = session(socket);
    if (!room || !player) return reply({ ok: false, error: "Sesi tidak ditemukan." });
    if (!room.mode) return reply({ ok: false, error: "Tunggu Room Master memilih mode." });
    if (room.hostId === player.id) return reply({ ok: false, error: "Room Master otomatis ikut ronde." });
    if (!["waiting", "finished"].includes(room.table.phase)) return reply({ ok: false, error: "Status Ready terkunci selama ronde berjalan." });
    if (ready) room.readyIds.add(player.id);
    else room.readyIds.delete(player.id);
    if (room.mode === "capsa-banting") room.capsaVoteResult = resolveCapsaVote(room);
    reply({ ok: true, ready: room.readyIds.has(player.id) });
    emitRoom(room);
  });

  socket.on("capsa:vote", ({ rule } = {}, reply = () => {}) => {
    const { room, player } = session(socket);
    if (!room || !player) return reply({ ok: false, error: "Sesi tidak ditemukan." });
    if (room.mode !== "capsa-banting") return reply({ ok: false, error: "Voting hanya tersedia untuk Capsa Banting." });
    if (player.id !== room.hostId && !room.readyIds.has(player.id)) return reply({ ok: false, error: "Pilih Ready sebelum voting aturan." });
    if (!["waiting", "finished"].includes(room.table.phase)) return reply({ ok: false, error: "Voting terkunci selama ronde berjalan." });
    if (!["classic", "free", "wheel"].includes(rule)) return reply({ ok: false, error: "Pilihan voting tidak valid." });
    room.capsaVotes.set(player.id, rule);
    room.capsaVoteResult = resolveCapsaVote(room);
    reply({ ok: true, result: room.capsaVoteResult });
    emitRoom(room);
  });

  socket.on("game:start", (_payload, reply = () => {}) => {
    const { room, player } = session(socket);
    if (!room || !player) return reply({ ok: false, error: "Sesi tidak ditemukan." });
    if (room.hostId !== player.id) return reply({ ok: false, error: "Hanya pembuat room yang bisa mulai." });
    if (!room.mode) return reply({ ok: false, error: "Pilih mode permainan dahulu." });
    if (![...room.readyIds].some((id) => room.table.players.some((item) => item.id === id && item.connected))) return reply({ ok: false, error: "Tunggu minimal satu pemain lain Ready." });
    room.table.players.forEach((item) => { item.playingRound = item.id === room.hostId || room.readyIds.has(item.id); });
    if (room.mode === "capsa-banting") {
      room.capsaVoteResult = resolveCapsaVote(room);
      if (!room.capsaVoteResult) return reply({ ok: false, error: "Tunggu semua pemain menyelesaikan voting aturan straight." });
    }
    try {
      if (room.mode === "holdem") {
        room.table.players.forEach((item) => { if (item.connected && item.stack <= 0) item.stack = 1000; });
        room.table.startHand();
      } else {
        if (room.mode === "capsa-banting") room.table.straightRule = room.capsaVoteResult;
        room.table.startRound();
      }
      scheduleTurn(room);
      room.readyIds.clear();
      reply({ ok: true });
      emitRoom(room);
    } catch (error) { reply({ ok: false, error: error.message }); }
  });

  socket.on("game:action", (action = {}, reply = () => {}) => {
    const { room, player } = session(socket);
    if (!room || !player) return reply({ ok: false, error: "Sesi tidak ditemukan." });
    const actionId = String(action.actionId || "").slice(0, 80);
    if (!actionId) return reply({ ok: false, error: "ID aksi wajib diisi." });
    try {
      const result = room.table.act(player.id, {
        type: String(action.type || ""),
        amount: Number(action.amount),
        cardIndex: Number(action.cardIndex),
        cardIndexes: Array.isArray(action.cardIndexes) ? action.cardIndexes.slice(0, 5).map(Number) : [],
        actionId,
      });
      if (room.mode === "capsa-banting" && room.table.phase === "finished") {
        room.capsaVotes.clear();
        room.capsaVoteResult = null;
      }
      if (!result?.duplicate) scheduleTurn(room);
      reply({ ok: true });
      emitRoom(room);
    } catch (error) { reply({ ok: false, error: error.message }); }
  });

  socket.on("media:join", ({ audio = true, video = false } = {}, reply = () => {}) => {
    const { room, player } = session(socket);
    if (!room || !player) return reply({ ok: false, error: "Sesi tidak ditemukan." });
    const videoCount = room.table.players.filter((item) => item.id !== player.id && item.media?.video).length;
    if (video && videoCount >= 4) return reply({ ok: false, error: "Maksimal empat kamera aktif." });
    player.media = { audio: Boolean(audio), video: Boolean(video) };
    const peers = room.table.players
      .filter((item) => item.id !== player.id && item.connected && (item.media?.audio || item.media?.video))
      .map((item) => ({ id: item.id, name: item.name, media: mediaView(item) }));
    socket.to(roomChannel(room)).emit("media:peer-joined", { peerId: player.id, name: player.name, media: mediaView(player) });
    reply({ ok: true, peers });
    emitRoom(room);
  });

  socket.on("media:status", ({ audio = false, video = false } = {}, reply = () => {}) => {
    const { room, player } = session(socket);
    if (!room || !player) return reply({ ok: false, error: "Sesi tidak ditemukan." });
    const videoCount = room.table.players.filter((item) => item.id !== player.id && item.media?.video).length;
    if (video && videoCount >= 4) return reply({ ok: false, error: "Maksimal empat kamera aktif." });
    player.media = { audio: Boolean(audio), video: Boolean(video) };
    io.to(roomChannel(room)).emit("media:peer-status", { peerId: player.id, media: mediaView(player) });
    reply({ ok: true });
    emitRoom(room);
  });

  socket.on("media:signal", ({ targetId, signal } = {}, reply = () => {}) => {
    const { room, player } = session(socket);
    const target = room?.table.players.find((item) => item.id === targetId && item.connected && item.socketId && (item.media?.audio || item.media?.video));
    const clean = safeSignal(signal);
    if (!room || !player || !(player.media?.audio || player.media?.video) || !target || !clean) return reply({ ok: false, error: "Peer media tidak valid." });
    io.to(target.socketId).emit("media:signal", { peerId: player.id, name: player.name, signal: clean });
    reply({ ok: true });
  });

  socket.on("media:leave", (_payload, reply = () => {}) => {
    const { room, player } = session(socket);
    leaveMedia(room, player);
    if (room) emitRoom(room);
    reply({ ok: true });
  });

  socket.on("disconnect", () => {
    const room = rooms.get(socket.data.roomCode);
    const player = room?.table.players.find((item) => item.id === socket.data.playerId && item.socketId === socket.id);
    if (!room || !player) return;
    leaveMedia(room, player);
    player.connected = false;
    player.socketId = null;
    room.readyIds.delete(player.id);
    if (room.mode === "capsa-banting" && ["waiting", "finished"].includes(room.table.phase)) room.capsaVoteResult = resolveCapsaVote(room);
    emitRoom(room);
    if (room.table.players.every((item) => !item.connected)) {
      removeRoomFromLobby(room.siteId, room.code);
      room.emptyTimer = setTimeout(() => rooms.delete(room.code), EMPTY_ROOM_TTL);
      room.emptyTimer.unref();
    }
  });
});

if (require.main === module) server.listen(PORT, "127.0.0.1", () => console.log(`RW06 Poker listening on ${PORT}`));
module.exports = { app, server, io, rooms, publicView };
