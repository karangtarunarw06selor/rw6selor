"use strict";

const snakes = Object.freeze({ 17: 6, 54: 14, 62: 19, 95: 36, 99: 83 });
const ladders = Object.freeze({ 3: 22, 5: 14, 9: 31, 20: 39, 27: 84, 51: 67, 72: 91, 73: 93, 88: 99 });

function move(position, dice) {
  const start = Number(position) || 1;
  const roll = Number(dice);
  if (!Number.isInteger(roll) || roll < 1 || roll > 6) throw new Error("Nilai dadu tidak valid.");
  const stepped = start + roll <= 100 ? start + roll : start;
  const destination = ladders[stepped] || snakes[stepped] || stepped;
  return {
    from: start,
    stepped,
    to: destination,
    event: ladders[stepped] ? "ladder" : snakes[stepped] ? "snake" : "move",
    won: destination === 100,
  };
}

module.exports = { ladders, snakes, move };
