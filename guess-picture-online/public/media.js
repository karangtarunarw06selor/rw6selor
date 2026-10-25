(() => {
  "use strict";
  const game = window.guessGame, socket = game.socket;
  const dialog = document.querySelector("#media-dialog"), dock = document.querySelector("#video-dock"), error = document.querySelector("#media-error");
  const peers = new Map(), pendingSignals = new Map(); let stream = null;
  const rtcConfig = { iceServers: [{ urls: "stun:stun.cloudflare.com:3478" }, { urls: "stun:stun.l.google.com:19302" }] };
  const tile = (id, name, local = false) => {
    let node = dock.querySelector(`[data-peer="${CSS.escape(id)}"]`); if (node) return node;
    node = document.createElement("div"); node.className = "video-tile"; node.dataset.peer = id; node.innerHTML = `<video autoplay playsinline ${local ? "muted" : ""}></video><span>${name}</span>`; dock.append(node); return node;
  };
  const removePeer = (id) => { peers.get(id)?.close(); peers.delete(id); dock.querySelector(`[data-peer="${CSS.escape(id)}"]`)?.remove(); };
  const offerPeer = (peer, id) => {
    if (peer.offerStarted) return;
    peer.offerStarted = true;
    peer.createOffer().then((description) => peer.setLocalDescription(description)).then(() => socket.emit("media:signal", { targetId: id, signal: { description: peer.localDescription } }));
  };
  const createPeer = (id, name, offerer = false) => {
    const existing = peers.get(id);
    if (existing) {
      stream?.getTracks().forEach((track) => { if (!existing.getSenders().some((sender) => sender.track?.kind === track.kind)) existing.addTrack(track, stream); });
      if (offerer) offerPeer(existing, id);
      return existing;
    }
    const peer = new RTCPeerConnection(rtcConfig); peers.set(id, peer);
    peer.pendingCandidates = [];
    stream?.getTracks().forEach((track) => peer.addTrack(track, stream));
    peer.ontrack = ({ streams }) => { const node = tile(id, name); node.querySelector("video").srcObject = streams[0]; };
    peer.onicecandidate = ({ candidate }) => { if (candidate) socket.emit("media:signal", { targetId: id, signal: { candidate } }); };
    peer.onconnectionstatechange = () => { if (["failed", "closed"].includes(peer.connectionState)) removePeer(id); };
    if (offerer) offerPeer(peer, id);
    return peer;
  };
  const stop = () => {
    stream?.getTracks().forEach((track) => track.stop()); stream = null; peers.forEach((_peer, id) => removePeer(id)); dock.innerHTML = ""; socket.emit("media:update", { voice: false, video: false }); dialog.close();
  };
  const start = async (video) => {
    error.textContent = "";
    try {
      stop(); stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, video: video ? { width: { ideal: 640 }, height: { ideal: 360 }, facingMode: "user" } : false });
      const own = game.currentPlayer(); if (video) tile(own?.id || "local", `${own?.name || "Kamu"} · Kamu`, true).querySelector("video").srcObject = stream;
      for (const [playerId, queued] of pendingSignals) { pendingSignals.delete(playerId); for (const item of queued) await handleSignal(item); }
      socket.emit("media:update", { voice: true, video }, (reply) => {
        if (!reply?.ok) { error.textContent = reply?.error || "Media gagal."; return stop(); }
        for (const person of reply.peers || []) createPeer(person.id, person.name, game.state.playerId < person.id);
        dialog.close(); game.toast(video ? "Voice dan kamera aktif." : "Voice aktif.");
      });
    } catch (reason) {
      const blocked = reason?.name === "NotAllowedError" ? "Izin media belum diberikan. Tutup bubble/overlay, lalu coba lagi." : "Mikrofon atau kamera tidak tersedia.";
      error.textContent = blocked;
    }
  };
  socket.on("media:peer", ({ playerId, voice }) => { if (!voice || playerId === game.state.playerId) return removePeer(playerId); if (!stream) return; const person = game.state.room?.players.find((item) => item.id === playerId); createPeer(playerId, person?.name || "Pemain", game.state.playerId < playerId); });
  socket.on("media:peer-left", ({ playerId }) => removePeer(playerId));
  const handleSignal = async ({ playerId, name, signal }) => {
    let peer = peers.get(playerId); if (!peer) peer = createPeer(playerId, name, false);
    if (signal.description) { await peer.setRemoteDescription(signal.description); for (const candidate of peer.pendingCandidates.splice(0)) await peer.addIceCandidate(candidate).catch(() => {}); if (signal.description.type === "offer") { const answer = await peer.createAnswer(); await peer.setLocalDescription(answer); socket.emit("media:signal", { targetId: playerId, signal: { description: peer.localDescription } }); } }
    if (signal.candidate) { if (peer.remoteDescription) await peer.addIceCandidate(signal.candidate).catch(() => {}); else peer.pendingCandidates.push(signal.candidate); }
  };
  socket.on("media:signal", async (payload) => {
    if (!stream) { const queued = pendingSignals.get(payload.playerId) || []; queued.push(payload); pendingSignals.set(payload.playerId, queued); return; }
    await handleSignal(payload);
  });
  document.querySelector("#media-toggle").addEventListener("click", () => dialog.showModal());
  document.querySelector(".close-dialog").addEventListener("click", () => dialog.close());
  document.querySelector("#voice-only").addEventListener("click", () => start(false));
  document.querySelector("#voice-video").addEventListener("click", () => start(true));
  document.querySelector("#media-off").addEventListener("click", stop);
  socket.on("disconnect", () => { stream?.getTracks().forEach((track) => track.stop()); peers.forEach((_peer, id) => removePeer(id)); });
})();
