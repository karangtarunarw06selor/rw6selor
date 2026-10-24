"use strict";

const express = require("express");
const http = require("http");
const path = require("path");
const crypto = require("crypto");
const { Server } = require("socket.io");
const { move } = require("./game-engine");

const app = express();
const server = http.createServer(app);
const socketPath = process.env.SOCKET_PATH || "/ular-tangga/socket.io";
const io = new Server(server, { path: socketPath, cors: { origin: false } });
const PORT = Number(process.env.PORT) || 3016;
const rooms = new Map();

app.use("/ular-tangga", express.static(path.join(__dirname, "public")));
app.get("/health", (_request, response) => response.json({ ok: true, rooms: rooms.size }));
app.get("/", (_request, response) => response.redirect("/ular-tangga/"));

const code = () => crypto.randomBytes(3).toString("hex").slice(0, 6).toUpperCase();
const cleanName = (value) => String(value || "").trim().slice(0, 24);
const cleanSiteId = (value) => String(value || "MMS").trim().toUpperCase() === "KT" ? "KT" : "MMS";
const cleanVoiceSignal = (signal) => {
  if (!signal || typeof signal !== "object") return null;
  if (JSON.stringify(signal).length > 16_384) return null;
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
};
const publicRoom = (room) => ({
  code: room.code,
  siteId: room.siteId,
  status: room.status,
  turn: room.turn,
  winner: room.winner,
  players: room.players.map(({ id, name, color, position, connected }) => ({ id, name, color, position, connected })),
  lastMove: room.lastMove,
});
const findPlayer = (room, socket) => room.players.find((player) => player.socketId === socket.id);
const emitRoom = (room) => io.to(room.code).emit("room:state", publicRoom(room));
const voicePeers = (room, playerId) => room.players
  .filter((player) => player.connected && player.voice && player.id !== playerId)
  .map(({ id, name }) => ({ id, name }));
const leaveVoice = (room, player) => {
  if (!room || !player?.voice) return;
  player.voice = false;
  io.to(room.code).emit("voice:peer-left", { peerId: player.id });
};
const finishIfEmpty = (room) => {
  if (room.players.every((player) => !player.connected)) rooms.delete(room.code);
};

io.on("connection", (socket) => {
  socket.on("room:create", ({ name, siteId: rawSiteId } = {}, reply = () => {}) => {
    const playerName = cleanName(name);
    const siteId = cleanSiteId(rawSiteId);
    if (!playerName) return reply({ ok: false, error: "Nama pemain wajib diisi." });
    let roomCode = code();
    while (rooms.has(roomCode)) roomCode = code();
    const player = { id: crypto.randomUUID(), socketId: socket.id, name: playerName, color: "#f0b54b", position: 1, connected: true };
    const room = { code: roomCode, siteId, status: "waiting", turn: player.id, winner: null, players: [player], lastMove: null };
    rooms.set(roomCode, room);
    socket.join(roomCode);
    socket.data.roomCode = roomCode;
    reply({ ok: true, room: publicRoom(room), playerId: player.id });
    emitRoom(room);
  });

  socket.on("room:join", ({ name, code: rawCode, siteId: rawSiteId } = {}, reply = () => {}) => {
    const playerName = cleanName(name);
    const siteId = cleanSiteId(rawSiteId);
    const roomCode = String(rawCode || "").trim().toUpperCase();
    const room = rooms.get(roomCode);
    if (!playerName) return reply({ ok: false, error: "Nama pemain wajib diisi." });
    if (!room || room.siteId !== siteId) return reply({ ok: false, error: "Room tidak ditemukan untuk situs ini." });
    if (room.players.length >= 4) return reply({ ok: false, error: "Room sudah penuh." });
    if (room.status === "finished") return reply({ ok: false, error: "Permainan sudah selesai." });
    const colors = ["#f0b54b", "#4db8d0", "#ef6f6c", "#70c48f"];
    const player = { id: crypto.randomUUID(), socketId: socket.id, name: playerName, color: colors[room.players.length], position: 1, connected: true };
    room.players.push(player);
    room.status = room.players.length >= 2 ? "playing" : "waiting";
    socket.join(roomCode);
    socket.data.roomCode = roomCode;
    reply({ ok: true, room: publicRoom(room), playerId: player.id });
    emitRoom(room);
  });

  socket.on("game:start", (_payload, reply = () => {}) => {
    const room = rooms.get(socket.data.roomCode);
    const player = room && findPlayer(room, socket);
    if (!room || !player || room.players[0].id !== player.id) return reply({ ok: false, error: "Hanya pembuat room yang bisa mulai." });
    if (room.players.length < 2) return reply({ ok: false, error: "Minimal dua pemain." });
    room.status = "playing";
    room.turn = room.players[0].id;
    emitRoom(room);
    reply({ ok: true });
  });

  socket.on("game:roll", (_payload, reply = () => {}) => {
    const room = rooms.get(socket.data.roomCode);
    const player = room && findPlayer(room, socket);
    if (!room || !player) return reply({ ok: false, error: "Sesi pemain tidak ditemukan." });
    if (room.status !== "playing") return reply({ ok: false, error: "Permainan belum dimulai." });
    if (room.turn !== player.id) return reply({ ok: false, error: "Belum giliranmu." });
    const dice = crypto.randomInt(1, 7);
    const result = move(player.position, dice);
    player.position = result.to;
    room.lastMove = { playerId: player.id, playerName: player.name, dice, ...result, at: Date.now() };
    if (result.won) {
      room.status = "finished";
      room.winner = player.id;
    } else {
      const active = room.players.filter((item) => item.connected);
      const index = active.findIndex((item) => item.id === player.id);
      room.turn = active[(index + 1) % active.length].id;
    }
    emitRoom(room);
    reply({ ok: true, move: room.lastMove });
  });

  socket.on("game:reset", (_payload, reply = () => {}) => {
    const room = rooms.get(socket.data.roomCode);
    const player = room && findPlayer(room, socket);
    if (!room || !player || room.players[0].id !== player.id) return reply({ ok: false, error: "Hanya pembuat room yang bisa reset." });
    room.players.forEach((item) => { item.position = 1; });
    room.status = room.players.length >= 2 ? "playing" : "waiting";
    room.turn = room.players[0].id;
    room.winner = null;
    room.lastMove = null;
    emitRoom(room);
    reply({ ok: true });
  });

  socket.on("voice:join", (_payload, reply = () => {}) => {
    const room = rooms.get(socket.data.roomCode);
    const player = room && findPlayer(room, socket);
    if (!room || !player || !player.connected) return reply({ ok: false, error: "Sesi pemain tidak ditemukan." });
    const peers = voicePeers(room, player.id);
    player.voice = true;
    socket.to(room.code).emit("voice:peer-joined", { peerId: player.id, name: player.name });
    reply({ ok: true, peers });
  });

  socket.on("voice:signal", ({ targetId, signal } = {}, reply = () => {}) => {
    const room = rooms.get(socket.data.roomCode);
    const player = room && findPlayer(room, socket);
    const target = room?.players.find((item) => item.id === targetId && item.connected && item.voice);
    const safeSignal = cleanVoiceSignal(signal);
    if (!room || !player?.voice || !target || !safeSignal) return reply({ ok: false, error: "Peer voice tidak valid." });
    io.to(target.socketId).emit("voice:signal", { peerId: player.id, name: player.name, signal: safeSignal });
    reply({ ok: true });
  });

  socket.on("voice:leave", (_payload, reply = () => {}) => {
    const room = rooms.get(socket.data.roomCode);
    const player = room && findPlayer(room, socket);
    leaveVoice(room, player);
    reply({ ok: true });
  });

  socket.on("disconnect", () => {
    const room = rooms.get(socket.data.roomCode);
    const player = room && findPlayer(room, socket);
    if (!room || !player) return;
    leaveVoice(room, player);
    player.connected = false;
    if (room.turn === player.id) {
      const next = room.players.find((item) => item.connected);
      room.turn = next ? next.id : null;
    }
    emitRoom(room);
    setTimeout(() => finishIfEmpty(room), 60_000).unref();
  });
});

if (require.main === module) server.listen(PORT, "127.0.0.1", () => console.log(`Ular Tangga MMS listening on ${PORT}`));
module.exports = { app, server, io, rooms };
