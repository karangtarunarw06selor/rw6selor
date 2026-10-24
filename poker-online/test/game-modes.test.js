"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { BigTwoTable, evaluateBigTwoPlay, compareBigTwoPlays, CangkulanTable } = require("../game-modes");

const cards = (...values) => values.map((value) => ({ rank: value.slice(0, -1), suit: value.slice(-1) }));

test("capsa banting ranks 2 above ace and spade above lower suits", () => {
  assert.equal(compareBigTwoPlays(evaluateBigTwoPlay(cards("2d")), evaluateBigTwoPlay(cards("As"))) > 0, true);
  assert.equal(compareBigTwoPlays(evaluateBigTwoPlay(cards("7s")), evaluateBigTwoPlay(cards("7h"))) > 0, true);
  assert.equal(compareBigTwoPlays(evaluateBigTwoPlay(cards("7h", "7s")), evaluateBigTwoPlay(cards("7c", "7d"))) > 0, true);
});

test("capsa banting compares five-card categories and straight vote rules", () => {
  const straight = evaluateBigTwoPlay(cards("3d", "4c", "5h", "6s", "7d"), "classic");
  const flush = evaluateBigTwoPlay(cards("3h", "6h", "9h", "Jh", "Kh"), "classic");
  assert.equal(compareBigTwoPlays(flush, straight) > 0, true);
  assert.throws(() => evaluateBigTwoPlay(cards("Ad", "2c", "3h", "4s", "5d"), "classic"), /straight/i);
  assert.equal(evaluateBigTwoPlay(cards("Ad", "2c", "3h", "4s", "5d"), "free").type, "five");
  assert.equal(evaluateBigTwoPlay(cards("Ad", "2c", "3h", "4s", "5d"), "wheel").type, "five");
  assert.throws(() => evaluateBigTwoPlay(cards("2d", "3c", "4h", "5s", "6d"), "wheel"), /straight/i);
});

test("capsa banting requires 3 diamonds to open, supports pass reset, and keeps hands private", () => {
  const table = new BigTwoTable({ code: "BIG201", siteId: "MMS", straightRule: "classic" });
  const a = table.addPlayer({ id: "a", name: "A" });
  const b = table.addPlayer({ id: "b", name: "B" });
  const c = table.addPlayer({ id: "c", name: "C" });
  table.startRound({ hands: {
    a: cards("3d", "4c"),
    b: cards("5d", "6c"),
    c: cards("7d", "8c"),
  } });
  assert.equal(table.currentPlayer().id, "a");
  assert.throws(() => table.act("a", { type: "play", cardIndexes: [1], actionId: "bad-open" }), /3♦/i);
  table.act("a", { type: "play", cardIndexes: [0], actionId: "open" });
  assert.deepEqual(table.viewFor("b").players.find((p) => p.id === "a").hand, [null]);
  table.act("b", { type: "pass", actionId: "pass-b" });
  table.act("c", { type: "pass", actionId: "pass-c" });
  assert.equal(table.currentPlayer().id, "a");
  assert.equal(table.currentPlay, null);
  table.act("a", { type: "play", cardIndexes: [0], actionId: "win" });
  assert.equal(table.phase, "finished");
  assert.equal(table.lastResult.winners[0].id, a.id);
});

test("capsa banting timeout opens with 3 diamonds and then auto-passes", () => {
  const table = new BigTwoTable({ code: "BIG202", siteId: "KT", straightRule: "classic" });
  table.addPlayer({ id: "a", name: "A" });
  table.addPlayer({ id: "b", name: "B" });
  table.startRound({ hands: { a: cards("3d", "9c"), b: cards("4d", "8c") } });
  table.timeoutCurrentPlayer();
  assert.deepEqual(table.currentPlay.cards, cards("3d"));
  assert.equal(table.currentPlayer().id, "b");
  table.timeoutCurrentPlayer();
  assert.equal(table.currentPlayer().id, "a");
  assert.equal(table.currentPlay, null);
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
