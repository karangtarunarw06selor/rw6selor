const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Pocket Clash realtime server active");
});
const wss = new WebSocket.Server({ server });
const rooms = new Map();
const presenceChannels = new Map();
const lobbyHistory = new Map();

const cleanSiteId = (value) => String(value || "MMS").trim().toUpperCase() === "KT" ? "KT" : "MMS";
const cleanRoomCode = (value) => String(value || "").trim().toUpperCase().slice(0, 16);
const cleanGameId = (value) => String(value || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 32);
const cleanClientId = (value) => String(value || "").trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);
const cleanName = (value) => String(value || "Pemain").trim().replace(/\s+/g, " ").slice(0, 40) || "Pemain";
const cleanMessage = (value) => String(value || "").trim().replace(/\s+/g, " ").slice(0, 240);
const roomKey = (siteId, roomCode) => `${siteId}:${roomCode}`;
const presenceKey = (siteId, gameId) => `${siteId}:${gameId}`;
const roleEndpoint = (siteId) => siteId === "KT"
  ? "https://karangtaruna.rw6selor.org/billiard/api/realtime_role.php"
  : "https://mudamudiselor.rw6selor.org/billiard/api/realtime_role.php";
async function verifyRole(siteId, roomCode, playerKey, claimedSpectator) {
  if (process.env.NODE_ENV === "test") return { ok: true, spectator: Boolean(claimedSpectator) };
  if (!playerKey) return { ok: false };
  try {
    const response = await fetch(roleEndpoint(siteId), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ player_key: playerKey, room_code: roomCode }),
      signal: AbortSignal.timeout(3000),
    });
    const result = await response.json();
    return {
      ok: response.ok && result.success === true,
      spectator: result.spectator === true,
      playerId: result.player_id,
      username: result.username,
    };
  } catch {
    return { ok: false };
  }
}
const validVoiceSignal = (signal) => {
  if (!signal || typeof signal !== "object" || JSON.stringify(signal).length > 20000) return false;
  if (signal.description) return ["offer", "answer"].includes(signal.description.type) && typeof signal.description.sdp === "string";
  return Boolean(signal.candidate && typeof signal.candidate.candidate === "string");
};

function safeSend(ws, data) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
}

function broadcastToRoom(key, data, exceptWs = null) {
  const room = rooms.get(key);
  if (!room) return;
  for (const client of room.clients) {
    if (client !== exceptWs) safeSend(client, data);
  }
}

function uniquePresenceCount(key) {
  const clients = presenceChannels.get(key);
  return clients ? new Set([...clients].map((client) => client.clientId)).size : 0;
}

function broadcastPresence(key) {
  const clients = presenceChannels.get(key);
  if (!clients) return;
  const onlineCount = uniquePresenceCount(key);
  for (const client of clients) safeSend(client, { type: "presence_update", site_id: client.siteId, game_id: client.gameId, online_count: onlineCount });
}

function removePresence(ws) {
  if (!ws.presenceKey) return;
  const key = ws.presenceKey;
  const clients = presenceChannels.get(key);
  if (clients) {
    clients.delete(ws);
    if (clients.size) broadcastPresence(key);
    else presenceChannels.delete(key);
  }
  ws.presenceKey = null;
  ws.gameId = null;
  ws.clientId = null;
}

function getRoomClientCount(key) {
  const clients = rooms.get(key)?.clients;
  return clients ? new Set([...clients].map((client) => client.playerId || client.clientId)).size : 0;
}

function removeClientFromRoom(ws) {
  if (!ws.roomKey) return;
  const key = ws.roomKey;
  const room = rooms.get(key);
  if (!room) return;
  room.clients.delete(ws);
  if (ws.voice) broadcastToRoom(key, { type: "voice_peer_left", player_id: ws.playerId }, ws);
  broadcastToRoom(key, {
    type: "player_left",
    room_code: ws.roomCode,
    site_id: ws.siteId,
    player_id: ws.playerId || null,
    username: ws.username || null,
    online_count: getRoomClientCount(key)
  });
  if (room.clients.size === 0) rooms.delete(key);
  ws.roomCode = null;
  ws.roomKey = null;
  ws.voice = false;
}

wss.on("connection", (ws) => {
  ws.isAlive = true;
  ws.roomCode = null;
  ws.roomKey = null;
  ws.siteId = "MMS";
  ws.playerId = null;
  ws.username = null;
  ws.voice = false;
  ws.spectator = false;
  ws.presenceKey = null;
  ws.gameId = null;
  ws.clientId = null;
  ws.lastChatAt = 0;

  safeSend(ws, { type: "connected", message: "Connected to Pocket Clash realtime server" });
  ws.on("pong", () => { ws.isAlive = true; });

  ws.on("message", async (raw) => {
    let data;
    try {
      data = JSON.parse(raw.toString());
    } catch {
      safeSend(ws, { type: "error", message: "Invalid JSON" });
      return;
    }

    if (data.type === "presence_join") {
      const siteId = cleanSiteId(data.site_id);
      const gameId = cleanGameId(data.game_id);
      const clientId = cleanClientId(data.client_id);
      if (!gameId || !clientId) return safeSend(ws, { type: "error", message: "Presence tidak valid" });
      removePresence(ws);
      ws.siteId = siteId;
      ws.gameId = gameId;
      ws.clientId = clientId;
      ws.username = cleanName(data.username);
      ws.presenceKey = presenceKey(siteId, gameId);
      if (!presenceChannels.has(ws.presenceKey)) presenceChannels.set(ws.presenceKey, new Set());
      presenceChannels.get(ws.presenceKey).add(ws);
      safeSend(ws, { type: "presence_history", messages: lobbyHistory.get(ws.presenceKey) || [] });
      broadcastPresence(ws.presenceKey);
      return;
    }

    if (data.type === "lobby_chat_send") {
      const message = cleanMessage(data.message);
      if (!ws.presenceKey || ws.gameId !== "billiard" || !message) return safeSend(ws, { type: "chat_rejected", message: "Chat lobby tidak valid" });
      if (Date.now() - ws.lastChatAt < 700) return safeSend(ws, { type: "chat_rejected", message: "Terlalu cepat" });
      ws.lastChatAt = Date.now();
      const item = { type: "lobby_chat", id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, username: ws.username, message, timestamp: Date.now() };
      const history = lobbyHistory.get(ws.presenceKey) || [];
      history.push(item);
      lobbyHistory.set(ws.presenceKey, history.slice(-50));
      for (const client of presenceChannels.get(ws.presenceKey) || []) safeSend(client, item);
      return;
    }

    if (data.type === "join_room") {
      const roomCode = cleanRoomCode(data.room_code);
      const siteId = cleanSiteId(data.site_id);
      const key = roomKey(siteId, roomCode);
      if (!roomCode) {
        safeSend(ws, { type: "error", message: "room_code kosong" });
        return;
      }
      const role = await verifyRole(siteId, roomCode, String(data.player_key || ""), data.spectator);
      if (!role.ok) return safeSend(ws, { type: "error", message: "Seat realtime tidak valid" });
      removeClientFromRoom(ws);
      ws.roomCode = roomCode;
      ws.roomKey = key;
      ws.siteId = siteId;
      ws.playerId = String(role.playerId || data.player_id || "").slice(0, 64);
      ws.username = String(role.username || data.username || "Pemain").slice(0, 40);
      ws.spectator = role.spectator;
      if (!rooms.has(key)) rooms.set(key, { clients: new Set() });
      rooms.get(key).clients.add(ws);
      safeSend(ws, {
        type: "joined_room",
        room_code: roomCode,
        site_id: siteId,
        player_id: ws.playerId,
        username: ws.username,
        spectator: ws.spectator,
        online_count: getRoomClientCount(key)
      });
      broadcastToRoom(key, {
        type: "player_joined",
        room_code: roomCode,
        site_id: siteId,
        player_id: ws.playerId,
        username: ws.username,
        online_count: getRoomClientCount(key)
      }, ws);
      return;
    }

    if (!ws.roomKey) {
      safeSend(ws, { type: "error", message: "Belum join room realtime" });
      return;
    }

    if (data.type === "room_chat_send") {
      const message = cleanMessage(data.message);
      if (!message) return safeSend(ws, { type: "chat_rejected", message: "Pesan kosong" });
      if (Date.now() - ws.lastChatAt < 700) return safeSend(ws, { type: "chat_rejected", message: "Terlalu cepat" });
      ws.lastChatAt = Date.now();
      broadcastToRoom(ws.roomKey, { type: "room_chat", id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, player_id: ws.playerId, username: ws.username, message, timestamp: Date.now() });
      return;
    }

    if (data.type === "voice_join") {
      const room = rooms.get(ws.roomKey);
      const peers = [...room.clients]
        .filter((client) => client !== ws && client.voice)
        .map((client) => ({ player_id: client.playerId, username: client.username }));
      ws.voice = true;
      safeSend(ws, { type: "voice_joined", peers });
      broadcastToRoom(ws.roomKey, { type: "voice_peer_joined", player_id: ws.playerId, username: ws.username }, ws);
      return;
    }

    if (data.type === "voice_leave") {
      if (ws.voice) {
        ws.voice = false;
        broadcastToRoom(ws.roomKey, { type: "voice_peer_left", player_id: ws.playerId }, ws);
      }
      return;
    }

    if (data.type === "voice_signal") {
      const targetId = String(data.target_player_id || "");
      const room = rooms.get(ws.roomKey);
      const target = [...room.clients].find((client) => client.voice && String(client.playerId) === targetId);
      if (!ws.voice || !target || target === ws || !validVoiceSignal(data.signal)) {
        safeSend(ws, { type: "voice_error", message: "Target atau signaling voice tidak valid" });
        return;
      }
      safeSend(target, {
        type: "voice_signal",
        player_id: ws.playerId,
        username: ws.username,
        signal: data.signal
      });
      return;
    }

    if (data.type === "aim_update") {
      if (ws.spectator) return safeSend(ws, { type: "gameplay_rejected", message: "Penonton tidak bisa membidik." });
      broadcastToRoom(ws.roomKey, {
        type: "aim_update",
        room_code: ws.roomCode,
        player_id: ws.playerId,
        username: ws.username,
        aim: data.aim || null,
        power: data.power || 0,
        timestamp: Date.now()
      }, ws);
      return;
    }

    if (data.type === "shot_start") {
      if (ws.spectator) return safeSend(ws, { type: "gameplay_rejected", message: "Penonton tidak bisa menembak." });
      broadcastToRoom(ws.roomKey, {
        type: "shot_start",
        room_code: ws.roomCode,
        player_id: ws.playerId,
        username: ws.username,
        shot: data.shot || null,
        balls: data.balls || null,
        timestamp: Date.now()
      }, ws);
      return;
    }

    if (data.type === "shot_end") {
      if (ws.spectator) return safeSend(ws, { type: "gameplay_rejected", message: "Penonton tidak bisa mengubah state meja." });
      broadcastToRoom(ws.roomKey, {
        type: "shot_end",
        room_code: ws.roomCode,
        player_id: ws.playerId,
        username: ws.username,
        balls: data.balls || null,
        timestamp: Date.now()
      }, ws);
      return;
    }

    if (data.type === "ball_frame") {
      if (ws.spectator || !Array.isArray(data.balls) || data.balls.length > 16) return;
      const balls = data.balls.map((ball) => ({ number: Number(ball.number), x: Number(ball.x), y: Number(ball.y), vx: Number(ball.vx || 0), vy: Number(ball.vy || 0), pocketed: Boolean(ball.pocketed) }));
      if (balls.some((ball) => ![ball.number, ball.x, ball.y, ball.vx, ball.vy].every(Number.isFinite))) return;
      broadcastToRoom(ws.roomKey, { type: "ball_frame", player_id: ws.playerId, balls, timestamp: Date.now() }, ws);
      return;
    }

    if (data.type === "ping") {
      safeSend(ws, { type: "pong", timestamp: Date.now() });
      return;
    }

    safeSend(ws, { type: "error", message: "Unknown message type" });
  });

  ws.on("close", () => { removeClientFromRoom(ws); removePresence(ws); });
  ws.on("error", () => { removeClientFromRoom(ws); removePresence(ws); });
});

setInterval(() => {
  for (const ws of wss.clients) {
    if (!ws.isAlive) {
      removeClientFromRoom(ws);
      removePresence(ws);
      ws.terminate();
      continue;
    }
    ws.isAlive = false;
    ws.ping();
  }
}, 30000);

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Pocket Clash realtime server running on 127.0.0.1:${PORT}`);
});
