"use strict";

(() => {
  const $ = (selector) => document.querySelector(selector);
  const socket = io({ path: "/poker/socket.io", transports: ["websocket", "polling"] });
  const siteId = /karangtaruna/i.test(location.hostname + location.pathname) ? "KT" : "MMS";
  document.body.dataset.site = siteId;

  const elements = {
    lobby: $("#lobby"), game: $("#game"), name: $("#playerName"), code: $("#roomCode"), error: $("#lobbyError"),
    copy: $("#copyCode"), seats: $("#seats"), board: $("#board"), pot: $("#pot"), phase: $("#phase"), handDock: $("#handDock"), notice: $("#notice"),
    start: $("#startGame"), modePicker: $("#modePicker"), capsaVote: $("#capsaVote"), voteStatus: $("#voteStatus"), actions: $("#actions"), cangkulanActions: $("#cangkulanActions"), capsaActions: $("#capsaActions"), checkCall: $("#checkCall"), raisePanel: $("#raisePanel"),
    raiseAmount: $("#raiseAmount"), raiseOutput: $("#raiseOutput"),
  };
  const state = { room: null, playerId: null, token: null, busy: false, selectedCards: new Set() };
  const storageKey = `rw06_poker_session_${siteId}`;
  const suit = { c: "♣", d: "♦", h: "♥", s: "♠" };
  const phaseLabel = { waiting: "LOBBY", playing: "BERMAIN", preflop: "PRE-FLOP", flop: "FLOP", turn: "TURN", river: "RIVER", finished: "RONDE SELESAI" };
  const modeLabel = { holdem: "TEXAS HOLD’EM", "capsa-banting": "CAPSA BANTING", cangkulan: "CANGKULAN" };
  let countdownTimer = null;

  function request(event, payload = {}) {
    return new Promise((resolve) => socket.emit(event, payload, resolve));
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
    elements.game.classList.remove("hidden");
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
    const winners = room.lastResult.winners.map((winner) => `${winner.name}${winner.amount ? ` +${winner.amount}` : ""}${winner.hand ? ` · ${winner.hand}` : ""}`).join(" · ");
    return `Pemenang: ${winners}`;
  }
  function renderSeat(player, index) {
    const classes = ["seat"];
    if (player.id === state.playerId) classes.push("me");
    if (player.id === state.room.turnId) classes.push("turn");
    if (player.media?.audio || player.media?.video) classes.push("media-on");
    const initials = escapeHtml(player.name.slice(0, 2).toUpperCase());
    const cards = player.hole || player.hand || [];
    const seatCards = ["cangkulan", "capsa-banting"].includes(state.room.mode) ? [] : cards;
    const hole = seatCards.length ? `<div class="hole">${seatCards.map((card) => `<span>${cardHtml(card)}</span>`).join("")}</div>` : "";
    return `<article class="${classes.join(" ")}" data-player-id="${player.id}" style="--seat:${index}">
      ${hole}<div class="seat-box">
        <span class="avatar" data-video-slot="${player.id}"><span>${initials}</span><i class="voice-dot"></i></span>
        <b class="seat-name">${escapeHtml(player.name)}${player.folded ? " · FOLD" : player.allIn ? " · ALL-IN" : ""}</b>
        <span class="seat-stack">${state.room.mode === "holdem" ? `♢ ${player.stack}` : `${player.cardCount ?? cards.length} KARTU`}</span>
        ${state.room.mode === "holdem" && player.id === state.room.dealerId ? `<i class="dealer">${state.room.players.length >= 3 ? "BANDAR" : "D"}</i>` : ""}
        ${player.bet ? `<span class="seat-bet">BET ${player.bet}</span>` : ""}
      </div>
    </article>`;
  }
  function escapeHtml(value) {
    const node = document.createElement("span");
    node.textContent = String(value);
    return node.innerHTML;
  }
  function render() {
    const room = state.room;
    if (!room) return;
    elements.copy.textContent = room.code;
    elements.pot.textContent = room.mode ? modeLabel[room.mode] : "PILIH MODE";
    elements.phase.textContent = phaseLabel[room.phase] || room.phase.toUpperCase();
    if (room.mode === "cangkulan") elements.board.innerHTML = `${cardHtml(room.topDiscard)}<span class="stock-count">STOK ${room.stockCount}</span>`;
    else if (room.mode === "capsa-banting") elements.board.innerHTML = room.currentPlay ? room.currentPlay.cards.map(cardHtml).join("") : '<span class="stock-count">BUKA PUTARAN</span>';
    else elements.board.innerHTML = [...(room.board || []), ...Array(Math.max(0, 5 - (room.board || []).length)).fill(undefined)].map(cardHtml).join("");
    elements.seats.innerHTML = orderedPlayers(room).map(renderSeat).join("");
    const me = room.players.find((player) => player.id === state.playerId);
    const dockHand = ["cangkulan", "capsa-banting"].includes(room.mode) ? (me?.hand || []) : [];
    elements.handDock.classList.toggle("hidden", !dockHand.length);
    elements.handDock.classList.toggle("capsa-hand", room.mode === "capsa-banting");
    elements.handDock.innerHTML = dockHand.map((card, cardIndex) => `<button data-card-index="${cardIndex}" class="${state.selectedCards.has(cardIndex) ? "selected" : ""}" ${room.turnId === state.playerId && card ? "" : "disabled"}>${cardHtml(card)}</button>`).join("");
    const isHost = room.hostId === state.playerId;
    const mayChooseMode = isHost && room.players.length >= 2 && ["waiting", "finished"].includes(room.phase);
    elements.modePicker.classList.toggle("hidden", !mayChooseMode);
    elements.modePicker.querySelectorAll("[data-mode]").forEach((button) => button.classList.toggle("selected", button.dataset.mode === room.mode));
    const voting = room.mode === "capsa-banting" && ["waiting", "finished"].includes(room.phase);
    elements.capsaVote.classList.toggle("hidden", !voting);
    elements.capsaVote.querySelectorAll("[data-rule]").forEach((button) => button.classList.toggle("selected", button.dataset.rule === room.myVote));
    elements.voteStatus.textContent = room.voteResult ? `Hasil: ${room.voteResult.toUpperCase()}` : `${room.voteCount}/${room.players.length} pemain sudah vote`;
    elements.start.classList.toggle("hidden", !isHost || !room.mode || (room.mode === "capsa-banting" && !room.voteResult) || !["waiting", "finished"].includes(room.phase));
    elements.start.textContent = room.phase === "finished" ? "Ronde Berikutnya" : `Mulai ${modeLabel[room.mode] || "Permainan"}`;
    const myTurn = room.turnId === state.playerId && ["preflop", "flop", "turn", "river"].includes(room.phase);
    elements.actions.classList.toggle("hidden", !myTurn);
    const cangkulanTurn = room.mode === "cangkulan" && room.phase === "playing" && room.turnId === state.playerId;
    elements.cangkulanActions.classList.toggle("hidden", !cangkulanTurn);
    const capsaTurn = room.mode === "capsa-banting" && room.phase === "playing" && room.turnId === state.playerId;
    elements.capsaActions.classList.toggle("hidden", !capsaTurn);
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
      const ownTurn = myTurn || cangkulanTurn || capsaTurn;
      elements.notice.textContent = resultText(room) || (!room.mode ? (isHost ? "Pilih mode setelah pemain lain bergabung." : "Menunggu host memilih mode.") : ownTurn ? `Giliranmu. Pilih aksi${timer}.` : room.turnId ? `Giliran ${room.players.find((p) => p.id === room.turnId)?.name || "pemain"}${timer}.` : `Mode ${modeLabel[room.mode]} dipilih.`);
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
  elements.start.addEventListener("click", () => roomAction("game:start"));
  elements.modePicker.addEventListener("click", (event) => {
    const mode = event.target.closest("[data-mode]")?.dataset.mode;
    if (mode) roomAction("room:mode", { mode });
  });
  elements.capsaVote.addEventListener("click", (event) => {
    const rule = event.target.closest("[data-rule]")?.dataset.rule;
    if (rule) roomAction("capsa:vote", { rule });
  });
  elements.actions.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action) roomAction("game:action", { type: action, actionId: crypto.randomUUID() });
  });
  $("#raiseOpen").addEventListener("click", () => elements.raisePanel.classList.toggle("hidden"));
  elements.raiseAmount.addEventListener("input", () => { elements.raiseOutput.textContent = elements.raiseAmount.value; });
  $("#raiseConfirm").addEventListener("click", () => roomAction("game:action", { type: "raise", amount: Number(elements.raiseAmount.value), actionId: crypto.randomUUID() }));
  $("#drawCard").addEventListener("click", () => roomAction("game:action", { type: "draw", actionId: crypto.randomUUID() }));
  $("#capsaPass").addEventListener("click", () => roomAction("game:action", { type: "pass", actionId: crypto.randomUUID() }));
  $("#capsaPlay").addEventListener("click", async () => {
    const selected = [...state.selectedCards].sort((a, b) => a - b);
    await roomAction("game:action", { type: "play", cardIndexes: selected, actionId: crypto.randomUUID() });
    state.selectedCards.clear();
    render();
  });
  elements.handDock.addEventListener("click", (event) => {
    const cardIndex = event.target.closest("[data-card-index]")?.dataset.cardIndex;
    if (cardIndex === undefined) return;
    const index = Number(cardIndex);
    if (state.room.mode === "capsa-banting") {
      if (state.selectedCards.has(index)) state.selectedCards.delete(index);
      else if (state.selectedCards.size < 5) state.selectedCards.add(index);
      render();
    } else roomAction("game:action", { type: "play", cardIndex: index, actionId: crypto.randomUUID() });
  });
  elements.copy.addEventListener("click", async () => { await navigator.clipboard?.writeText(state.room.code); elements.notice.textContent = "Kode room disalin."; });
  $("#leaveGame").addEventListener("click", () => { localStorage.removeItem(storageKey); window.PokerMedia?.leave(); location.reload(); });
  socket.on("room:state", (room) => { state.room = room; render(); });
  socket.on("session:replaced", () => {
    localStorage.removeItem(storageKey);
    alert("Sesi dipindahkan ke perangkat atau tab lain.");
    location.reload();
  });
  socket.on("connect", async () => {
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
})();
