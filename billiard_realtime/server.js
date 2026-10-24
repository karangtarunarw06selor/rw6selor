const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Pocket Clash realtime server active");
});
const wss = new WebSocket.Server({ server });
const rooms = new Map();

const cleanSiteId = (value) => String(value || "MMS").trim().toUpperCase() === "KT" ? "KT" : "MMS";
const cleanRoomCode = (value) => String(value || "").trim().toUpperCase().slice(0, 16);
const roomKey = (siteId, roomCode) => `${siteId}:${roomCode}`;
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

function getRoomClientCount(key) {
  return rooms.get(key)?.clients.size || 0;
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

  safeSend(ws, { type: "connected", message: "Connected to Pocket Clash realtime server" });
  ws.on("pong", () => { ws.isAlive = true; });

  ws.on("message", (raw) => {
    let data;
    try {
      data = JSON.parse(raw.toString());
    } catch {
      safeSend(ws, { type: "error", message: "Invalid JSON" });
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
      removeClientFromRoom(ws);
      ws.roomCode = roomCode;
      ws.roomKey = key;
      ws.siteId = siteId;
      ws.playerId = String(data.player_id || "").slice(0, 64);
      ws.username = String(data.username || "Pemain").slice(0, 40);
      if (!rooms.has(key)) rooms.set(key, { clients: new Set() });
      rooms.get(key).clients.add(ws);
      safeSend(ws, {
        type: "joined_room",
        room_code: roomCode,
        site_id: siteId,
        player_id: ws.playerId,
        username: ws.username,
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

    if (data.type === "ping") {
      safeSend(ws, { type: "pong", timestamp: Date.now() });
      return;
    }

    safeSend(ws, { type: "error", message: "Unknown message type" });
  });

  ws.on("close", () => removeClientFromRoom(ws));
  ws.on("error", () => removeClientFromRoom(ws));
});

setInterval(() => {
  for (const ws of wss.clients) {
    if (!ws.isAlive) {
      removeClientFromRoom(ws);
      ws.terminate();
      continue;
    }
    ws.isAlive = false;
    ws.ping();
  }
}, 30000);

server.listen(PORT, () => {
  console.log(`Pocket Clash realtime server running on port ${PORT}`);
});
