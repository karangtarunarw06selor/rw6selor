"use strict";

const $ = (id) => document.getElementById(id);
const query = new URLSearchParams(location.search);
const siteId = query.get("siteId") === "KT" || location.hostname.startsWith("karangtaruna.") ? "KT" : "MMS";

document.body.classList.toggle("kt", siteId === "KT");
$("brand").textContent = siteId === "KT" ? "KARANG TARUNA SELOR" : "MUDA MUDI SELOR";

const socket = io({ path: "/uno/socket.io" });
let session = JSON.parse(sessionStorage.getItem("unoSession") || "null");
let reconnecting = false;
let pendingWild = null;
let currentState = null;
const chatIds = new Set();

function toast(message) {
  $("toast").textContent = message;
  $("toast").style.display = "block";
  setTimeout(() => { $("toast").style.display = "none"; }, 2500);
}

function showRoom(roomCode = session?.roomCode) {
  $("lobby").hidden = true;
  $("room").hidden = false;
  if (roomCode) $("roomcode").textContent = roomCode;
}

function request(event, data = {}) {
  return new Promise((resolve) => socket.emit(event, data, resolve));
}

async function send(event, data = {}) {
  const response = await request(event, data);
  if (!response?.ok) {
    toast(response?.error || "Gagal memproses permintaan.");
    return null;
  }
  if (response.reconnectToken) {
    session = {
      roomCode: response.roomCode,
      playerId: response.playerId,
      reconnectToken: response.reconnectToken,
      siteId: response.siteId,
    };
    sessionStorage.setItem("unoSession", JSON.stringify(session));
    showRoom();
  }
  return response;
}

async function action(type, extra = {}) {
  const response = await send("game:action", { type, actionId: crypto.randomUUID(), ...extra });
  if (response) $("uno").checked = false;
}

socket.on("connect", async () => {
  if (!session || reconnecting) return;
  reconnecting = true;
  const response = await request("room:reconnect", session);
  reconnecting = false;
  if (response?.ok) showRoom();
  else {
    session = null;
    sessionStorage.removeItem("unoSession");
  }
});

$("openJoin").addEventListener("click", () => { $("joinbox").hidden = false; });
$("create").addEventListener("click", () => send("room:create", { name: $("name").value, siteId }));
$("join").addEventListener("click", () => send("room:join", { name: $("name").value, siteId, roomCode: $("code").value }));
$("start").addEventListener("click", () => send("game:start"));
$("rematch").addEventListener("click", () => send("game:rematch"));
$("draw").addEventListener("click", () => action("draw"));
$("pass").addEventListener("click", () => action("pass"));
$("leave").addEventListener("click", async () => {
  if (!confirm("Keluar dari ruang? Sesi tidak bisa dipulihkan.")) return;
  await window.UnoMedia?.leave();
  await request("room:leave");
  sessionStorage.removeItem("unoSession");
  location.href = `/uno/?siteId=${siteId}`;
});

function appendChat(item) {
  if (!item?.id || chatIds.has(item.id)) return;
  chatIds.add(item.id);
  const message = document.createElement("p");
  const author = document.createElement("b");
  const text = document.createElement("span");
  author.textContent = `${item.name}:`;
  text.textContent = item.text;
  message.append(author, text);
  $("chat-messages").append(message);
  $("chat-messages").scrollTop = $("chat-messages").scrollHeight;
}

$("chat-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = $("chat-input").value.trim();
  if (!text) return;
  const response = await send("chat:send", { text });
  if (response) $("chat-input").value = "";
});

socket.on("chat:message", appendChat);

const cardClass = (card) => card.color || "wild";
const actionAssets = {
  skip: "assets/res/block.png?v=2",
  reverse: "assets/res/inverse.png?v=2",
  draw2: "assets/res/two_cards.png?v=2",
  wild4: "assets/res/four_cards.png?v=2",
};

function renderCard(node, card) {
  node.className = `uno-card ${cardClass(card)}`;
  node.setAttribute("aria-label", ({ skip: "Skip", reverse: "Reverse", draw2: "Ambil dua", wild: "Wild", wild4: "Ambil empat" }[card.value] || card.value));
  if (card.value === "wild") {
    const wheel = document.createElement("span");
    wheel.className = "wild-wheel";
    node.replaceChildren(wheel);
    return;
  }
  if (actionAssets[card.value]) {
    const icon = document.createElement("img");
    icon.className = "action-icon";
    icon.src = actionAssets[card.value];
    icon.alt = "";
    node.replaceChildren(icon);
    return;
  }
  node.textContent = card.value;
}

const song = $("song");
$("sound").addEventListener("click", async () => {
  if (song.paused) {
    try {
      await song.play();
      $("sound").classList.add("playing");
      $("sound").setAttribute("aria-label", "Matikan musik");
    } catch {
      toast("Browser memblokir musik. Coba tekan lagi.");
    }
  } else {
    song.pause();
    $("sound").classList.remove("playing");
    $("sound").setAttribute("aria-label", "Nyalakan musik");
  }
});

function isLegal(card, state) {
  if (!card.color) {
    if (card.value !== "wild4") return true;
    return !state.myHand.some((held) => held.id !== card.id && held.color === state.activeColor);
  }
  return card.color === state.activeColor || card.value === state.topCard?.value;
}

socket.on("room:state", (state) => {
  currentState = state;
  showRoom();
  document.body.classList.toggle("game-screen", state.phase !== "waiting");
  document.body.classList.toggle("lobby-screen", state.phase === "waiting");
  const myTurn = state.phase === "playing" && !state.spectator && state.turnPlayerId === state.myId;
  const activePlayers = state.players.filter((player) => !player.spectator);

  const mediaTiles = new Map([...$("players").querySelectorAll(".player-media")].map((node) => [node.dataset.playerId, node]));
  $("players").replaceChildren(...state.players.map((player) => {
    const node = document.createElement("div");
    node.className = `player${state.turnPlayerId === player.id ? " active" : ""}`;
    node.dataset.playerId = player.id;
    const media = mediaTiles.get(player.id) || document.createElement("div");
    media.className = "player-media";
    media.dataset.playerId = player.id;
    const label = document.createElement("div");
    label.className = "player-label";
    label.textContent = `${player.name}${player.id === state.hostId ? " • HOST" : ""}${player.spectator ? " • PENONTON" : ""} — ${player.cardCount} kartu`;
    const status = document.createElement("small");
    status.className = "media-status";
    status.textContent = `${player.media?.voice ? "🎙" : "🔇"} ${player.media?.video ? "📷" : "Kamera off"}${player.connected ? "" : " • Terputus"}`;
    node.append(media, label, status);
    return node;
  }));
  (state.chatHistory || []).forEach(appendChat);
  window.UnoMedia?.syncPlayers(state.players, state.myId);

  $("notice").textContent = state.spectator
    ? "Anda masuk saat match berjalan. Anda ikut pada rematch berikutnya."
    : state.phase === "waiting" ? "Menunggu host memulai (2–8 pemain)." : "";
  $("start").hidden = !(state.phase === "waiting" && state.myId === state.hostId && activePlayers.length >= 2);
  $("rematch").hidden = !(state.phase === "finished" && state.myId === state.hostId);
  $("table").hidden = state.phase === "waiting";
  $("turn").textContent = state.phase === "finished"
    ? `Pemenang: ${state.players.find((player) => player.id === state.winnerId)?.name || "-"}`
    : myTurn ? "Giliran Anda" : `Giliran ${state.players.find((player) => player.id === state.turnPlayerId)?.name || "-"}`;

  const standings = $("standings");
  standings.hidden = state.phase !== "finished";
  standings.replaceChildren(...state.standings.map((id, index) => {
    const item = document.createElement("li");
    item.textContent = `${index + 1}. ${state.players.find((player) => player.id === id)?.name || "Pemain"}`;
    return item;
  }));

  if (state.topCard) {
    renderCard($("discard"), state.topCard);
    $("discard").classList.add("discard-card");
  }
  $("draw").querySelector("span").textContent = `STACK · ${state.stockCount}`;
  $("draw").disabled = !myTurn || state.canPass;
  $("pass").hidden = !state.canPass;
  $("pass").disabled = !myTurn;
  $("uno").disabled = !myTurn;

  $("hand").replaceChildren(...state.myHand.map((card) => {
    const button = document.createElement("button");
    renderCard(button, card);
    if (card.id === state.drawnCardId) button.classList.add("drawn");
    button.disabled = !myTurn || (state.canPass && card.id !== state.drawnCardId) || !isLegal(card, state);
    button.addEventListener("click", () => {
      if (!card.color) {
        pendingWild = card.id;
        $("colors").hidden = false;
      } else action("play", { cardId: card.id, uno: $("uno").checked });
    });
    return button;
  }));
});

document.querySelectorAll("#colors button").forEach((button) => button.addEventListener("click", () => {
  action("play", { cardId: pendingWild, color: button.dataset.color, uno: $("uno").checked });
  $("colors").hidden = true;
  pendingWild = null;
}));

window.UnoGame = { socket, request, toast, getState: () => currentState };
