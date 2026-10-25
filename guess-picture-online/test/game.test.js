"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { normalize, scoreFor, drawerScoreFor } = require("../server");

test("answer matching ignores capitalization, punctuation, accents, and repeated spaces", () => {
  assert.equal(normalize("  GuNuNg---Everest!! "), "gunung everest");
  assert.equal(normalize("MÉNARA   EIFFEL"), "menara eiffel");
});
test("scores decrease as more clues are opened", () => {
  assert.deepEqual([1, 2, 3, 4].map(scoreFor), [4, 3, 2, 1]);
  assert.deepEqual([1, 2, 3, 4].map(drawerScoreFor), [3, 2, 1, 1]);
});
