(() => {
  "use strict";
  const game = window.guessGame, socket = game.socket;
  const dialog = document.querySelector("#media-dialog"), dock = document.querySelector("#video-dock"), error = document.querySelector("#media-error");
  const peers = new Map(), mutedPeers = new Set(); let stream = null, watchingCode = null, watchTask = null, restoreBroadcast = false;
  let rtcConfig = { iceServers: [{ urls: "stun:stun.cloudflare.com:3478" }, { urls: "stun:stun.l.google.com:19302" }] };
  const audioNode = (id) => document.querySelector(`audio[data-peer="${CSS.escape(id)}"]`);
  const updateAudioButton = (id) => {
    const audio = audioNode(id), node = document.querySelector(`.video-tile[data-peer="${CSS.escape(id)}"]`), blocked = Boolean(audio && !audio.muted && audio.paused);
    const silent = mutedPeers.has(id) || blocked;
    if (node) { node.querySelector(".peer-mute")?.replaceChildren(silent ? "Nyalakan suara" : "Bisukan"); node.classList.toggle("audio-muted", silent); }
  };
  const playRemoteAudio = async (id) => {
    const audio = audioNode(id); if (!audio || mutedPeers.has(id)) return false;
    audio.muted = false;
    try { await audio.play(); updateAudioButton(id); return true; }
    catch { updateAudioButton(id); return false; }
  };
  const tile = (id, name, local = false) => {
    const scope = game.state.room?.status === "waiting" ? "#lobby-players" : "#scoreboard";
    const slot = document.querySelector(`${scope} [data-player="${CSS.escape(id)}"] .player-camera`);
    let node = document.querySelector(`.video-tile[data-peer="${CSS.escape(id)}"]`);
    if (!node) {
      node = document.createElement("div"); node.className = `video-tile${local ? " local-camera" : ""}`; node.dataset.peer = id; node.title = name; node.innerHTML = `<video autoplay playsinline muted></video>${local ? "" : '<button class="peer-mute" type="button">Bisukan</button>'}`;
      node.querySelector(".peer-mute")?.addEventListener("click", async () => { const audio = audioNode(id); if (!audio) return; if (audio.paused || mutedPeers.has(id)) { mutedPeers.delete(id); await playRemoteAudio(id); } else { mutedPeers.add(id); audio.muted = true; updateAudioButton(id); } });
    }
    (slot || dock).append(node); return node;
  };
  const removePeer = (id) => {
    peers.get(id)?.close(); peers.delete(id);
    document.querySelector(`.video-tile[data-peer="${CSS.escape(id)}"]`)?.remove();
    document.querySelector(`audio[data-peer="${CSS.escape(id)}"]`)?.remove();
  };
  const showPlayerSlots = () => { for (const person of game.state.room?.players || []) tile(person.id, person.name, person.id === game.state.playerId); };
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
      if (offerer) { existing.offerStarted = false; offerPeer(existing, id); }
      return existing;
    }
    const peer = new RTCPeerConnection(rtcConfig); peers.set(id, peer); peer.pendingCandidates = [];
    if (stream) stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    else { peer.addTransceiver("audio", { direction: "recvonly" }); peer.addTransceiver("video", { direction: "recvonly" }); }
    peer.ontrack = ({ track, streams }) => {
      if (track.kind === "video") { const node = tile(id, name); node.querySelector("video").srcObject = streams[0] || new MediaStream([track]); node.classList.add("has-video"); }
      else {
        const node = tile(id, name);
        let audio = document.querySelector(`audio[data-peer="${CSS.escape(id)}"]`);
        if (!audio) { audio = document.createElement("audio"); audio.dataset.peer = id; audio.autoplay = true; audio.playsInline = true; dock.append(audio); }
        audio.srcObject = streams[0] || new MediaStream([track]); audio.muted = mutedPeers.has(id); playRemoteAudio(id);
      }
    };
    peer.onicecandidate = ({ candidate }) => { if (candidate) socket.emit("media:signal", { targetId: id, signal: { candidate } }); };
    peer.onconnectionstatechange = () => { if (["failed", "closed"].includes(peer.connectionState)) removePeer(id); };
    if (offerer) offerPeer(peer, id);
    return peer;
  };
  const request = (event, data = {}) => new Promise((resolve) => socket.emit(event, data, resolve));
  const liveTrack = (kind) => stream?.getTracks().find((track) => track.kind === kind && track.readyState === "live");
  const mediaState = () => ({ voice: Boolean(liveTrack("audio")), video: Boolean(liveTrack("video")) });
  const updateControls = () => {
    const { voice, video } = mediaState();
    for (const [selector, active, label] of [["#mic-toggle", voice, "Mikrofon"], ["#camera-toggle", video, "Kamera"]]) {
      const button = document.querySelector(selector); button.setAttribute("aria-pressed", String(active)); button.classList.toggle("active", active); button.textContent = `${label} ${active ? "ON" : "OFF"}`;
    }
    document.querySelector("#media-toggle").classList.toggle("active", voice || video);
  };
  const syncSender = async (peer, kind, track) => {
    let transceiver = peer.getTransceivers().find((item) => item.sender.track?.kind === kind || item.receiver.track?.kind === kind);
    if (!transceiver && track) { const sender = peer.addTrack(track, stream); transceiver = peer.getTransceivers().find((item) => item.sender === sender); }
    if (!transceiver) return;
    await transceiver.sender.replaceTrack(track || null);
    transceiver.direction = track ? "sendrecv" : "recvonly";
  };
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
  const restore = async () => {
    if (!restoreBroadcast || !stream || !game.state.room || stream.getTracks().every((track) => track.readyState !== "live")) return;
    restoreBroadcast = false;
    await watch();
    const state = mediaState(), reply = await request("media:update", state);
    if (!reply?.ok) return;
    const own = game.currentPlayer(); if (state.video) tile(own?.id || "local", own?.name || "Kamu", true).querySelector("video").srcObject = stream;
    for (const person of reply.peers || []) createPeer(person.id, person.name, false);
    updateControls();
  };
  const stopBroadcast = () => {
    restoreBroadcast = false; stream?.getTracks().forEach((track) => track.stop()); stream = null;
    const ownId = game.currentPlayer()?.id || "local", ownNode = document.querySelector(`.video-tile[data-peer="${CSS.escape(ownId)}"]`); if (ownNode) { ownNode.querySelector("video").srcObject = null; ownNode.classList.remove("has-video"); }
    peers.forEach((peer) => peer.getSenders().filter((sender) => sender.track).forEach((sender) => sender.replaceTrack(null))); socket.emit("media:update", { voice: false, video: false }, () => watch());
    updateControls();
    if (dialog.open) dialog.close();
  };
  const toggleTrack = async (kind) => {
    error.textContent = ""; restoreBroadcast = false;
    try {
      const config = await request("media:config"); if (!config?.ok) throw new Error(config?.error || "Konfigurasi media tidak tersedia.");
      rtcConfig = { iceServers: config.iceServers };
      const current = liveTrack(kind);
      if (current) { current.stop(); stream.removeTrack(current); await Promise.all([...peers.values()].map((peer) => syncSender(peer, kind, null))); }
      else {
        const acquired = await navigator.mediaDevices.getUserMedia(kind === "audio" ? { audio: { echoCancellation: true, noiseSuppression: true }, video: false } : { audio: false, video: { width: { ideal: 640 }, height: { ideal: 360 }, facingMode: "user" } });
        if (!stream) stream = new MediaStream();
        const track = acquired.getTracks()[0]; stream.addTrack(track); await Promise.all([...peers.values()].map((peer) => syncSender(peer, kind, track)));
      }
      const state = mediaState(), own = game.currentPlayer(), ownNode = tile(own?.id || "local", own?.name || "Kamu", true);
      if (state.video) { ownNode.querySelector("video").srcObject = stream; ownNode.classList.add("has-video"); } else { ownNode.querySelector("video").srcObject = null; ownNode.classList.remove("has-video"); }
      updateControls();
      socket.emit("media:update", state, (reply) => {
        if (!reply?.ok) { error.textContent = reply?.error || "Media gagal."; return stopBroadcast(); }
        for (const person of reply.peers || []) createPeer(person.id, person.name, false);
        game.toast(`${kind === "audio" ? "Mikrofon" : "Kamera"} ${liveTrack(kind) ? "aktif" : "mati"}.`);
      });
    } catch (reason) {
      const blocked = reason?.name === "NotAllowedError" ? "Izin media belum diberikan. Tutup bubble/overlay, lalu coba lagi." : reason?.message || "Mikrofon atau kamera tidak tersedia.";
      error.textContent = blocked;
    }
  };
  socket.on("room:state", () => { showPlayerSlots(); watch(); restore(); });
  socket.on("media:peer", async ({ playerId, voice, video }) => {
    if (playerId === game.state.playerId) return;
    const node = tile(playerId, game.state.room?.players.find((item) => item.id === playerId)?.name || "Pemain");
    const audio = audioNode(playerId); if (audio) { audio.muted = !voice || mutedPeers.has(playerId); voice ? playRemoteAudio(playerId) : updateAudioButton(playerId); }
    node.classList.toggle("has-video", video);
    await watch();
    const person = game.state.room?.players.find((item) => item.id === playerId); createPeer(playerId, person?.name || "Pemain", true);
  });
  socket.on("media:peer-left", ({ playerId }) => removePeer(playerId));
  const handleSignal = async ({ playerId, name, signal }) => {
    let peer = peers.get(playerId); if (!peer) peer = createPeer(playerId, name, false);
    if (signal.description) {
      if (signal.description.type === "answer" && peer.signalingState !== "have-local-offer") return;
      await peer.setRemoteDescription(signal.description); for (const candidate of peer.pendingCandidates.splice(0)) await peer.addIceCandidate(candidate).catch(() => {}); if (signal.description.type === "offer") { const answer = await peer.createAnswer(); await peer.setLocalDescription(answer); socket.emit("media:signal", { targetId: playerId, signal: { description: peer.localDescription } }); } else peer.offerStarted = false;
    }
    if (signal.candidate) { if (peer.remoteDescription) await peer.addIceCandidate(signal.candidate).catch(() => {}); else peer.pendingCandidates.push(signal.candidate); }
  };
  socket.on("media:signal", (payload) => handleSignal(payload));
  document.querySelector("#media-toggle").addEventListener("click", () => { updateControls(); dialog.showModal(); });
  document.querySelector(".close-dialog").addEventListener("click", () => dialog.close());
  document.querySelector("#mic-toggle").addEventListener("click", () => toggleTrack("audio"));
  document.querySelector("#camera-toggle").addEventListener("click", () => toggleTrack("video"));
  document.addEventListener("click", () => document.querySelectorAll("audio[data-peer]").forEach((audio) => { if (!audio.muted && audio.paused) playRemoteAudio(audio.dataset.peer); }));
  socket.on("disconnect", () => { watchingCode = null; restoreBroadcast = Boolean(stream?.getTracks().some((track) => track.readyState === "live")); peers.forEach((_peer, id) => removePeer(id)); });
  window.GuessMedia = { leave: stopBroadcast, state: mediaState };
})();
