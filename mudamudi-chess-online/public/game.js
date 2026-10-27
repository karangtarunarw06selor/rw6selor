
"use strict";

const socket = io(window.location.origin, {

    path: "/chess/socket.io",

    transports: ["polling"]

});

let roomCode = null;

let playerColor = null;

let board = [];

let currentTurn = "white";

let selectedSquare = null;

const gameMode = new URLSearchParams(window.location.search).get("mode") === "computer" ? "computer" : "online";

let computerThinking = false;

let audioContext = null;

function playMoveSound(captured = false) {

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    if (!audioContext) audioContext = new AudioContextClass();

    if (audioContext.state === "suspended") audioContext.resume().catch(() => {});

    const tones = captured ? [[145, 0.09, "sawtooth", 0], [90, 0.12, "triangle", 0.055]] : [[180, 0.055, "square", 0], [120, 0.075, "triangle", 0.038]];

    tones.forEach(([frequency, duration, type, delay]) => setTimeout(() => {

        const oscillator = audioContext.createOscillator();

        const gain = audioContext.createGain();

        oscillator.type = type;

        oscillator.frequency.value = frequency;

        gain.gain.setValueAtTime(0.065, audioContext.currentTime);

        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

        oscillator.connect(gain);

        gain.connect(audioContext.destination);

        oscillator.start();

        oscillator.stop(audioContext.currentTime + duration);

    }, delay * 1000));

}

window.chessGameState = {

    gameOver: false,

    winner: null,

    check: null

};

const pieceImages = {

    P: "/chess/assets/pieces/wp.png?v=20261022-3d1",

    R: "/chess/assets/pieces/wr.png?v=20261022-3d1",

    N: "/chess/assets/pieces/wn.png?v=20261022-3d1",

    B: "/chess/assets/pieces/wb.png?v=20261022-3d1",

    Q: "/chess/assets/pieces/wq.png?v=20261022-3d1",

    K: "/chess/assets/pieces/wk.png?v=20261022-3d1",

    p: "/chess/assets/pieces/bp.png?v=20261022-3d1",

    r: "/chess/assets/pieces/br.png?v=20261022-3d1",

    n: "/chess/assets/pieces/bn.png?v=20261022-3d1",

    b: "/chess/assets/pieces/bb.png?v=20261022-3d1",

    q: "/chess/assets/pieces/bq.png?v=20261022-3d1",

    k: "/chess/assets/pieces/bk.png?v=20261022-3d1"

};

socket.on("connect", () => {

    const status = document.getElementById("status");

    const connectionStatus = document.getElementById("connectionStatus");

    if (connectionStatus) {

        connectionStatus.innerText = "Connected";

        connectionStatus.classList.add("connected");

        connectionStatus.classList.remove("error");

    }

    if (status && !roomCode) {

        status.innerHTML = "Socket connected. Silakan join room.";

    }

    console.log("Socket connected:", socket.id);

});

socket.on("connect_error", (err) => {

    const status = document.getElementById("status");

    const connectionStatus = document.getElementById("connectionStatus");

    if (connectionStatus) {

        connectionStatus.innerText = "Connection Error";

        connectionStatus.classList.add("error");

        connectionStatus.classList.remove("connected");

    }

    if (status) {

        status.innerHTML = "Socket error: " + err.message;

    }

    console.error("Socket error:", err);

});

function joinRoom() {

    const input = document.getElementById("roomCodeInput");

    const value = input.value.trim();

    if (!value) {

        showToast("Masukkan kode room.", "warning", "Room kosong");

        return;

    }

    roomCode = value.toUpperCase();

    socket.emit("joinRoom", roomCode);

}

function resetGame() {

    if (!roomCode) {

        showToast("Masuk room dulu.", "warning", "Belum masuk room");

        return;

    }

    if (gameMode === "computer") {

        board = ChessCore.createInitialBoard();

        currentTurn = "white";

        selectedSquare = null;

        computerThinking = false;

        updateStatus({ players: 2, status: "playing", turn: currentTurn });

        renderBoard();

        showToast("Papan kembali ke posisi awal.", "success", "Game direset");

        return;

    }

    socket.emit("resetGame");

}

socket.on("room:chat", (message) => {
    const container = document.getElementById("roomChatMessages"); if (!container) return;
    const row = document.createElement("p"); const sender = document.createElement("b"); sender.textContent = `${message.sender}: `;
    row.append(sender, document.createTextNode(message.text)); container.append(row);
    while (container.children.length > 50) container.firstElementChild.remove(); container.scrollTop = container.scrollHeight;
});

document.getElementById("roomChatForm")?.addEventListener("submit", (event) => {
    event.preventDefault(); const input = document.getElementById("roomChatInput"); if (!roomCode || !input.value.trim()) return;
    socket.emit("room:chat", { text: input.value }); input.value = "";
});

socket.on("joinedRoom", (data) => {

    document.body.classList.add("game-active");

    roomCode = data.roomCode;

    playerColor = data.color;

    if (playerColor === "spectator") document.getElementById("status").textContent = "Mode penonton · kamu bisa menonton dan memakai chat room";

    board = data.board;

    currentTurn = data.turn;

    selectedSquare = null;

    window.chessGameState.gameOver = Boolean(data.gameOver);

    window.chessGameState.winner = data.winner || null;

    window.chessGameState.check = data.check || null;

    updateStatus(data);

    renderBoard();

    renderCapturedPieces(data.capturedPieces);

    handleGameStateToast(data);

});

socket.on("roomUpdate", (data) => {

    updateStatus(data);

});

socket.on("gameReady", (data) => {

    updateStatus(data);

});

socket.on("boardUpdated", (data) => {

    playMoveSound(Boolean(data.move?.captured));

    board = data.board;

    currentTurn = data.turn;

    selectedSquare = null;

    window.chessGameState.gameOver = Boolean(data.gameOver);

    window.chessGameState.winner = data.winner || null;

    window.chessGameState.check = data.check || null;

    updateStatus(data);

    renderBoard();

    renderCapturedPieces(data.capturedPieces || { white: [], black: [] });

    handleGameStateToast(data);

});

socket.on("invalidMove", (message) => {

    selectedSquare = null;

    renderBoard();

    showToast(message, "warning", "Peringatan");

});

socket.on("joinError", (message) => {

    showToast(message, "warning", "Gagal join");

});

socket.on("roomFull", (message) => {

    showToast(message || "Room sudah penuh.", "error", "Room penuh");

});

socket.on("playerDisconnected", (data) => {

    showToast(data?.message || "Lawan keluar dari game.", "info", "Player keluar");

});

function updateStatus(data) {

    const status = document.getElementById("status");

    const playerInfo = document.getElementById("playerInfo");

    if (!roomCode) {

        status.innerHTML = "Belum masuk room.";

        playerInfo.innerHTML = "";

        return;

    }

    const players = gameMode === "computer" ? 2 : data?.players ?? "-";

    const gameStatus = data?.status ?? "-";

    const turn = data?.turn ?? currentTurn;

    const myColor = playerColor === "white" ? "white" : "black";

    const enemyColor = myColor === "white" ? "black" : "white";

    const isMyTurn = playerColor === turn;

    const myLabel = myColor === "white" ? "PUTIH" : "HITAM";

    const enemyLabel = gameMode === "computer" ? "COMPUTER" : enemyColor === "white" ? "PUTIH" : "HITAM";

    const turnLabel = isMyTurn ? "GILIRANMU" : "LAWAN";

    status.innerHTML = `

        <div class="hud-wrap">

            <div class="hud-player ${isMyTurn ? "active" : ""}">

                <div class="hud-avatar ${myColor}">${myColor === "white" ? "W" : "B"}</div>

                <div>

                    <span>KAMU</span>

                    <strong>${myLabel}</strong>

                </div>

            </div>

            <div class="hud-center">

                <div class="hud-room">${escapeHtml(roomCode)}</div>

                <div class="hud-vs">VS</div>

                <div class="hud-meta">${players}/2 · ${gameStatus === "playing" ? "LIVE" : "WAIT"}</div>

            </div>

            <div class="hud-player ${!isMyTurn && gameStatus === "playing" ? "active" : ""}">

                <div class="hud-avatar ${enemyColor}">${enemyColor === "white" ? "W" : "B"}</div>

                <div>

                    <span>${gameMode === "computer" ? "AI" : "LAWAN"}</span>

                    <strong>${enemyLabel}</strong>

                </div>

            </div>

        </div>

        <div class="turn-chip ${isMyTurn ? "my-turn" : "enemy-turn"}">

            ${turnLabel}

        </div>

    `;

    playerInfo.innerHTML = "";

}

function escapeHtml(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}

function getBoardPosition(displayRow, displayCol) {

    if (playerColor === "black") {

        return {

            row: 7 - displayRow,

            col: 7 - displayCol

        };

    }

    return {

        row: displayRow,

        col: displayCol

    };

}

function getFrontendPieceColor(piece) {

    if (!piece) return null;

    return piece === piece.toUpperCase() ? "white" : "black";

}

function renderBoard() {

    const boardElement = document.getElementById("board");

    boardElement.innerHTML = "";

    if (!Array.isArray(board) || board.length !== 8) {

        return;

    }

    for (let displayRow = 0; displayRow < 8; displayRow++) {

        for (let displayCol = 0; displayCol < 8; displayCol++) {

            const realPosition = getBoardPosition(displayRow, displayCol);

            const row = realPosition.row;

            const col = realPosition.col;

            const square = document.createElement("div");

            square.classList.add("square");

            square.classList.add((row + col) % 2 === 0 ? "light" : "dark");

            if (

                selectedSquare &&

                selectedSquare.row === row &&

                selectedSquare.col === col

            ) {

                square.classList.add("selected");

            }

            const piece = board[row][col];

            if (piece && pieceImages[piece]) {

                const img = document.createElement("img");

                img.src = pieceImages[piece];

                img.alt = piece;

                img.classList.add("piece-img");

                square.appendChild(img);

            }

            square.addEventListener("click", () => handleSquareClick(row, col));

            boardElement.appendChild(square);

        }

    }

}

function handleSquareClick(row, col) {

    if (!roomCode) {

        showToast("Masuk room dulu.", "warning", "Belum masuk room");

        return;

    }

    if (window.chessGameState.gameOver) {

        showToast("Game sudah selesai.", "info", "Game Over");

        return;

    }

    if (playerColor !== currentTurn) {

        showToast("Belum giliran kamu.", "warning", "Tunggu");

        return;

    }

    const clickedPiece = board[row][col];

    if (!selectedSquare) {

        if (!clickedPiece) return;

        const pieceColor = getPieceColor(clickedPiece);

        if (pieceColor !== playerColor) {

            showToast("Itu bidak lawan.", "warning", "Bukan bidakmu");

            return;

        }

        selectedSquare = { row, col };

        renderBoard();

        return;

    }

    if (gameMode === "computer") {

            const legal = ChessCore.pieceMoves(board, selectedSquare.row, selectedSquare.col)

                .find((move) => move.toRow === row && move.toCol === col);

            if (!legal) {

                selectedSquare = null;

                renderBoard();

                showToast("Langkah bidak itu tidak valid.", "warning", "Langkah ditolak");

                return;

            }

            const result = ChessCore.applyMove(board, legal);

            board = result.board;

            currentTurn = "black";

            selectedSquare = null;

            playMoveSound(Boolean(result.move.captured));

            renderBoard();

            updateStatus({ players: 2, status: "playing", turn: currentTurn });

            runComputerMove();

        } else if (isPromotionMove(selectedSquare.row, selectedSquare.col, row, col)) {

            openPromotionOverlay({

                roomCode,

                fromRow: selectedSquare.row,

                fromCol: selectedSquare.col,

                toRow: row,

                toCol: col

            });

        } else {

            socket.emit("movePiece", {

                roomCode,

                fromRow: selectedSquare.row,

                fromCol: selectedSquare.col,

                toRow: row,

                toCol: col

            });

        }

}

function getPieceColor(piece) {

    if (!piece) return null;

    return piece === piece.toUpperCase() ? "white" : "black";

}

function showToast(message, type = "info", title = "Info") {

    const container = document.getElementById("toastContainer");

    if (!container) {

        console.log(title + ": " + message);

        return;

    }

    const toast = document.createElement("div");

    toast.className = "toast " + type;

    const iconMap = {

        success: "✓",

        error: "!",

        warning: "!",

        info: "i"

    };

    toast.innerHTML = `

        <div class="toast-icon">${iconMap[type] || "i"}</div>

        <div class="toast-content">

            <p class="toast-title">${title}</p>

            <p class="toast-message">${message}</p>

        </div>

        <button class="toast-close" type="button" aria-label="Close">×</button>

    `;

    const closeBtn = toast.querySelector(".toast-close");

    closeBtn.addEventListener("click", () => {

        toast.remove();

    });

    container.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 2800);

}


function autoJoinFromUrl() {

    if (gameMode === "computer") {

        startComputerMode();

        return;

    }

    const params = new URLSearchParams(window.location.search);

    const room = params.get("room");

    if (!room) return;

    const input = document.getElementById("roomCodeInput");

    if (input) {

        input.value = room.toUpperCase();

    }

    setTimeout(() => {

        joinRoom();

    }, 300);

}

window.addEventListener("DOMContentLoaded", autoJoinFromUrl);

function startComputerMode() {

    document.body.classList.add("game-active");

    roomCode = "VS-COMPUTER";

    playerColor = "white";

    board = ChessCore.createInitialBoard();

    currentTurn = "white";

    selectedSquare = null;

    const roomPanel = document.querySelector(".room-panel");

    if (roomPanel) roomPanel.hidden = true;

    updateStatus({ players: 2, status: "playing", turn: currentTurn });

    renderBoard();

}

function runComputerMove() {

    computerThinking = true;

    const turnChip = document.querySelector(".turn-chip");

    if (turnChip) turnChip.textContent = "COMPUTER BERPIKIR…";

    setTimeout(() => {

        const move = ChessCore.chooseComputerMove(board, "black");

        if (!move) return;

        const result = ChessCore.applyMove(board, move);

        board = result.board;

        currentTurn = "white";

        computerThinking = false;

        playMoveSound(Boolean(result.move.captured));

        renderBoard();

        updateStatus({ players: 2, status: "playing", turn: currentTurn });

    }, 650);

}



window.openLeaveConfirm = function () {

    const overlay = document.getElementById("leaveConfirmOverlay");

    if (overlay) {

        overlay.classList.add("show");

        return;

    }

    window.location.href = "/chess/lobby.html";

};

window.closeLeaveConfirm = function () {

    const overlay = document.getElementById("leaveConfirmOverlay");

    if (overlay) {

        overlay.classList.remove("show");

    }

};

window.goToLobby = function () {

    window.location.href = "/chess/lobby.html";

};


let lastCheckState = null;

let lastWinnerState = null;

function handleGameStateToast(data) {

    if (!data) return;

    if (data.winner && data.winner !== lastWinnerState) {

        lastWinnerState = data.winner;

        const winnerLabel = data.winner === "white" ? "Putih" : "Hitam";

        const isWinner = playerColor === data.winner;

        showToast(

            isWinner ? "Kamu menang." : winnerLabel + " menang.",

            isWinner ? "success" : "error",

            "Game Over"

        );

        return;

    }

    if (data.check && data.check !== lastCheckState) {

        lastCheckState = data.check;

        const checkedLabel = data.check === "white" ? "Putih" : "Hitam";

        const isMeChecked = playerColor === data.check;

        showToast(

            isMeChecked ? "Raja kamu sedang skak." : "Raja lawan sedang skak.",

            "warning",

            "Skak!"

        );

    }

    if (!data.check) {

        lastCheckState = null;

    }

}


function showGameResultOverlay(isWinner, winnerColor) {

    const overlay = document.getElementById("gameResultOverlay");

    const badge = document.getElementById("gameResultBadge");

    const title = document.getElementById("gameResultTitle");

    const message = document.getElementById("gameResultMessage");

    if (!overlay || !badge || !title || !message) {

        return;

    }

    badge.classList.remove("win", "lose");

    if (isWinner) {

        badge.innerText = "WINNER";

        badge.classList.add("win");

        title.innerText = "Kamu Menang";

        message.innerText = "Pertandingan selesai. Kamu bisa tanding ulang atau kembali ke lobby.";

    } else {

        const winnerLabel = winnerColor === "white" ? "Putih" : "Hitam";

        badge.innerText = "GAME OVER";

        badge.classList.add("lose");

        title.innerText = "Kamu Kalah";

        message.innerText = winnerLabel + " menang. Kamu bisa tanding ulang atau kembali ke lobby.";

    }

    overlay.classList.add("show");

}

function hideGameResultOverlay() {

    const overlay = document.getElementById("gameResultOverlay");

    if (overlay) {

        overlay.classList.remove("show");

    }

}

window.requestRematch = function () {

    hideGameResultOverlay();

    if (!roomCode) {

        showToast("Masuk room dulu.", "warning", "Belum masuk room");

        return;

    }

    window.chessGameState.gameOver = false;

    window.chessGameState.winner = null;

    window.chessGameState.check = null;

    lastWinnerState = null;

    lastCheckState = null;

    socket.emit("resetGame");

};


function handleGameStateToast(data) {

    if (!data) return;

    if (data.winner && data.winner !== lastWinnerState) {

        lastWinnerState = data.winner;

        const isWinner = playerColor === data.winner;

        showGameResultOverlay(isWinner, data.winner);

        return;

    }

    if (data.check && data.check !== lastCheckState) {

        lastCheckState = data.check;

        const isMeChecked = playerColor === data.check;

        showToast(

            isMeChecked ? "Raja kamu sedang skak." : "Raja lawan sedang skak.",

            "warning",

            "Skak!"

        );

    }

    if (!data.check) {

        lastCheckState = null;

    }

}


function showGameEndOverlay(data) {

    const overlay = document.getElementById("gameResultOverlay");

    const badge = document.getElementById("gameResultBadge");

    const title = document.getElementById("gameResultTitle");

    const message = document.getElementById("gameResultMessage");

    if (!overlay || !badge || !title || !message) {

        return;

    }

    badge.classList.remove("win", "lose", "draw");

    if (data.endReason === "stalemate") {

        badge.innerText = "DRAW";

        badge.classList.add("draw");

        title.innerText = "Remis";

        message.innerText = "Stalemate. Tidak ada langkah legal, tetapi raja tidak sedang skak.";

        overlay.classList.add("show");

        return;

    }

    const isWinner = playerColor === data.winner;

    if (isWinner) {

        badge.innerText = data.endReason === "checkmate" ? "CHECKMATE" : "WINNER";

        badge.classList.add("win");

        title.innerText = "Kamu Menang";

        message.innerText = data.endReason === "checkmate"

            ? "Skakmat. Lawan tidak punya langkah legal untuk menyelamatkan raja."

            : "Pertandingan selesai. Kamu bisa tanding ulang atau kembali ke lobby.";

    } else {

        badge.innerText = data.endReason === "checkmate" ? "CHECKMATE" : "GAME OVER";

        badge.classList.add("lose");

        title.innerText = "Kamu Kalah";

        message.innerText = data.endReason === "checkmate"

            ? "Skakmat. Raja kamu tidak punya langkah legal untuk selamat."

            : "Pertandingan selesai. Kamu bisa tanding ulang atau kembali ke lobby.";

    }

    overlay.classList.add("show");

}

function handleGameStateToast(data) {

    if (!data) return;

    if (data.gameOver && data.gameOver !== lastWinnerState) {

        lastWinnerState = data.endReason || data.winner || "game-over";

        showGameEndOverlay(data);

        return;

    }

    if (data.check && data.check !== lastCheckState) {

        lastCheckState = data.check;

        const isMeChecked = playerColor === data.check;

        showToast(

            isMeChecked ? "Raja kamu sedang skak." : "Raja lawan sedang skak.",

            "warning",

            "Skak!"

        );

    }

    if (!data.check) {

        lastCheckState = null;

    }

}


const pieceAssetMap = {

    P: "/chess/assets/pieces/wp.png?v=20261022-3d1",

    R: "/chess/assets/pieces/wr.png?v=20261022-3d1",

    N: "/chess/assets/pieces/wn.png?v=20261022-3d1",

    B: "/chess/assets/pieces/wb.png?v=20261022-3d1",

    Q: "/chess/assets/pieces/wq.png?v=20261022-3d1",

    K: "/chess/assets/pieces/wk.png?v=20261022-3d1",

    p: "/chess/assets/pieces/bp.png?v=20261022-3d1",

    r: "/chess/assets/pieces/br.png?v=20261022-3d1",

    n: "/chess/assets/pieces/bn.png?v=20261022-3d1",

    b: "/chess/assets/pieces/bb.png?v=20261022-3d1",

    q: "/chess/assets/pieces/bq.png?v=20261022-3d1",

    k: "/chess/assets/pieces/bk.png?v=20261022-3d1"

};

let pendingPromotionMove = null;

function ensureCapturedHud() {

    if (document.getElementById("capturedHud")) return;

    const board = document.getElementById("board");

    if (!board) return;

    const boardWrap = board.closest(".board-wrap") || board.parentElement;

    const parent = boardWrap.parentElement;

    const hud = document.createElement("div");

    hud.id = "capturedHud";

    hud.className = "captured-hud";

    hud.innerHTML = `

        <div class="captured-box">

            <div class="captured-title">Bidak Putih Dimakan</div>

            <div id="capturedWhite" class="captured-pieces"></div>

        </div>

        <div class="captured-box">

            <div class="captured-title">Bidak Hitam Dimakan</div>

            <div id="capturedBlack" class="captured-pieces"></div>

        </div>

    `;

    parent.insertBefore(hud, boardWrap.nextSibling);

}

function renderCapturedPieces(capturedPieces) {

    ensureCapturedHud();

    const whiteBox = document.getElementById("capturedWhite");

    const blackBox = document.getElementById("capturedBlack");

    if (!whiteBox || !blackBox) return;

    const capturedWhite = capturedPieces?.white || [];

    const capturedBlack = capturedPieces?.black || [];

    whiteBox.innerHTML = capturedWhite.length

        ? capturedWhite.map((piece) => `<img class="captured-piece-img" src="${pieceAssetMap[piece] || ""}" alt="${piece}">`).join("")

        : `<span class="captured-empty">Belum ada</span>`;

    blackBox.innerHTML = capturedBlack.length

        ? capturedBlack.map((piece) => `<img class="captured-piece-img" src="${pieceAssetMap[piece] || ""}" alt="${piece}">`).join("")

        : `<span class="captured-empty">Belum ada</span>`;

}

function ensurePromotionOverlay() {

    if (document.getElementById("promotionOverlay")) return;

    const overlay = document.createElement("div");

    overlay.id = "promotionOverlay";

    overlay.className = "promotion-overlay";

    overlay.innerHTML = `

        <div class="promotion-card">

            <div class="promotion-badge">PROMOSI PION</div>

            <h2>Pilih Bidak</h2>

            <p>Pion berhasil mencapai ujung papan. Pilih bidak pengganti.</p>

            <div class="promotion-options">

                <button type="button" onclick="choosePromotion('q')">

                    <span>Queen</span>

                </button>

                <button type="button" onclick="choosePromotion('r')">

                    <span>Benteng</span>

                </button>

                <button type="button" onclick="choosePromotion('b')">

                    <span>Bishop</span>

                </button>

                <button type="button" onclick="choosePromotion('n')">

                    <span>Kuda</span>

                </button>

            </div>

        </div>

    `;

    document.body.appendChild(overlay);

}

function isPromotionMove(fromRow, fromCol, toRow, toCol) {

    const piece = board?.[fromRow]?.[fromCol];

    if (!piece) return false;

    if (piece === "P" && toRow === 0) return true;

    if (piece === "p" && toRow === 7) return true;

    return false;

}

function openPromotionOverlay(move) {

    ensurePromotionOverlay();

    pendingPromotionMove = move;

    const overlay = document.getElementById("promotionOverlay");

    if (overlay) {

        overlay.classList.add("show");

    }

}

function closePromotionOverlay() {

    const overlay = document.getElementById("promotionOverlay");

    if (overlay) {

        overlay.classList.remove("show");

    }

}

window.choosePromotion = function (promotion) {

    if (!pendingPromotionMove) {

        closePromotionOverlay();

        return;

    }

    socket.emit("movePiece", {

        ...pendingPromotionMove,

        promotion

    });

    pendingPromotionMove = null;

    closePromotionOverlay();

};
