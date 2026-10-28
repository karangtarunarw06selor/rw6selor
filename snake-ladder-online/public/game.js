(() => {
  const snakes = { 17: 6, 54: 34, 62: 19, 95: 36, 99: 83 };
  const ladders = { 3: 22, 5: 14, 9: 31, 20: 39, 27: 84, 51: 67, 72: 91, 73: 93, 88: 99 };
  const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
  const colors = ["#f0b54b", "#4db8d0", "#ef6f6c", "#70c48f"];
  const headsetIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13v-1a8 8 0 0 1 16 0v1"></path><path d="M4 13h3v7H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 1-2ZM20 13h-3v7h2a2 2 0 0 0 2-2v-3a2 2 0 0 0-1-2ZM17 20c0 1-1 2-3 2h-2"></path></svg>';
  const $ = (selector) => document.querySelector(selector);
  const siteId = document.body.dataset.site || "MMS";
  const socket = typeof io === "function" ? io({ path: "/ular-tangga/socket.io" }) : null;
  const roomSessionKey = `snake-room-session:${siteId}`;
  const state = { mode: null, playerId: null, room: null, sound: true, busy: false, visualPositions: new Map(), animationQueue: Promise.resolve(), rollStartedAt: 0, winnerShownAt: null };
  let setupMode = "solo";
  let lobbyMessages = [];

  const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
  const snakePaths = {
    17: [[43, 84], [50, 87], [57, 92], [66, 91], [62, 96]],
    54: [[70, 49], [67, 54], [61, 58], [64, 64]],
    62: [[20, 39], [18, 47], [13, 53], [17, 61], [20, 68], [14, 75], [18, 82]],
    95: [[65, 10], [66, 18], [60, 24], [57, 31], [61, 39], [56, 47], [49, 53], [52, 59]],
    99: [[10, 9], [13, 16], [20, 20], [24, 27], [17, 30], [12, 25], [17, 18]],
  };

  const playSound = (id, { start = 0, duration = 0 } = {}) => {
    if (!state.sound) return;
    const audio = $(id);
    clearTimeout(audio.stopTimer);
    audio.currentTime = start;
    audio.play().catch(() => {});
    if (duration) audio.stopTimer = setTimeout(() => { audio.pause(); audio.currentTime = start; }, duration);
  };
  const toast = (message) => {
    const element = $("#toast");
    element.textContent = message;
    element.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => element.classList.remove("show"), 2400);
  };
  window.snakeGame = { socket, getState: () => state, toast };
  const moveResult = (position, dice) => {
    const path = [];
    let direction = 1;
    let stepped = position;
    for (let count = 0; count < dice; count += 1) {
      if (stepped === 100) direction = -1;
      stepped += direction;
      path.push(stepped);
    }
    const transfers = [];
    let to = stepped;
    const visited = new Set();
    while (!visited.has(to) && (ladders[to] || snakes[to])) {
      visited.add(to);
      const event = ladders[to] ? "ladder" : "snake";
      const destination = ladders[to] || snakes[to];
      transfers.push({ from: to, to: destination, event });
      to = destination;
    }
    return { from: position, path, stepped, transfers, to, event: transfers.at(-1)?.event || "move", won: to === 100 };
  };
  const coordinates = (position) => {
    const value = Math.max(1, Math.min(100, Number(position) || 1));
    const row = Math.floor((value - 1) / 10);
    const slot = (value - 1) % 10;
    const column = row % 2 ? 9 - slot : slot;
    return { left: 6.4 + column * 9.68, top: 92.9 - row * 9.58 };
  };
  const tokenElement = (playerId) => document.querySelector(`.token[data-player-id="${CSS.escape(playerId)}"]`);
  const syncTokens = (room) => {
    const container = $("#tokens");
    const ids = new Set(room.players.map((player) => player.id));
    container.querySelectorAll(".token").forEach((token) => { if (!ids.has(token.dataset.playerId)) token.remove(); });
    room.players.forEach((player, index) => {
      let token = tokenElement(player.id);
      if (!token) {
        token = document.createElement("span");
        token.className = `token offset-${index}`;
        token.dataset.playerId = player.id;
        token.textContent = index + 1;
        container.append(token);
      }
      const point = coordinates(state.visualPositions.get(player.id) ?? player.position);
      token.style.cssText = `left:${point.left}%;top:${point.top}%;background:${player.color}`;
      token.title = player.name;
    });
  };
  const animatePoint = async (playerId, position, duration = 220) => {
    state.visualPositions.set(playerId, position);
    const token = tokenElement(playerId);
    if (!token) return;
    const point = coordinates(position);
    token.style.transitionDuration = `${duration}ms`;
    token.style.left = `${point.left}%`;
    token.style.top = `${point.top}%`;
    await sleep(duration);
  };
  const animateTransfer = async (move, transfer) => {
    const token = tokenElement(move.playerId);
    if (!token) return;
    const from = coordinates(transfer.from);
    const to = coordinates(transfer.to);
    const middle = transfer.event === "snake" ? snakePaths[transfer.from] || [] : [];
    const points = [from, ...middle.map(([left, top]) => ({ left, top })), to];
    playSound(transfer.event === "ladder" ? "#ladder-sound" : "#snake-sound");
    token.classList.add(`following-${transfer.event}`);
    token.style.transition = "none";
    const animation = token.animate(points.map((point) => ({ left: `${point.left}%`, top: `${point.top}%` })), {
      duration: transfer.event === "ladder" ? 900 : 1250,
      easing: transfer.event === "ladder" ? "ease-in-out" : "linear",
      fill: "forwards",
    });
    await animation.finished.catch(() => {});
    token.classList.remove(`following-${transfer.event}`);
    token.style.left = `${to.left}%`;
    token.style.top = `${to.top}%`;
    animation.cancel();
    token.style.transition = "";
    state.visualPositions.set(move.playerId, transfer.to);
  };
  const animateMove = async (move) => {
    state.busy = true;
    const elapsed = Date.now() - state.rollStartedAt;
    if (!state.rollStartedAt || elapsed > 850) {
      state.rollStartedAt = Date.now();
      $("#dice").classList.remove("rolling");
      requestAnimationFrame(() => $("#dice").classList.add("rolling"));
      playSound("#dice-sound", { start: .16, duration: 800 });
    }
    await sleep(Math.max(0, 800 - (Date.now() - state.rollStartedAt)));
    $("#dice").textContent = diceFaces[move.dice - 1];
    for (const position of move.path || []) await animatePoint(move.playerId, position);
    for (const transfer of move.transfers || []) await animateTransfer(move, transfer);
    state.visualPositions.set(move.playerId, move.to);
    state.rollStartedAt = 0;
    state.busy = false;
    render();
  };
  const queueMove = (move) => {
    if (!move || move.at === queueMove.lastAt) return state.animationQueue;
    queueMove.lastAt = move.at;
    state.busy = true;
    $("#roll-button").disabled = true;
    state.visualPositions.set(move.playerId, move.from);
    state.animationQueue = state.animationQueue.then(() => animateMove(move));
    return state.animationQueue;
  };
  const currentPlayer = () => state.room?.players.find((player) => player.id === state.playerId);
  const showWinner = (room) => {
    if (room.status !== "finished" || !room.finishOrder?.length) return;
    const signature = `${room.code}:${room.lastMove?.at || room.finishOrder.join(":")}`;
    if (state.winnerShownAt === signature) return;
    state.winnerShownAt = signature;
    const ranked = room.finishOrder.map((id) => room.players.find((player) => player.id === id)).filter(Boolean);
    $("#winner-name").textContent = ranked[0]?.name || "Pemenang";
    $("#final-standings").innerHTML = ranked.map((player, index) => `<li class="rank-${index + 1}"><span>${index < 3 ? ["🥇", "🥈", "🥉"][index] : index + 1}</span><b>${escapeHtml(player.name)}</b><small>${index === ranked.length - 1 && player.position < 100 ? `Petak ${player.position} · otomatis terakhir` : player.position === 100 ? "Selesai" : `Petak ${player.position}`}</small></li>`).join("");
    const dialog = $("#winner-dialog");
    if (!dialog.open) dialog.showModal();
  };
  const showSetup = (mode) => {
    setupMode = mode;
    $("#setup-kicker").textContent = mode === "join" ? "Gabung arena" : mode === "create" ? "Room baru" : "Lawan bot";
    $("#setup-title").textContent = mode === "join" ? "Masukkan kode temanmu" : "Siapa namamu?";
    $("#room-code-label").hidden = mode !== "join";
    $("#room-code").required = mode === "join";
    $("#setup-feedback").textContent = "";
    $("#setup").hidden = false;
    setTimeout(() => $("#player-name").focus(), 0);
  };
  const startView = () => {
    document.body.classList.add("game-active");
    $("#welcome").hidden = true;
    $("#setup").hidden = true;
    $("#game").hidden = false;
    window.dispatchEvent(new CustomEvent("snake:game-started", { detail: { mode: state.mode } }));
    render();
  };
  const addLog = (text) => {
    const item = document.createElement("li");
    item.textContent = text;
    $("#move-log").prepend(item);
    while ($("#move-log").children.length > 5) $("#move-log").lastElementChild.remove();
  };
  const describeMove = (move) => {
    if (!move) return "Permainan siap dimulai.";
    if (move.won) return `${move.playerName} mencapai petak 100 dan menang!`;
    if (move.transfers?.length) {
      const route = [move.stepped, ...move.transfers.map((transfer) => transfer.to)].join(" → ");
      return `${move.playerName} mendapat ${move.dice}: ${route}.`;
    }
    return `${move.playerName} mendapat ${move.dice}: ${move.from} → ${move.to}.`;
  };
  const render = () => {
    const room = state.room;
    if (!room) return;
    if (room.status !== "finished" && $("#winner-dialog").open) {
      $("#winner-dialog").close();
      state.winnerShownAt = null;
    }
    const hasNewMove = room.lastMove && room.lastMove.at !== render.lastMove;
    if (hasNewMove) state.visualPositions.set(room.lastMove.playerId, room.lastMove.from);
    $("#room-code-display").textContent = room.code;
    const turn = room.players.find((player) => player.id === room.turn);
    $("#turn-name").textContent = room.status === "finished" ? "Selesai" : turn?.name || "Menunggu";
    $("#turn-dot").style.background = turn?.color || "#7894a2";
    const isHost = state.mode === "online" && room.players[0]?.id === state.playerId;
    $("#players").innerHTML = room.players.map((player) => {
      const mine = player.id === state.playerId;
      const voice = state.mode === "online" ? `${mine ? `<button class="player-voice${player.voice ? " active" : ""}" type="button" data-voice-toggle aria-label="${player.voice ? "Mute mikrofon" : "Aktifkan mikrofon"}" title="${player.voice ? "Mute mikrofon" : "Aktifkan mikrofon"}">${headsetIcon}</button>` : `<span class="player-voice${player.voice ? " active" : ""}" aria-label="${player.voice ? "Voice aktif" : "Voice tidak aktif"}">${headsetIcon}</span>`}` : "";
      return `<article class="player-row" data-player-id="${player.id}"><span class="player-color" style="background:${player.color}"></span><div class="player-identity"><span class="player-name"><b>${escapeHtml(player.name)}</b>${voice}</span><small>${player.participant === false ? (mine ? "Kamu · Penonton" : "Penonton") : mine ? "Kamu" : player.connected === false ? "Terputus" : "Pemain"}</small></div><strong class="player-position">${state.visualPositions.get(player.id) ?? player.position}</strong>${isHost && !mine ? `<button class="kick-player" type="button" data-kick-player="${player.id}">Kick</button>` : ""}</article>`;
    }).join("");
    syncTokens(room);
    const message = describeMove(room.lastMove);
    $("#event-banner").textContent = room.status === "waiting" ? "Bagikan kode room dan tunggu teman masuk." : message;
    const mine = currentPlayer();
    $("#roll-button").disabled = state.busy || room.status !== "playing" || !mine || room.turn !== mine.id;
    $("#start-button").hidden = state.mode === "solo" || room.status !== "waiting" || room.players[0]?.id !== state.playerId;
    $("#reset-button").hidden = room.status !== "finished" || (state.mode !== "solo" && room.players[0]?.id !== state.playerId);
    if (room.lastMove && room.lastMove.at !== render.lastMove) {
      render.lastMove = room.lastMove.at;
      addLog(message);
      queueMove(room.lastMove);
    }
    window.dispatchEvent(new CustomEvent("snake:rendered"));
    if (room.status === "finished") state.animationQueue.then(() => showWinner(room));
  };
  const escapeHtml = (value) => String(value || "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const renderLobbyChat = () => {
    const container = $("#lobby-chat-messages");
    container.innerHTML = lobbyMessages.map((message) => {
      const time = new Date(message.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      const codeButton = message.roomCode ? `<button type="button" data-room-code="${escapeHtml(message.roomCode)}">Gabung ${escapeHtml(message.roomCode)}</button>` : "";
      return `<article><div><b>${escapeHtml(message.name)}</b><time>${time}</time></div><p>${escapeHtml(message.text)}</p>${codeButton}</article>`;
    }).join("") || '<p class="chat-empty">Belum ada pesan. Ajak teman main di sini.</p>';
    container.scrollTop = container.scrollHeight;
  };
  const joinLobbyChat = () => {
    if (!socket?.connected) return;
    socket.emit("lobby:chat:join", { siteId }, (reply) => {
      $("#lobby-chat-status").textContent = reply?.ok ? "Online" : "Terputus";
      if (!reply?.ok) return;
      lobbyMessages = reply.messages || [];
      renderLobbyChat();
    });
  };
  const saveRoomSession = (reply) => sessionStorage.setItem(roomSessionKey, JSON.stringify({ code: reply.room.code, playerId: reply.playerId, reconnectToken: reply.reconnectToken }));
  const reconnectRoom = () => {
    const saved = JSON.parse(sessionStorage.getItem(roomSessionKey) || "null");
    if (!saved || state.mode === "solo") return;
    socket.emit("room:reconnect", { ...saved, siteId }, (reply) => {
      if (!reply?.ok) { sessionStorage.removeItem(roomSessionKey); return; }
      state.mode = "online";
      state.playerId = reply.playerId;
      state.room = reply.room;
      saveRoomSession(reply);
      startView();
      toast("Tersambung kembali ke room.");
    });
  };
  const rollAnimation = () => {
    state.busy = true;
    $("#roll-button").disabled = true;
    $("#dice").classList.remove("rolling");
    requestAnimationFrame(() => $("#dice").classList.add("rolling"));
    state.rollStartedAt = Date.now();
    playSound("#dice-sound", { start: .16, duration: 800 });
  };
  const returnToLobby = () => {
    sessionStorage.removeItem(roomSessionKey);
    state.mode = null;
    state.playerId = null;
    state.room = null;
    state.busy = false;
    state.winnerShownAt = null;
    state.visualPositions.clear();
    document.body.classList.remove("game-active");
    $("#game").hidden = true;
    $("#setup").hidden = true;
    $("#welcome").hidden = false;
    $("#leave-dialog").close();
    window.dispatchEvent(new CustomEvent("snake:game-left"));
  };
  const leaveRoom = () => {
    if (!state.room) { window.location.href = "/"; return; }
    if (state.mode === "solo") { returnToLobby(); return; }
    socket.emit("room:leave", {}, (reply) => {
      if (!reply?.ok) { toast(reply?.error || "Gagal keluar dari room."); return; }
      returnToLobby();
    });
  };

  const createSolo = (name) => {
    state.mode = "solo";
    state.playerId = "human";
    state.room = {
      code: "SOLO",
      status: "playing",
      turn: "human",
      winner: null,
      finishOrder: [],
      lastMove: null,
      players: [
        { id: "human", name, color: colors[0], position: 1, connected: true },
        { id: "bot", name: "Bot Selor", color: colors[1], position: 1, connected: true },
      ],
    };
    startView();
  };
  const soloRoll = (playerId) => {
    const room = state.room;
    const player = room.players.find((item) => item.id === playerId);
    const dice = Math.floor(Math.random() * 6) + 1;
    const result = moveResult(player.position, dice);
    player.position = result.to;
    room.lastMove = { playerId, playerName: player.name, dice, ...result, at: Date.now() };
    if (result.won) {
      room.finishOrder = [playerId, ...room.players.filter((item) => item.id !== playerId).map((item) => item.id)];
      room.status = "finished";
      room.winner = playerId;
      room.turn = null;
      room.lastMove.finishRank = 1;
    } else {
      room.turn = playerId === "human" ? "bot" : "human";
    }
    render();
    return { ...result, animation: queueMove(room.lastMove) };
  };
  const roll = () => {
    if (state.busy || !state.room) return;
    rollAnimation();
    if (state.mode === "solo") {
      setTimeout(() => {
        const result = soloRoll("human");
        if (!result.won) result.animation.then(() => setTimeout(() => soloRoll("bot"), 350));
      }, 600);
      return;
    }
    socket.emit("game:roll", {}, (reply) => {
      if (!reply?.ok) { state.busy = false; toast(reply?.error || "Dadu gagal dikocok."); render(); }
    });
  };

  document.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => showSetup(button.dataset.mode)));
  $("#lobby-chat-name").value = localStorage.getItem(`snake-chat-name:${siteId}`) || "";
  $("#lobby-chat-messages").addEventListener("click", (event) => {
    const roomCode = event.target.closest("[data-room-code]")?.dataset.roomCode;
    if (!roomCode) return;
    $("#room-code").value = roomCode;
    const chatName = $("#lobby-chat-name").value.trim();
    if (chatName) $("#player-name").value = chatName;
    showSetup("join");
  });
  $("#lobby-chat-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("#lobby-chat-name").value.trim();
    const input = $("#lobby-chat-input");
    const error = $("#lobby-chat-error");
    if (!socket?.connected) { error.textContent = "Chat belum terhubung."; return; }
    socket.emit("lobby:chat:send", { siteId, name, text: input.value }, (reply) => {
      error.textContent = reply?.ok ? "" : reply?.error || "Pesan gagal dikirim.";
      if (!reply?.ok) return;
      localStorage.setItem(`snake-chat-name:${siteId}`, name);
      $("#player-name").value = name;
      input.value = "";
      input.focus();
    });
  });
  $(".dialog-close").addEventListener("click", () => { $("#setup").hidden = true; });
  $("#setup-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("#player-name").value.trim();
    const feedback = $("#setup-feedback");
    if (!name) return;
    if (setupMode === "solo") return createSolo(name);
    if (!socket?.connected) { feedback.textContent = "Server permainan belum terhubung."; return; }
    feedback.textContent = "Menghubungkan...";
    const action = setupMode === "create" ? "room:create" : "room:join";
    socket.emit(action, { name, code: $("#room-code").value, siteId }, (reply) => {
      if (!reply?.ok) { feedback.textContent = reply?.error || "Room gagal dibuka."; return; }
      state.mode = "online";
      state.playerId = reply.playerId;
      state.room = reply.room;
      saveRoomSession(reply);
      startView();
    });
  });
  $("#back-button").addEventListener("click", () => {
    if (!state.room) { window.location.href = "/"; return; }
    $("#leave-dialog").showModal();
  });
  $("#cancel-leave").addEventListener("click", () => $("#leave-dialog").close());
  $("#confirm-leave").addEventListener("click", leaveRoom);
  $("#close-winner").addEventListener("click", () => $("#winner-dialog").close());
  $("#roll-button").addEventListener("click", roll);
  $("#start-button").addEventListener("click", () => socket.emit("game:start", {}, (reply) => { if (!reply?.ok) toast(reply?.error); }));
  $("#reset-button").addEventListener("click", () => {
    $("#winner-dialog").close();
    state.winnerShownAt = null;
    if (state.mode === "solo") return createSolo(currentPlayer()?.name || "Pemain");
    socket.emit("game:reset", {}, (reply) => { if (!reply?.ok) toast(reply?.error); });
  });
  $("#room-code-display").addEventListener("click", async () => {
    if (state.room?.code === "SOLO") return;
    await navigator.clipboard?.writeText(state.room?.code || "");
    toast("Kode room disalin.");
  });
  $("#sound-toggle").addEventListener("click", () => {
    state.sound = !state.sound;
    $("#sound-toggle").classList.toggle("off", !state.sound);
  });
  $("#players").addEventListener("click", (event) => {
    const playerId = event.target.closest("[data-kick-player]")?.dataset.kickPlayer;
    if (!playerId || !confirm("Keluarkan pemain ini dari room?")) return;
    socket.emit("room:kick", { playerId }, (reply) => { if (!reply?.ok) toast(reply?.error || "Gagal mengeluarkan pemain."); });
  });
  socket?.on("room:state", (room) => { state.room = room; render(); });
  socket?.on("room:kicked", ({ message } = {}) => { returnToLobby(); toast(message || "Kamu dikeluarkan oleh host."); });
  socket?.on("connect", () => { joinLobbyChat(); reconnectRoom(); });
  socket?.on("disconnect", () => { $("#lobby-chat-status").textContent = "Terputus"; });
  socket?.on("lobby:chat:message", (message) => { lobbyMessages.push(message); lobbyMessages = lobbyMessages.slice(-50); renderLobbyChat(); });
  socket?.on("lobby:chat:remove-room", ({ roomCode }) => { lobbyMessages = lobbyMessages.filter((message) => message.roomCode !== roomCode); renderLobbyChat(); });
  socket?.on("connect_error", () => { if (state.mode === "online") toast("Koneksi permainan terputus."); });
  if (socket?.connected) { joinLobbyChat(); reconnectRoom(); }
})();
