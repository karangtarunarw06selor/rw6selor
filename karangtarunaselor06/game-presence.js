(() => {
  const script = document.currentScript;
  const siteId = String(script?.dataset.site || "MMS").toUpperCase() === "KT" ? "KT" : "MMS";
  const gameId = String(script?.dataset.game || "").toLowerCase();
  const chatMode = script?.dataset.chat || "";
  if (!gameId) return;

  const key = "rw06_game_presence_id";
  let clientId = localStorage.getItem(key);
  if (!clientId) {
    clientId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(key, clientId);
  }

  const name = localStorage.getItem("pocket_clash_player_name") || localStorage.getItem("playerName") || "Pemain";
  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  const socket = new WebSocket(`${protocol}//${location.host}/billiard-realtime`);
  const style = document.createElement("style");
  style.textContent = ".game-online-badge{position:fixed;top:max(10px,env(safe-area-inset-top));right:10px;z-index:10000;padding:7px 11px;border-radius:999px;background:rgba(3,12,10,.88);border:1px solid rgba(255,255,255,.22);color:#fff;font:700 12px/1.2 system-ui;box-shadow:0 6px 20px rgba(0,0,0,.25)}.game-online-badge i{display:inline-block;width:7px;height:7px;margin-right:6px;border-radius:50%;background:#35dc78}.game-chat{margin-top:18px;padding:12px;border:1px solid rgba(255,255,255,.16);border-radius:14px;background:rgba(0,0,0,.22);color:#fff}.game-chat h2{margin:0 0 8px;font:800 14px system-ui}.game-chat-log{height:130px;overflow:auto;padding:8px;border-radius:10px;background:rgba(0,0,0,.25);font:13px/1.4 system-ui}.game-chat-log p{margin:0 0 6px;overflow-wrap:anywhere}.game-chat-log b{color:#ffd650}.game-chat form{display:flex;gap:6px;margin-top:8px}.game-chat input{min-width:0;flex:1;margin:0!important;padding:9px 10px!important;text-transform:none!important}.game-chat button{width:auto!important;flex:none;margin:0!important;padding:9px 12px!important;font-size:13px!important}.game-room-chat{position:fixed;right:10px;bottom:10px;z-index:9999;width:min(310px,calc(100vw - 20px));margin:0;box-shadow:0 10px 30px rgba(0,0,0,.4)}@media(max-width:600px){.game-room-chat{position:relative;right:auto;bottom:auto;width:auto;margin:12px}}";
  document.head.appendChild(style);

  const badge = document.createElement("div");
  badge.className = "game-online-badge";
  badge.innerHTML = "<i></i><span>0 online</span>";
  document.body.appendChild(badge);

  let log = null;
  let form = null;
  if (chatMode) {
    const panel = document.createElement("section");
    panel.className = `game-chat ${chatMode === "room" ? "game-room-chat" : ""}`;
    panel.innerHTML = `<h2>${chatMode === "room" ? "Chat Room" : "Chat Publik"}</h2><div class="game-chat-log" aria-live="polite"></div><form><input maxlength="240" placeholder="Tulis pesan…" aria-label="Pesan"><button type="submit">Kirim</button></form>`;
    const mount = chatMode === "lobby" ? document.querySelector(".lobbyCard") : document.body;
    mount?.appendChild(panel);
    log = panel.querySelector(".game-chat-log");
    form = panel.querySelector("form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = form.querySelector("input");
      const message = input.value.trim();
      if (!message || socket.readyState !== WebSocket.OPEN) return;
      socket.send(JSON.stringify({ type: chatMode === "room" ? "room_chat_send" : "lobby_chat_send", message }));
      input.value = "";
    });
  }

  function appendMessage(message) {
    if (!log) return;
    const row = document.createElement("p");
    const sender = document.createElement("b");
    sender.textContent = `${message.username || "Pemain"}: `;
    row.append(sender, document.createTextNode(message.message || ""));
    log.appendChild(row);
    while (log.children.length > 50) log.firstChild.remove();
    log.scrollTop = log.scrollHeight;
  }

  socket.addEventListener("open", () => {
    socket.send(JSON.stringify({ type: "presence_join", site_id: siteId, game_id: gameId, client_id: clientId, username: name }));
    if (chatMode === "room") {
      const params = new URLSearchParams(location.search);
      const roomCode = params.get("room_code") || params.get("room") || localStorage.getItem("pocket_clash_room_code") || "";
      const playerKey = params.get("player_key") || localStorage.getItem("pocket_clash_player_key") || localStorage.getItem("billiard_player_key") || "";
      if (roomCode && playerKey) socket.send(JSON.stringify({ type: "join_room", site_id: siteId, room_code: roomCode, player_key: playerKey }));
    }
  });
  socket.addEventListener("message", (event) => {
    let data;
    try { data = JSON.parse(event.data); } catch { return; }
    if (data.type === "presence_update" && data.game_id === gameId) badge.querySelector("span").textContent = `${data.online_count} online`;
    if (data.type === "presence_history") data.messages?.forEach(appendMessage);
    if (data.type === "lobby_chat" || data.type === "room_chat") appendMessage(data);
  });
})();
