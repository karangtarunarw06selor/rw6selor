const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/plain"
  });

  res.end("Pocket Clash realtime server active");
});

const wss = new WebSocket.Server({
  server
});

const rooms = new Map();

function safeSend(ws, data) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

function broadcastToRoom(roomCode, data, exceptWs = null) {
  const room = rooms.get(roomCode);

  if (!room) return;

  for (const client of room.clients) {
    if (client !== exceptWs) {
      safeSend(client, data);
    }
  }
}

function getRoomClientCount(roomCode) {
  const room = rooms.get(roomCode);
  return room ? room.clients.size : 0;
}

function removeClientFromRoom(ws) {
  const roomCode = ws.roomCode;

  if (!roomCode) return;

  const room = rooms.get(roomCode);

  if (!room) return;

  room.clients.delete(ws);

  broadcastToRoom(roomCode, {
    type: "player_left",
    room_code: roomCode,
    player_id: ws.playerId || null,
    username: ws.username || null,
    online_count: getRoomClientCount(roomCode)
  });

  if (room.clients.size === 0) {
    rooms.delete(roomCode);
  }

  ws.roomCode = null;
}

wss.on("connection", (ws) => {
  ws.isAlive = true;
  ws.roomCode = null;
  ws.playerId = null;
  ws.username = null;

  safeSend(ws, {
    type: "connected",
    message: "Connected to Pocket Clash realtime server"
  });

  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("message", (raw) => {
    let data;

    try {
      data = JSON.parse(raw.toString());
    } catch (err) {
      safeSend(ws, {
        type: "error",
        message: "Invalid JSON"
      });
      return;
    }

    if (data.type === "join_room") {
      const roomCode = String(data.room_code || "").trim().toUpperCase();

      if (!roomCode) {
        safeSend(ws, {
          type: "error",
          message: "room_code kosong"
        });
        return;
      }

      removeClientFromRoom(ws);

      ws.roomCode = roomCode;
      ws.playerId = data.player_id || null;
      ws.username = data.username || null;

      if (!rooms.has(roomCode)) {
        rooms.set(roomCode, {
          clients: new Set()
        });
      }

      rooms.get(roomCode).clients.add(ws);

      safeSend(ws, {
        type: "joined_room",
        room_code: roomCode,
        player_id: ws.playerId,
        username: ws.username,
        online_count: getRoomClientCount(roomCode)
      });

      broadcastToRoom(roomCode, {
        type: "player_joined",
        room_code: roomCode,
        player_id: ws.playerId,
        username: ws.username,
        online_count: getRoomClientCount(roomCode)
      }, ws);

      return;
    }

    if (!ws.roomCode) {
      safeSend(ws, {
        type: "error",
        message: "Belum join room realtime"
      });
      return;
    }

    if (data.type === "aim_update") {
      broadcastToRoom(ws.roomCode, {
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
      broadcastToRoom(ws.roomCode, {
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
      broadcastToRoom(ws.roomCode, {
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
      safeSend(ws, {
        type: "pong",
        timestamp: Date.now()
      });

      return;
    }

    safeSend(ws, {
      type: "error",
      message: "Unknown message type"
    });
  });

  ws.on("close", () => {
    removeClientFromRoom(ws);
  });

  ws.on("error", () => {
    removeClientFromRoom(ws);
  });
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