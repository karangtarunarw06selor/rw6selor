"use strict";

const crypto = require("crypto");
const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const { UnoGame } = require("./uno-engine");

const CHAT_LIMIT = 80;
const CHAT_LENGTH = 300;
const SIGNAL_LIMIT = 20_000;

function createService() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, { path: "/uno/socket.io", cors: { origin: false }, maxHttpBufferSize: SIGNAL_LIMIT });
  const rooms = new Map();

  app.use("/uno", express.static(path.join(__dirname, "public")));
  app.get("/health", (_request, response) => response.json({ ok: true, service: "uno-online", rooms: rooms.size }));
  app.get("/uno/health", (_request, response) => response.json({ ok: true, service: "uno-online", rooms: rooms.size }));
  app.get("/", (_request, response) => response.redirect("/uno/"));

  const site = (value) => String(value).toUpperCase() === "KT" ? "KT" : "MMS";
  const code = (value) => String(value || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  const name = (value) => String(value || "").trim().replace(/\s+/g, " ").slice(0, 20);
  const message = (value) => String(value || "").trim().replace(/\s+/g, " ").slice(0, CHAT_LENGTH);
  const key = (siteId, roomCode) => `${siteId}:${roomCode}`;
  const channel = (room) => `uno:${room.siteId}:${room.code}`;
  const mediaView = (player) => ({ voice: Boolean(player.media?.voice), video: Boolean(player.media?.video) });

  function safeSignal(signal) {
    if (!signal || typeof signal !== "object") return null;
    if (JSON.stringify(signal).length > SIGNAL_LIMIT) return null;
    if (signal.description && ["offer", "answer"].includes(signal.description.type) && typeof signal.description.sdp === "string" && signal.description.sdp.length <= 16_000) {
      return { description: { type: signal.description.type, sdp: signal.description.sdp } };
    }
    if (signal.candidate && typeof signal.candidate.candidate === "string" && signal.candidate.candidate.length <= 4096) {
      return { candidate: {
        candidate: signal.candidate.candidate,
        sdpMid: typeof signal.candidate.sdpMid === "string" ? signal.candidate.sdpMid.slice(0, 64) : null,
        sdpMLineIndex: Number.isInteger(signal.candidate.sdpMLineIndex) ? signal.candidate.sdpMLineIndex : null,
      } };
    }
    return null;
  }

  function state(room) {
    for (const player of room.players) {
      if (!player.connected || !player.socketId) continue;
      io.to(player.socketId).emit("room:state", {
        ...room.game.viewFor(player.id),
        roomCode: room.code,
        siteId: room.siteId,
        hostId: room.hostId,
        myId: player.id,
        spectator: player.spectator,
        chatHistory: room.chat,
        players: room.players.map((item) => {
          const gamePlayer = room.game.players.find((candidate) => candidate.id === item.id);
          return {
            id: item.id,
            name: item.name,
            connected: item.connected,
            spectator: item.spectator,
            cardCount: gamePlayer?.hand.length || 0,
            playing: Boolean(gamePlayer?.playing),
            media: mediaView(item),
          };
        }),
      });
    }
  }

  function bind(socket, room, player) {
    if (player.socketId && player.socketId !== socket.id) io.sockets.sockets.get(player.socketId)?.disconnect(true);
    player.socketId = socket.id;
    player.connected = true;
    player.mediaWatching = false;
    player.media = { voice: false, video: false };
    socket.data = { roomKey: key(room.siteId, room.code), playerId: player.id };
    socket.join(channel(room));
  }

  function leaveMedia(room, player) {
    if (!player) return;
    const wasPresent = player.mediaWatching || player.media?.voice || player.media?.video;
    player.mediaWatching = false;
    player.media = { voice: false, video: false };
    if (room && wasPresent) socketRoom(room).emit("media:peer-left", { playerId: player.id });
  }

  function socketRoom(room) {
    return io.to(channel(room));
  }

  const ack = (callback, task) => {
    try { callback?.({ ok: true, ...task() }); }
    catch (error) { callback?.({ ok: false, error: error.message }); }
  };

  io.on("connection", (socket) => {
    const ensureFree = () => { if (socket.data.roomKey) throw Error("Sudah berada di ruang."); };
    const session = () => {
      const room = rooms.get(socket.data.roomKey);
      const player = room?.players.find((item) => item.id === socket.data.playerId && item.socketId === socket.id);
      if (!room || !player) throw Error("Sesi tidak valid.");
      return { room, player };
    };

    socket.on("room:create", (data = {}, callback) => ack(callback, () => {
      ensureFree();
      const siteId = site(data.siteId);
      let roomCode;
      do { roomCode = crypto.randomBytes(3).toString("hex").toUpperCase(); }
      while (rooms.has(key(siteId, roomCode)));
      const player = { id: crypto.randomUUID(), name: name(data.name) || "Pemain", token: crypto.randomBytes(24).toString("hex"), connected: true, spectator: false, media: { voice: false, video: false } };
      const game = new UnoGame();
      game.addPlayer(player);
      const room = { siteId, code: roomCode, players: [player], hostId: player.id, game, chat: [] };
      rooms.set(key(siteId, roomCode), room);
      bind(socket, room, player);
      state(room);
      return { roomCode, playerId: player.id, reconnectToken: player.token, siteId };
    }));

    socket.on("room:join", (data = {}, callback) => ack(callback, () => {
      ensureFree();
      const siteId = site(data.siteId);
      const room = rooms.get(key(siteId, code(data.roomCode)));
      if (!room) throw Error("Ruang tidak ditemukan.");
      if (room.players.length >= 8) throw Error("Ruang penuh.");
      const spectator = room.game.phase !== "waiting";
      const player = { id: crypto.randomUUID(), name: name(data.name) || "Pemain", token: crypto.randomBytes(24).toString("hex"), connected: true, spectator, media: { voice: false, video: false } };
      room.players.push(player);
      if (!spectator) room.game.addPlayer(player);
      bind(socket, room, player);
      state(room);
      return { roomCode: room.code, playerId: player.id, reconnectToken: player.token, siteId, spectator };
    }));

    socket.on("room:reconnect", (data = {}, callback) => ack(callback, () => {
      const siteId = site(data.siteId);
      const room = rooms.get(key(siteId, code(data.roomCode)));
      const player = room?.players.find((item) => item.id === data.playerId);
      if (!player || player.token !== data.reconnectToken) throw Error("Sesi tidak valid.");
      bind(socket, room, player);
      state(room);
      return { roomCode: room.code, playerId: player.id, reconnectToken: player.token, siteId, spectator: player.spectator };
    }));

    socket.on("chat:send", (data = {}, callback) => ack(callback, () => {
      const { room, player } = session();
      const text = message(data.text);
      if (!text) throw Error("Pesan kosong.");
      const now = Date.now();
      if (now - (player.lastChatAt || 0) < 500) throw Error("Terlalu cepat mengirim pesan.");
      player.lastChatAt = now;
      const item = { id: crypto.randomUUID(), playerId: player.id, name: player.name, text, sentAt: now };
      room.chat.push(item);
      if (room.chat.length > CHAT_LIMIT) room.chat.splice(0, room.chat.length - CHAT_LIMIT);
      socketRoom(room).emit("chat:message", item);
      return { message: item };
    }));

    socket.on("media:config", (_data, callback) => ack(callback, () => {
      session();
      return { iceServers: [{ urls: "stun:stun.cloudflare.com:3478" }, { urls: "stun:stun.l.google.com:19302" }] };
    }));

    socket.on("media:watch", (_data, callback) => ack(callback, () => {
      const { room, player } = session();
      player.mediaWatching = true;
      const peers = room.players.filter((item) => item.id !== player.id && item.connected && (item.mediaWatching || item.media?.voice || item.media?.video)).map((item) => ({ id: item.id, name: item.name, media: mediaView(item) }));
      return { peers };
    }));

    socket.on("media:update", (data = {}, callback) => ack(callback, () => {
      const { room, player } = session();
      player.mediaWatching = true;
      player.media = { voice: Boolean(data.voice), video: Boolean(data.video) };
      socket.to(channel(room)).emit("media:peer", { playerId: player.id, name: player.name, ...player.media });
      state(room);
      return { peers: room.players.filter((item) => item.id !== player.id && item.connected && (item.mediaWatching || item.media?.voice || item.media?.video)).map((item) => ({ id: item.id, name: item.name, media: mediaView(item) })) };
    }));

    socket.on("media:signal", (data = {}, callback) => ack(callback, () => {
      const { room, player } = session();
      const target = room.players.find((item) => item.id === data.targetId && item.connected && item.socketId && (item.mediaWatching || item.media?.voice || item.media?.video));
      const signal = safeSignal(data.signal);
      if (!(player.mediaWatching || player.media?.voice || player.media?.video) || !target || !signal) throw Error("Peer media tidak valid.");
      io.to(target.socketId).emit("media:signal", { playerId: player.id, name: player.name, signal });
      return {};
    }));

    socket.on("media:leave", (_data, callback) => ack(callback, () => {
      const { room, player } = session();
      leaveMedia(room, player);
      state(room);
      return {};
    }));

    socket.on("game:start", (_data = {}, callback) => ack(callback, () => {
      const { room, player } = session();
      if (room.hostId !== player.id) throw Error("Hanya host.");
      room.game.start();
      state(room);
      return {};
    }));

    socket.on("game:action", (data = {}, callback) => ack(callback, () => {
      const { room, player } = session();
      if (player.spectator) throw Error("Penonton tidak dapat bermain.");
      const output = room.game.act(player.id, data.actionId, () => {
        if (data.type === "draw") return room.game.draw(player.id);
        if (data.type === "pass") return room.game.pass(player.id);
        if (data.type === "play") return room.game.play(player.id, data.cardId, { color: data.color, uno: Boolean(data.uno) });
        throw Error("Aksi tidak valid.");
      });
      state(room);
      return output;
    }));

    socket.on("game:rematch", (_data = {}, callback) => ack(callback, () => {
      const { room, player } = session();
      if (room.hostId !== player.id) throw Error("Hanya host.");
      if (room.game.phase !== "finished") throw Error("Permainan belum selesai.");
      const seated = room.players.filter((item) => item.connected);
      if (seated.length < 2) throw Error("Minimal 2 pemain terhubung.");
      room.game = new UnoGame();
      for (const item of seated) { item.spectator = false; room.game.addPlayer(item); }
      for (const item of room.players.filter((item) => !item.connected)) item.spectator = true;
      room.game.start();
      state(room);
      return {};
    }));

    socket.on("room:leave", (_data, callback) => ack(callback, () => {
      const { room, player } = session();
      leaveMedia(room, player);
      const gamePlayer = room.game.players.find((item) => item.id === player.id);
      if (gamePlayer && room.game.phase === "playing") {
        const wasCurrent = room.game.current().id === player.id;
        gamePlayer.playing = false;
        const active = room.game.players.filter((item) => item.playing);
        if (active.length === 1) room.game.finishPlayer(active[0]);
        else if (wasCurrent && active.length > 1) room.game.turnIndex = room.game.nextIndex(room.game.turnIndex);
      }
      room.players = room.players.filter((item) => item !== player);
      socket.leave(channel(room));
      socket.data = {};
      if (!room.players.length) rooms.delete(key(room.siteId, room.code));
      else {
        if (room.hostId === player.id) room.hostId = room.players[0].id;
        state(room);
      }
      return {};
    }));

    socket.on("disconnect", () => {
      const room = rooms.get(socket.data.roomKey);
      const player = room?.players.find((item) => item.id === socket.data.playerId && item.socketId === socket.id);
      if (!player) return;
      leaveMedia(room, player);
      player.connected = false;
      state(room);
    });
  });

  return { app, server, io, rooms };
}

if (require.main === module) {
  const { server } = createService();
  server.listen(Number(process.env.PORT) || 3053, "127.0.0.1", () => console.log("UNO online listening"));
}

module.exports = { createService };
