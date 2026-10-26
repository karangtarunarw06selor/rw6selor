(() => {
  "use strict";
  const game = window.guessGame, socket = game.socket;
  const dialog = document.querySelector("#media-dialog"), dock = document.querySelector("#video-dock"), error = document.querySelector("#media-error");
  const peers = new Map(); let stream = null, watchingCode = null, watchTask = null;
  let rtcConfig = { iceServers: [{ urls: "stun:stun.cloudflare.com:3478" }, { urls: "stun:stun.l.google.com:19302" }] };
  const tile = (id, name, local = false) => {
    const scope = game.state.room?.status === "waiting" ? "#lobby-players" : "#scoreboard";
    const slot = document.querySelector(`${scope} [data-player="${CSS.escape(id)}"] .player-camera`);
    let node = document.querySelector(`.video-tile[data-peer="${CSS.escape(id)}"]`);
    if (!node) { node = document.createElement("div"); node.className = "video-tile"; node.dataset.peer = id; node.title = name; node.innerHTML = `<video autoplay playsinline ${local ? "muted" : ""}></video>`; }
    (slot || dock).append(node); return node;
  };
  const removePeer = (id) => {
    peers.get(id)?.close(); peers.delete(id);
    document.querySelector(`.video-tile[data-peer="${CSS.escape(id)}"]`)?.remove();
    document.querySelector(`audio[data-peer="${CSS.escape(id)}"]`)?.remove();
  };
  const offerPeer = async (peer, id) => {
    if (peer.offerStarted) return;
    peer.offerStarted = true;
    try { const description = await peer.createOffer(); await peer.setLocalDescription(description); socket.emit("media:signal", { targetId: id, signal: { description: peer.localDescription } }); }
    catch { peer.offerStarted = false; }
  };
  const createPeer = (id, name, offerer = false) => {
    const existing = peers.get(id);
    if (existing) {
      stream?.getTracks().forEach((track) => { if (!existing.getSenders().some((sender) => sender.track?.kind === track.kind)) existing.addTrack(track, stream); });
      if (offerer) offerPeer(existing, id);
      return existing;
    }
    const peer = new RTCPeerConnection(rtcConfig); peers.set(id, peer); peer.pendingCandidates = [];
    if (stream) stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    else { peer.addTransceiver("audio", { direction: "recvonly" }); peer.addTransceiver("video", { direction: "recvonly" }); }
    peer.ontrack = ({ track, streams }) => {
      if (track.kind === "video") tile(id, name).querySelector("video").srcObject = streams[0];
      else {
        let audio = document.querySelector(`audio[data-peer="${CSS.escape(id)}"]`);
        if (!audio) { audio = document.createElement("audio"); audio.dataset.peer = id; audio.autoplay = true; audio.playsInline = true; dock.append(audio); }
        audio.srcObject = streams[0];
      }
    };
    peer.onicecandidate = ({ candidate }) => { if (candidate) socket.emit("media:signal", { targetId: id, signal: { candidate } }); };
    peer.onconnectionstatechange = () => { if (["failed", "closed"].includes(peer.connectionState)) removePeer(id); };
    if (offerer) offerPeer(peer, id);
    return peer;
  };
  const request = (event, data = {}) => new Promise((resolve) => socket.emit(event, data, resolve));
  const watch = async () => {
    const room = game.state.room; if (!room || watchingCode === room.code || watchTask) return;
    watchTask = (async () => {
      const config = await request("media:config"); if (!config?.ok || !game.state.room) return;
      rtcConfig = { iceServers: config.iceServers };
      const reply = await request("media:watch"); if (!reply?.ok || !game.state.room) return;
      watchingCode = game.state.room.code;
      for (const person of reply.peers || []) createPeer(person.id, person.name, true);
    })().finally(() => { watchTask = null; });
    await watchTask;
  };
  const stopBroadcast = () => {
    stream?.getTracks().forEach((track) => track.stop()); stream = null;
    const ownId = game.currentPlayer()?.id || "local"; document.querySelector(`.video-tile[data-peer="${CSS.escape(ownId)}"]`)?.remove();
    peers.forEach((_peer, id) => removePeer(id)); socket.emit("media:update", { voice: false, video: false }, () => { watchingCode = null; watch(); });
    if (dialog.open) dialog.close();
  };
  const start = async (video) => {
    error.textContent = "";
    try {
      const config = await request("media:config"); if (!config?.ok) throw new Error(config?.error || "Konfigurasi media tidak tersedia.");
      rtcConfig = { iceServers: config.iceServers };
      stream?.getTracks().forEach((track) => track.stop()); stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, video: video ? { width: { ideal: 640 }, height: { ideal: 360 }, facingMode: "user" } : false });
      peers.forEach((_peer, id) => removePeer(id));
      const own = game.currentPlayer(); if (video) tile(own?.id || "local", `${own?.name || "Kamu"} · Kamu`, true).querySelector("video").srcObject = stream;
      socket.emit("media:update", { voice: true, video }, (reply) => {
        if (!reply?.ok) { error.textContent = reply?.error || "Media gagal."; return stopBroadcast(); }
        for (const person of reply.peers || []) createPeer(person.id, person.name, true);
        dialog.close(); game.toast(video ? "Voice dan kamera aktif." : "Voice aktif.");
      });
    } catch (reason) {
      const blocked = reason?.name === "NotAllowedError" ? "Izin media belum diberikan. Tutup bubble/overlay, lalu coba lagi." : reason?.message || "Mikrofon atau kamera tidak tersedia.";
      error.textContent = blocked;
    }
  };
  socket.on("room:state", () => watch());
  socket.on("media:peer", async ({ playerId, voice, video }) => {
    if (!voice || playerId === game.state.playerId) return removePeer(playerId);
    if (!video) document.querySelector(`.video-tile[data-peer="${CSS.escape(playerId)}"]`)?.remove();
    await watch();
    const person = game.state.room?.players.find((item) => item.id === playerId); createPeer(playerId, person?.name || "Pemain", true);
  });
  socket.on("media:peer-left", ({ playerId }) => removePeer(playerId));
  const handleSignal = async ({ playerId, name, signal }) => {
    let peer = peers.get(playerId); if (!peer) peer = createPeer(playerId, name, false);
    if (signal.description) { await peer.setRemoteDescription(signal.description); for (const candidate of peer.pendingCandidates.splice(0)) await peer.addIceCandidate(candidate).catch(() => {}); if (signal.description.type === "offer") { const answer = await peer.createAnswer(); await peer.setLocalDescription(answer); socket.emit("media:signal", { targetId: playerId, signal: { description: peer.localDescription } }); } }
    if (signal.candidate) { if (peer.remoteDescription) await peer.addIceCandidate(signal.candidate).catch(() => {}); else peer.pendingCandidates.push(signal.candidate); }
  };
  socket.on("media:signal", (payload) => handleSignal(payload));
  document.querySelector("#media-toggle").addEventListener("click", () => dialog.showModal());
  document.querySelector(".close-dialog").addEventListener("click", () => dialog.close());
  document.querySelector("#voice-only").addEventListener("click", () => start(false));
  document.querySelector("#voice-video").addEventListener("click", () => start(true));
  document.querySelector("#media-off").addEventListener("click", stopBroadcast);
  socket.on("disconnect", () => { watchingCode = null; stream?.getTracks().forEach((track) => track.stop()); stream = null; peers.forEach((_peer, id) => removePeer(id)); });
  window.GuessMedia = { leave: stopBroadcast };
})();
