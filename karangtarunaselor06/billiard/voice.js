(() => {
  "use strict";

  const peers = new Map();
  const activePlayers = new Set();
  const speakingPlayers = new Set();
  const rtcConfig = { iceServers: [{ urls: "stun:stun.cloudflare.com:3478" }, { urls: "stun:stun.l.google.com:19302" }] };
  let stream = null;
  let audioContext = null;
  let localMeter = null;
  let muted = false;
  let joining = false;

  const context = () => window.billiardVoiceContext;
  const playerId = () => String(context()?.player?.id || "");
  const socket = () => context()?.socket;
  const send = (message) => {
    const ws = socket();
    if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message));
  };
  const resumeAudio = () => {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    return audioContext.resume().catch(() => {});
  };

  const syncBadges = () => {
    document.querySelectorAll("[data-player-id]").forEach((badge) => {
      const id = String(badge.dataset.playerId || "");
      const controls = badge.querySelectorAll(".voiceToggle");
      const mine = id === playerId();
      controls.forEach((control) => {
        control.classList.toggle("active", activePlayers.has(id));
        control.classList.toggle("muted", mine && muted);
        control.classList.toggle("pending", mine && joining);
        control.classList.toggle("speaking", speakingPlayers.has(id));
        if (mine) {
          const label = !stream ? "Aktifkan mikrofon" : muted ? "Aktifkan suara" : "Mute mikrofon";
          control.setAttribute("aria-label", label);
          control.setAttribute("title", label);
        }
      });
      badge.classList.toggle("voiceSpeaking", speakingPlayers.has(id));
    });
  };

  const meter = (mediaStream, id) => {
    try {
      resumeAudio();
      const source = audioContext.createMediaStreamSource(mediaStream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const values = new Uint8Array(analyser.fftSize);
      let frame;
      let previous = false;
      const tick = () => {
        analyser.getByteTimeDomainData(values);
        const rms = Math.sqrt(values.reduce((sum, value) => sum + ((value - 128) / 128) ** 2, 0) / values.length);
        const next = !(id === playerId() && muted) && rms > 0.035;
        if (next !== previous) {
          previous = next;
          if (next) speakingPlayers.add(id); else speakingPlayers.delete(id);
          syncBadges();
        }
        frame = requestAnimationFrame(tick);
      };
      tick();
      return () => {
        cancelAnimationFrame(frame);
        speakingPlayers.delete(id);
        source.disconnect();
        analyser.disconnect();
        syncBadges();
      };
    } catch { return () => {}; }
  };

  const removePeer = (id) => {
    const peer = peers.get(String(id));
    peer?.stopMeter?.();
    peer?.connection.close();
    peer?.audio.remove();
    peers.delete(String(id));
    activePlayers.delete(String(id));
    speakingPlayers.delete(String(id));
    syncBadges();
  };

  const signal = (id, payload) => send({ type: "voice_signal", target_player_id: String(id), signal: payload });
  const createPeer = async (id, initiator = false) => {
    id = String(id);
    if (!stream || peers.has(id)) return peers.get(id)?.connection;
    activePlayers.add(id);
    const connection = new RTCPeerConnection(rtcConfig);
    const audio = document.createElement("audio");
    audio.autoplay = true;
    audio.playsInline = true;
    audio.dataset.peerId = id;
    document.querySelector("#voiceAudio").append(audio);
    const entry = { connection, audio, stopMeter: null };
    peers.set(id, entry);
    stream.getTracks().forEach((track) => connection.addTrack(track, stream));
    connection.onicecandidate = ({ candidate }) => { if (candidate) signal(id, { candidate }); };
    connection.ontrack = ({ streams: [remoteStream] }) => {
      if (!remoteStream) return;
      audio.srcObject = remoteStream;
      audio.play().catch(() => {});
      entry.stopMeter?.();
      entry.stopMeter = meter(remoteStream, id);
    };
    connection.onconnectionstatechange = () => {
      if (["failed", "closed"].includes(connection.connectionState)) removePeer(id);
    };
    syncBadges();
    if (initiator) {
      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);
      signal(id, { description: connection.localDescription });
    }
    return connection;
  };

  const handleSignal = async (message) => {
    if (!stream) return;
    const id = String(message.player_id || "");
    const connection = await createPeer(id);
    if (message.signal?.description) {
      await connection.setRemoteDescription(message.signal.description);
      if (message.signal.description.type === "offer") {
        const answer = await connection.createAnswer();
        await connection.setLocalDescription(answer);
        signal(id, { description: connection.localDescription });
      }
    }
    if (message.signal?.candidate) await connection.addIceCandidate(message.signal.candidate).catch(() => {});
  };

  const join = async () => {
    if (joining || stream) return;
    if (!navigator.mediaDevices?.getUserMedia || !window.RTCPeerConnection) return alert("Browser ini belum mendukung voice room.");
    const ws = socket();
    if (!ws || ws.readyState !== WebSocket.OPEN || !context()?.player) return alert("Tunggu koneksi realtime siap.");
    bindSocket();
    joining = true;
    resumeAudio();
    syncBadges();
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false });
      activePlayers.add(playerId());
      localMeter = meter(stream, playerId());
      send({ type: "voice_join" });
    } catch (error) {
      stream = null;
      alert(error?.name === "NotAllowedError" ? "Izin mikrofon ditolak." : "Mikrofon tidak tersedia.");
    } finally {
      joining = false;
      syncBadges();
    }
  };

  const leave = (notify = true) => {
    if (notify && stream) send({ type: "voice_leave" });
    [...peers.keys()].forEach(removePeer);
    localMeter?.();
    localMeter = null;
    stream?.getTracks().forEach((track) => track.stop());
    stream = null;
    muted = false;
    activePlayers.clear();
    speakingPlayers.clear();
    syncBadges();
  };

  const toggle = () => {
    resumeAudio();
    if (!stream) return join();
    muted = !muted;
    stream.getAudioTracks().forEach((track) => { track.enabled = !muted; });
    if (muted) speakingPlayers.delete(playerId());
    syncBadges();
  };

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-voice-toggle]")) {
      event.preventDefault();
      event.stopPropagation();
      toggle();
    }
  });
  window.addEventListener("billiard:rendered", syncBadges);
  window.addEventListener("beforeunload", () => leave());
  window.addEventListener("message", syncBadges);

  const bindSocket = () => {
    const ws = socket();
    if (!ws || ws.__voiceBound) return;
    ws.__voiceBound = true;
    ws.addEventListener("message", (event) => {
      let message;
      try { message = JSON.parse(event.data); } catch { return; }
      if (message.type === "voice_joined") {
        activePlayers.add(playerId());
        (message.peers || []).forEach((peer) => activePlayers.add(String(peer.player_id)));
        syncBadges();
      } else if (message.type === "voice_peer_joined") {
        activePlayers.add(String(message.player_id));
        createPeer(message.player_id, true).catch(() => removePeer(message.player_id));
      } else if (message.type === "voice_peer_left") {
        removePeer(message.player_id);
      } else if (message.type === "voice_signal") {
        handleSignal(message).catch(() => removePeer(message.player_id));
      }
    });
    ws.addEventListener("close", () => leave(false));
  };
  const interceptSocket = setInterval(bindSocket, 250);
  window.addEventListener("beforeunload", () => clearInterval(interceptSocket));
})();
