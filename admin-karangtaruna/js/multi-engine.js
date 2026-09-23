import {
  createMatch,
  entrantsFromWinners,
  planEliminationToTarget
} from "./qualifier-engine.js";

const finalFeederMatchCount = (entryCount, matchSize) => {
  const minimumFinalists = 3;
  const naturalCount = Math.ceil(entryCount / matchSize);
  const maximumNonSingletonMatches = Math.floor(entryCount / 2);
  return Math.min(matchSize, maximumNonSingletonMatches, Math.max(minimumFinalists, naturalCount));
};

const distributeEntries = (entries, matchCount) => {
  const baseSize = Math.floor(entries.length / matchCount);
  const extra = entries.length % matchCount;
  const groups = [];
  let cursor = 0;

  for (let index = 0; index < matchCount; index += 1) {
    const size = baseSize + (index < extra ? 1 : 0);
    groups.push(entries.slice(cursor, cursor + size));
    cursor += size;
  }

  return groups;
};

const createMultiRound = (entries, matchSize, key, name, bracketPath) => ({
  key,
  name,
  type: bracketPath,
  bracketPath,
  matches: distributeEntries(entries, finalFeederMatchCount(entries.length, matchSize)).map((slots, index) => createMatch({
    id: `${key}-${String(index + 1).padStart(2, "0")}`,
    label: `Match ${index + 1}`,
    roundKey: key,
    type: bracketPath,
    bracketPath,
    slots
  }))
});

export const planMultiBracket = (entries, matchSize) => {
  const rounds = [];
  let candidates = entries;
  let roundNumber = 1;

  while (candidates.length > matchSize) {
    if (candidates.length <= matchSize * matchSize) {
      const round = createMultiRound(candidates, matchSize, `main-${roundNumber}`, `Round ${roundNumber}`, "main");
      rounds.push(round);
      candidates = entrantsFromWinners(round.matches);
      roundNumber += 1;
      continue;
    }

    const nextTarget = Math.max(6, Math.ceil(candidates.length / matchSize));
    const qualifier = planEliminationToTarget(candidates, nextTarget, matchSize, `qualifier-${candidates.length}`, "Qualifier", "qualifier");
    rounds.push({
      key: `qualifier-${candidates.length}`,
      name: "Qualifier",
      type: "qualifier",
      bracketPath: "qualifier",
      matches: qualifier.matches
    });
    candidates = qualifier.entrants;
  }

  const finalMatch = {
    id: "final-01",
    label: "Final",
    roundKey: "final",
    type: "final",
    bracketPath: "final",
    slots: candidates,
    winnerId: null,
    rankings: { first: "", second: "", third: "" },
    advanceTo: null,
    loserTo: null
  };

  rounds.push({ key: "final", name: "Final", type: "final", bracketPath: "final", matches: [finalMatch] });

  return {
    engine: "multi",
    matchSize,
    entryCount: entries.length,
    targetCount: candidates.length,
    rounds
  };
};
