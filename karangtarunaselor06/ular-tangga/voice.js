(() => {
  "use strict";

  const game = window.snakeGame;
  if (!game?.socket) return;

  const socket = game.socket;
  const peers = new Map();
  const speaking = new Set();
  let localStream = null;
  let audioContext = null;
  let localMeter = null;
  let muted = false;
  let joining = false;

  const $ = (selector) => document.querySelector(selector);
  const rtcConfig = { iceServers: [{ urls: "stun:stun.cloudflare.com:3478" }, { urls: "stun:stun.l.google.com:19302" }] };
  const localPlayerId = () => game.getState().playerId;
  const resumeAudioContext = () => {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    return audioContext.resume().catch(() => {});
  };

  const syncBadges = () => {
    const state = game.getState();
    state.room?.players.forEach((player) => {
      const row = $(`[data-player-id="${player.id}"]`);
      const badge = row?.querySelector(".player-voice");
      if (!badge) return;
      const mine = player.id === state.playerId;
      badge.classList.toggle("active", Boolean(player.voice));
      badge.classList.toggle("muted", mine && muted);
      badge.classList.toggle("pending", mine && joining);
      badge.classList.toggle("speaking", speaking.has(player.id));
      row.classList.toggle("voice-speaking", speaking.has(player.id));
      if (mine) {
        const label = !localStream ? "Aktifkan mikrofon" : muted ? "Aktifkan suara" : "Mute mikrofon";
        badge.setAttribute("aria-label", label);
        badge.setAttribute("title", label);
      }
    });
  };

  const meter = (stream, playerId) => {
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const values = new Uint8Array(analyser.fftSize);
      let frame = 0;
      let lastSpeaking = false;
      const tick = () => {
        analyser.getByteTimeDomainData(values);
        const rms = Math.sqrt(values.reduce((sum, value) => sum + ((value - 128) / 128) ** 2, 0) / values.length);
        const isLocalMuted = playerId === localPlayerId() && muted;
        const isSpeaking = !isLocalMuted && rms > 0.035;
        if (isSpeaking !== lastSpeaking) {
          lastSpeaking = isSpeaking;
          if (isSpeaking) speaking.add(playerId); else speaking.delete(playerId);
          syncBadges();
        }
        frame = requestAnimationFrame(tick);
      };
      tick();
      return () => {
        cancelAnimationFrame(frame);
        speaking.delete(playerId);
        source.disconnect();
        analyser.disconnect();
        syncBadges();
      };
    } catch { return () => {}; }
  };

  const removePeer = (peerId) => {
    const entry = peers.get(peerId);
    entry?.stopMeter?.();
    entry?.connection.close();
    entry?.audio.remove();
    peers.delete(peerId);
    speaking.delete(peerId);
    syncBadges();
  };

  const sendSignal = (targetId, signal) => socket.emit("voice:signal", { targetId, signal }, (reply) => {
    if (!reply?.ok) game.toast(reply?.error || "Signaling voice gagal.");
  });

  const createPeer = async (peerId, _name, initiator = false) => {
    if (!localStream || peers.has(peerId)) return peers.get(peerId)?.connection;
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

  const leaveVoice = (notify = true) => {
    if (notify && localStream) socket.emit("voice:leave", {});
    [...peers.keys()].forEach(removePeer);
    localMeter?.();
    localMeter = null;
    localStream?.getTracks().forEach((track) => track.stop());
    localStream = null;
    muted = false;
    joining = false;
    speaking.clear();
    syncBadges();
  };

  const joinVoice = async () => {
    if (joining || game.getState().mode !== "online") return;
    if (!navigator.mediaDevices?.getUserMedia || !window.RTCPeerConnection) {
      game.toast("Browser ini belum mendukung voice room.");
      return;
    }
    joining = true;
    syncBadges();
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false });
      localMeter = meter(localStream, localPlayerId());
      socket.emit("voice:join", {}, (reply) => {
        joining = false;
        if (!reply?.ok) {
          leaveVoice(false);
          game.toast(reply?.error || "Gagal mengaktifkan mikrofon.");
          return;
        }
        syncBadges();
        game.toast("Mikrofon aktif.");
      });
    } catch (error) {
      localStream = null;
      joining = false;
      syncBadges();
      game.toast(error?.name === "NotAllowedError" ? "Izin mikrofon ditolak." : "Mikrofon tidak tersedia.");
    }
  };

  const toggleVoice = () => {
    resumeAudioContext();
    if (!localStream) return joinVoice();
    muted = !muted;
    localStream.getAudioTracks().forEach((track) => { track.enabled = !muted; });
    if (muted) speaking.delete(localPlayerId());
    syncBadges();
    game.toast(muted ? "Mikrofon dimute." : "Mikrofon aktif.");
  };

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-voice-toggle]")) toggleVoice();
  });
  socket.on("voice:peer-joined", ({ peerId, name }) => createPeer(peerId, name, true).catch(() => removePeer(peerId)));
  socket.on("voice:peer-left", ({ peerId }) => removePeer(peerId));
  socket.on("voice:signal", (payload) => handleSignal(payload).catch(() => removePeer(payload.peerId)));
  socket.on("disconnect", () => leaveVoice(false));
  window.addEventListener("beforeunload", () => leaveVoice());
  window.addEventListener("snake:game-left", () => leaveVoice());
  window.addEventListener("snake:rendered", syncBadges);
})();
