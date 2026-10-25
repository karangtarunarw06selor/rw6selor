(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const socket = io({ path: "/tebak-gambar/socket.io" });
  const siteId = document.body.dataset.site || "MMS";
  const sessionKey = `guess-picture-session:${siteId}`;
  const state = { playerId: null, room: null, secret: null, activeClue: 0, drawing: false, points: [], lastStatus: null, correctShown: null };
  const canvas = $("#clue-canvas"), context = canvas.getContext("2d");
  const toast = (text) => { $("#toast").textContent = text; $("#toast").classList.add("show"); setTimeout(() => $("#toast").classList.remove("show"), 2200); };
  const saveSession = (reply) => sessionStorage.setItem(sessionKey, JSON.stringify({ code: reply.room.code, playerId: reply.playerId, reconnectToken: reply.reconnectToken }));
  const isDrawer = () => state.room?.drawerId === state.playerId;
  const currentPlayer = () => state.room?.players.find((player) => player.id === state.playerId);
  const redraw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineCap = "round"; context.lineJoin = "round";
    for (const stroke of state.room?.strokes?.[state.activeClue] || []) {
      context.strokeStyle = stroke.color; context.lineWidth = stroke.size; context.beginPath();
      stroke.points.forEach(([x, y], index) => index ? context.lineTo(x * canvas.width, y * canvas.height) : context.moveTo(x * canvas.width, y * canvas.height)); context.stroke();
    }
    $("#canvas-note").hidden = Boolean(state.room?.strokes?.[state.activeClue]?.length);
  };
  const renderTabs = () => {
    $("#clue-tabs").innerHTML = [0, 1, 2, 3].map((index) => `<button type="button" class="clue-tab ${state.activeClue === index ? "active" : ""}" data-clue="${index}" ${index >= (state.room?.clueCount || 0) ? "disabled" : ""}>Clue ${index + 1}</button>`).join("");
    $("#clue-tabs").querySelectorAll("[data-clue]").forEach((button) => button.addEventListener("click", () => { state.activeClue = Number(button.dataset.clue); renderTabs(); redraw(); }));
  };
  const renderPlayers = () => {
    const room = state.room; if (!room) return;
    $("#lobby-players").innerHTML = room.players.map((player, index) => `<article class="player-card ${player.connected ? "" : "offline"}"><b>${player.name}</b><small>${index === 0 ? "HOST" : "PEMAIN"}</small></article>`).join("");
    $("#scoreboard").innerHTML = [...room.players].sort((a, b) => b.score - a.score).map((player) => `<div class="score-row ${player.id === room.drawerId ? "drawer" : ""}"><b>${player.name}${player.id === state.playerId ? " · Kamu" : ""}</b><strong>${player.score}</strong><small>${player.id === room.drawerId ? "Sedang menggambar" : `${player.wins} jawaban tercepat`}${player.connected ? "" : " · offline"}</small></div>`).join("");
  };
  const render = () => {
    const room = state.room; if (!room) return;
    const waiting = room.status === "waiting";
    $("#welcome").hidden = true; $("#lobby").hidden = !waiting; $("#game").hidden = waiting;
    $("#room-display").textContent = room.code; renderPlayers();
    $("#start-game").hidden = room.hostId !== state.playerId; $("#lobby-note").hidden = room.hostId === state.playerId;
    if (waiting) return;
    const drawer = room.players.find((player) => player.id === room.drawerId);
    $("#round-label").textContent = `RONDE ${Math.min(room.round, room.totalRounds)} / ${room.totalRounds}`;
    $("#drawer-label").textContent = room.status === "finished" ? "Permainan selesai" : `${drawer?.name || "Pemain"} sedang menggambar`;
    $("#draw-tools").hidden = !isDrawer() || room.status !== "playing";
    $("#guess-form").hidden = isDrawer() || room.status !== "playing";
    $("#report-round").hidden = isDrawer() || room.status !== "playing";
    $("#next-clue").disabled = room.clueCount >= 4;
    $("#secret-panel").hidden = !isDrawer() || !state.secret || room.status !== "playing";
    $("#moderation").hidden = room.hostId !== state.playerId || room.reports < Math.max(2, Math.ceil((room.players.length - 1) / 2));
    $("#round-result").hidden = !["result", "finished"].includes(room.status);
    if (room.status === "playing" && $("#correct-dialog").open) $("#correct-dialog").close();
    if (room.status === "result") {
      const winner = room.players.find((player) => player.id === room.result?.winnerId);
      $("#round-result").innerHTML = winner ? `<b>${winner.name} tercepat!</b><p>${room.answerReveal}</p><small>${(room.result.elapsedMs / 1000).toFixed(3)} detik · +${room.result.guessPoints}; penggambar ${room.result.drawerPoints > 0 ? "+" : ""}${room.result.drawerPoints}</small>` : `<b>Tidak tertebak</b><p>${room.answerReveal}</p><small>Ronde ini tanpa poin.</small>`;
      const resultKey = `${room.round}:${room.result?.winnerId || "none"}`;
      if (winner && state.correctShown !== resultKey) {
        state.correctShown = resultKey;
        $("#correct-player").textContent = winner.name;
        $("#correct-answer").textContent = room.answerReveal;
        const seconds = (room.result.elapsedMs / 1000).toLocaleString("id-ID", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
        $("#correct-time").textContent = `Waktu tercepat ${seconds} detik · Bonus +${room.result.guessPoints} poin`;
        $("#correct-dialog").showModal();
        $("#correct-dialog").focus();
      }
    } else if (room.status === "finished") {
      const winner = room.players.find((player) => player.id === room.winnerId); $("#round-result").innerHTML = `<b>${winner?.name || "Tidak ada"} menang!</b><p>Skor tertinggi: ${winner?.score || 0}</p>`;
    }
    renderTabs(); redraw();
  };
  const showSecret = (secret) => {
    state.secret = secret; $("#secret-image").src = secret.image; $("#secret-answer").textContent = secret.answer; $("#secret-category").textContent = secret.category; $("#secret-forbidden").textContent = secret.forbidden.join(", "); $("#secret-examples").textContent = `Contoh clue aman: ${secret.examples.join(" · ")}`; $("#secret-panel").hidden = false;
  };
  const reconnect = () => {
    const saved = JSON.parse(sessionStorage.getItem(sessionKey) || "null"); if (!saved) return;
    socket.emit("room:reconnect", { ...saved, siteId }, (reply) => { if (!reply?.ok) return sessionStorage.removeItem(sessionKey); state.playerId = reply.playerId; state.room = reply.room; saveSession(reply); render(); toast("Masuk kembali ke room."); });
  };
  $("#room-form").addEventListener("submit", (event) => {
    event.preventDefault(); const action = event.submitter?.value; const name = $("#player-name").value.trim();
    if (action === "join" && $("#code-wrap").hidden) { $("#code-wrap").hidden = false; $("#room-code").focus(); return; }
    socket.emit(action === "create" ? "room:create" : "room:join", { name, code: $("#room-code").value, siteId }, (reply) => { $("#room-error").textContent = reply?.ok ? "" : reply?.error || "Gagal masuk room."; if (!reply?.ok) return; state.playerId = reply.playerId; state.room = reply.room; saveSession(reply); render(); });
  });
  $("#start-game").addEventListener("click", () => socket.emit("game:start", {}, (reply) => { if (!reply?.ok) toast(reply.error); }));
  $("#room-display").addEventListener("click", () => navigator.clipboard?.writeText(state.room?.code));
  $("#close-correct").addEventListener("click", () => $("#correct-dialog").close());
  $("#next-clue").addEventListener("click", () => socket.emit("clue:unlock", {}, (reply) => { if (!reply?.ok) toast(reply.error); else { state.activeClue = state.room.clueCount; } }));
  $("#clear-clue").addEventListener("click", () => socket.emit("clue:clear", { clueIndex: state.activeClue }));
  $("#hide-secret").addEventListener("click", () => { $("#secret-panel").hidden = true; });
  $("#skip-question").addEventListener("click", () => socket.emit("round:skip", {}, (reply) => { if (!reply?.ok) toast(reply.error); }));
  $("#report-round").addEventListener("click", () => socket.emit("round:report", {}, (reply) => toast(reply?.ok ? "Laporan dikirim ke host." : "Laporan gagal.")));
  $("#moderation").querySelectorAll("[data-mod]").forEach((button) => button.addEventListener("click", () => socket.emit("round:moderate", { action: button.dataset.mod })));
  $("#guess-form").addEventListener("submit", (event) => { event.preventDefault(); const input = $("#guess-input"); socket.emit("guess:submit", { text: input.value }, (reply) => { $("#guess-feedback").textContent = reply?.correct ? "Benar!" : reply?.error || "Belum tepat."; if (reply?.ok) input.value = ""; }); });
  const point = (event) => { const box = canvas.getBoundingClientRect(), touch = event.touches?.[0] || event; return [(touch.clientX - box.left) / box.width, (touch.clientY - box.top) / box.height]; };
  const startDraw = (event) => { if (!isDrawer() || state.room?.status !== "playing") return; event.preventDefault(); state.drawing = true; state.points = [point(event)]; };
  const moveDraw = (event) => { if (!state.drawing) return; event.preventDefault(); state.points.push(point(event)); const last = state.points.slice(-2); context.strokeStyle = $("#draw-color").value; context.lineWidth = Number($("#draw-size").value); context.lineCap = "round"; context.beginPath(); context.moveTo(last[0][0] * canvas.width, last[0][1] * canvas.height); context.lineTo(last.at(-1)[0] * canvas.width, last.at(-1)[1] * canvas.height); context.stroke(); };
  const endDraw = () => { if (!state.drawing) return; state.drawing = false; if (state.points.length >= 2) socket.emit("clue:stroke", { clueIndex: state.activeClue, points: state.points.slice(0, 100), color: $("#draw-color").value, size: Number($("#draw-size").value) }); state.points = []; };
  canvas.addEventListener("pointerdown", startDraw); canvas.addEventListener("pointermove", moveDraw); window.addEventListener("pointerup", endDraw);
  socket.on("room:state", (room) => { state.room = room; if (state.lastStatus === "playing" && room.status !== "playing") state.secret = null; state.lastStatus = room.status; render(); });
  socket.on("round:secret", showSecret);
  socket.on("clue:stroke", (stroke) => { if (!state.room) return; state.room.strokes[stroke.clueIndex].push(stroke); if (stroke.clueIndex === state.activeClue) redraw(); });
  socket.on("clue:clear", ({ clueIndex }) => { if (!state.room) return; state.room.strokes[clueIndex] = []; if (clueIndex === state.activeClue) redraw(); });
  socket.on("connect", reconnect);
  setInterval(() => { if (!state.room?.deadline) return $("#timer").textContent = "--:--"; const seconds = Math.max(0, Math.ceil((state.room.deadline - Date.now()) / 1000)); $("#timer").textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`; }, 250);
  window.guessGame = { socket, state, toast, currentPlayer };
  if (socket.connected) reconnect();
})();
