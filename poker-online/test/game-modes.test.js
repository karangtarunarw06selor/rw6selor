"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { BigTwoTable, evaluateBigTwoPlay, compareBigTwoPlays, CangkulanTable, SamgongTable, evaluateSamgong, compareSamgong } = require("../game-modes");

const cards = (...values) => values.map((value) => ({ rank: value.slice(0, -1), suit: value.slice(-1) }));

test("samgong ranks three face cards above ordinary modulo-ten hands", () => {
  const samgong = evaluateSamgong(cards("Js", "Qh", "Kd"));
  const nine = evaluateSamgong(cards("9s", "Kh", "Qd"));
  const five = evaluateSamgong(cards("7s", "8h", "Kd"));
  assert.equal(samgong.samgong, true);
  assert.equal(nine.value, 9);
  assert.equal(five.value, 5);
  assert.equal(compareSamgong(samgong, nine) > 0, true);
});

test("samgong keeps cards private until everyone reveals and dealer wins exact ties", () => {
  const table = new SamgongTable({ code: "SAM001", siteId: "MMS" });
  table.addPlayer({ id: "a", name: "Bandar" });
  table.addPlayer({ id: "b", name: "Tamu" });
  table.startRound({ hands: { a: cards("9s", "Kh", "Qd"), b: cards("9s", "Kh", "Qd") } });
  assert.equal(table.bandarId, "a");
  assert.deepEqual(table.viewFor("a").players.find((player) => player.id === "b").hand, [null, null, null]);
  table.act("a", { type: "reveal", actionId: "open-a" });
  assert.equal(table.phase, "playing");
  table.act("b", { type: "reveal", actionId: "open-b" });
  assert.equal(table.phase, "finished");
  assert.equal(table.lastResult.outcomes.find((entry) => entry.id === "b").result, "lose");
  assert.equal(table.players.find((player) => player.id === "a").score, 1);
  assert.equal(table.players.find((player) => player.id === "b").score, -1);
  assert.equal(table.viewFor("b").players.every((player) => player.hand.every(Boolean)), true);
});

test("samgong rotates dealer each round and timeout reveals the current player", () => {
  const table = new SamgongTable({ code: "SAM002", siteId: "MMS" });
  table.addPlayer({ id: "a", name: "A" });
  table.addPlayer({ id: "b", name: "B" });
  table.startRound({ hands: { a: cards("2s", "3h", "4d"), b: cards("As", "2h", "3d") } });
  table.timeoutCurrentPlayer();
  assert.equal(table.players[0].revealed, true);
  table.timeoutCurrentPlayer();
  assert.equal(table.phase, "finished");
  table.startRound({ hands: { a: cards("2s", "3h", "4d"), b: cards("As", "2h", "3d") } });
  assert.equal(table.bandarId, "b");
});

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

test("minuman keeps exactly 52 physical cards throughout the round", () => {
  const table = new CangkulanTable({ code: "MINUM52", siteId: "MMS" });
  table.addPlayer({ id: "a", name: "A" });
  table.addPlayer({ id: "b", name: "B" });
  table.startRound({ random: () => 0.5 });
  const physicalCards = () => table.stock.length + table.spent.length + table.currentTrick.length
    + table.players.reduce((total, player) => total + player.hand.length, 0);
  assert.equal(physicalCards(), 52);
  assert.equal(new Set([...table.stock, ...table.spent, ...table.players.flatMap((player) => player.hand)].map((card) => `${card.rank}${card.suit}`)).size, 52);
});

test("minuman takes the table discard pile when stock is empty", () => {
  const table = new CangkulanTable({ code: "MINUMPILE", siteId: "MMS" });
  table.addPlayer({ id: "a", name: "A" });
  table.addPlayer({ id: "b", name: "B" });
  table.startRound({ hands: { a: cards("2c"), b: cards("3h") }, stock: [], openingCard: cards("9h")[0] });
  table.spent.push(...cards("4d", "5s"));
  table.completedTrick = [
    { playerId: "a", card: table.spent[1] },
    { playerId: "b", card: table.spent[2] },
  ];
  table.act("a", { type: "draw", actionId: "take-pile" });
  assert.deepEqual(table.players[0].hand, cards("2c", "9h", "4d", "5s"));
  assert.equal(table.stock.length, 0);
  assert.equal(table.spent.length, 0);
  assert.equal(table.completedTrick.length, 0);
});

test("minuman draws one card at a time and requires confirmation before playing", () => {
  const table = new CangkulanTable({ code: "MINUM2", siteId: "KT" });
  table.addPlayer({ id: "a", name: "A" });
  table.addPlayer({ id: "b", name: "B" });
  table.startRound({ hands: { a: cards("2c"), b: cards("3h") }, stock: cards("6h", "5d", "4s"), openingCard: cards("9h")[0] });
  table.act("a", { type: "draw", actionId: "drink-a" });
  assert.deepEqual(table.players[0].hand, cards("2c", "4s"));
  assert.equal(table.currentTrick.length, 0);
  assert.equal(table.currentPlayer().id, "a");
  table.act("a", { type: "draw", actionId: "drink-a-2" });
  assert.deepEqual(table.players[0].hand, cards("2c", "4s", "5d"));
  table.act("a", { type: "draw", actionId: "drink-a-3" });
  assert.deepEqual(table.players[0].hand, cards("2c", "4s", "5d", "6h"));
  assert.throws(() => table.act("a", { type: "draw", actionId: "drink-extra" }), /house/i);
  table.act("a", { type: "play", cardIndex: 3, actionId: "confirm-a" });
  assert.equal(table.currentTrick[0].card.rank, "6");
  assert.equal(table.currentPlayer().id, "b");
});

test("minuman keeps the completed trick visible until bandar opens a new house", () => {
  const table = new CangkulanTable({ code: "MINUM3", siteId: "MMS" });
  table.addPlayer({ id: "a", name: "A" });
  table.addPlayer({ id: "b", name: "B" });
  table.addPlayer({ id: "c", name: "C" });
  table.startRound({ hands: { a: cards("7h", "2c"), b: cards("Ah", "3d"), c: cards("Kh", "4s") }, stock: cards("6c"), openingCard: cards("9h")[0] });
  table.act("a", { type: "play", cardIndex: 0, actionId: "a" });
  table.act("b", { type: "play", cardIndex: 0, actionId: "b" });
  table.act("c", { type: "play", cardIndex: 0, actionId: "c" });
  assert.equal(table.currentTrick.length, 0);
  assert.deepEqual(table.completedTrick.map((play) => play.playerId), ["a", "b", "c"]);
  assert.equal(table.completedTrickWinnerId, "b");
  assert.equal(table.houseSuit, null);
  assert.equal(table.bandarId, "b");
  assert.equal(table.currentPlayer().id, "b");
  table.act("b", { type: "play", cardIndex: 0, actionId: "lead" });
  assert.equal(table.houseSuit, "d");
  assert.equal(table.completedTrick.length, 0);
  assert.equal(table.completedTrickWinnerId, null);
  assert.equal(table.currentTrick[0].playerId, "b");
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
