
"use strict";

const express = require("express");

const http = require("http");

const path = require("path");
const crypto = require("crypto");

const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {

    path: "/chess/socket.io",

    cors: {

        origin: "*",

        methods: ["GET", "POST"]

    }

});

const PORT = process.env.PORT || 3000;

app.use("/chess", express.static(path.join(__dirname, "public")));

app.use(express.static(path.join(__dirname, "public")));

const rooms = {};

const publicQueue = [];
const lobbyMessages = { MMS: [], KT: [] };
const cleanSite = (value) => String(value || "MMS").trim().toUpperCase() === "KT" ? "KT" : "MMS";
const cleanLobbyText = (value, limit) => String(value || "").trim().replace(/\s+/g, " ").slice(0, limit);
const lobbyChannel = (siteId) => `chess:lobby:${siteId}`;
const lobbyState = (siteId) => ({ messages: lobbyMessages[siteId], rooms: Object.entries(rooms).filter(([, room]) => room.siteId === siteId).map(([code, room]) => ({ code, players: room.players.length, status: room.status })).slice(-20) });
const emitLobby = (siteId) => io.to(lobbyChannel(siteId)).emit("lobby:state", lobbyState(siteId));

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

function getPromotionPiece(color, promotion) {

    const allowed = ["q", "r", "b", "n"];

    const selected = String(promotion || "q").toLowerCase();

    if (!allowed.includes(selected)) {

        return color === "white" ? "Q" : "q";

    }

    return color === "white" ? selected.toUpperCase() : selected;

}

function getPieceColor(piece) {

    if (!piece) return null;

    return piece === piece.toUpperCase() ? "white" : "black";

}

function oppositeColor(color) {

    return color === "white" ? "black" : "white";

}

function findKing(board, color) {

    const king = color === "white" ? "K" : "k";

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            if (board[row][col] === king) {

                return { row, col };

            }

        }

    }

    return null;

}

function isClearPath(board, fromRow, fromCol, toRow, toCol) {

    const rowStep = Math.sign(toRow - fromRow);

    const colStep = Math.sign(toCol - fromCol);

    let row = fromRow + rowStep;

    let col = fromCol + colStep;

    while (row !== toRow || col !== toCol) {

        if (board[row][col]) return false;

        row += rowStep;

        col += colStep;

    }

    return true;

}

function canPieceAttack(board, fromRow, fromCol, toRow, toCol) {

    const piece = board[fromRow][fromCol];

    if (!piece) return false;

    const color = getPieceColor(piece);

    const lower = piece.toLowerCase();

    const rowDiff = toRow - fromRow;

    const colDiff = toCol - fromCol;

    const absRow = Math.abs(rowDiff);

    const absCol = Math.abs(colDiff);

    if (lower === "p") {

        const direction = color === "white" ? -1 : 1;

        return rowDiff === direction && absCol === 1;

    }

    if (lower === "n") {

        return (absRow === 2 && absCol === 1) || (absRow === 1 && absCol === 2);

    }

    if (lower === "b") {

        return absRow === absCol && isClearPath(board, fromRow, fromCol, toRow, toCol);

    }

    if (lower === "r") {

        return (fromRow === toRow || fromCol === toCol) && isClearPath(board, fromRow, fromCol, toRow, toCol);

    }

    if (lower === "q") {

        const diagonal = absRow === absCol;

        const straight = fromRow === toRow || fromCol === toCol;

        return (diagonal || straight) && isClearPath(board, fromRow, fromCol, toRow, toCol);

    }

    if (lower === "k") {

        return absRow <= 1 && absCol <= 1;

    }

    return false;

}

function cloneBoard(board) {

    return board.map((row) => row.slice());

}

function getMoveValidationMessage(piece) {

    const lower = piece.toLowerCase();

    if (lower === "p") {

        return "Langkah pion tidak valid. Pion jalan maju, makan diagonal samping.";

    }

    if (lower === "n") {

        return "Langkah kuda tidak valid. Kuda hanya boleh bergerak pola L.";

    }

    if (lower === "b") {

        return "Langkah bishop/gajah tidak valid. Bishop hanya boleh bergerak diagonal.";

    }

    if (lower === "r") {

        return "Langkah rook/benteng tidak valid. Benteng hanya boleh bergerak lurus.";

    }

    if (lower === "q") {

        return "Langkah queen/ratu tidak valid. Ratu hanya boleh bergerak lurus atau diagonal.";

    }

    if (lower === "k") {

        return "Langkah king/raja tidak valid. Raja hanya boleh bergerak 1 kotak.";

    }

    return "Langkah bidak tidak valid.";

}

function isLegalPieceMove(board, fromRow, fromCol, toRow, toCol, color) {

    const piece = board[fromRow][fromCol];

    const targetPiece = board[toRow][toCol];

    const lower = piece.toLowerCase();

    const rowDiff = toRow - fromRow;

    const colDiff = toCol - fromCol;

    const absRow = Math.abs(rowDiff);

    const absCol = Math.abs(colDiff);

    if (fromRow === toRow && fromCol === toCol) {

        return {

            ok: false,

            message: "Bidak harus berpindah ke kotak lain."

        };

    }

    if (lower === "p") {

        const direction = color === "white" ? -1 : 1;

        const startRow = color === "white" ? 6 : 1;

        const movingForward = colDiff === 0;

        const targetEmpty = !targetPiece;

        if (movingForward && rowDiff === direction && targetEmpty) {

            return { ok: true };

        }

        if (

            movingForward &&

            fromRow === startRow &&

            rowDiff === direction * 2 &&

            targetEmpty &&

            !board[fromRow + direction][fromCol]

        ) {

            return { ok: true };

        }

        if (

            absCol === 1 &&

            rowDiff === direction &&

            targetPiece &&

            getPieceColor(targetPiece) !== color

        ) {

            return { ok: true };

        }

        return {

            ok: false,

            message: "Langkah pion tidak valid. Pion jalan maju jika kosong dan hanya makan diagonal samping."

        };

    }

    if (lower === "n") {

        const validKnight = (absRow === 2 && absCol === 1) || (absRow === 1 && absCol === 2);

        return validKnight

            ? { ok: true }

            : { ok: false, message: getMoveValidationMessage(piece) };

    }

    if (lower === "b") {

        const validBishop = absRow === absCol && isClearPath(board, fromRow, fromCol, toRow, toCol);

        return validBishop

            ? { ok: true }

            : { ok: false, message: getMoveValidationMessage(piece) };

    }

    if (lower === "r") {

        const validRook = (fromRow === toRow || fromCol === toCol) && isClearPath(board, fromRow, fromCol, toRow, toCol);

        return validRook

            ? { ok: true }

            : { ok: false, message: getMoveValidationMessage(piece) };

    }

    if (lower === "q") {

        const diagonal = absRow === absCol;

        const straight = fromRow === toRow || fromCol === toCol;

        const validQueen = (diagonal || straight) && isClearPath(board, fromRow, fromCol, toRow, toCol);

        return validQueen

            ? { ok: true }

            : { ok: false, message: getMoveValidationMessage(piece) };

    }

    if (lower === "k") {

        const validKing = absRow <= 1 && absCol <= 1;

        return validKing

            ? { ok: true }

            : { ok: false, message: getMoveValidationMessage(piece) };

    }

    return {

        ok: false,

        message: "Bidak tidak dikenali."

    };

}

function isLegalMove(board, fromRow, fromCol, toRow, toCol, color, options = {}) {

    const piece = board[fromRow][fromCol];

    if (!piece) {

        return {

            ok: false,

            message: "Tidak ada bidak di posisi asal."

        };

    }

    const pieceColor = getPieceColor(piece);

    if (pieceColor !== color) {

        return {

            ok: false,

            message: "Kamu tidak bisa menggerakkan bidak lawan."

        };

    }

    const targetPiece = board[toRow][toCol];

    const targetColor = getPieceColor(targetPiece);

    if (

        !options.allowKingCapture &&

        targetPiece &&

        targetPiece.toLowerCase() === "k"

    ) {

        return {

            ok: false,

            message: "Raja tidak boleh dimakan. Game selesai saat skakmat."

        };

    }

    if (targetColor === color) {

        return {

            ok: false,

            message: "Tidak bisa memakan bidak sendiri."

        };

    }

    const pieceRule = isLegalPieceMove(board, fromRow, fromCol, toRow, toCol, color);

    if (!pieceRule.ok) {

        return pieceRule;

    }

    const simulatedBoard = cloneBoard(board);

    simulatedBoard[toRow][toCol] = piece;

    simulatedBoard[fromRow][fromCol] = "";

    if (isKingInCheck(simulatedBoard, color)) {

        return {

            ok: false,

            message: "Langkah tidak valid karena raja kamu akan/skak."

        };

    }

    return { ok: true };

}

function hasAnyLegalMove(board, color) {

    for (let fromRow = 0; fromRow < 8; fromRow++) {

        for (let fromCol = 0; fromCol < 8; fromCol++) {

            const piece = board[fromRow][fromCol];

            if (!piece || getPieceColor(piece) !== color) continue;

            for (let toRow = 0; toRow < 8; toRow++) {

                for (let toCol = 0; toCol < 8; toCol++) {

                    const validation = isLegalMove(board, fromRow, fromCol, toRow, toCol, color, {

                        allowKingCapture: false

                    });

                    if (validation.ok) {

                        return true;

                    }

                }

            }

        }

    }

    return false;

}

function finalizeGameState(room, nextTurn) {

    const checked = isKingInCheck(room.board, nextTurn);

    const hasLegalMove = hasAnyLegalMove(room.board, nextTurn);

    room.check = checked ? nextTurn : null;

    if (checked && !hasLegalMove) {

        room.status = "finished";

        room.winner = oppositeColor(nextTurn);

        room.endReason = "checkmate";

        return;

    }

    if (!checked && !hasLegalMove) {

        room.status = "finished";

        room.winner = null;

        room.endReason = "stalemate";

        return;

    }

    room.status = "playing";

    room.winner = null;

    room.endReason = null;

}

function isKingInCheck(board, color) {

    const kingPos = findKing(board, color);

    if (!kingPos) return false;

    const attackerColor = oppositeColor(color);

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const piece = board[row][col];

            if (!piece) continue;

            if (getPieceColor(piece) !== attackerColor) continue;

            if (canPieceAttack(board, row, col, kingPos.row, kingPos.col)) {

                return true;

            }

        }

    }

    return false;

}

function getRoomData(roomCode) {

    const room = rooms[roomCode];

    if (!room) return null;

    return {

        roomCode,

        board: room.board,

        turn: room.turn,

        players: room.players.length,

        members: room.players.map(({ id, color }) => ({ id, color })),

        hostId: room.players[0]?.id || null,

        status: room.status,

        capturedPieces: room.capturedPieces || { white: [], black: [] },

        winner: room.winner || null,

        check: room.check || null,

        endReason: room.endReason || null,

        gameOver: room.status === "finished"

    };

}

function createRoom(roomCode, siteId = "MMS") {

    rooms[roomCode] = {

        siteId: cleanSite(siteId),

        players: [],

        board: createInitialBoard(),

        turn: "white",

        status: "waiting",

        capturedPieces: { white: [], black: [] },

        winner: null,

        check: null,

        endReason: null

    };

}

app.get("/chess/debug-path", (req, res) => {

    res.json({

        ok: true,

        app: "chess-online-state-fixed",

        path: req.path,

        originalUrl: req.originalUrl,

        dirname: __dirname,

        socketPath: "/chess/socket.io",

        time: new Date().toISOString()

    });

});

app.get("/chess", (req, res) => {

    res.sendFile(path.join(__dirname, "public", "index.html"));

});

app.get("/chess/", (req, res) => {

    res.sendFile(path.join(__dirname, "public", "index.html"));

});

io.on("connection", (socket) => {

    console.log("Socket connected:", socket.id);

    socket.on("lobby:join", ({ siteId: rawSite } = {}, reply = () => {}) => {
        const siteId = cleanSite(rawSite);
        if (socket.data.lobbySite) socket.leave(lobbyChannel(socket.data.lobbySite));
        socket.data.lobbySite = siteId; socket.join(lobbyChannel(siteId));
        reply({ ok: true, ...lobbyState(siteId) });
    });

    socket.on("lobby:chat", ({ siteId: rawSite, name, text } = {}, reply = () => {}) => {
        const siteId = cleanSite(rawSite); const cleanName = cleanLobbyText(name, 28); const cleanText = cleanLobbyText(text, 180); const now = Date.now();
        if (socket.data.lobbySite !== siteId) return reply({ ok: false, error: "Lobby tidak sesuai." });
        if (!cleanName || !cleanText) return reply({ ok: false, error: "Nama dan pesan wajib diisi." });
        if (now - (socket.data.lastLobbyChatAt || 0) < 1200) return reply({ ok: false, error: "Tunggu sebentar sebelum mengirim lagi." });
        socket.data.lastLobbyChatAt = now;
        const message = { id: `${socket.id}:${now}`, name: cleanName, text: cleanText, at: now };
        lobbyMessages[siteId].push(message); if (lobbyMessages[siteId].length > 50) lobbyMessages[siteId].shift();
        io.to(lobbyChannel(siteId)).emit("lobby:chat", message); reply({ ok: true });
    });

    socket.on("findPublicMatch", ({ siteId: rawSite } = {}) => {

        const existingIndex = publicQueue.findIndex((item) => item.socketId === socket.id);

        if (existingIndex !== -1) {

            socket.emit("publicWaiting");

            return;

        }

        const siteId = cleanSite(rawSite);
        const opponentIndex = publicQueue.findIndex((item) => item.siteId === siteId);
        const opponent = opponentIndex === -1 ? null : publicQueue.splice(opponentIndex, 1)[0];

        if (!opponent) {

            publicQueue.push({ socketId: socket.id, siteId });

            socket.emit("publicWaiting");

            return;

        }

        const roomCode = "PUB" + Math.random().toString(36).slice(2, 8).toUpperCase();

        socket.emit("publicMatched", { roomCode });

        io.to(opponent.socketId).emit("publicMatched", { roomCode });

    });

    socket.on("joinRoom", (payload) => {

        const roomCodeRaw = typeof payload === "object" ? payload?.roomCode : payload;
        const siteId = cleanSite(typeof payload === "object" ? payload?.siteId : "MMS");
        const roomCode = String(roomCodeRaw || "").trim().toUpperCase();

        if (!roomCode) {

            socket.emit("joinError", "Kode room kosong.");

            return;

        }

        if (!rooms[roomCode]) {

            createRoom(roomCode, siteId);

        }

        const room = rooms[roomCode];
        if (room.siteId !== siteId) { socket.emit("joinError", "Room tidak ditemukan."); return; }

        const existingPlayer = room.players.find((player) => player.socketId === socket.id);

        if (existingPlayer) {

            socket.emit("joinedRoom", {

                ...getRoomData(roomCode),

                color: existingPlayer.color,

                playerId: existingPlayer.id

            });

            return;

        }

        if (room.players.length >= 8) {

            socket.emit("roomFull", "Room sudah penuh.");

            return;

        }

        const activeColors = new Set(room.players.map((player) => player.color).filter((value) => value === "white" || value === "black"));

        const color = room.status === "playing" || room.status === "finished" ? "spectator" : !activeColors.has("white") ? "white" : !activeColors.has("black") ? "black" : "spectator";

        room.players.push({

            id: crypto.randomUUID(),

            socketId: socket.id,

            color

        });

        if (room.players.filter((player) => player.color !== "spectator").length === 2 && room.status !== "finished") {

            room.status = "playing";

        }

        socket.join(roomCode);

        socket.data.roomCode = roomCode;

        socket.data.color = color;

        socket.emit("joinedRoom", {

            ...getRoomData(roomCode),

            color,

            playerId: room.players.at(-1).id

        });

        io.to(roomCode).emit("roomUpdate", getRoomData(roomCode));
        emitLobby(room.siteId);

        if (room.status === "playing" && color !== "spectator") {

            io.to(roomCode).emit("gameReady", getRoomData(roomCode));

        }

    });

    socket.on("room:kick", ({ playerId } = {}, reply = () => {}) => {
        const roomCode = socket.data.roomCode;
        const room = rooms[roomCode];
        const host = room?.players[0];
        if (!room || host?.socketId !== socket.id) return reply({ ok: false, error: "Hanya host yang dapat mengeluarkan pemain." });
        if (playerId === host.id) return reply({ ok: false, error: "Host tidak dapat mengeluarkan diri sendiri." });
        const targetIndex = room.players.findIndex((player) => player.id === playerId);
        if (targetIndex === -1) return reply({ ok: false, error: "Pemain tidak ditemukan." });
        const [target] = room.players.splice(targetIndex, 1);
        const targetSocket = io.sockets.sockets.get(target.socketId);
        if (targetSocket?.data.roomCode === roomCode) {
            targetSocket.leave(roomCode); targetSocket.data.roomCode = null; targetSocket.data.color = null;
            targetSocket.emit("room:kicked", { message: "Kamu dikeluarkan oleh host." });
        }
        if (room.status !== "finished" && target.color !== "spectator") {
            room.status = "finished"; room.winner = target.color === "white" ? "black" : "white"; room.endReason = "Pemain dikeluarkan host.";
        }
        io.to(roomCode).emit("roomUpdate", getRoomData(roomCode)); emitLobby(room.siteId); reply({ ok: true });
    });

    socket.on("room:chat", ({ text } = {}) => {
        const roomCode = socket.data.roomCode;
        const room = rooms[roomCode];
        const member = room?.players.find((player) => player.socketId === socket.id);
        const clean = String(text || "").trim().replace(/\s+/g, " ").slice(0, 180);
        if (!room || !member || !clean) return;
        const now = Date.now();
        if (socket.data.lastChatAt && now - socket.data.lastChatAt < 800) return;
        socket.data.lastChatAt = now;
        io.to(roomCode).emit("room:chat", { id: `${socket.id}:${now}`, sender: member.color === "spectator" ? "Penonton" : member.color === "white" ? "Putih" : "Hitam", text: clean, at: now });
    });

    socket.on("movePiece", (data) => {

        const roomCode = String(data?.roomCode || socket.data.roomCode || "").trim().toUpperCase();

        const fromRow = Number(data?.fromRow);

        const fromCol = Number(data?.fromCol);

        const toRow = Number(data?.toRow);

        const toCol = Number(data?.toCol);

        const promotion = data?.promotion;

        const room = rooms[roomCode];

        if (!room) {

            socket.emit("invalidMove", "Room tidak ditemukan.");

            return;

        }

        if (room.status === "finished") {

            socket.emit("invalidMove", "Game sudah selesai.");

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

            fromRow >= 0 && fromRow <= 7 &&

            fromCol >= 0 && fromCol <= 7 &&

            toRow >= 0 && toRow <= 7 &&

            toCol >= 0 && toCol <= 7;

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

        const capturedColor = targetColor;

        if (targetColor === player.color) {

            socket.emit("invalidMove", "Tidak bisa memakan bidak sendiri.");

            return;

        }

        const moveValidation = isLegalMove(room.board, fromRow, fromCol, toRow, toCol, player.color);

        if (!moveValidation.ok) {

            socket.emit("invalidMove", moveValidation.message);

            return;

        }

        if (targetPiece && capturedColor) {

            if (!room.capturedPieces) {

                room.capturedPieces = { white: [], black: [] };

            }

            room.capturedPieces[capturedColor].push(targetPiece);

        }

        room.board[toRow][toCol] = piece;

        room.board[fromRow][fromCol] = "";

        if (piece === "P" && toRow === 0) {

            room.board[toRow][toCol] = getPromotionPiece("white", promotion);

        }

        if (piece === "p" && toRow === 7) {

            room.board[toRow][toCol] = getPromotionPiece("black", promotion);

        }

        const nextTurn = oppositeColor(room.turn);

        room.turn = nextTurn;

        finalizeGameState(room, nextTurn);

        io.to(roomCode).emit("boardUpdated", {

            ...getRoomData(roomCode),

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

        const requester = room.players.find((player) => player.socketId === socket.id);
        const host = room.players.find((player) => player.color !== "spectator");

        if (!requester || requester.socketId !== host?.socketId) {

            socket.emit("invalidMove", requester?.color === "spectator" ? "Penonton tidak bisa mereset game." : "Hanya pemain putih yang bisa memulai game berikutnya.");

            return;

        }

        room.board = createInitialBoard();

        room.turn = "white";

        room.players.forEach((member, index) => { member.color = index === 0 ? "white" : index === 1 ? "black" : "spectator"; });
        room.status = room.players.filter((member) => member.color !== "spectator").length === 2 ? "playing" : "waiting";

        room.winner = null;

        room.check = null;

        room.endReason = null;

        io.to(roomCode).emit("boardUpdated", getRoomData(roomCode));

    });

    socket.on("disconnect", () => {

        const queueIndex = publicQueue.findIndex((item) => item.socketId === socket.id);

        if (queueIndex !== -1) {

            publicQueue.splice(queueIndex, 1);

        }

        for (const roomCode of Object.keys(rooms)) {

            const room = rooms[roomCode];

            const playerIndex = room.players.findIndex((player) => player.socketId === socket.id);

            if (playerIndex === -1) continue;

            const disconnectedPlayer = room.players[playerIndex];

            room.players.splice(playerIndex, 1);

            if (room.status !== "finished" && disconnectedPlayer.color !== "spectator") {

                room.status = "finished";

            }

            io.to(roomCode).emit("playerDisconnected", {

                message: disconnectedPlayer.color + " keluar dari game."

            });

            io.to(roomCode).emit("roomUpdate", getRoomData(roomCode));

            if (room.players.length === 0) {

                delete rooms[roomCode];

            }
            emitLobby(room.siteId);

            break;

        }

    });

});

app.get("/{*path}", (req, res) => {

    res.sendFile(path.join(__dirname, "public", "index.html"));

});

if (require.main === module) server.listen(PORT, () => {

    console.log("Chess Online Multiplayer state fixed running on port " + PORT);

});
module.exports = { app, server, io, rooms };
