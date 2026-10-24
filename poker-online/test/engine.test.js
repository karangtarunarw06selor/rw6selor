"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  createDeck,
  evaluateSeven,
  compareHands,
  PokerTable,
} = require("../poker-engine");

const cards = (...values) => values.map((value) => ({ rank: value.slice(0, -1), suit: value.slice(-1) }));

test("deck has 52 unique cards", () => {
  const deck = createDeck();
  assert.equal(deck.length, 52);
  assert.equal(new Set(deck.map((card) => `${card.rank}${card.suit}`)).size, 52);
});

test("evaluator ranks straight flush above four of a kind", () => {
  const straightFlush = evaluateSeven(cards("9h", "Th", "Jh", "Qh", "Kh", "2c", "3d"));
  const quads = evaluateSeven(cards("As", "Ah", "Ad", "Ac", "Ks", "2c", "3d"));
  assert.equal(straightFlush.name, "Straight Flush");
  assert.equal(quads.name, "Four of a Kind");
  assert.equal(compareHands(straightFlush, quads) > 0, true);
});

test("evaluator handles wheel straight and split pots", () => {
  const wheel = evaluateSeven(cards("Ah", "2c", "3d", "4s", "5h", "Kd", "Qc"));
  assert.equal(wheel.name, "Straight");
  assert.equal(wheel.tiebreak[0], 5);
  const boardRoyal = cards("Ah", "Kh", "Qh", "Jh", "Th");
  const a = evaluateSeven([...boardRoyal, ...cards("2c", "3d")]);
  const b = evaluateSeven([...boardRoyal, ...cards("9c", "9d")]);
  assert.equal(compareHands(a, b), 0);
});

test("table deals private cards and exposes only own hole cards", () => {
  const table = new PokerTable({ code: "ABC123", siteId: "MMS", smallBlind: 10, bigBlind: 20 });
  const a = table.addPlayer({ id: "a", name: "A" });
  const b = table.addPlayer({ id: "b", name: "B" });
  table.startHand(() => 0);
  assert.equal(a.hole.length, 2);
  assert.equal(b.hole.length, 2);
  assert.deepEqual(table.viewFor("a").players.find((p) => p.id === "a").hole, a.hole);
  assert.deepEqual(table.viewFor("a").players.find((p) => p.id === "b").hole, [null, null]);
  assert.throws(() => table.startHand(() => 0), /sedang berjalan/i);
});

test("preflop enforces turn and valid call amount", () => {
  const table = new PokerTable({ code: "ABC123", siteId: "MMS", smallBlind: 10, bigBlind: 20 });
  table.addPlayer({ id: "a", name: "A" });
  table.addPlayer({ id: "b", name: "B" });
  table.addPlayer({ id: "c", name: "C" });
  table.startHand(() => 0);
  const actor = table.currentPlayer();
  const other = table.players.find((p) => p.id !== actor.id);
  assert.throws(() => table.act(other.id, { type: "call" }), /giliran/i);
  const before = actor.stack;
  const owed = table.currentBet - actor.streetBet;
  table.act(actor.id, { type: "call" });
  assert.equal(actor.stack, before - owed);
});

test("minimum raise follows the previous full raise size", () => {
  const table = new PokerTable({ code: "RAISE1", siteId: "MMS", smallBlind: 10, bigBlind: 20 });
  table.addPlayer({ id: "a", name: "A" });
  table.addPlayer({ id: "b", name: "B" });
  table.addPlayer({ id: "c", name: "C" });
  table.startHand(() => 0);
  let actor = table.currentPlayer();
  table.act(actor.id, { type: "raise", amount: 100, actionId: "raise-100" });
  actor = table.currentPlayer();
  assert.throws(() => table.act(actor.id, { type: "raise", amount: 150, actionId: "raise-150" }), /minimal 180/i);
  table.act(actor.id, { type: "raise", amount: 180, actionId: "raise-180" });
  assert.equal(table.currentBet, 180);
});

test("last remaining player wins pot after folds", () => {
  const table = new PokerTable({ code: "ABC123", siteId: "KT", smallBlind: 10, bigBlind: 20 });
  table.addPlayer({ id: "a", name: "A" });
  table.addPlayer({ id: "b", name: "B" });
  table.startHand(() => 0);
  const actor = table.currentPlayer();
  const pot = table.pot;
  const winner = table.players.find((p) => p.id !== actor.id);
  const before = winner.stack;
  table.act(actor.id, { type: "fold" });
  assert.equal(table.phase, "finished");
  assert.equal(table.lastResult.winners[0].id, winner.id);
  assert.equal(winner.stack, before + pot);
});

test("action id is idempotent", () => {
  const table = new PokerTable({ code: "ABC123", siteId: "MMS", smallBlind: 10, bigBlind: 20 });
  table.addPlayer({ id: "a", name: "A" });
  table.addPlayer({ id: "b", name: "B" });
  table.startHand(() => 0);
  const actor = table.currentPlayer();
  const action = { type: "call", actionId: "same-action" };
  table.act(actor.id, action);
  const after = actor.stack;
  table.act(actor.id, action);
  assert.equal(actor.stack, after);
  const next = table.currentPlayer();
  assert.throws(() => table.act(next.id, action), /ID aksi/i);
});

test("timeout folds current player and advances or finishes hand", () => {
  const table = new PokerTable({ code: "TIME01", siteId: "MMS" });
  table.addPlayer({ id: "a", name: "A" });
  table.addPlayer({ id: "b", name: "B" });
  table.startHand(() => 0);
  const actor = table.currentPlayer();
  table.timeoutCurrentPlayer();
  assert.equal(actor.folded, true);
  assert.equal(table.phase, "finished");
});

test("all-in side pots conserve chips", () => {
  const table = new PokerTable({ code: "ABC123", siteId: "MMS", smallBlind: 10, bigBlind: 20 });
  const a = table.addPlayer({ id: "a", name: "A", stack: 100 });
  const b = table.addPlayer({ id: "b", name: "B", stack: 200 });
  const c = table.addPlayer({ id: "c", name: "C", stack: 300 });
  table.startHand(() => 0);
  for (let guard = 0; table.phase !== "finished" && guard < 30; guard += 1) {
    const actor = table.currentPlayer();
    if (!actor) break;
    table.act(actor.id, { type: "all-in", actionId: `a-${guard}` });
  }
  assert.equal(a.stack + b.stack + c.stack, 600);
});

test("nested side pots pay only eligible winners", () => {
  const table = new PokerTable({ code: "SIDE01", siteId: "MMS" });
  const a = table.addPlayer({ id: "a", name: "A", stack: 0 });
  const b = table.addPlayer({ id: "b", name: "B", stack: 0 });
  const c = table.addPlayer({ id: "c", name: "C", stack: 0 });
  Object.assign(a, { hole: cards("Ah", "Ad"), committed: 100 });
  Object.assign(b, { hole: cards("Kh", "Kd"), committed: 200 });
  Object.assign(c, { hole: cards("Qh", "Qd"), committed: 300 });
  table.board = cards("2c", "3d", "7s", "8c", "9d");
  table.pot = 600;
  table.phase = "river";
  table.showdown();
  assert.deepEqual([a.stack, b.stack, c.stack], [300, 200, 100]);
  assert.equal(a.stack + b.stack + c.stack, 600);
});

test("unmatched folded overbet is returned instead of disappearing", () => {
  const table = new PokerTable({ code: "REFUND", siteId: "MMS" });
  const folded = table.addPlayer({ id: "folded", name: "Folded", stack: 0 });
  const winner = table.addPlayer({ id: "winner", name: "Winner", stack: 0 });
  const loser = table.addPlayer({ id: "loser", name: "Loser", stack: 0 });
  Object.assign(folded, { hole: cards("2h", "3h"), committed: 300, folded: true });
  Object.assign(winner, { hole: cards("Ah", "Ad"), committed: 100 });
  Object.assign(loser, { hole: cards("Kh", "Kd"), committed: 100 });
  table.board = cards("4c", "5d", "8s", "9c", "Td");
  table.pot = 500;
  table.phase = "river";
  table.showdown();
  assert.deepEqual([folded.stack, winner.stack, loser.stack], [200, 300, 0]);
  assert.equal(folded.stack + winner.stack + loser.stack, 500);
});
