(() => {
  const snakes = { 17: 6, 54: 14, 62: 19, 95: 36, 99: 83 };
  const ladders = { 3: 22, 5: 14, 9: 31, 20: 39, 27: 84, 51: 67, 72: 91, 73: 93, 88: 99 };
  const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
  const colors = ["#f0b54b", "#4db8d0", "#ef6f6c", "#70c48f"];
  const $ = (selector) => document.querySelector(selector);
  const siteId = document.body.dataset.site || "MMS";
  const socket = typeof io === "function" ? io({ path: "/ular-tangga/socket.io" }) : null;
  const state = { mode: null, playerId: null, room: null, sound: true, busy: false };
  let setupMode = "solo";

  const playSound = (id) => {
    if (!state.sound) return;
    const audio = $(id);
    audio.currentTime = 0;
    audio.play().catch(() => {});
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
    $("#room-code-display").textContent = room.code;
    const turn = room.players.find((player) => player.id === room.turn);
    $("#turn-name").textContent = room.status === "finished" ? "Selesai" : turn?.name || "Menunggu";
    $("#turn-dot").style.background = turn?.color || "#7894a2";
    $("#players").innerHTML = room.players.map((player) => `<article class="player-row"><span class="player-color" style="background:${player.color}"></span><div><b>${escapeHtml(player.name)}</b><small>${player.id === state.playerId ? "Kamu" : player.connected === false ? "Terputus" : "Pemain"}</small></div><strong class="player-position">${player.position}</strong></article>`).join("");
    $("#tokens").innerHTML = room.players.map((player, index) => {
      const point = coordinates(player.position);
      return `<span class="token offset-${index}" style="left:${point.left}%;top:${point.top}%;background:${player.color}" title="${escapeHtml(player.name)}">${index + 1}</span>`;
    }).join("");
    const message = describeMove(room.lastMove);
    $("#event-banner").textContent = room.status === "waiting" ? "Bagikan kode room dan tunggu teman masuk." : message;
    const mine = currentPlayer();
    $("#roll-button").disabled = state.busy || room.status !== "playing" || !mine || room.turn !== mine.id;
    $("#start-button").hidden = state.mode === "solo" || room.status !== "waiting" || room.players[0]?.id !== state.playerId;
    $("#reset-button").hidden = room.status !== "finished" || (state.mode !== "solo" && room.players[0]?.id !== state.playerId);
    if (room.lastMove && room.lastMove.at !== render.lastMove) {
      render.lastMove = room.lastMove.at;
      $("#dice").textContent = diceFaces[room.lastMove.dice - 1];
      addLog(message);
      if (room.lastMove.event === "ladder") playSound("#ladder-sound");
      if (room.lastMove.event === "snake") playSound("#snake-sound");
    }
  };
  const escapeHtml = (value) => String(value || "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const rollAnimation = () => {
    state.busy = true;
    $("#roll-button").disabled = true;
    $("#dice").classList.remove("rolling");
    requestAnimationFrame(() => $("#dice").classList.add("rolling"));
    playSound("#dice-sound");
  };
  const finishAnimation = () => {
    setTimeout(() => { state.busy = false; render(); }, 700);
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
    return result;
  };
  const roll = () => {
    if (state.busy || !state.room) return;
    rollAnimation();
    if (state.mode === "solo") {
      setTimeout(() => {
        const result = soloRoll("human");
        if (!result.won) setTimeout(() => { soloRoll("bot"); finishAnimation(); }, 900);
        else finishAnimation();
      }, 600);
      return;
    }
    socket.emit("game:roll", {}, (reply) => {
      if (!reply?.ok) toast(reply?.error || "Dadu gagal dikocok.");
      finishAnimation();
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
