"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { move } = require("../game-engine");

test("normal move advances token", () => assert.deepEqual(move(1, 1), { from: 1, stepped: 2, to: 2, event: "move", won: false }));
test("ladder raises token", () => assert.deepEqual(move(1, 2), { from: 1, stepped: 3, to: 22, event: "ladder", won: false }));
test("snake lowers token", () => assert.deepEqual(move(16, 1), { from: 16, stepped: 17, to: 6, event: "snake", won: false }));
test("roll must land exactly on 100", () => assert.deepEqual(move(98, 4), { from: 98, stepped: 98, to: 98, event: "move", won: false }));
test("landing on 100 wins", () => assert.deepEqual(move(96, 4), { from: 96, stepped: 100, to: 100, event: "move", won: true }));
test("invalid dice value is rejected", () => assert.throws(() => move(1, 7), /Nilai dadu/));
