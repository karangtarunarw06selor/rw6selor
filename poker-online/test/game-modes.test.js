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

test("minuman follows the system house and keeps opponents private", () => {
  const table = new CangkulanTable({ code: "MINUM1", siteId: "MMS" });
  table.addPlayer({ id: "a", name: "A" });
  table.addPlayer({ id: "b", name: "B" });
  table.startRound({ hands: { a: cards("7h", "2c"), b: cards("9h", "3d") }, stock: cards("4c"), openingCard: cards("5h")[0] });
  assert.equal(table.houseSuit, "h");
  assert.throws(() => table.act("a", { type: "play", cardIndex: 1, actionId: "bad" }), /house/i);
  table.act("a", { type: "play", cardIndex: 0, actionId: "good" });
  assert.equal(table.currentTrick[0].card.rank, "7");
  const bView = table.viewFor("b");
  assert.deepEqual(bView.players.find((p) => p.id === "a").hand, [null]);
  assert.deepEqual(bView.players.find((p) => p.id === "b").hand, cards("9h", "3d"));
});

test("minuman draws until matching the house and plays the drawn card", () => {
  const table = new CangkulanTable({ code: "MINUM2", siteId: "KT" });
  table.addPlayer({ id: "a", name: "A" });
  table.addPlayer({ id: "b", name: "B" });
  table.startRound({ hands: { a: cards("2c"), b: cards("3h") }, stock: cards("6h", "5d", "4s"), openingCard: cards("9h")[0] });
  table.act("a", { type: "draw", actionId: "drink-a" });
  assert.deepEqual(table.players[0].hand, cards("2c", "4s", "5d"));
  assert.equal(table.currentTrick[0].card.rank, "6");
  assert.equal(table.currentPlayer().id, "b");
});

test("minuman clears a completed trick and highest rank becomes bandar", () => {
  const table = new CangkulanTable({ code: "MINUM3", siteId: "MMS" });
  table.addPlayer({ id: "a", name: "A" });
  table.addPlayer({ id: "b", name: "B" });
  table.addPlayer({ id: "c", name: "C" });
  table.startRound({ hands: { a: cards("7h", "2c"), b: cards("Ah", "3d"), c: cards("Kh", "4s") }, stock: cards("6c"), openingCard: cards("9h")[0] });
  table.act("a", { type: "play", cardIndex: 0, actionId: "a" });
  table.act("b", { type: "play", cardIndex: 0, actionId: "b" });
  table.act("c", { type: "play", cardIndex: 0, actionId: "c" });
  assert.equal(table.currentTrick.length, 0);
  assert.equal(table.houseSuit, null);
  assert.equal(table.bandarId, "b");
  assert.equal(table.currentPlayer().id, "b");
  table.act("b", { type: "play", cardIndex: 0, actionId: "lead" });
  assert.equal(table.houseSuit, "d");
});

test("minuman records finish order, skips finished players, and ranks the last player as loser", () => {
  const table = new CangkulanTable({ code: "MINUM4", siteId: "MMS" });
  table.addPlayer({ id: "a", name: "A" });
  table.addPlayer({ id: "b", name: "B" });
  table.addPlayer({ id: "c", name: "C" });
  table.startRound({ hands: { a: cards("2h"), b: cards("Ah", "3d"), c: cards("Kh", "4s") }, stock: cards("5c"), openingCard: cards("9h")[0] });
  table.act("a", { type: "play", cardIndex: 0, actionId: "first" });
  assert.deepEqual(table.rankings.map((entry) => entry.id), ["a"]);
  assert.equal(table.currentPlayer().id, "b");
  table.act("b", { type: "play", cardIndex: 0, actionId: "b-house" });
  table.act("c", { type: "play", cardIndex: 0, actionId: "c-house" });
  assert.equal(table.bandarId, "b");
  assert.equal(table.currentPlayer().id, "b");
  table.act("b", { type: "play", cardIndex: 0, actionId: "second" });
  assert.equal(table.phase, "finished");
  assert.deepEqual(table.lastResult.rankings.map((entry) => entry.id), ["a", "b", "c"]);
  assert.equal(table.lastResult.rankings[2].rank, 3);
  assert.equal(table.act("b", { type: "play", cardIndex: 0, actionId: "second" }).duplicate, true);
});
