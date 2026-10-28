const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { test, before, after } = require("node:test");
const WebSocket = require("ws");

const port = 3318;
let server;

const waitFor = (ws, type) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`Timeout waiting for ${type}`)), 2000);
  const handler = (raw) => {
    const message = JSON.parse(raw.toString());
    if (message.type !== type) return;
    clearTimeout(timer);
    ws.off("message", handler);
    resolve(message);
  };
  ws.on("message", handler);
});
const connect = () => new Promise((resolve, reject) => {
  const ws = new WebSocket(`ws://127.0.0.1:${port}`);
  ws.once("open", () => resolve(ws));
  ws.once("error", reject);
});
const send = (ws, message) => ws.send(JSON.stringify(message));
const presence = async (ws, siteId, gameId, clientId, username) => {
  const update = waitFor(ws, "presence_update");
  send(ws, { type: "presence_join", site_id: siteId, game_id: gameId, client_id: clientId, username });
  return update;
};
const join = async (ws, siteId, roomCode, playerId, username, spectator = false) => {
  const joined = waitFor(ws, "joined_room");
  send(ws, { type: "join_room", site_id: siteId, room_code: roomCode, player_id: playerId, username, spectator });
  return joined;
};

before(async () => {
  server = spawn(process.execPath, ["server.js"], { cwd: __dirname, env: { ...process.env, PORT: String(port), NODE_ENV: "test" } });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Server failed to start")), 3000);
    server.stdout.on("data", (chunk) => {
      if (!chunk.toString().includes(`127.0.0.1:${port}`)) return;
      clearTimeout(timer);
      resolve();
    });
    server.once("error", reject);
  });
});

after(() => server?.kill());

test("voice peers and signals stay inside site and billiard room", async () => {
  const host = await connect();
  const guest = await connect();
  const otherSite = await connect();
  const otherRoom = await connect();
  await join(host, "MMS", "ABC123", 1, "Host");
  await join(guest, "MMS", "ABC123", 2, "Guest");
  await join(otherSite, "KT", "ABC123", 3, "KT");
  await join(otherRoom, "MMS", "XYZ789", 4, "Other");

  send(host, { type: "voice_join" });
  assert.deepEqual((await waitFor(host, "voice_joined")).peers, []);
  const peerJoined = waitFor(host, "voice_peer_joined");
  send(guest, { type: "voice_join" });
  assert.deepEqual((await waitFor(guest, "voice_joined")).peers, [{ player_id: "1", username: "Host" }]);
  assert.equal((await peerJoined).player_id, "2");

  const relayed = waitFor(guest, "voice_signal");
  send(host, { type: "voice_signal", target_player_id: 2, signal: { description: { type: "offer", sdp: "test-sdp" } } });
  const signal = await relayed;
  assert.equal(signal.player_id, "1");
  assert.equal(signal.signal.description.type, "offer");

  send(host, { type: "voice_signal", target_player_id: 3, signal: { description: { type: "offer", sdp: "blocked" } } });
  assert.equal((await waitFor(host, "voice_error")).type, "voice_error");
  send(host, { type: "voice_signal", target_player_id: 2, signal: { unexpected: true } });
  assert.equal((await waitFor(host, "voice_error")).type, "voice_error");

  [host, guest, otherSite, otherRoom].forEach((ws) => ws.close());
});

test("legacy gameplay events still relay in the joined site room", async () => {
  const host = await connect();
  const guest = await connect();
  await join(host, "KT", "PLAY01", 11, "Host");
  await join(guest, "KT", "PLAY01", 12, "Guest");
  const aim = waitFor(guest, "aim_update");
  send(host, { type: "aim_update", aim: { x: 5, y: 8 }, power: 30 });
  assert.deepEqual((await aim).aim, { x: 5, y: 8 });
  const frame = waitFor(guest, "ball_frame");
  send(host, { type: "ball_frame", balls: [{ number: 0, x: 221.5, y: 250, vx: 4, vy: 0, pocketed: false }] });
  assert.deepEqual((await frame).balls[0], { number: 0, x: 221.5, y: 250, vx: 4, vy: 0, pocketed: false });
  host.close();
  guest.close();
});

test("spectator keeps voice access but gameplay relays are rejected", async () => {
  const player = await connect();
  const spectator = await connect();
  await join(player, "MMS", "WATCH1", 21, "Player");
  const joined = await join(spectator, "MMS", "WATCH1", 22, "Watcher", true);
  assert.equal(joined.spectator, true);
  send(player, { type: "voice_join" });
  await waitFor(player, "voice_joined");
  const peer = waitFor(player, "voice_peer_joined");
  send(spectator, { type: "voice_join" });
  assert.equal((await waitFor(spectator, "voice_joined")).peers.length, 1);
  assert.equal((await peer).player_id, "22");
  for (const type of ["aim_update", "shot_start", "shot_end"]) {
    const rejected = waitFor(spectator, "gameplay_rejected");
    send(spectator, { type });
    assert.match((await rejected).message, /Penonton/);
  }
  player.close(); spectator.close();
});

test("presence counts unique browsers per site and game", async () => {
  const first = await connect();
  const duplicate = await connect();
  const otherSite = await connect();
  assert.equal((await presence(first, "MMS", "billiard", "browser-1", "Satu")).online_count, 1);
  assert.equal((await presence(duplicate, "MMS", "billiard", "browser-1", "Satu")).online_count, 1);
  assert.equal((await presence(otherSite, "KT", "billiard", "browser-2", "Dua")).online_count, 1);
  first.close(); duplicate.close(); otherSite.close();
});

test("billiard lobby chat stays inside the site", async () => {
  const sender = await connect();
  const receiver = await connect();
  const otherSite = await connect();
  await presence(sender, "MMS", "billiard", "sender", "Host");
  await presence(receiver, "MMS", "billiard", "receiver", "Guest");
  await presence(otherSite, "KT", "billiard", "other", "KT");
  const received = waitFor(receiver, "lobby_chat");
  send(sender, { type: "lobby_chat_send", message: "Ayo main" });
  assert.equal((await received).message, "Ayo main");
  const blocked = waitFor(otherSite, "lobby_chat").then(() => false, () => true);
  assert.equal(await blocked, true);
  sender.close(); receiver.close(); otherSite.close();
});

test("billiard room chat requires membership and stays inside the room", async () => {
  const host = await connect();
  const guest = await connect();
  const outsider = await connect();
  await join(host, "MMS", "CHAT01", 31, "Host");
  await join(guest, "MMS", "CHAT01", 32, "Guest");
  await join(outsider, "MMS", "CHAT02", 33, "Other");
  const received = waitFor(guest, "room_chat");
  send(host, { type: "room_chat_send", message: "Gas" });
  assert.equal((await received).message, "Gas");
  const blocked = waitFor(outsider, "room_chat").then(() => false, () => true);
  assert.equal(await blocked, true);
  host.close(); guest.close(); outsider.close();
});
