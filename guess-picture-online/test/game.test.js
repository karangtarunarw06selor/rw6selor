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

test("question bank adds a third 100 unique private images for 308 total", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const crypto = require("node:crypto");
  const questions = require("../questions");
  const sources = require("../assets/questions/sources.json");
  const ids = new Set(questions.map((question) => question.id));
  const answers = new Set(questions.map((question) => normalize(question.answer)));
  const images = new Set(questions.map((question) => question.image));
  const hashes = new Set(questions.map((question) => {
    const file = path.join(__dirname, "..", "assets", "questions", question.image);
    assert.equal(fs.existsSync(file), true, `Gambar tidak ditemukan: ${question.image}`);
    assert.ok(fs.statSync(file).size > 4_000, `Gambar terlalu kecil: ${question.image}`);
    return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  }));
  assert.equal(questions.length, 308);
  assert.equal(ids.size, 308);
  assert.equal(answers.size, 308);
  assert.equal(images.size, 308);
  assert.equal(hashes.size, 308);
  assert.equal(Object.keys(sources).length, 308);
  const answerOwners = new Map(questions.map((question) => [normalize(question.answer), question.id]));
  questions.forEach((question) => {
    assert.ok(question.aliases instanceof Array);
    assert.ok(question.forbidden.length > 0);
    assert.equal(question.examples.length, 4);
    const source = sources[question.image];
    assert.ok(source, `Sumber tidak ditemukan: ${question.image}`);
    ["page", "image", "artist", "license", "retrieved"].forEach((field) => {
      assert.ok(source[field], `Metadata ${field} kosong: ${question.image}`);
    });
    question.aliases.forEach((alias) => {
      const owner = answerOwners.get(normalize(alias));
      assert.ok(!owner || owner === question.id, `Alias ${alias} bertabrakan dengan ${owner}`);
    });
  });
});
