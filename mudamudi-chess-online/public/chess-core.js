(function exposeChessCore(root, factory) {
    const core = factory();
    if (typeof module === "object" && module.exports) module.exports = core;
    else root.ChessCore = core;
})(typeof globalThis !== "undefined" ? globalThis : this, () => {
    "use strict";

    const values = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };

    function createInitialBoard() {
        return [
            ["r", "n", "b", "q", "k", "b", "n", "r"],
            ["p", "p", "p", "p", "p", "p", "p", "p"],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["P", "P", "P", "P", "P", "P", "P", "P"],
            ["R", "N", "B", "Q", "K", "B", "N", "R"]
        ];
    }

    const colorOf = (piece) => !piece ? null : piece === piece.toUpperCase() ? "white" : "black";
    const inside = (row, col) => row >= 0 && row < 8 && col >= 0 && col < 8;

    function addMove(board, moves, color, fromRow, fromCol, toRow, toCol) {
        if (!inside(toRow, toCol)) return false;
        const captured = board[toRow][toCol] || null;
        if (colorOf(captured) === color) return false;
        moves.push({ fromRow, fromCol, toRow, toCol, piece: board[fromRow][fromCol], captured });
        return !captured;
    }

    function slide(board, moves, color, row, col, directions) {
        directions.forEach(([rowStep, colStep]) => {
            let toRow = row + rowStep;
            let toCol = col + colStep;
            while (inside(toRow, toCol)) {
                if (!addMove(board, moves, color, row, col, toRow, toCol)) break;
                toRow += rowStep;
                toCol += colStep;
            }
        });
    }

    function pieceMoves(board, row, col) {
        const piece = board[row]?.[col] || "";
        const color = colorOf(piece);
        if (!color) return [];
        const kind = piece.toLowerCase();
        const moves = [];
        if (kind === "p") {
            const direction = color === "white" ? -1 : 1;
            const start = color === "white" ? 6 : 1;
            if (inside(row + direction, col) && !board[row + direction][col]) {
                addMove(board, moves, color, row, col, row + direction, col);
                if (row === start && !board[row + direction * 2][col]) addMove(board, moves, color, row, col, row + direction * 2, col);
            }
            [-1, 1].forEach((colStep) => {
                const target = board[row + direction]?.[col + colStep];
                if (target && colorOf(target) !== color) addMove(board, moves, color, row, col, row + direction, col + colStep);
            });
        } else if (kind === "n") {
            [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([a,b]) => addMove(board, moves, color, row, col, row + a, col + b));
        } else if (kind === "b") {
            slide(board, moves, color, row, col, [[-1,-1],[-1,1],[1,-1],[1,1]]);
        } else if (kind === "r") {
            slide(board, moves, color, row, col, [[-1,0],[1,0],[0,-1],[0,1]]);
        } else if (kind === "q") {
            slide(board, moves, color, row, col, [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]);
        } else if (kind === "k") {
            [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([a,b]) => addMove(board, moves, color, row, col, row + a, col + b));
        }
        return moves;
    }

    function legalMoves(board, color) {
        const moves = [];
        for (let row = 0; row < 8; row += 1) {
            for (let col = 0; col < 8; col += 1) {
                if (colorOf(board[row][col]) === color) moves.push(...pieceMoves(board, row, col));
            }
        }
        return moves;
    }

    function evaluateBoard(board, perspective) {
        let score = 0;
        for (let row = 0; row < 8; row += 1) {
            for (let col = 0; col < 8; col += 1) {
                const piece = board[row][col];
                if (!piece) continue;
                const value = piece.toLowerCase() === "k" ? 1000 : values[piece.toLowerCase()] || 0;
                const center = 3.5 - (Math.abs(3.5 - row) + Math.abs(3.5 - col)) / 2;
                score += (colorOf(piece) === perspective ? 1 : -1) * (value + center * 0.03);
            }
        }
        const opponent = perspective === "white" ? "black" : "white";
        return score + (legalMoves(board, perspective).length - legalMoves(board, opponent).length) * 0.02;
    }

    function minimax(board, turn, perspective, depth, alpha, beta) {
        const moves = legalMoves(board, turn);
        if (!depth || !moves.length) return evaluateBoard(board, perspective);
        const maximizing = turn === perspective;
        const nextTurn = turn === "white" ? "black" : "white";
        let best = maximizing ? -Infinity : Infinity;
        for (const move of moves) {
            const next = applyMove(board, move).board;
            const score = minimax(next, nextTurn, perspective, depth - 1, alpha, beta);
            best = maximizing ? Math.max(best, score) : Math.min(best, score);
            if (maximizing) alpha = Math.max(alpha, best);
            else beta = Math.min(beta, best);
            if (beta <= alpha) break;
        }
        return best;
    }

    function chooseComputerMove(board, color = "black", random = Math.random) {
        const moves = legalMoves(board, color);
        if (!moves.length) return null;
        const opponent = color === "white" ? "black" : "white";
        const scored = moves.map((move) => ({
            move,
            score: minimax(applyMove(board, move).board, opponent, color, 2, -Infinity, Infinity)
        }));
        const bestScore = Math.max(...scored.map(({ score }) => score));
        const best = scored.filter(({ score }) => Math.abs(score - bestScore) < 1e-9);
        return best[Math.min(best.length - 1, Math.floor(random() * best.length))].move;
    }

    function applyMove(board, move) {
        const next = board.map((row) => [...row]);
        const piece = next[move.fromRow]?.[move.fromCol] || "";
        const captured = next[move.toRow]?.[move.toCol] || null;
        next[move.toRow][move.toCol] = piece;
        next[move.fromRow][move.fromCol] = "";
        return { board: next, move: { ...move, piece, captured } };
    }

    return { createInitialBoard, colorOf, pieceMoves, legalMoves, chooseComputerMove, applyMove };
});
