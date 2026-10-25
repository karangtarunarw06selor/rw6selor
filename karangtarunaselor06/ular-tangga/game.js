(() => {
  const snakes = { 17: 6, 54: 14, 62: 19, 95: 36, 99: 83 };
  const ladders = { 3: 22, 5: 14, 9: 31, 20: 39, 27: 84, 51: 67, 72: 91, 73: 93, 88: 99 };
  const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
  const colors = ["#f0b54b", "#4db8d0", "#ef6f6c", "#70c48f"];
  const headsetIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13v-1a8 8 0 0 1 16 0v1"></path><path d="M4 13h3v7H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 1-2ZM20 13h-3v7h2a2 2 0 0 0 2-2v-3a2 2 0 0 0-1-2ZM17 20c0 1-1 2-3 2h-2"></path></svg>';
  const $ = (selector) => document.querySelector(selector);
  const siteId = document.body.dataset.site || "MMS";
  const socket = typeof io === "function" ? io({ path: "/ular-tangga/socket.io" }) : null;
  const state = { mode: null, playerId: null, room: null, sound: true, busy: false, visualPositions: new Map(), animationQueue: Promise.resolve(), rollStartedAt: 0 };
  let setupMode = "solo";

  const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
  const snakePaths = {
    17: [[43, 84], [50, 87], [57, 92], [66, 91], [62, 96]],
    54: [[70, 49], [67, 55], [61, 58], [68, 64], [66, 70], [61, 75], [68, 81]],
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
    const stepped = position + dice <= 100 ? position + dice : position;
    const to = ladders[stepped] || snakes[stepped] || stepped;
    return { from: position, stepped, to, event: ladders[stepped] ? "ladder" : snakes[stepped] ? "snake" : "move", won: to === 100 };
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
  const animateTransfer = async (move) => {
    const token = tokenElement(move.playerId);
    if (!token) return;
    const from = coordinates(move.stepped);
    const to = coordinates(move.to);
    const middle = move.event === "snake" ? snakePaths[move.stepped] || [] : [];
    const points = [from, ...middle.map(([left, top]) => ({ left, top })), to];
    playSound(move.event === "ladder" ? "#ladder-sound" : "#snake-sound");
    token.classList.add(`following-${move.event}`);
    token.style.transition = "none";
    const animation = token.animate(points.map((point) => ({ left: `${point.left}%`, top: `${point.top}%` })), {
      duration: move.event === "ladder" ? 900 : 1250,
      easing: move.event === "ladder" ? "ease-in-out" : "linear",
      fill: "forwards",
    });
    await animation.finished.catch(() => {});
    token.classList.remove(`following-${move.event}`);
    token.style.left = `${to.left}%`;
    token.style.top = `${to.top}%`;
    animation.cancel();
    token.style.transition = "";
    state.visualPositions.set(move.playerId, move.to);
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
    if (move.from !== move.stepped) {
      for (let position = move.from + 1; position <= move.stepped; position += 1) await animatePoint(move.playerId, position);
    }
    if (move.event === "ladder" || move.event === "snake") await animateTransfer(move);
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
    if (move.event === "ladder") return `${move.playerName} mendapat tangga: ${move.stepped} → ${move.to}.`;
    if (move.event === "snake") return `${move.playerName} terkena ular: ${move.stepped} → ${move.to}.`;
    if (move.from === move.to) return `${move.playerName} mendapat ${move.dice}, tetapi harus tepat ke petak 100.`;
    return `${move.playerName} mendapat ${move.dice}: ${move.from} → ${move.to}.`;
  };
  const render = () => {
    const room = state.room;
    if (!room) return;
    const hasNewMove = room.lastMove && room.lastMove.at !== render.lastMove;
    if (hasNewMove) state.visualPositions.set(room.lastMove.playerId, room.lastMove.from);
    $("#room-code-display").textContent = room.code;
    const turn = room.players.find((player) => player.id === room.turn);
    $("#turn-name").textContent = room.status === "finished" ? "Selesai" : turn?.name || "Menunggu";
    $("#turn-dot").style.background = turn?.color || "#7894a2";
    $("#players").innerHTML = room.players.map((player) => {
      const mine = player.id === state.playerId;
      const voice = state.mode === "online" ? `${mine ? `<button class="player-voice${player.voice ? " active" : ""}" type="button" data-voice-toggle aria-label="${player.voice ? "Mute mikrofon" : "Aktifkan mikrofon"}" title="${player.voice ? "Mute mikrofon" : "Aktifkan mikrofon"}">${headsetIcon}</button>` : `<span class="player-voice${player.voice ? " active" : ""}" aria-label="${player.voice ? "Voice aktif" : "Voice tidak aktif"}">${headsetIcon}</span>`}` : "";
      return `<article class="player-row" data-player-id="${player.id}"><span class="player-color" style="background:${player.color}"></span><div class="player-identity"><span class="player-name"><b>${escapeHtml(player.name)}</b>${voice}</span><small>${mine ? "Kamu" : player.connected === false ? "Terputus" : "Pemain"}</small></div><strong class="player-position">${state.visualPositions.get(player.id) ?? player.position}</strong></article>`;
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
  };
  const escapeHtml = (value) => String(value || "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const rollAnimation = () => {
    state.busy = true;
    $("#roll-button").disabled = true;
    $("#dice").classList.remove("rolling");
    requestAnimationFrame(() => $("#dice").classList.add("rolling"));
    state.rollStartedAt = Date.now();
    playSound("#dice-sound", { start: .16, duration: 800 });
  };
  const createSolo = (name) => {
    state.mode = "solo";
    state.playerId = "human";
    state.room = {
      code: "SOLO",
      status: "playing",
      turn: "human",
      winner: null,
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
      room.status = "finished";
      room.winner = playerId;
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
      startView();
    });
  });
  $("#roll-button").addEventListener("click", roll);
  $("#start-button").addEventListener("click", () => socket.emit("game:start", {}, (reply) => { if (!reply?.ok) toast(reply?.error); }));
  $("#reset-button").addEventListener("click", () => {
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
  socket?.on("room:state", (room) => { state.room = room; render(); });
  socket?.on("connect_error", () => { if (state.mode === "online") toast("Koneksi permainan terputus."); });
})();
