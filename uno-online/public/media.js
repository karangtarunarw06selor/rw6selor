(() => {
  "use strict";

  const game = window.UnoGame;
  const socket = game.socket;
  const peers = new Map();
  const streams = new Map();
  let localStream = new MediaStream();
  let playerId = null;
  let watchingRoom = null;
  let watchTask = null;
  let rtcConfig = { iceServers: [{ urls: "stun:stun.cloudflare.com:3478" }] };

  const micButton = document.querySelector("#mic-toggle");
  const cameraButton = document.querySelector("#camera-toggle");
  const remoteMedia = document.querySelector("#remote-media");
  const request = (event, data = {}) => game.request(event, data);
  const liveTrack = (kind) => localStream.getTracks().find((track) => track.kind === kind && track.readyState === "live");
  const mediaState = () => ({ voice: Boolean(liveTrack("audio")), video: Boolean(liveTrack("video")) });

  function slot(id) {
    return document.querySelector(`.player-media[data-player-id="${CSS.escape(id)}"]`);
  }

  function videoNode(id, local = false) {
    let video = document.querySelector(`video[data-media-player="${CSS.escape(id)}"]`);
    if (!video) {
      video = document.createElement("video");
      video.dataset.mediaPlayer = id;
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;
    }
    video.classList.toggle("local-camera", local);
    const target = slot(id);
    if (target && video.parentElement !== target) target.append(video);
    return video;
  }

  function attachVideo(id, stream, local = false) {
    const video = videoNode(id, local);
    if (!stream?.getVideoTracks().length) {
      video.srcObject = null;
      video.hidden = true;
      return;
    }
    video.hidden = false;
    if (video.srcObject !== stream) video.srcObject = stream;
    video.play().catch(() => {});
  }

  function attachAudio(id, stream) {
    let audio = document.querySelector(`audio[data-media-peer="${CSS.escape(id)}"]`);
    if (!audio) {
      audio = document.createElement("audio");
      audio.dataset.mediaPeer = id;
      audio.autoplay = true;
      audio.playsInline = true;
      remoteMedia.append(audio);
    }
    if (audio.srcObject !== stream) audio.srcObject = stream;
    audio.play().catch(() => game.toast("Ketuk layar untuk menyalakan suara pemain."));
  }

  function attachRemote(id, stream) {
    streams.set(id, stream);
    attachVideo(id, stream);
    if (stream.getAudioTracks().length) attachAudio(id, stream);
  }

  function closePeer(id) {
    peers.get(id)?.close();
    peers.delete(id);
    streams.delete(id);
    document.querySelector(`video[data-media-player="${CSS.escape(id)}"]`)?.remove();
    document.querySelector(`audio[data-media-peer="${CSS.escape(id)}"]`)?.remove();
  }

  async function emitSignal(id, payload) {
    await request("media:signal", { targetId: id, signal: payload });
  }

  async function offer(peer, id) {
    if (peer.offerPending) return;
    peer.offerPending = true;
    try {
      const description = await peer.createOffer();
      await peer.setLocalDescription(description);
      await emitSignal(id, { description: peer.localDescription });
    } catch {
      peer.offerPending = false;
    }
  }

  function createPeer(id, initiator = false) {
    const existing = peers.get(id);
    if (existing) {
      if (initiator) { existing.offerPending = false; offer(existing, id); }
      return existing;
    }
    const peer = new RTCPeerConnection(rtcConfig);
    peer.pendingCandidates = [];
    peers.set(id, peer);
    for (const kind of ["audio", "video"]) {
      const track = liveTrack(kind);
      if (track) peer.addTransceiver(track, { direction: "sendrecv", streams: [localStream] });
      else peer.addTransceiver(kind, { direction: "recvonly" });
    }
    peer.onicecandidate = ({ candidate }) => { if (candidate) emitSignal(id, { candidate }); };
    peer.ontrack = ({ track, streams: incoming }) => {
      const stream = incoming[0] || streams.get(id) || new MediaStream();
      if (!stream.getTracks().includes(track)) stream.addTrack(track);
      attachRemote(id, stream);
    };
    peer.onconnectionstatechange = () => { if (["failed", "closed"].includes(peer.connectionState)) closePeer(id); };
    if (initiator) offer(peer, id);
    return peer;
  }

  async function syncSender(peer, kind, track) {
    let transceiver = peer.getTransceivers().find((item) => item.sender.track?.kind === kind || item.receiver.track?.kind === kind);
    if (!transceiver && track) {
      const sender = peer.addTrack(track, localStream);
      transceiver = peer.getTransceivers().find((item) => item.sender === sender);
    }
    if (!transceiver) return;
    await transceiver.sender.replaceTrack(track || null);
    transceiver.direction = track ? "sendrecv" : "recvonly";
  }

  function updateButtons() {
    const { voice, video } = mediaState();
    micButton.classList.toggle("active", voice);
    micButton.setAttribute("aria-pressed", String(voice));
    micButton.textContent = `🎙 Mikrofon ${voice ? "ON" : "OFF"}`;
    cameraButton.classList.toggle("active", video);
    cameraButton.setAttribute("aria-pressed", String(video));
    cameraButton.textContent = `📷 Kamera ${video ? "ON" : "OFF"}`;
  }

  async function watch() {
    const state = game.getState();
    if (!state || watchingRoom === state.roomCode || watchTask) return;
    watchTask = (async () => {
      const config = await request("media:config");
      if (!config?.ok) throw new Error(config?.error || "Konfigurasi media gagal.");
      rtcConfig = { iceServers: config.iceServers };
      const response = await request("media:watch");
      if (!response?.ok) throw new Error(response?.error || "Media room gagal.");
      watchingRoom = state.roomCode;
      for (const peer of response.peers || []) createPeer(peer.id, true);
      const active = mediaState();
      if (active.voice || active.video) {
        const restored = await request("media:update", active);
        for (const peer of restored?.peers || []) createPeer(peer.id, true);
      }
    })().catch((error) => game.toast(error.message)).finally(() => { watchTask = null; });
    await watchTask;
  }

  async function toggle(kind) {
    try {
      await watch();
      const current = liveTrack(kind);
      if (current) {
        current.stop();
        localStream.removeTrack(current);
        await Promise.all([...peers.values()].map((peer) => syncSender(peer, kind, null)));
      } else {
        const constraints = kind === "audio"
          ? { audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false }
          : { audio: false, video: { facingMode: "user", width: { ideal: 480 }, height: { ideal: 360 }, frameRate: { ideal: 15, max: 20 } } };
        const acquired = await navigator.mediaDevices.getUserMedia(constraints);
        const track = acquired.getTracks()[0];
        localStream.addTrack(track);
        await Promise.all([...peers.values()].map((peer) => syncSender(peer, kind, track)));
      }
      const state = mediaState();
      const response = await request("media:update", state);
      if (!response?.ok) throw new Error(response?.error || "Media gagal diperbarui.");
      for (const peer of response.peers || []) createPeer(peer.id, true);
      attachVideo(playerId, localStream, true);
      updateButtons();
    } catch (error) {
      const denied = ["NotAllowedError", "SecurityError"].includes(error?.name);
      game.toast(denied ? "Izin mikrofon/kamera ditolak. Game tetap dapat dimainkan." : error?.message || "Media tidak tersedia.");
    }
  }

  async function handleSignal({ playerId: senderId, signal }) {
    const peer = createPeer(senderId, false);
    if (signal.description) {
      if (signal.description.type === "answer" && peer.signalingState !== "have-local-offer") return;
      await peer.setRemoteDescription(signal.description);
      for (const candidate of peer.pendingCandidates.splice(0)) await peer.addIceCandidate(candidate).catch(() => {});
      if (signal.description.type === "offer") {
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        await emitSignal(senderId, { description: peer.localDescription });
      } else peer.offerPending = false;
    } else if (signal.candidate) {
      if (peer.remoteDescription) await peer.addIceCandidate(signal.candidate).catch(() => {});
      else peer.pendingCandidates.push(signal.candidate);
    }
  }

  function syncPlayers(players, ownId) {
    playerId = ownId;
    for (const player of players) {
      if (player.id === playerId) attachVideo(player.id, localStream, true);
      else if (streams.has(player.id)) attachVideo(player.id, streams.get(player.id));
    }
    watch();
  }

  async function leave() {
    localStream.getTracks().forEach((track) => track.stop());
    localStream = new MediaStream();
    [...peers.keys()].forEach(closePeer);
    watchingRoom = null;
    updateButtons();
    if (game.getState()) await request("media:leave");
  }

  micButton.addEventListener("click", () => toggle("audio"));
  cameraButton.addEventListener("click", () => toggle("video"));
  document.addEventListener("pointerdown", () => document.querySelectorAll("#remote-media audio").forEach((audio) => { if (audio.paused) audio.play().catch(() => {}); }), { passive: true });
  socket.on("media:peer", ({ playerId: id }) => { if (id !== playerId) { watch(); createPeer(id, false); } });
  socket.on("media:signal", (payload) => handleSignal(payload).catch((error) => { console.error("UNO media signal", error); closePeer(payload.playerId); }));
  socket.on("media:peer-left", ({ playerId: id }) => closePeer(id));
  socket.on("disconnect", () => { watchingRoom = null; [...peers.keys()].forEach(closePeer); });
  window.addEventListener("beforeunload", () => localStream.getTracks().forEach((track) => track.stop()));

  window.UnoMedia = { syncPlayers, leave, state: mediaState };
  updateButtons();
  const initial = game.getState();
  if (initial) syncPlayers(initial.players, initial.myId);
})();
