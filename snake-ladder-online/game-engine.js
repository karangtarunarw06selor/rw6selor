"use strict";

const snakes = Object.freeze({ 17: 6, 54: 34, 62: 19, 95: 36, 99: 83 });
const ladders = Object.freeze({ 3: 22, 5: 14, 9: 31, 20: 39, 27: 84, 51: 67, 72: 91, 73: 93, 88: 99 });

function move(position, dice) {
  const start = Number(position) || 1;
  const roll = Number(dice);
  if (!Number.isInteger(roll) || roll < 1 || roll > 6) throw new Error("Nilai dadu tidak valid.");
  const path = [];
  let direction = 1;
  let stepped = start;
  for (let count = 0; count < roll; count += 1) {
    if (stepped === 100) direction = -1;
    stepped += direction;
    path.push(stepped);
  }
  const transfers = [];
  let destination = stepped;
  const visited = new Set();
  while (!visited.has(destination) && (ladders[destination] || snakes[destination])) {
    visited.add(destination);
    const event = ladders[destination] ? "ladder" : "snake";
    const to = ladders[destination] || snakes[destination];
    transfers.push({ from: destination, to, event });
    destination = to;
  }
  return {
    from: start,
    path,
    stepped,
    transfers,
    to: destination,
    event: transfers.at(-1)?.event || "move",
    won: destination === 100,
  };
}

module.exports = { ladders, snakes, move };
