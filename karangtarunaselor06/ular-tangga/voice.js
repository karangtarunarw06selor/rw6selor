(() => {
  "use strict";

  const game = window.snakeGame;
  if (!game?.socket) return;

  const socket = game.socket;
  const peers = new Map();
  const members = new Map();
  let localStream = null;
  let audioContext = null;
  let localMeter = null;
  let muted = false;

  const $ = (selector) => document.querySelector(selector);
  const rtcConfig = { iceServers: [{ urls: "stun:stun.cloudflare.com:3478" }, { urls: "stun:stun.l.google.com:19302" }] };

  const setStatus = (text) => { $("#voice-status").textContent = text; };
  const renderMembers = () => {
    const state = game.getState();
    const local = state.room?.players.find((player) => player.id === state.playerId);
    const entries = localStream ? [{ id: state.playerId, name: local?.name || "Kamu", local: true }, ...members.values()] : [...members.values()];
    $("#voice-members").innerHTML = entries.length
      ? entries.map((member) => `<span class="voice-member${member.speaking ? " speaking" : ""}" data-voice-member="${member.id}"><i></i>${member.local ? "Kamu" : escapeHtml(member.name)}</span>`).join("")
      : '<small>Belum ada pemain di voice.</small>';
  };
  const escapeHtml = (value) => String(value || "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const updateControls = () => {
    const joined = Boolean(localStream);
    $("#voice-join").hidden = joined;
    $("#voice-mute").hidden = !joined;
    $("#voice-leave").hidden = !joined;
    $("#voice-mute").textContent = muted ? "Unmute" : "Mute";
    $("#voice-mute").classList.toggle("active", muted);
    setStatus(joined ? (muted ? "Mikrofon dimute" : "Mikrofon aktif") : "Belum terhubung");
    renderMembers();
  };

  const meter = (stream, peerId) => {
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const values = new Uint8Array(analyser.frequencyBinCount);
      let frame = 0;
      const tick = () => {
        analyser.getByteFrequencyData(values);
        const level = values.reduce((sum, value) => sum + value, 0) / values.length;
        const member = peerId === "local" ? null : members.get(peerId);
        const speaking = level > 18;
        const node = peerId === "local" ? $(`[data-voice-member="${game.getState().playerId}"]`) : $(`[data-voice-member="${peerId}"]`);
        node?.classList.toggle("speaking", speaking);
        if (member) member.speaking = speaking;
        frame = requestAnimationFrame(tick);
      };
      tick();
      return () => { cancelAnimationFrame(frame); source.disconnect(); analyser.disconnect(); };
    } catch { return () => {}; }
  };

  const removePeer = (peerId) => {
    const entry = peers.get(peerId);
    entry?.stopMeter?.();
    entry?.connection.close();
    entry?.audio.remove();
    peers.delete(peerId);
    members.delete(peerId);
    renderMembers();
  };

  const sendSignal = (targetId, signal) => socket.emit("voice:signal", { targetId, signal }, (reply) => {
    if (!reply?.ok) game.toast(reply?.error || "Signaling voice gagal.");
  });

  const createPeer = async (peerId, name, initiator = false) => {
    if (!localStream || peers.has(peerId)) return peers.get(peerId)?.connection;
    members.set(peerId, { id: peerId, name: name || "Pemain", speaking: false });
    const connection = new RTCPeerConnection(rtcConfig);
    const audio = document.createElement("audio");
    audio.autoplay = true;
    audio.playsInline = true;
    audio.dataset.peerId = peerId;
    $("#voice-audio").append(audio);
    const entry = { connection, audio, stopMeter: null };
    peers.set(peerId, entry);
    localStream.getTracks().forEach((track) => connection.addTrack(track, localStream));
    connection.onicecandidate = ({ candidate }) => { if (candidate) sendSignal(peerId, { candidate }); };
    connection.ontrack = ({ streams: [stream] }) => {
      if (!stream) return;
      audio.srcObject = stream;
      audio.play().catch(() => {});
      entry.stopMeter?.();
      entry.stopMeter = meter(stream, peerId);
    };
    connection.onconnectionstatechange = () => {
      if (["failed", "closed"].includes(connection.connectionState)) removePeer(peerId);
    };
    renderMembers();
    if (initiator) {
      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);
      sendSignal(peerId, { description: connection.localDescription });
    }
    return connection;
  };

  const handleSignal = async ({ peerId, name, signal }) => {
    if (!localStream || !peerId || !signal) return;
    const connection = await createPeer(peerId, name, false);
    if (signal.description) {
      await connection.setRemoteDescription(signal.description);
      if (signal.description.type === "offer") {
        const answer = await connection.createAnswer();
        await connection.setLocalDescription(answer);
        sendSignal(peerId, { description: connection.localDescription });
      }
    }
    if (signal.candidate) await connection.addIceCandidate(signal.candidate).catch(() => {});
  };

  const joinVoice = async () => {
    if (game.getState().mode !== "online") return;
    if (!navigator.mediaDevices?.getUserMedia || !window.RTCPeerConnection) {
      game.toast("Browser ini belum mendukung voice room.");
      return;
    }
    $("#voice-join").disabled = true;
    setStatus("Meminta izin mikrofon...");
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false });
      localMeter = meter(localStream, "local");
      socket.emit("voice:join", {}, (reply) => {
        if (!reply?.ok) { leaveVoice(false); game.toast(reply?.error || "Gagal masuk voice."); return; }
        (reply.peers || []).forEach((peer) => members.set(peer.id, { id: peer.id, name: peer.name, speaking: false }));
        updateControls();
      });
    } catch (error) {
      localStream = null;
      setStatus(error?.name === "NotAllowedError" ? "Izin mikrofon ditolak" : "Mikrofon tidak tersedia");
      game.toast("Aktifkan izin mikrofon untuk memakai voice room.");
    } finally { $("#voice-join").disabled = false; }
  };

  const leaveVoice = (notify = true) => {
    if (notify) socket.emit("voice:leave", {});
    peers.forEach((_entry, peerId) => removePeer(peerId));
    localMeter?.();
    localMeter = null;
    localStream?.getTracks().forEach((track) => track.stop());
    localStream = null;
    muted = false;
    members.clear();
    updateControls();
  };

  const syncPanel = () => {
    const online = game.getState().mode === "online";
    $("#voice-panel").hidden = !online;
    if (!online && localStream) leaveVoice();
  };

  $("#voice-join").addEventListener("click", joinVoice);
  $("#voice-mute").addEventListener("click", () => {
    muted = !muted;
    localStream?.getAudioTracks().forEach((track) => { track.enabled = !muted; });
    updateControls();
  });
  $("#voice-leave").addEventListener("click", () => leaveVoice());
  socket.on("voice:peer-joined", ({ peerId, name }) => createPeer(peerId, name, true).catch(() => removePeer(peerId)));
  socket.on("voice:peer-left", ({ peerId }) => removePeer(peerId));
  socket.on("voice:signal", (payload) => handleSignal(payload).catch(() => removePeer(payload.peerId)));
  socket.on("disconnect", () => leaveVoice(false));
  window.addEventListener("beforeunload", () => leaveVoice());
  window.addEventListener("snake:game-started", syncPanel);
  syncPanel();
  updateControls();
})();
