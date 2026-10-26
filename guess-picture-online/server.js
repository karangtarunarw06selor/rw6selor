"use strict";

const express = require("express");
const http = require("http");
const crypto = require("crypto");
const path = require("path");
const { Server } = require("socket.io");
const questions = require("./questions");

const app = express();
const server = http.createServer(app);
const socketPath = process.env.SOCKET_PATH || "/tebak-gambar/socket.io";
const io = new Server(server, { path: socketPath, cors: { origin: false } });
const PORT = Number(process.env.PORT) || 3052;
const ROUND_MS = Number(process.env.ROUND_MS) || 5 * 60_000;
const RECONNECT_MS = Number(process.env.RECONNECT_MS) || 5 * 60_000;
const rooms = new Map();
const lobbyMessages = new Map();
const LOBBY_HISTORY_LIMIT = 50;
const LOBBY_CHAT_COOLDOWN_MS = 800;
const ROOM_CHAT_COOLDOWN_MS = 1200;

app.use("/tebak-gambar", express.static(path.join(__dirname, "public")));
app.get("/health", (_req, res) => res.json({ ok: true, rooms: rooms.size }));
app.get("/", (_req, res) => res.redirect("/tebak-gambar/"));

const normalize = (value) => String(value || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
const cleanName = (value) => String(value || "").replace(/[<>&"'`]/g, "").trim().replace(/\s+/g, " ").slice(0, 24);
const cleanSite = (value) => String(value || "").toUpperCase() === "KT" ? "KT" : "MMS";
const cleanChat = (value) => String(value || "").trim().replace(/\s+/g, " ").slice(0, 180);
const code = () => crypto.randomBytes(3).toString("hex").slice(0, 6).toUpperCase();
const playerBySocket = (room, socket) => room?.players.find((player) => player.socketId === socket.id);
const scoreFor = (clueCount) => [4, 4, 3, 2, 1][Math.max(1, Math.min(4, clueCount))];
const drawerScoreFor = (clueCount) => [3, 3, 2, 1, 1][Math.max(1, Math.min(4, clueCount))];
const imageCache = new Map();
const questionImage = (question) => {
  if (imageCache.has(question.image)) return imageCache.get(question.image);
  const file = path.join(__dirname, "assets", "questions", question.image);
  const mime = question.image.endsWith(".png") ? "image/png" : "image/jpeg";
  const data = `data:${mime};base64,${require("fs").readFileSync(file).toString("base64")}`;
  imageCache.set(question.image, data);
  return data;
};

const publicView = (room) => ({
  code: room.code, siteId: room.siteId, status: room.status, hostId: room.players[0]?.id || null,
  drawerId: room.drawerId, round: room.round, totalRounds: room.totalRounds, roundsPerPlayer: room.roundsPerPlayer || 2, clueCount: room.clueCount,
  deadline: room.deadline, winnerId: room.winnerId, answerReveal: room.answerReveal, result: room.result,
  questionReveal: room.status === "result" && room.question ? { answer: room.question.answer, category: room.question.category, image: questionImage(room.question) } : null,
  strokes: room.strokes, reports: room.reports.size, messages: room.messages,
  players: room.players.map(({ id, name, score, connected, media, wins, totalGuessMs }) => ({ id, name, score, connected, media, wins, totalGuessMs, participant: room.status === "waiting" || room.activeIds?.has(id) })),
});
const secretView = (question) => ({ id: question.id, answer: question.answer, aliases: question.aliases, category: question.category, forbidden: question.forbidden, examples: question.examples, image: questionImage(question) });
const emitRoom = (room) => {
  io.to(room.code).emit("room:state", publicView(room));
  const drawer = room.players.find((player) => player.id === room.drawerId && player.connected);
  if (drawer && room.question) io.to(drawer.socketId).emit("round:secret", secretView(room.question));
};
const addRoomMessage = (room, player, type, text = "") => {
  const message = { id: crypto.randomUUID(), type, playerId: player?.id || null, name: player?.name || "Sistem", text, createdAt: Date.now() };
  room.messages.push(message);
  if (room.messages.length > 60) room.messages.splice(0, room.messages.length - 60);
  io.to(room.code).emit("room:message", message);
  return message;
};
const sessionReply = (room, player) => ({ ok: true, room: publicView(room), playerId: player.id, reconnectToken: player.token });
const lobbyChannel = (siteId) => `lobby:${siteId}`;
const lobbyRooms = (siteId) => [...rooms.values()].filter((room) => room.siteId === siteId && room.status !== "finished" && room.players.some((player) => player.connected)).map((room) => ({ code: room.code, host: room.players[0]?.name || "Pemain", players: room.players.filter((player) => player.connected).length, capacity: 8, status: room.status, createdAt: room.createdAt }));
const lobbyPayload = (siteId) => ({ messages: lobbyMessages.get(siteId) || [], rooms: lobbyRooms(siteId) });
const emitLobby = (siteId) => io.to(lobbyChannel(siteId)).emit("lobby:state", lobbyPayload(siteId));
const removeRoom = (room) => { clearTimeout(room.roundTimer); clearTimeout(room.nextTimer); rooms.delete(room.code); emitLobby(room.siteId); };
const scheduleCleanup = (room, player) => {
  clearTimeout(player.cleanupTimer);
  player.cleanupTimer = setTimeout(() => {
    if (player.connected) return;
    room.players = room.players.filter((item) => item.id !== player.id);
    if (!room.players.length) return removeRoom(room);
    if (room.drawerId === player.id && room.status === "playing") finishRound(room, { reason: "drawer-left", drawerPenalty: -1 });
    emitRoom(room); emitLobby(room.siteId);
  }, RECONNECT_MS);
  player.cleanupTimer.unref();
};
const chooseQuestion = (room) => {
  const available = questions.filter((question) => !room.usedQuestions.has(question.id));
  if (!available.length) room.usedQuestions.clear();
  const pool = available.length ? available : questions;
  const question = pool[crypto.randomInt(0, pool.length)];
  room.usedQuestions.add(question.id);
  return question;
};
const startRound = (room) => {
  const participants = room.players.filter((player) => player.connected && room.activeIds?.has(player.id));
  if (participants.length < 2) {
    if (room.activeIds?.size >= 2 && ["playing", "result"].includes(room.status)) return emitRoom(room);
    room.status = "waiting"; return emitRoom(room);
  }
  room.round += 1;
  if (room.round > room.totalRounds) {
    room.status = "finished";
    const sorted = [...room.players].sort((a, b) => b.score - a.score || b.wins - a.wins || a.totalGuessMs - b.totalGuessMs);
    room.winnerId = sorted[0]?.id || null;
    room.answerReveal = null;
    room.result = null;
    return emitRoom(room);
  }
  room.status = "playing";
  room.drawerId = participants[(room.round - 1) % participants.length].id;
  room.question = chooseQuestion(room);
  room.clueCount = 1;
  room.strokes = [[], [], [], []];
  room.guessedIds = new Set();
  room.reports = new Set();
  room.skipUsed = false;
  room.startedAt = Date.now();
  room.deadline = room.startedAt + ROUND_MS;
  room.answerReveal = null;
  room.result = null;
  clearTimeout(room.roundTimer);
  room.roundTimer = setTimeout(() => finishRound(room, { reason: "timeout" }), ROUND_MS);
  room.roundTimer.unref();
  emitRoom(room);
};
function finishRound(room, { reason, winner = null, elapsedMs = null, drawerPenalty = 0 } = {}) {
  if (room.status !== "playing") return;
  clearTimeout(room.roundTimer);
  const drawer = room.players.find((player) => player.id === room.drawerId);
  if (reason === "timeout" && room.strokes.every((clue) => !clue.length)) drawerPenalty = -1;
  let guessPoints = 0;
  let drawerPoints = drawerPenalty;
  if (winner) {
    guessPoints = scoreFor(room.clueCount);
    drawerPoints = drawerScoreFor(room.clueCount);
    winner.score += guessPoints; winner.wins += 1; winner.totalGuessMs += elapsedMs;
    if (drawer) drawer.score += drawerPoints;
  } else if (drawerPenalty && drawer) drawer.score += drawerPenalty;
  room.status = "result";
  room.answerReveal = room.question.answer;
  room.result = { reason, winnerId: winner?.id || null, elapsedMs, guessPoints, drawerPoints };
  room.deadline = null;
  emitRoom(room);
  room.nextTimer = setTimeout(() => startRound(room), 5_000);
  room.nextTimer.unref();
}

io.on("connection", (socket) => {
  socket.on("lobby:join", ({ siteId: rawSite } = {}, reply = () => {}) => {
    const siteId = cleanSite(rawSite);
    if (socket.data.lobbySite) socket.leave(lobbyChannel(socket.data.lobbySite));
    socket.data.lobbySite = siteId; socket.join(lobbyChannel(siteId)); reply({ ok: true, ...lobbyPayload(siteId) });
  });
  socket.on("lobby:chat", ({ siteId: rawSite, name, text } = {}, reply = () => {}) => {
    const siteId = cleanSite(rawSite); const nameClean = cleanName(name); const textClean = cleanChat(text); const now = Date.now();
    if (socket.data.lobbySite !== siteId) return reply({ ok: false, error: "Lobby tidak sesuai." });
    if (!nameClean || !textClean) return reply({ ok: false, error: "Nama dan pesan wajib diisi." });
    if (now - (socket.data.lastLobbyChatAt || 0) < LOBBY_CHAT_COOLDOWN_MS) return reply({ ok: false, error: "Tunggu sebentar sebelum mengirim lagi." });
    socket.data.lastLobbyChatAt = now;
    const validCodes = [...new Set((textClean.toUpperCase().match(/\b[A-F0-9]{6}\b/g) || []).filter((roomCode) => { const room = rooms.get(roomCode); return room?.siteId === siteId && room.status !== "finished" && room.players.some((player) => player.connected); }))];
    const message = { id: crypto.randomUUID(), name: nameClean, text: textClean, createdAt: now, roomCodes: validCodes };
    const history = lobbyMessages.get(siteId) || []; history.push(message); if (history.length > LOBBY_HISTORY_LIMIT) history.splice(0, history.length - LOBBY_HISTORY_LIMIT); lobbyMessages.set(siteId, history);
    io.to(lobbyChannel(siteId)).emit("lobby:chat", message); reply({ ok: true });
  });
  socket.on("room:create", ({ name, siteId: rawSite } = {}, reply = () => {}) => {
    if (socket.data.roomCode) return reply({ ok: false, error: "Keluar dari room saat ini terlebih dahulu." });
    const nameClean = cleanName(name); if (!nameClean) return reply({ ok: false, error: "Nama wajib diisi." });
    let roomCode = code(); while (rooms.has(roomCode)) roomCode = code();
    const player = { id: crypto.randomUUID(), token: crypto.randomBytes(24).toString("base64url"), socketId: socket.id, name: nameClean, score: 0, wins: 0, totalGuessMs: 0, connected: true, media: { voice: false, video: false }, mediaWatching: false };
    const room = { code: roomCode, siteId: cleanSite(rawSite), status: "waiting", players: [player], createdAt: Date.now(), round: 0, totalRounds: 0, roundsPerPlayer: 2, drawerId: null, clueCount: 0, strokes: [[], [], [], []], reports: new Set(), usedQuestions: new Set(), winnerId: null, messages: [] };
    rooms.set(roomCode, room); socket.join(roomCode); socket.data.roomCode = roomCode; reply(sessionReply(room, player)); emitRoom(room); emitLobby(room.siteId);
  });
  socket.on("room:join", ({ name, code: rawCode, siteId: rawSite } = {}, reply = () => {}) => {
    if (socket.data.roomCode) return reply({ ok: false, error: "Keluar dari room saat ini terlebih dahulu." });
    const room = rooms.get(String(rawCode || "").trim().toUpperCase()); const nameClean = cleanName(name);
    if (!nameClean) return reply({ ok: false, error: "Nama wajib diisi." });
    if (!room || room.siteId !== cleanSite(rawSite)) return reply({ ok: false, error: "Room tidak ditemukan." });
    if (room.players.length >= 8) return reply({ ok: false, error: "Room penuh." });
    const player = { id: crypto.randomUUID(), token: crypto.randomBytes(24).toString("base64url"), socketId: socket.id, name: nameClean, score: 0, wins: 0, totalGuessMs: 0, connected: true, media: { voice: false, video: false }, mediaWatching: false };
    room.players.push(player); socket.join(room.code); socket.data.roomCode = room.code; addRoomMessage(room, null, "system", `${player.name} masuk ke room.`); reply(sessionReply(room, player)); emitRoom(room); emitLobby(room.siteId);
  });
  socket.on("room:reconnect", ({ code: rawCode, playerId, reconnectToken, siteId: rawSite } = {}, reply = () => {}) => {
    if (socket.data.roomCode) return reply({ ok: false, error: "Keluar dari room saat ini terlebih dahulu." });
    const room = rooms.get(String(rawCode || "").trim().toUpperCase());
    const player = room?.players.find((item) => item.id === playerId && item.token === reconnectToken);
    if (!room || room.siteId !== cleanSite(rawSite) || !player) return reply({ ok: false, error: "Sesi berakhir." });
    clearTimeout(player.cleanupTimer); io.sockets.sockets.get(player.socketId)?.disconnect(true);
    player.socketId = socket.id; player.connected = true; player.media = { voice: false, video: false }; player.mediaWatching = false;
    socket.join(room.code); socket.data.roomCode = room.code; reply(sessionReply(room, player)); emitRoom(room); emitLobby(room.siteId);
    if (room.status === "result" && room.players.filter((item) => item.connected && room.activeIds?.has(item.id)).length >= 2) {
      clearTimeout(room.nextTimer); room.nextTimer = setTimeout(() => startRound(room), 500); room.nextTimer.unref();
    }
  });
  socket.on("room:leave", (_data, reply = () => {}) => {
    const room = rooms.get(socket.data.roomCode); const player = playerBySocket(room, socket);
    if (!room || !player) return reply({ ok: false, error: "Sesi tidak ditemukan." });
    clearTimeout(player.cleanupTimer);
    player.media = { voice: false, video: false };
    socket.to(room.code).emit("media:peer-left", { playerId: player.id });
    room.players = room.players.filter((item) => item.id !== player.id);
    socket.leave(room.code); socket.data.roomCode = null;
    if (!room.players.length) removeRoom(room);
    else {
      if (room.drawerId === player.id && room.status === "playing") finishRound(room, { reason: "drawer-left", drawerPenalty: -1 });
      else emitRoom(room);
      emitLobby(room.siteId);
    }
    reply({ ok: true });
  });
  socket.on("game:start", ({ roundsPerPlayer = 2 } = {}, reply = () => {}) => {
    const room = rooms.get(socket.data.roomCode); const player = playerBySocket(room, socket);
    if (!room || room.players[0]?.id !== player?.id) return reply({ ok: false, error: "Hanya host." });
    if (!['waiting', 'finished'].includes(room.status)) return reply({ ok: false, error: "Permainan sedang berjalan." });
    const rounds = Number(roundsPerPlayer);
    if (![2, 3, 5].includes(rounds)) return reply({ ok: false, error: "Pilihan putaran tidak valid." });
    const participants = room.players.filter((item) => item.connected);
    if (participants.length < 2) return reply({ ok: false, error: "Minimal dua pemain." });
    if (room.status === "finished") {
      room.round = 0; room.winnerId = null; room.answerReveal = null; room.result = null;
      room.players.forEach((item) => { item.score = 0; item.wins = 0; item.totalGuessMs = 0; });
    }
    room.roundsPerPlayer = rounds; room.activeIds = new Set(participants.map((item) => item.id)); room.totalRounds = participants.length * rounds; reply({ ok: true }); startRound(room); emitLobby(room.siteId);
  });
  socket.on("clue:stroke", ({ clueIndex, points, color, size } = {}, reply = () => {}) => {
    const room = rooms.get(socket.data.roomCode); const player = playerBySocket(room, socket);
    if (!room || room.status !== "playing" || player?.id !== room.drawerId) return reply({ ok: false, error: "Bukan penggambar." });
    const index = Number(clueIndex); if (!Number.isInteger(index) || index < 0 || index >= room.clueCount || !Array.isArray(points) || points.length < 2 || points.length > 100 || room.strokes[index].length >= 500) return reply({ ok: false, error: "Goresan tidak valid." });
    const safe = { id: crypto.randomUUID(), clueIndex: index, points: points.map((p) => [Math.max(0, Math.min(1, Number(p[0]))), Math.max(0, Math.min(1, Number(p[1])))]), color: /^#[0-9a-f]{6}$/i.test(color) ? color : "#111827", size: Math.max(2, Math.min(24, Number(size) || 5)) };
    room.strokes[index].push(safe); io.to(room.code).emit("clue:stroke", safe); reply({ ok: true });
  });
  socket.on("clue:unlock", (_data, reply = () => {}) => {
    const room = rooms.get(socket.data.roomCode); const player = playerBySocket(room, socket);
    if (!room || room.status !== "playing" || player?.id !== room.drawerId) return reply({ ok: false, error: "Bukan penggambar." });
    if (room.clueCount >= 4) return reply({ ok: false, error: "Semua clue sudah terbuka." });
    room.clueCount += 1; emitRoom(room); reply({ ok: true });
  });
  socket.on("clue:clear", ({ clueIndex } = {}, reply = () => {}) => {
    const room = rooms.get(socket.data.roomCode); const player = playerBySocket(room, socket); const index = Number(clueIndex);
    if (!room || player?.id !== room.drawerId || !Number.isInteger(index) || index < 0 || index >= room.clueCount) return reply({ ok: false });
    room.strokes[index] = []; io.to(room.code).emit("clue:clear", { clueIndex: index }); reply({ ok: true });
  });
  socket.on("guess:submit", ({ text } = {}, reply = () => {}) => {
    const room = rooms.get(socket.data.roomCode); const player = playerBySocket(room, socket);
    if (!room || !player) return reply({ ok: false, error: "Tidak bisa mengirim pesan." });
    const now = Date.now();
    if (now - (player.lastGuessAt || 0) < ROOM_CHAT_COOLDOWN_MS) return reply({ ok: false, error: "Tunggu sebentar sebelum mengirim lagi." });
    player.lastGuessAt = now;
    const rawText = cleanChat(String(text || "").slice(0, 80));
    const guess = normalize(rawText); if (!guess) return reply({ ok: false, error: "Pesan kosong." });
    const canGuess = room.status === "playing" && room.activeIds?.has(player.id) && player.id !== room.drawerId;
    const answers = room.status === "playing" ? [room.question.answer, ...room.question.aliases].map(normalize).filter(Boolean) : [];
    const accepted = answers.includes(guess);
    const containsAnswer = answers.some((answer) => ` ${guess} `.includes(` ${answer} `));
    if (!canGuess) {
      if (containsAnswer) return reply({ ok: false, error: "Jawaban rahasia tidak boleh ditulis di chat." });
      addRoomMessage(room, player, "chat", rawText); return reply({ ok: true, correct: false, kind: "chat" });
    }
    if (!accepted) {
      if (containsAnswer) return reply({ ok: true, correct: false, kind: "private" });
      addRoomMessage(room, player, "guess", rawText); return reply({ ok: true, correct: false, kind: "guess" });
    }
    const elapsedMs = Date.now() - room.startedAt; addRoomMessage(room, player, "correct"); reply({ ok: true, correct: true, kind: "correct", elapsedMs }); finishRound(room, { reason: "guessed", winner: player, elapsedMs });
  });
  socket.on("round:skip", (_data, reply = () => {}) => {
    const room = rooms.get(socket.data.roomCode); const player = playerBySocket(room, socket);
    if (!room || player?.id !== room.drawerId || room.status !== "playing") return reply({ ok: false });
    if (room.skipUsed) return reply({ ok: false, error: "Ganti soal hanya sekali." });
    room.skipUsed = true; room.question = chooseQuestion(room); room.strokes = [[], [], [], []]; room.clueCount = 1; room.startedAt = Date.now(); room.deadline = room.startedAt + ROUND_MS; clearTimeout(room.roundTimer); room.roundTimer = setTimeout(() => finishRound(room, { reason: "timeout" }), ROUND_MS); room.roundTimer.unref(); emitRoom(room); reply({ ok: true });
  });
  socket.on("round:report", (_data, reply = () => {}) => {
    const room = rooms.get(socket.data.roomCode); const player = playerBySocket(room, socket);
    if (!room || !player || !room.activeIds?.has(player.id) || player.id === room.drawerId || room.status !== "playing") return reply({ ok: false });
    room.reports.add(player.id); emitRoom(room); reply({ ok: true });
  });
  socket.on("round:moderate", ({ action } = {}, reply = () => {}) => {
    const room = rooms.get(socket.data.roomCode); const player = playerBySocket(room, socket);
    if (!room || room.players[0]?.id !== player?.id || room.status !== "playing") return reply({ ok: false });
    if (action === "cancel") finishRound(room, { reason: "cancelled" }); else if (action === "penalty") finishRound(room, { reason: "violation", drawerPenalty: -2 }); else return reply({ ok: false });
    reply({ ok: true });
  });
  socket.on("media:config", (_data, reply = () => {}) => {
    const room = rooms.get(socket.data.roomCode); const player = playerBySocket(room, socket); const secret = process.env.TURN_SECRET;
    if (!room || !player || !secret) return reply({ ok: false, error: "Konfigurasi media tidak tersedia." });
    const username = `${Math.floor(Date.now() / 1000) + 3600}:${player.id}`;
    const credential = crypto.createHmac("sha1", secret).update(username).digest("base64");
    reply({ ok: true, iceServers: [{ urls: ["stun:stun.cloudflare.com:3478", "stun:stun.l.google.com:19302"] }, { urls: ["turn:178.83.188.207:3478?transport=udp", "turn:178.83.188.207:3478?transport=tcp"], username, credential }] });
  });
  socket.on("media:watch", (_data, reply = () => {}) => {
    const room = rooms.get(socket.data.roomCode); const player = playerBySocket(room, socket);
    if (!room || !player) return reply({ ok: false, error: "Masuk ke room terlebih dahulu." });
    player.mediaWatching = true;
    reply({ ok: true, peers: room.players.filter((item) => item.connected && item.media.voice && item.id !== player.id).map((item) => ({ id: item.id, name: item.name, media: item.media })) });
  });
  socket.on("media:update", ({ voice, video } = {}, reply = () => {}) => {
    const room = rooms.get(socket.data.roomCode); const player = playerBySocket(room, socket); if (!room || !player) return reply({ ok: false, error: "Masuk ke room terlebih dahulu." });
    const activeVideos = room.players.filter((item) => item.media.video && item.id !== player.id).length;
    if (video && activeVideos >= 4) return reply({ ok: false, error: "Maksimal empat kamera." });
    player.media = { voice: Boolean(voice), video: Boolean(video) }; socket.to(room.code).emit("media:peer", { playerId: player.id, ...player.media }); emitRoom(room); reply({ ok: true, peers: room.players.filter((item) => item.connected && item.media.voice && item.id !== player.id).map((item) => ({ id: item.id, name: item.name, media: item.media })) });
  });
  socket.on("media:signal", ({ targetId, signal } = {}, reply = () => {}) => {
    const room = rooms.get(socket.data.roomCode); const player = playerBySocket(room, socket); const target = room?.players.find((item) => item.id === targetId && item.connected && (item.media.voice || item.mediaWatching));
    if (!(player?.media.voice || player?.mediaWatching) || !target || !signal || JSON.stringify(signal).length > 20_000) return reply({ ok: false });
    io.to(target.socketId).emit("media:signal", { playerId: player.id, name: player.name, signal }); reply({ ok: true });
  });
  socket.on("disconnect", () => {
    const room = rooms.get(socket.data.roomCode); const player = playerBySocket(room, socket); if (!room || !player) return;
    player.connected = false; player.media = { voice: false, video: false }; socket.to(room.code).emit("media:peer-left", { playerId: player.id });
    emitRoom(room);
    emitLobby(room.siteId); scheduleCleanup(room, player);
  });
});

if (require.main === module) server.listen(PORT, "127.0.0.1", () => console.log(`Tebak Gambar listening on ${PORT}`));
module.exports = { app, server, io, rooms, lobbyMessages, normalize, scoreFor, drawerScoreFor, startRound, finishRound };
