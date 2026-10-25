"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { move } = require("../game-engine");

const summary = (result) => ({
  from: result.from,
  path: result.path,
  stepped: result.stepped,
  transfers: result.transfers,
  to: result.to,
  event: result.event,
  won: result.won,
});

test("normal move advances token", () => assert.deepEqual(summary(move(1, 1)), {
  from: 1, path: [2], stepped: 2, transfers: [], to: 2, event: "move", won: false,
}));

test("ladder raises token", () => assert.deepEqual(summary(move(1, 2)), {
  from: 1, path: [2, 3], stepped: 3, transfers: [{ from: 3, to: 22, event: "ladder" }], to: 22, event: "ladder", won: false,
}));

test("snake 54 descends to 34", () => assert.deepEqual(summary(move(53, 1)), {
  from: 53, path: [54], stepped: 54, transfers: [{ from: 54, to: 34, event: "snake" }], to: 34, event: "snake", won: false,
}));

test("ladder 88 chains through snake 99 to 83", () => assert.deepEqual(summary(move(87, 1)), {
  from: 87,
  path: [88],
  stepped: 88,
  transfers: [{ from: 88, to: 99, event: "ladder" }, { from: 99, to: 83, event: "snake" }],
  to: 83,
  event: "snake",
  won: false,
}));

test("98 plus 3 bounces at 100 and lands on snake 99", () => assert.deepEqual(summary(move(98, 3)), {
  from: 98, path: [99, 100, 99], stepped: 99, transfers: [{ from: 99, to: 83, event: "snake" }], to: 83, event: "snake", won: false,
}));

test("96 plus 5 bounces at 100 and lands on snake 99", () => assert.deepEqual(summary(move(96, 5)), {
  from: 96, path: [97, 98, 99, 100, 99], stepped: 99, transfers: [{ from: 99, to: 83, event: "snake" }], to: 83, event: "snake", won: false,
}));

test("landing exactly on 100 wins", () => assert.deepEqual(summary(move(96, 4)), {
  from: 96, path: [97, 98, 99, 100], stepped: 100, transfers: [], to: 100, event: "move", won: true,
}));

test("invalid dice value is rejected", () => assert.throws(() => move(1, 7), /Nilai dadu/));
