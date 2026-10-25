"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { createInitialBoard, legalMoves, chooseComputerMove, applyMove } = require("../public/chess-core");

test("black computer chooses a legal move from the initial board", () => {
    const board = createInitialBoard();
    const move = chooseComputerMove(board, "black", () => 0);
    assert.ok(move);
    assert.ok(legalMoves(board, "black").some((candidate) => JSON.stringify(candidate) === JSON.stringify(move)));
});

test("computer prioritizes capturing a valuable opponent piece", () => {
    const board = Array.from({ length: 8 }, () => Array(8).fill(""));
    board[0][0] = "r";
    board[0][7] = "k";
    board[7][0] = "Q";
    board[7][7] = "K";
    const move = chooseComputerMove(board, "black", () => 0);
    assert.deepEqual(move, { fromRow: 0, fromCol: 0, toRow: 7, toCol: 0, piece: "r", captured: "Q" });
});

test("applyMove returns capture metadata without mutating the source board", () => {
    const board = createInitialBoard();
    const result = applyMove(board, { fromRow: 1, fromCol: 4, toRow: 3, toCol: 4 });
    assert.equal(board[1][4], "p");
    assert.equal(result.board[1][4], "");
    assert.equal(result.board[3][4], "p");
    assert.equal(result.move.captured, null);
});

test("pawn cannot move through an occupied square", () => {
    const board = createInitialBoard();
    board[2][0] = "N";
    const moves = legalMoves(board, "black").filter((move) => move.fromRow === 1 && move.fromCol === 0);
    assert.deepEqual(moves, []);
});
