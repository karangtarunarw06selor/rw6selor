export const nextId = (prefix, index) => `${prefix}-${String(index + 1).padStart(2, "0")}`;

export const cloneEntry = (entry) => ({ ...entry });

export const largestPowerOfTwoAtMost = (count) => {
  let value = 1;
  while (value * 2 <= count) value *= 2;
  return value;
};

export const roundNameForSize = (size) => {
  if (size === 2) return "Final";
  if (size === 4) return "Semi Final";
  if (size === 8) return "Round 8";
  if (size === 16) return "Round 16";
  if (size === 32) return "Round 32";
  if (size === 64) return "Round 64";
  return `Round ${size}`;
};

export const createMatch = ({ id, label, roundKey, type, bracketPath = type, slots, advanceTo = null, loserTo = null, ranking = false, woPath = false, displayOnly = false }) => ({
  id,
  label,
  roundKey,
  type,
  bracketPath,
  slots,
  woPath,
  displayOnly,
  winnerId: null,
  rankings: ranking ? { first: "", second: "", third: "" } : null,
  advanceTo,
  loserTo
});

export const createSourceSlot = (sourceMatchId, label, options = {}) => ({
  id: `source:${sourceMatchId}`,
  name: label,
  type: "source",
  sourceMatchId,
  woPath: Boolean(options.woPath),
  locked: true
});

export const createLoserSlot = (sourceMatchId, label) => ({
  id: `loser:${sourceMatchId}`,
  name: label,
  type: "loser",
  loserSourceMatchId: sourceMatchId,
  locked: true
});

const markWoEntry = (entry) => ({
  ...cloneEntry(entry),
  wo: true,
  woLabel: "WO",
  woNote: "Lolos otomatis karena WO"
});

const carriesWoPath = (entry) => Boolean(entry?.wo || entry?.woPath);

export const planEliminationToTarget = (entries, targetCount, matchSize, roundKey, labelPrefix, bracketPath = roundKey) => {
  const eliminationNeeded = entries.length - targetCount;
  if (eliminationNeeded <= 0) {
    const directEntries = entries.map(cloneEntry);
    return { directEntries, matches: [], entrants: directEntries };
  }

  const isInitialElimination = entries.every((entry) => entry.type !== "source" && !carriesWoPath(entry));
  const existingWoEntries = entries.filter(carriesWoPath).map(cloneEntry);
  const playableEntries = entries.filter((entry) => !carriesWoPath(entry));
  const matches = [];
  const matchGroups = [];
  let remainingEliminations = eliminationNeeded;
  let cursor = 0;

  while (remainingEliminations > 0 && cursor < playableEntries.length) {
    const contestants = Math.min(matchSize, remainingEliminations + 1, playableEntries.length - cursor);
    const group = playableEntries.slice(cursor, cursor + contestants).map(cloneEntry);
    matchGroups.push(group);
    cursor += contestants;
    remainingEliminations -= Math.max(0, group.length - 1);
  }

  matchGroups.forEach((slots, index) => {
    const isWoPath = slots.some(carriesWoPath);
    matches.push(createMatch({
      id: nextId(roundKey, index),
      label: `${labelPrefix} ${index + 1}`,
      roundKey,
      type: roundKey,
      bracketPath,
      slots,
      woPath: isWoPath
    }));
  });

  const newWoEntries = playableEntries.slice(cursor).map(markWoEntry);
  const directEntries = [
    ...existingWoEntries,
    ...newWoEntries
  ];
  const activeMatches = [...matches];
  for (let index = 0; isInitialElimination && index < newWoEntries.length; index += matchSize) {
    matches.push(createMatch({
      id: nextId(`${roundKey}-wo`, Math.floor(index / matchSize)),
      label: `${labelPrefix} ${matches.length + 1}`,
      roundKey,
      type: roundKey,
      bracketPath,
      slots: newWoEntries.slice(index, index + matchSize).map(cloneEntry),
      woPath: true,
      displayOnly: true
    }));
  }
  const winnerEntries = entrantsFromWinners(activeMatches);

  return {
    directEntries,
    matches,
    entrants: [...directEntries, ...winnerEntries]
  };
};

export const createRoundFromEntries = (entries, matchSize, roundKey, roundName, type = "main", bracketPath = type) => {
  const matches = [];
  for (let index = 0; index < entries.length; index += matchSize) {
    const slots = entries.slice(index, index + matchSize).map(cloneEntry);
    const isWoPath = slots.length > 0 && slots.some(carriesWoPath);
    matches.push(createMatch({
      id: nextId(roundKey, matches.length),
      label: `Match ${matches.length + 1}`,
      roundKey,
      type,
      bracketPath,
      slots,
      woPath: isWoPath
    }));
  }
  return { key: roundKey, name: roundName, type, bracketPath, matches };
};

export const entrantsFromWinners = (matches) =>
  matches.map((match) => createSourceSlot(match.id, `Pemenang ${match.label}`, { woPath: match.woPath }));
