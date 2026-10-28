"use strict";

(() => {
  const $ = (selector) => document.querySelector(selector);
  const socket = io({ path: "/poker/socket.io", transports: ["websocket", "polling"] });
  const siteId = /karangtaruna/i.test(location.hostname + location.pathname) ? "KT" : "MMS";
  document.body.dataset.site = siteId;
  document.querySelector('link[rel="icon"]').href = siteId === "KT" ? "favicon-kt.avif?v=1" : "favicon-mms.avif?v=1";
  document.querySelector('link[rel="apple-touch-icon"]').href = siteId === "KT" ? "favicon-kt.avif?v=1" : "favicon-mms.avif?v=1";
  const siteBrand = siteId === "KT" ? "KT RW06" : "MMS 05";
  document.title = `Game Kartu ${siteBrand}`;
  document.querySelector("[data-site-brand]").textContent = `${siteBrand} SOCIAL GAME`;
  document.querySelector("[data-game-brand]").textContent = `GAME KARTU ${siteBrand}`;

  const elements = {
    lobby: $("#lobby"), roomLobby: $("#roomLobby"), game: $("#game"), roomPlayers: $("#roomPlayers"), roomNotice: $("#roomNotice"), gameCode: $("#gameRoomCode"), name: $("#playerName"), code: $("#roomCode"), error: $("#lobbyError"),
    copy: $("#copyCode"), seats: $("#seats"), board: $("#board"), pot: $("#pot"), phase: $("#phase"), handDock: $("#handDock"), notice: $("#notice"),
    start: $("#startGame"), modePicker: $("#modePicker"), readyPanel: $("#readyPanel"), readyToggle: $("#readyToggle"), readyStatus: $("#readyStatus"), capsaVote: $("#capsaVote"), voteStatus: $("#voteStatus"), actions: $("#actions"), cangkulanActions: $("#cangkulanActions"), capsaActions: $("#capsaActions"), samgongActions: $("#samgongActions"), checkCall: $("#checkCall"), raisePanel: $("#raisePanel"),
    raiseAmount: $("#raiseAmount"), raiseOutput: $("#raiseOutput"),
  };
  const state = { room: null, playerId: null, token: null, busy: false, selectedCards: new Set() };
  const lobbyMessages = [];
  const chatMessages = $("#lobbyChatMessages");
  const chatInput = $("#lobbyChatInput");
  const chatError = $("#lobbyChatError");
  const leaveConfirm = $("#leaveConfirm");
  let allowLeave = false;
  const storageKey = `rw06_poker_session_${siteId}`;
  const suit = { c: "♣", d: "♦", h: "♥", s: "♠" };
  const phaseLabel = { waiting: "LOBBY", playing: "BERMAIN", preflop: "PRE-FLOP", flop: "FLOP", turn: "TURN", river: "RIVER", finished: "RONDE SELESAI" };
  const modeLabel = { holdem: "TEXAS HOLD’EM", "capsa-banting": "CAPSA BANTING", cangkulan: "MINUMAN", samgong: "SAMGONG BANDAR" };
  let countdownTimer = null;
  let selectionKey = "";

  function request(event, payload = {}) {
    return new Promise((resolve) => socket.emit(event, payload, resolve));
  }
  function actionId() {
    return globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }

  function setError(message = "") { elements.error.textContent = message; }
  function remember(result, name) {
    state.playerId = result.playerId;
    state.token = result.token;
    localStorage.setItem(storageKey, JSON.stringify({ code: result.room.code, token: result.token, name }));
  }
  function enter(room) {
    state.room = room;
    elements.lobby.classList.add("hidden");
    render();
  }
  function cardHtml(card) {
    if (card === null) return '<span class="playing-card back">?</span>';
    if (!card) return '<span class="playing-card empty"></span>';
    const red = card.suit === "h" || card.suit === "d";
    return `<span class="playing-card${red ? " red" : ""}">${card.rank}${suit[card.suit]}</span>`;
  }
  function orderedPlayers(room) {
    const ownIndex = Math.max(0, room.players.findIndex((player) => player.id === state.playerId));
    return [...room.players.slice(ownIndex), ...room.players.slice(0, ownIndex)];
  }
  function resultText(room) {
    if (!room.lastResult) return room.phase === "waiting" ? "Bagikan kode room. Minimal dua pemain untuk mulai." : "";
    if (room.lastResult.rankings) return room.lastResult.rankings.map((entry, index, all) => `${index + 1}. ${entry.name}${index === all.length - 1 ? " · KALAH" : ""}`).join(" · ");
    const winners = room.lastResult.winners.map((winner) => `${winner.name}${winner.amount ? ` +${winner.amount}` : ""}${winner.hand ? ` · ${winner.hand}` : ""}`).join(" · ");
    return `Pemenang: ${winners}`;
  }
  function renderSeat(player, index) {
    const classes = ["seat"];
    if (player.id === state.playerId) classes.push("me");
    if (player.id === state.room.turnId) classes.push("turn");
    if (player.playingRound === false) classes.push("resting");
    if (player.media?.audio || player.media?.video) classes.push("media-on");
    const initials = escapeHtml(player.name.slice(0, 2).toUpperCase());
    const cards = player.hole || player.hand || [];
    const seatCards = ["cangkulan", "capsa-banting", "samgong"].includes(state.room.mode) ? [] : cards;
    const hole = seatCards.length ? `<div class="hole">${seatCards.map((card) => `<span>${cardHtml(card)}</span>`).join("")}</div>` : "";
    const showStack = ["cangkulan", "capsa-banting", "samgong"].includes(state.room.mode) && player.id !== state.playerId && player.cardCount > 0 && state.room.phase !== "finished";
    const stack = showStack ? `<div class="opponent-stack" aria-label="${player.cardCount} kartu tersisa">${Array.from({ length: Math.min(player.cardCount, 5) }, () => '<span class="playing-card back">?</span>').join("")}</div>` : "";
    return `<article class="${classes.join(" ")}" data-player-id="${player.id}" style="--seat:${index}">
      ${hole}${stack}<div class="seat-box">
        <span class="avatar" data-video-slot="${player.id}"><span>${initials}</span><i class="voice-dot"></i></span>
        <b class="seat-name">${escapeHtml(player.name)}${player.folded ? " · FOLD" : player.allIn ? " · ALL-IN" : ""}</b>
        <span class="seat-stack">${state.room.mode === "holdem" ? `♢ ${player.stack}` : state.room.mode === "samgong" ? `${player.cardCount ?? cards.length} KARTU · SKOR ${player.score >= 0 ? "+" : ""}${player.score}` : `${player.cardCount ?? cards.length} KARTU`}</span>
        ${["waiting", "finished"].includes(state.room.phase) && state.room.mode ? `<i class="ready-badge ${player.id === state.room.hostId || player.ready ? "is-ready" : ""}">${player.id === state.room.hostId ? "MASTER" : player.ready ? "READY" : "REHAT"}</i>` : player.playingRound === false ? '<i class="ready-badge">PENONTON · IKUT RONDE BERIKUTNYA</i>' : ""}
        ${state.room.mode === "holdem" && player.id === state.room.dealerId ? `<i class="dealer">${state.room.players.length >= 3 ? "BANDAR" : "D"}</i>` : ""}
        ${state.room.mode === "cangkulan" && player.id === state.room.bandarId ? '<i class="dealer">BANDAR</i>' : ""}
        ${state.room.mode === "samgong" && player.id === state.room.bandarId ? '<i class="dealer">BANDAR</i>' : ""}
        ${state.room.mode === "cangkulan" && player.rank ? `<i class="rank-badge">${player.rank === state.room.players.length ? "KALAH" : `#${player.rank}`}</i>` : ""}
        ${player.bet ? `<span class="seat-bet">BET ${player.bet}</span>` : ""}
      </div>
    </article>`;
  }
  function escapeHtml(value) {
    const node = document.createElement("span");
    node.textContent = String(value);
    return node.innerHTML;
  }
  function renderLobbyChat() {
    chatMessages.innerHTML = lobbyMessages.map((message) => {
      const time = new Date(message.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      const code = message.roomCode ? `<button type="button" data-room-code="${message.roomCode}">Pakai ${message.roomCode}</button>` : "";
      return `<article><div><b>${escapeHtml(message.name)}</b><time>${time}</time></div><p>${escapeHtml(message.text)}</p>${code}</article>`;
    }).join("") || '<p class="chat-empty">Belum ada pesan. Buat room lalu bagikan kodenya di sini.</p>';
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  function addLobbyMessage(message) {
    if (lobbyMessages.some((item) => item.id === message.id)) return;
    lobbyMessages.push(message);
    if (lobbyMessages.length > 50) lobbyMessages.shift();
    renderLobbyChat();
  }
  function render() {
    const room = state.room;
    if (!room) return;
    const waiting = ["waiting", "finished"].includes(room.phase);
    elements.lobby.classList.add("hidden");
    elements.roomLobby.classList.toggle("hidden", !waiting);
    elements.game.classList.toggle("hidden", waiting);
    elements.copy.textContent = room.code;
    elements.gameCode.textContent = room.code;
    elements.pot.textContent = room.mode ? modeLabel[room.mode] : "PILIH MODE";
    elements.phase.textContent = phaseLabel[room.phase] || room.phase.toUpperCase();
    if (room.mode === "cangkulan") {
      if (room.lastResult?.rankings) elements.board.innerHTML = `<ol class="ranking-list">${room.lastResult.rankings.map((entry, index, all) => `<li><b>#${index + 1}</b> ${escapeHtml(entry.name)}${index === all.length - 1 ? " · KALAH" : ""}</li>`).join("")}</ol>`;
      else {
        const plays = room.currentTrick?.length ? room.currentTrick : room.completedTrick || [];
        const trick = plays.length ? `<div class="minuman-trick">${plays.map((play) => {
          const player = room.players.find((item) => item.id === play.playerId);
          const highest = play.playerId === room.completedTrickWinnerId;
          return `<article class="${highest ? "highest" : ""}"><small>${escapeHtml(player?.name || "Pemain")}</small>${cardHtml(play.card)}${highest ? "<b>TERTINGGI</b>" : ""}</article>`;
        }).join("")}</div>` : room.houseSuit ? `<div class="minuman-trick system-house"><article><small>SISTEM</small>${cardHtml(room.openingCard)}</article></div>` : "";
        const house = room.houseSuit ? `HOUSE ${suit[room.houseSuit]}` : "BANDAR BUKA";
        elements.board.innerHTML = `${trick}<span class="stock-count">${house} · DECK ${room.stockCount}</span>`;
      }
    }
    else if (room.mode === "capsa-banting") elements.board.innerHTML = room.currentPlay ? room.currentPlay.cards.map(cardHtml).join("") : '<span class="stock-count">BUKA PUTARAN</span>';
    else if (room.mode === "samgong") {
      const outcomes = room.lastResult?.outcomes;
      elements.board.innerHTML = outcomes ? `<ol class="ranking-list samgong-results">${outcomes.map((entry) => {
        const player = room.players.find((item) => item.id === entry.id);
        return `<li><span>${(player?.hand || []).map(cardHtml).join("")}</span><div><b>${entry.bandar ? "BANDAR" : entry.result === "win" ? "MENANG" : "KALAH"}</b><small>${escapeHtml(entry.name)} · ${entry.delta >= 0 ? "+" : ""}${entry.delta}</small></div></li>`;
      }).join("")}</ol>` : '<span class="stock-count">3 KARTU · LAWAN BANDAR</span>';
    }
    else elements.board.innerHTML = [...(room.board || []), ...Array(Math.max(0, 5 - (room.board || []).length)).fill(undefined)].map(cardHtml).join("");
    elements.seats.innerHTML = orderedPlayers(room).map(renderSeat).join("");
    const me = room.players.find((player) => player.id === state.playerId);
    elements.roomPlayers.innerHTML = room.players.map((player) => `<article class="room-player"><b>${escapeHtml(player.name)}</b><span>${player.id === room.hostId ? "HOST" : player.ready ? "READY" : "MENUNGGU"}</span></article>`).join("");
    const dockHand = ["cangkulan", "capsa-banting"].includes(room.mode) || (room.mode === "samgong" && room.phase === "playing") ? (me?.hand || []) : [];
    const nextSelectionKey = `${room.mode}|${room.phase}|${room.turnId}|${dockHand.map((card) => card ? `${card.rank}${card.suit}` : "").join(",")}`;
    if (selectionKey && selectionKey !== nextSelectionKey) state.selectedCards.clear();
    selectionKey = nextSelectionKey;
    elements.handDock.classList.toggle("hidden", !dockHand.length);
    elements.handDock.classList.toggle("capsa-hand", room.mode === "capsa-banting");
    elements.handDock.classList.toggle("minuman-hand", room.mode === "cangkulan");
    elements.handDock.classList.toggle("samgong-hand", room.mode === "samgong");
    elements.handDock.innerHTML = dockHand.map((card, cardIndex) => `<button data-card-index="${cardIndex}" class="${state.selectedCards.has(cardIndex) ? "selected" : ""}" ${room.turnId === state.playerId && card ? "" : "disabled"}>${cardHtml(card)}</button>`).join("");
    const isHost = room.hostId === state.playerId;
    const mayChooseMode = isHost && room.players.length >= 2 && ["waiting", "finished"].includes(room.phase);
    elements.modePicker.classList.toggle("hidden", !mayChooseMode);
    elements.modePicker.querySelectorAll("[data-mode]").forEach((button) => button.classList.toggle("selected", button.dataset.mode === room.mode));
    const voting = room.mode === "capsa-banting" && ["waiting", "finished"].includes(room.phase) && (isHost || me?.ready);
    elements.capsaVote.classList.toggle("hidden", !voting);
    elements.capsaVote.querySelectorAll("[data-rule]").forEach((button) => button.classList.toggle("selected", button.dataset.rule === room.myVote));
    elements.voteStatus.textContent = room.voteResult ? `Hasil: ${room.voteResult.toUpperCase()}` : `${room.voteCount}/${room.readyIds.length + 1} peserta sudah vote`;
    const preparing = Boolean(room.mode) && ["waiting", "finished"].includes(room.phase);
    const readyCount = room.readyIds.length;
    elements.readyPanel.classList.toggle("hidden", !preparing || isHost);
    elements.readyToggle.textContent = me?.ready ? "Rehat ronde ini" : "Ready untuk ronde";
    elements.readyToggle.classList.toggle("primary", !me?.ready);
    elements.readyStatus.textContent = me?.ready ? "Kamu ikut ronde berikutnya." : "Kamu menonton satu ronde tanpa kartu.";
    elements.start.classList.toggle("hidden", !isHost || !preparing || (room.mode === "capsa-banting" && !room.voteResult));
    elements.start.disabled = readyCount < 1;
    elements.start.textContent = readyCount < 1 ? "Menunggu pemain Ready" : `${room.phase === "finished" ? "Ronde Berikutnya" : `Mulai ${modeLabel[room.mode] || "Permainan"}`} · ${readyCount + 1} pemain`;
    const myTurn = room.turnId === state.playerId && ["preflop", "flop", "turn", "river"].includes(room.phase);
    elements.actions.classList.toggle("hidden", !myTurn);
    const cangkulanTurn = room.mode === "cangkulan" && room.phase === "playing" && room.turnId === state.playerId;
    elements.cangkulanActions.classList.toggle("hidden", !cangkulanTurn);
    const capsaTurn = room.mode === "capsa-banting" && room.phase === "playing" && room.turnId === state.playerId;
    elements.capsaActions.classList.toggle("hidden", !capsaTurn);
    const samgongTurn = room.mode === "samgong" && room.phase === "playing" && room.turnId === state.playerId;
    elements.samgongActions.classList.toggle("hidden", !samgongTurn);
    $("#minumanPlay").disabled = state.selectedCards.size !== 1;
    $("#minumanPlay").textContent = state.selectedCards.size ? "Buang kartu ✓" : "Pilih lalu buang";
    $("#capsaPlay").disabled = state.selectedCards.size < 1;
    $("#capsaPlay").textContent = state.selectedCards.size ? `Mainkan ${state.selectedCards.size} kartu` : "Mainkan pilihan";
    $("#drawCard").disabled = !room.houseSuit || (me?.hand || []).some((card) => card?.suit === room.houseSuit);
    elements.raisePanel.classList.add("hidden");
    if (myTurn && me) {
      const owed = Math.max(0, room.currentBet - me.bet);
      elements.checkCall.textContent = owed ? `Call ${Math.min(owed, me.stack)}` : "Check";
      elements.checkCall.dataset.action = owed ? "call" : "check";
      const minimum = Math.min(me.bet + me.stack, room.minimumRaise);
      elements.raiseAmount.min = String(minimum);
      elements.raiseAmount.max = String(me.bet + me.stack);
      elements.raiseAmount.step = String(room.bigBlind);
      elements.raiseAmount.value = String(minimum);
      elements.raiseOutput.textContent = elements.raiseAmount.value;
      $("#raiseOpen").disabled = me.bet + me.stack <= room.currentBet;
    }
    if (countdownTimer) clearInterval(countdownTimer);
    const updateNotice = () => {
      const seconds = room.turnDeadline ? Math.max(0, Math.ceil((room.turnDeadline - Date.now()) / 1000)) : null;
      const timer = seconds === null ? "" : ` · ${seconds}d`;
      const ownTurn = myTurn || cangkulanTurn || capsaTurn || samgongTurn;
      elements.notice.textContent = resultText(room) || (!room.mode ? (isHost ? "Pilih mode setelah pemain lain bergabung." : "Menunggu host memilih mode.") : ownTurn ? `Giliranmu. Pilih aksi${timer}.` : room.turnId ? `Giliran ${room.players.find((p) => p.id === room.turnId)?.name || "pemain"}${timer}.` : `Mode ${modeLabel[room.mode]} dipilih.`);
      elements.roomNotice.textContent = elements.notice.textContent;
    };
    updateNotice();
    if (room.turnDeadline) countdownTimer = setInterval(updateNotice, 1000);
    window.PokerMedia?.syncSeats(room.players, state.playerId);
  }
  async function roomAction(event, payload) {
    if (state.busy) return;
    state.busy = true;
    const response = await request(event, payload);
    state.busy = false;
    if (!response?.ok) elements.notice.textContent = response?.error || "Aksi gagal.";
    return response;
  }
  async function createOrJoin(mode) {
    setError();
    const name = elements.name.value.trim();
    localStorage.setItem("rw06_poker_name", name);
    const response = await request(`room:${mode}`, { name, code: elements.code.value, siteId });
    if (!response?.ok) return setError(response?.error || "Gagal masuk room.");
    remember(response, name);
    enter(response.room);
    window.PokerMedia?.configure({ socket, request, playerId: state.playerId });
  }

  $("#createRoom").addEventListener("click", () => createOrJoin("create"));
  $("#joinRoom").addEventListener("click", () => createOrJoin("join"));
  elements.name.addEventListener("keydown", (event) => { if (event.key === "Enter") createOrJoin(elements.code.value ? "join" : "create"); });
  elements.code.addEventListener("input", () => { elements.code.value = elements.code.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); });
  elements.code.addEventListener("keydown", (event) => { if (event.key === "Enter") createOrJoin("join"); });
  $("#lobbyChatForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    chatError.textContent = "";
    const response = await request("lobby:chat:send", { siteId, name: elements.name.value, text: chatInput.value });
    if (!response?.ok) return chatError.textContent = response?.error || "Chat gagal dikirim.";
    chatInput.value = "";
  });
  chatMessages.addEventListener("click", (event) => {
    const code = event.target.closest("[data-room-code]")?.dataset.roomCode;
    if (!code) return;
    elements.code.value = code;
    elements.code.focus();
    chatError.textContent = `Kode ${code} siap digunakan.`;
  });
  elements.start.addEventListener("click", () => roomAction("game:start"));
  elements.modePicker.addEventListener("click", (event) => {
    const mode = event.target.closest("[data-mode]")?.dataset.mode;
    if (mode) roomAction("room:mode", { mode });
  });
  elements.readyToggle.addEventListener("click", () => {
    const me = state.room?.players.find((player) => player.id === state.playerId);
    roomAction("room:ready", { ready: !me?.ready });
  });
  elements.capsaVote.addEventListener("click", (event) => {
    const rule = event.target.closest("[data-rule]")?.dataset.rule;
    if (rule) roomAction("capsa:vote", { rule });
  });
  elements.actions.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action) roomAction("game:action", { type: action, actionId: actionId() });
  });
  $("#raiseOpen").addEventListener("click", () => elements.raisePanel.classList.toggle("hidden"));
  elements.raiseAmount.addEventListener("input", () => { elements.raiseOutput.textContent = elements.raiseAmount.value; });
  $("#raiseConfirm").addEventListener("click", () => roomAction("game:action", { type: "raise", amount: Number(elements.raiseAmount.value), actionId: actionId() }));
  $("#drawCard").addEventListener("click", () => roomAction("game:action", { type: "draw", actionId: actionId() }));
  $("#minumanPlay").addEventListener("click", async () => {
    const [cardIndex] = state.selectedCards;
    if (cardIndex === undefined) return elements.notice.textContent = "Pilih satu kartu dahulu.";
    const response = await roomAction("game:action", { type: "play", cardIndex, actionId: actionId() });
    if (response?.ok) { state.selectedCards.clear(); render(); }
  });
  $("#capsaPass").addEventListener("click", () => roomAction("game:action", { type: "pass", actionId: actionId() }));
  $("#samgongReveal").addEventListener("click", () => roomAction("game:action", { type: "reveal", actionId: actionId() }));
  $("#capsaPlay").addEventListener("click", async () => {
    const selected = [...state.selectedCards].sort((a, b) => a - b);
    const response = await roomAction("game:action", { type: "play", cardIndexes: selected, actionId: actionId() });
    if (response?.ok) { state.selectedCards.clear(); render(); }
  });
  elements.handDock.addEventListener("click", (event) => {
    const cardIndex = event.target.closest("[data-card-index]")?.dataset.cardIndex;
    if (cardIndex === undefined) return;
    const index = Number(cardIndex);
    if (state.room.mode === "capsa-banting") {
      if (state.selectedCards.has(index)) state.selectedCards.delete(index);
      else if (state.selectedCards.size < 5) state.selectedCards.add(index);
      render();
    } else if (state.room.mode === "cangkulan") {
      if (state.selectedCards.has(index)) state.selectedCards.clear();
      else { state.selectedCards.clear(); state.selectedCards.add(index); }
      render();
    }
  });
  elements.copy.addEventListener("click", async () => { await navigator.clipboard?.writeText(state.room.code); elements.notice.textContent = "Kode room disalin."; });
  $("#leaveGame").addEventListener("click", () => leaveConfirm.showModal());
  $("#leaveRoom").addEventListener("click", () => leaveConfirm.showModal());
  $("#leaveConfirmButton").addEventListener("click", () => {
    allowLeave = true;
    localStorage.removeItem(storageKey);
    window.PokerMedia?.leave();
    location.reload();
  });
  window.addEventListener("beforeunload", (event) => {
    if (!state.room || allowLeave) return;
    event.preventDefault();
    event.returnValue = "";
  });
  socket.on("room:state", (room) => { state.room = room; render(); });
  socket.on("lobby:chat:message", addLobbyMessage);
  socket.on("lobby:chat:remove-room", ({ roomCode } = {}) => {
    for (let index = lobbyMessages.length - 1; index >= 0; index -= 1) {
      if (lobbyMessages[index].roomCode === roomCode) lobbyMessages.splice(index, 1);
    }
    renderLobbyChat();
  });
  socket.on("session:replaced", () => {
    localStorage.removeItem(storageKey);
    alert("Sesi dipindahkan ke perangkat atau tab lain.");
    location.reload();
  });
  socket.on("connect", async () => {
    const chat = await request("lobby:chat:join", { siteId });
    if (chat?.ok) { lobbyMessages.splice(0, lobbyMessages.length, ...chat.messages); renderLobbyChat(); }
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (!saved || state.room) return;
    const response = await request("room:reconnect", { code: saved.code, token: saved.token, siteId });
    if (!response?.ok) return localStorage.removeItem(storageKey);
    remember(response, saved.name);
    enter(response.room);
    window.PokerMedia?.configure({ socket, request, playerId: state.playerId });
  });
  socket.on("disconnect", () => { if (state.room) elements.notice.textContent = "Koneksi terputus. Mencoba menyambung kembali…"; });
  elements.name.value = localStorage.getItem("rw06_poker_name") || "";
  renderLobbyChat();
})();
