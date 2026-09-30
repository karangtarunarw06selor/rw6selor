(() => {
    const socket = io({ path: "/chess/socket.io" });

    const pieces = {
        r: "♜", n: "♞", b: "♝", q: "♛", k: "♚", p: "♟",
        R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔", P: "♙"
    };

    let roomCode = "";
    let playerColor = "";
    let board = [];
    let turn = "white";
    let selected = null;
    let audioContext = null;

    function getAudioContext() {
        if (!audioContext) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return null;
            audioContext = new AudioContextClass();
        }
        if (audioContext.state === "suspended") {
            audioContext.resume().catch(() => {});
        }
        return audioContext;
    }

    function playTone(frequency, duration = 0.09, type = "sine", gainValue = 0.05) {
        const context = getAudioContext();
        if (!context) return;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, context.currentTime);
        gain.gain.setValueAtTime(gainValue, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + duration);
    }

    function playSound(kind) {
        if (kind === "select") playTone(520, 0.05, "triangle", 0.035);
        if (kind === "move") {
            playTone(620, 0.08, "sine", 0.05);
            setTimeout(() => playTone(820, 0.07, "sine", 0.04), 65);
        }
        if (kind === "error") playTone(150, 0.12, "sawtooth", 0.045);
        if (kind === "ready") playTone(880, 0.12, "triangle", 0.045);
        if (kind === "reset") playTone(360, 0.12, "square", 0.035);
    }

    const $ = (id) => document.getElementById(id);
    const els = {
        lobby: $("lobby"),
        game: $("game"),
        roomInput: $("room-code"),
        join: $("join-room"),
        random: $("random-room"),
        status: $("connection-status"),
        lobbyMessage: $("lobby-message"),
        board: $("chess-board"),
        activeRoom: $("active-room"),
        playerColor: $("player-color"),
        turnLabel: $("turn-label"),
        gameStatus: $("game-status"),
        gameMessage: $("game-message"),
        copy: $("copy-room"),
        reset: $("reset-game"),
        leave: $("leave-game")
    };

    function setMessage(target, message, isError = false) {
        target.textContent = message || "";
        target.style.color = isError ? "#f87171" : "#94a3b8";
    }

    function colorLabel(value) {
        return value === "white" ? "Putih" : "Hitam";
    }

    function randomRoom() {
        return `RW${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    }

    function updateConnection(online) {
        els.status.textContent = online ? "Online" : "Terputus";
        els.status.classList.toggle("online", online);
        els.status.classList.toggle("offline", !online);
    }

    function renderBoard() {
        els.board.innerHTML = "";
        for (let row = 0; row < 8; row += 1) {
            for (let col = 0; col < 8; col += 1) {
                const piece = board[row]?.[col] || "";
                const square = document.createElement("button");
                square.type = "button";
                square.className = `square ${(row + col) % 2 === 0 ? "white" : "black"}`;
                square.dataset.row = row;
                square.dataset.col = col;
                square.setAttribute("aria-label", `Baris ${row + 1}, kolom ${col + 1}`);

                if (selected && selected.row === row && selected.col === col) {
                    square.classList.add("selected");
                }

                if (piece) {
                    const span = document.createElement("span");
                    const pieceColor = piece === piece.toUpperCase() ? "white" : "black";
                    span.className = `piece piece-${pieceColor}`;
                    span.textContent = pieces[piece] || piece;
                    square.appendChild(span);
                }

                square.addEventListener("click", () => handleSquareClick(row, col));
                els.board.appendChild(square);
            }
        }
    }

    function renderGame(data = {}) {
        board = data.board || board;
        turn = data.turn || turn;
        const players = Number(data.players || 0);
        const status = data.status || "waiting";

        els.activeRoom.textContent = roomCode;
        els.playerColor.textContent = colorLabel(playerColor);
        els.turnLabel.textContent = colorLabel(turn);
        els.gameStatus.textContent = status === "playing"
            ? `Game berjalan. ${players}/2 player online.`
            : `Menunggu lawan masuk. ${players}/2 player online.`;
        renderBoard();
    }

    function joinRoom() {
        const raw = els.roomInput.value.trim().toUpperCase();
        if (!raw) {
            setMessage(els.lobbyMessage, "Isi kode room dulu.", true);
            return;
        }
        setMessage(els.lobbyMessage, "Masuk room…");
        socket.emit("joinRoom", raw);
    }

    function handleSquareClick(row, col) {
        if (!roomCode || !playerColor) return;
        if (turn !== playerColor) {
            playSound("error");
            setMessage(els.gameMessage, "Belum giliran kamu.", true);
            return;
        }

        const piece = board[row]?.[col] || "";
        const isOwnPiece = piece && ((playerColor === "white") === (piece === piece.toUpperCase()));

        if (!selected) {
            if (!isOwnPiece) {
                playSound("error");
                setMessage(els.gameMessage, "Pilih bidak milikmu.", true);
                return;
            }
            playSound("select");
            selected = { row, col };
            setMessage(els.gameMessage, "Pilih kotak tujuan.");
            renderBoard();
            return;
        }

        if (selected.row === row && selected.col === col) {
            selected = null;
            renderBoard();
            return;
        }

        socket.emit("movePiece", {
            roomCode,
            fromRow: selected.row,
            fromCol: selected.col,
            toRow: row,
            toCol: col
        });
        selected = null;
    }

    socket.on("connect", () => updateConnection(true));
    socket.on("disconnect", () => updateConnection(false));
    socket.on("connect_error", () => {
        updateConnection(false);
        setMessage(els.lobbyMessage, "Koneksi socket gagal. Coba refresh halaman.", true);
    });

    socket.on("joinedRoom", (data) => {
        roomCode = data.roomCode;
        playerColor = data.color;
        els.lobby.classList.add("hidden");
        els.game.classList.remove("hidden");
        setMessage(els.gameMessage, playerColor === "white" ? "Kamu player pertama." : "Kamu player kedua.");
        renderGame(data);
    });

    socket.on("roomUpdate", renderGame);
    socket.on("gameReady", (data) => {
        playSound("ready");
        setMessage(els.gameMessage, "Lawan sudah masuk. Game mulai.");
        renderGame(data);
    });
    socket.on("boardUpdated", (data) => {
        playSound("move");
        selected = null;
        setMessage(els.gameMessage, "Langkah berhasil.");
        renderGame(data);
    });
    socket.on("invalidMove", (message) => {
        playSound("error");
        setMessage(els.gameMessage, message, true);
    });
    socket.on("joinError", (message) => {
        playSound("error");
        setMessage(els.lobbyMessage, message, true);
    });
    socket.on("roomFull", (message) => {
        playSound("error");
        setMessage(els.lobbyMessage, message, true);
    });
    socket.on("playerDisconnected", (data) => {
        playSound("error");
        setMessage(els.gameMessage, data.message, true);
    });

    els.join.addEventListener("click", joinRoom);
    els.roomInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") joinRoom();
    });
    els.random.addEventListener("click", () => {
        els.roomInput.value = randomRoom();
        els.roomInput.focus();
    });
    els.copy.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(roomCode);
            setMessage(els.gameMessage, "Kode room disalin.");
        } catch {
            setMessage(els.gameMessage, `Kode room: ${roomCode}`);
        }
    });
    els.reset.addEventListener("click", () => {
        playSound("reset");
        socket.emit("resetGame");
    });
    els.leave.addEventListener("click", () => window.location.href = "../index.html");

    els.roomInput.value = randomRoom();
})();
