"use strict";

const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

const rooms = {};

function createInitialBoard() {
    return [
        ["r", "n", "b", "q", "k", "b", "n", "r"],
        ["p", "p", "p", "p", "p", "p", "p", "p"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["P", "P", "P", "P", "P", "P", "P", "P"],
        ["R", "N", "B", "Q", "K", "B", "N", "R"]
    ];
}

function getPieceColor(piece) {
    if (!piece) return null;
    return piece === piece.toUpperCase() ? "white" : "black";
}

function getRoomPublicData(roomCode) {
    const room = rooms[roomCode];

    if (!room) return null;

    return {
        roomCode,
        board: room.board,
        turn: room.turn,
        players: room.players.length,
        status: room.status
    };
}

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", (roomCodeRaw) => {
        const roomCode = String(roomCodeRaw || "").trim().toUpperCase();

        if (!roomCode) {
            socket.emit("joinError", "Kode room kosong.");
            return;
        }

        if (!rooms[roomCode]) {
            rooms[roomCode] = {
                players: [],
                board: createInitialBoard(),
                turn: "white",
                status: "waiting"
            };
        }

        const room = rooms[roomCode];

        const alreadyJoined = room.players.find((player) => {
            return player.socketId === socket.id;
        });

        if (alreadyJoined) {
            socket.emit("joinedRoom", {
                ...getRoomPublicData(roomCode),
                color: alreadyJoined.color
            });
            return;
        }

        if (room.players.length >= 2) {
            socket.emit("roomFull", "Room sudah penuh.");
            return;
        }

        const color = room.players.length === 0 ? "white" : "black";

        room.players.push({
            socketId: socket.id,
            color
        });

        if (room.players.length === 2) {
            room.status = "playing";
        }

        socket.join(roomCode);
        socket.data.roomCode = roomCode;
        socket.data.color = color;

        socket.emit("joinedRoom", {
            ...getRoomPublicData(roomCode),
            color
        });

        io.to(roomCode).emit("roomUpdate", getRoomPublicData(roomCode));

        if (room.status === "playing") {
            io.to(roomCode).emit("gameReady", getRoomPublicData(roomCode));
        }

        console.log(`${socket.id} joined room ${roomCode} as ${color}`);
    });

    socket.on("movePiece", (data) => {
        const roomCode = String(data?.roomCode || socket.data.roomCode || "").trim().toUpperCase();

        const fromRow = Number(data?.fromRow);
        const fromCol = Number(data?.fromCol);
        const toRow = Number(data?.toRow);
        const toCol = Number(data?.toCol);

        const room = rooms[roomCode];

        if (!room) {
            socket.emit("invalidMove", "Room tidak ditemukan.");
            return;
        }

        if (room.status !== "playing") {
            socket.emit("invalidMove", "Game belum siap. Tunggu player kedua masuk.");
            return;
        }

        const player = room.players.find((item) => item.socketId === socket.id);

        if (!player) {
            socket.emit("invalidMove", "Kamu bukan player di room ini.");
            return;
        }

        if (player.color !== room.turn) {
            socket.emit("invalidMove", "Bukan giliran kamu.");
            return;
        }

        const validCoordinate =
            Number.isInteger(fromRow) &&
            Number.isInteger(fromCol) &&
            Number.isInteger(toRow) &&
            Number.isInteger(toCol) &&
            fromRow >= 0 &&
            fromRow <= 7 &&
            fromCol >= 0 &&
            fromCol <= 7 &&
            toRow >= 0 &&
            toRow <= 7 &&
            toCol >= 0 &&
            toCol <= 7;

        if (!validCoordinate) {
            socket.emit("invalidMove", "Koordinat langkah tidak valid.");
            return;
        }

        const piece = room.board[fromRow][fromCol];

        if (!piece) {
            socket.emit("invalidMove", "Tidak ada bidak di posisi asal.");
            return;
        }

        const pieceColor = getPieceColor(piece);

        if (pieceColor !== player.color) {
            socket.emit("invalidMove", "Kamu tidak bisa menggerakkan bidak lawan.");
            return;
        }

        const targetPiece = room.board[toRow][toCol];
        const targetColor = getPieceColor(targetPiece);

        if (targetColor === player.color) {
            socket.emit("invalidMove", "Tidak bisa memakan bidak sendiri.");
            return;
        }

        // Untuk tahap awal, ini belum validasi aturan catur penuh.
        // Nanti rules pawn, rook, bishop, knight, queen, king ditambahkan di sini.
        room.board[toRow][toCol] = piece;
        room.board[fromRow][fromCol] = "";

        room.turn = room.turn === "white" ? "black" : "white";

        io.to(roomCode).emit("boardUpdated", {
            ...getRoomPublicData(roomCode),
            move: {
                fromRow,
                fromCol,
                toRow,
                toCol,
                piece,
                captured: targetPiece || null
            }
        });
    });

    socket.on("resetGame", () => {
        const roomCode = socket.data.roomCode;
        const room = rooms[roomCode];

        if (!room) return;

        room.board = createInitialBoard();
        room.turn = "white";
        room.status = room.players.length === 2 ? "playing" : "waiting";

        io.to(roomCode).emit("boardUpdated", getRoomPublicData(roomCode));
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        for (const roomCode of Object.keys(rooms)) {
            const room = rooms[roomCode];

            const playerIndex = room.players.findIndex((player) => {
                return player.socketId === socket.id;
            });

            if (playerIndex === -1) continue;

            const disconnectedPlayer = room.players[playerIndex];

            room.players.splice(playerIndex, 1);
            room.status = "waiting";

            io.to(roomCode).emit("playerDisconnected", {
                message: `${disconnectedPlayer.color} keluar dari game.`,
                disconnectedColor: disconnectedPlayer.color
            });

            io.to(roomCode).emit("roomUpdate", getRoomPublicData(roomCode));

            if (room.players.length === 0) {
                delete rooms[roomCode];
                console.log(`Room ${roomCode} deleted.`);
            }

            break;
        }
    });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

server.listen(PORT, () => {
    console.log(`Chess Online server running on port ${PORT}`);
});