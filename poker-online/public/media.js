"use strict";

(() => {
  const peers = new Map();
  const remoteStreams = new Map();
  const analysers = new Map();
  let audioContext;
  let socket;
  let request;
  let playerId;
  let localStream;
  let audioEnabled = false;
  let videoEnabled = false;
  let pendingMode = null;
  const rtcConfig = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
  const audioButton = document.querySelector("#audioToggle");
  const videoButton = document.querySelector("#videoToggle");
  const dialog = document.querySelector("#mediaConsent");
  const confirm = document.querySelector("#consentConfirm");

  function emitSignal(targetId, signal) { request("media:signal", { targetId, signal }); }
  function videoSlot(id) {
    const active = document.querySelector("#game:not(.hidden)") ? "#game" : "#roomLobby";
    return document.querySelector(`${active} [data-video-slot="${CSS.escape(id)}"]`);
  }
  function attachVideo(id, stream, muted = false) {
    const slot = videoSlot(id);
    if (!slot || !stream?.getVideoTracks().length) return;
    let video = document.querySelector(`video[data-camera-player="${CSS.escape(id)}"]`);
    if (!video) { video = document.createElement("video"); video.autoplay = true; video.playsInline = true; slot.prepend(video); }
    else if (video.parentElement !== slot) slot.prepend(video);
    video.dataset.cameraPlayer = id;
    video.classList.toggle("local-camera", muted);
    video.muted = true;
    const play = () => video.play().catch(() => { /* retry after the next user gesture */ });
    if (video.srcObject !== stream) {
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", play, { once: true });
    } else play();
  }
  function attachAudio(id, stream) {
    let audio = document.querySelector(`#remoteMedia audio[data-peer="${CSS.escape(id)}"]`);
    if (!audio) { audio = document.createElement("audio"); audio.dataset.peer = id; audio.autoplay = true; document.querySelector("#remoteMedia").append(audio); }
    audio.srcObject = stream;
    playRemoteAudio(audio);
    watchSpeaking(id, stream);
  }
  async function playRemoteAudio(audio) {
    try { await audio.play(); audio.dataset.blocked = "false"; }
    catch { audio.dataset.blocked = "true"; }
    audioButton.classList.toggle("needs-tap", Boolean(document.querySelector('#remoteMedia audio[data-blocked="true"]')));
    audioButton.title = audioButton.classList.contains("needs-tap") ? "Ketuk layar untuk menyalakan suara room" : "Voice room aktif";
  }
  function resumeRemoteAudio() {
    if (audioContext?.state === "suspended") audioContext.resume();
    document.querySelectorAll("#remoteMedia audio").forEach(playRemoteAudio);
  }
  function setSpeaking(id, speaking) {
    document.querySelector(`[data-player-id="${CSS.escape(id)}"]`)?.classList.toggle("speaking", speaking);
  }
  function watchSpeaking(id, stream) {
    if (analysers.has(id) || !stream?.getAudioTracks().length) return;
    audioContext ||= new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = .65;
    source.connect(analyser);
    const values = new Uint8Array(analyser.frequencyBinCount);
    let speakingFrames = 0;
    const tick = () => {
      if (!analysers.has(id)) return;
      analyser.getByteFrequencyData(values);
      const level = values.reduce((sum, value) => sum + value, 0) / values.length;
      speakingFrames = level > 18 ? Math.min(4, speakingFrames + 1) : Math.max(0, speakingFrames - 1);
      setSpeaking(id, speakingFrames >= 2);
      analysers.get(id).frame = requestAnimationFrame(tick);
    };
    analysers.set(id, { source, analyser, frame: requestAnimationFrame(tick) });
  }
  function attachStream(id, stream) {
    remoteStreams.set(id, stream);
    attachAudio(id, stream);
    attachVideo(id, stream);
  }
  async function makePeer(id, initiator) {
    if (peers.has(id)) return peers.get(id);
    const pc = new RTCPeerConnection(rtcConfig);
    peers.set(id, pc);
    localStream?.getTracks().forEach((track) => pc.addTrack(track, localStream));
    pc.onicecandidate = ({ candidate }) => { if (candidate) emitSignal(id, { candidate }); };
    pc.ontrack = ({ streams }) => { if (streams[0]) attachStream(id, streams[0]); };
    pc.onconnectionstatechange = () => { if (["failed", "closed"].includes(pc.connectionState)) closePeer(id); };
    if (initiator) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      emitSignal(id, { description: pc.localDescription });
    }
    return pc;
  }
  function closePeer(id) {
    peers.get(id)?.close();
    peers.delete(id);
    remoteStreams.delete(id);
    const meter = analysers.get(id);
    if (meter) { cancelAnimationFrame(meter.frame); meter.source.disconnect(); analysers.delete(id); }
    setSpeaking(id, false);
    document.querySelector(`#remoteMedia audio[data-peer="${CSS.escape(id)}"]`)?.remove();
  }
  async function handleSignal({ peerId, signal }) {
    const pc = await makePeer(peerId, false);
    if (signal.description) {
      await pc.setRemoteDescription(signal.description);
      if (signal.description.type === "offer") {
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        emitSignal(peerId, { description: pc.localDescription });
      }
    } else if (signal.candidate) {
      try { await pc.addIceCandidate(signal.candidate); } catch { /* stale candidate during reconnect */ }
    }
  }
  async function replaceTracks() {
    for (const pc of peers.values()) {
      for (const sender of pc.getSenders()) {
        const replacement = localStream?.getTracks().find((track) => track.kind === sender.track?.kind) || null;
        await sender.replaceTrack(replacement);
      }
      const existingKinds = new Set(pc.getSenders().map((sender) => sender.track?.kind).filter(Boolean));
      localStream?.getTracks().forEach((track) => { if (!existingKinds.has(track.kind)) pc.addTrack(track, localStream); });
    }
  }
  async function acquire(wantVideo) {
    const next = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true },
      video: wantVideo ? { facingMode: "user", width: { ideal: 320 }, height: { ideal: 240 }, frameRate: { ideal: 15, max: 20 } } : false,
    });
    localStream?.getTracks().forEach((track) => track.stop());
    localStream = next;
    audioEnabled = true;
    videoEnabled = wantVideo;
    attachVideo(playerId, localStream, true);
    await replaceTracks();
  }
  function mediaErrorMessage(error, fallback) {
    if (error?.name === "NotAllowedError" || error?.name === "SecurityError") {
      return "Izin media belum bisa diminta. Tutup bubble/overlay aplikasi lain, lalu coba lagi.";
    }
    if (error?.name === "NotReadableError" || error?.name === "AbortError") {
      return "Mikrofon atau kamera sedang dipakai aplikasi lain. Tutup aplikasi tersebut, lalu coba lagi.";
    }
    return error?.message || fallback;
  }
  async function join(wantVideo) {
    try {
      await acquire(wantVideo);
      const response = await request("media:join", { audio: true, video: wantVideo });
      if (!response?.ok) throw new Error(response?.error || "Media gagal diaktifkan.");
      audioButton.classList.add("active");
      videoButton.classList.toggle("active", wantVideo);
      for (const peer of response.peers || []) await makePeer(peer.id, true);
      resumeRemoteAudio();
    } catch (error) {
      if (wantVideo) {
        try { await acquire(false); const fallback = await request("media:join", { audio: true, video: false }); if (!fallback?.ok) throw new Error(fallback?.error); audioButton.classList.add("active"); videoButton.classList.remove("active"); }
        catch { alert(mediaErrorMessage(error, "Izin media ditolak.")); }
      } else alert(mediaErrorMessage(error, "Izin mikrofon ditolak."));
    }
  }
  async function toggleAudio() {
    if (!localStream) { pendingMode = "audio"; dialog.showModal(); return; }
    if (document.querySelector('#remoteMedia audio[data-blocked="true"]')) { resumeRemoteAudio(); return; }
    audioEnabled = !audioEnabled;
    localStream.getAudioTracks().forEach((track) => { track.enabled = audioEnabled; });
    const response = await request("media:status", { audio: audioEnabled, video: videoEnabled });
    if (!response?.ok) return;
    audioButton.classList.toggle("active", audioEnabled);
  }
  async function toggleVideo() {
    if (!localStream) { pendingMode = "video"; dialog.showModal(); return; }
    const next = !videoEnabled;
    const previousAudio = audioEnabled;
    if (next && !localStream.getVideoTracks().length) {
      try {
        await acquire(true);
        audioEnabled = previousAudio;
        localStream.getAudioTracks().forEach((track) => { track.enabled = audioEnabled; });
        await request("media:leave");
        [...peers.keys()].forEach(closePeer);
        const joined = await request("media:join", { audio: audioEnabled, video: true });
        if (!joined?.ok) throw new Error(joined?.error || "Kamera gagal diaktifkan.");
        for (const peer of joined.peers || []) await makePeer(peer.id, true);
      } catch (error) {
        videoEnabled = false;
        localStream?.getVideoTracks().forEach((track) => { track.enabled = false; });
        return alert(error.message || "Kamera tidak tersedia. Voice tetap aktif.");
      }
    }
    const response = await request("media:status", { audio: audioEnabled, video: next });
    if (!response?.ok) {
      videoEnabled = false;
      localStream.getVideoTracks().forEach((track) => { track.enabled = false; });
      return alert(response?.error || "Kamera gagal diaktifkan.");
    }
    videoEnabled = next;
    localStream.getVideoTracks().forEach((track) => { track.enabled = next; });
    videoButton.classList.toggle("active", next);
  }
  async function leave() {
    if (request) await request("media:leave");
    localStream?.getTracks().forEach((track) => track.stop());
    localStream = null;
    [...peers.keys()].forEach(closePeer);
    audioEnabled = false;
    videoEnabled = false;
  }
  function syncSeats(players, ownId) {
    playerId = ownId;
    players.forEach((player) => {
      const slot = videoSlot(player.id);
      if (!player.media?.video) slot?.querySelector("video")?.remove();
      else if (player.id === playerId && localStream) attachVideo(player.id, localStream, true);
      else if (remoteStreams.has(player.id)) attachVideo(player.id, remoteStreams.get(player.id));
    });
  }
  function configure(config) {
    socket = config.socket;
    request = config.request;
    playerId = config.playerId;
    if (socket.__pokerMediaBound) return;
    socket.__pokerMediaBound = true;
    socket.on("media:peer-joined", ({ peerId }) => { if (localStream) makePeer(peerId, false); });
    socket.on("media:signal", handleSignal);
    socket.on("media:peer-left", ({ peerId }) => closePeer(peerId));
    socket.on("disconnect", () => { [...peers.keys()].forEach(closePeer); });
  }
  audioButton.addEventListener("click", toggleAudio);
  videoButton.addEventListener("click", toggleVideo);
  document.addEventListener("pointerdown", resumeRemoteAudio, { passive: true });
  confirm.addEventListener("click", (event) => { event.preventDefault(); dialog.close(); join(pendingMode === "video"); pendingMode = null; });
  window.addEventListener("beforeunload", () => { localStream?.getTracks().forEach((track) => track.stop()); });
  window.PokerMedia = { configure, syncSeats, leave };
})();
