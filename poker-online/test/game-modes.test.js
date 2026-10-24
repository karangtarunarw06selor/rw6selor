"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { CapsaFiveTable, CangkulanTable } = require("../game-modes");

const cards = (...values) => values.map((value) => ({ rank: value.slice(0, -1), suit: value.slice(-1) }));

test("capsa five deals five private cards and awards the strongest poker hand", () => {
  const table = new CapsaFiveTable({ code: "CAPSA1", siteId: "MMS" });
  const a = table.addPlayer({ id: "a", name: "A" });
  const b = table.addPlayer({ id: "b", name: "B" });
  table.startRound({
    hands: {
      a: cards("Ah", "Ad", "Ac", "Ks", "Kd"),
      b: cards("Kh", "Kd", "Kc", "Qs", "Qd"),
    },
  });
  assert.equal(table.phase, "finished");
  assert.equal(table.lastResult.winners[0].id, "a");
  assert.equal(a.hand.length, 5);
  assert.equal(b.hand.length, 5);
  assert.deepEqual(table.viewFor("a").players.find((p) => p.id === "b").hand, b.hand);
  assert.deepEqual(table.viewFor("a").players.find((p) => p.id === "a").hand, a.hand);
});

test("capsa five splits a tied result", () => {
  const table = new CapsaFiveTable({ code: "CAPSA2", siteId: "KT" });
  table.addPlayer({ id: "a", name: "A" });
  table.addPlayer({ id: "b", name: "B" });
  table.startRound({ hands: { a: cards("Ah", "Kd", "Qc", "Js", "9h"), b: cards("As", "Kh", "Qd", "Jc", "9s") } });
  assert.deepEqual(table.lastResult.winners.map((winner) => winner.id).sort(), ["a", "b"]);
});

test("cangkulan permits only matching rank or suit and keeps hands private", () => {
  const table = new CangkulanTable({ code: "CANG01", siteId: "MMS" });
  table.addPlayer({ id: "a", name: "A" });
  table.addPlayer({ id: "b", name: "B" });
  table.startRound({ hands: { a: cards("7h", "2c"), b: cards("9s", "3d") }, stock: cards("4c"), discard: cards("9h") });
  assert.equal(table.currentPlayer().id, "a");
  assert.throws(() => table.act("a", { type: "play", cardIndex: 1, actionId: "bad" }), /tidak cocok/i);
  table.act("a", { type: "play", cardIndex: 0, actionId: "good" });
  assert.equal(table.topDiscard().rank, "7");
  const bView = table.viewFor("b");
  assert.deepEqual(bView.players.find((p) => p.id === "a").hand, [null]);
  assert.deepEqual(bView.players.find((p) => p.id === "b").hand, cards("9s", "3d"));
});

test("cangkulan draws until playable, plays it, and advances turn", () => {
  const table = new CangkulanTable({ code: "CANG02", siteId: "KT" });
  table.addPlayer({ id: "a", name: "A" });
  table.addPlayer({ id: "b", name: "B" });
  table.startRound({ hands: { a: cards("2c"), b: cards("3d") }, stock: cards("6h", "5d", "4s"), discard: cards("9h") });
  table.act("a", { type: "draw", actionId: "draw-a" });
  assert.equal(table.players[0].hand.length, 3);
  assert.equal(table.topDiscard().rank, "6");
  assert.equal(table.currentPlayer().id, "b");
});

test("cangkulan ends when a player empties their hand and action ids are idempotent", () => {
  const table = new CangkulanTable({ code: "CANG03", siteId: "MMS" });
  table.addPlayer({ id: "a", name: "A" });
  table.addPlayer({ id: "b", name: "B" });
  table.startRound({ hands: { a: cards("7h"), b: cards("3d") }, stock: cards("4s"), discard: cards("9h") });
  const action = { type: "play", cardIndex: 0, actionId: "win" };
  table.act("a", action);
  assert.equal(table.phase, "finished");
  assert.equal(table.lastResult.winners[0].id, "a");
  const duplicate = table.act("a", action);
  assert.equal(duplicate.duplicate, true);
});

test("cangkulan recycles the discard pile when stock runs out", () => {
  const table = new CangkulanTable({ code: "CANG04", siteId: "MMS" });
  table.addPlayer({ id: "a", name: "A" });
  table.addPlayer({ id: "b", name: "B" });
  table.startRound({ hands: { a: cards("2c"), b: cards("3d") }, stock: [], discard: cards("4h", "9h") });
  table.act("a", { type: "draw", actionId: "recycle" });
  assert.equal(table.discard.length, 2);
  assert.equal(table.topDiscard().rank, "4");
});
