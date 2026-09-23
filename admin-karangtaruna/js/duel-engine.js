import {
  createLoserSlot,
  createMatch,
  createRoundFromEntries,
  createSourceSlot,
  entrantsFromWinners,
  largestPowerOfTwoAtMost,
  nextId,
  planEliminationToTarget,
  roundNameForSize
} from "./qualifier-engine.js";

const SEMI_FINAL_TARGET = 4;
const carriesWoPath = (entry) => Boolean(entry?.wo || entry?.woPath);

export const planDuelBracket = (entries) => {
  const target = largestPowerOfTwoAtMost(entries.length);
  const preliminary = planEliminationToTarget(entries, target, 2, "preliminary", "Preliminary", "preliminary");
  const rounds = [];

  if (preliminary.matches.length) {
    rounds.push({ key: "preliminary", name: "Preliminary", type: "preliminary", bracketPath: "preliminary", matches: preliminary.matches });
  }

  let candidates = preliminary.entrants;

  while (candidates.length > SEMI_FINAL_TARGET) {
    const roundKey = `round-${candidates.length}`;
    const round = createRoundFromEntries(candidates, 2, roundKey, roundNameForSize(candidates.length), "main", "main");
    rounds.push(round);
    candidates = entrantsFromWinners(round.matches);
  }

  if (candidates.length > SEMI_FINAL_TARGET) {
    const qualifier = planEliminationToTarget(candidates, SEMI_FINAL_TARGET, 2, "qualifier", "Qualifier", "qualifier");
    if (qualifier.matches.length) {
      rounds.push({ key: "qualifier", name: "Qualifier", type: "qualifier", bracketPath: "qualifier", matches: qualifier.matches });
    }
    candidates = qualifier.entrants;
  }

  const semiMatches = [
    createMatch({
      id: nextId("semi-final", 0),
      label: "Semi Final 1",
      roundKey: "semi-final",
      type: "semifinal",
      bracketPath: "semifinal",
      slots: candidates.slice(0, 2),
      woPath: candidates.slice(0, 2).some(carriesWoPath)
    }),
    createMatch({
      id: nextId("semi-final", 1),
      label: "Semi Final 2",
      roundKey: "semi-final",
      type: "semifinal",
      bracketPath: "semifinal",
      slots: candidates.slice(2, 4),
      woPath: candidates.slice(2, 4).some(carriesWoPath)
    })
  ];

  const finalMatch = createMatch({
    id: "final-01",
    label: "Final",
    roundKey: "final",
    type: "final",
    bracketPath: "final",
    slots: [
      createSourceSlot(semiMatches[0].id, "Pemenang Semi Final 1", { woPath: semiMatches[0].woPath }),
      createSourceSlot(semiMatches[1].id, "Pemenang Semi Final 2", { woPath: semiMatches[1].woPath })
    ]
  });

  const thirdPlaceMatch = createMatch({
    id: "third-place-01",
    label: "Perebutan Juara 3",
    roundKey: "third-place",
    type: "third_place",
    bracketPath: "third_place",
    slots: [
      createLoserSlot(semiMatches[0].id, "Kalah Semi Final 1"),
      createLoserSlot(semiMatches[1].id, "Kalah Semi Final 2")
    ]
  });

  semiMatches[0].advanceTo = { matchId: finalMatch.id, slotIndex: 0 };
  semiMatches[0].loserTo = { matchId: thirdPlaceMatch.id, slotIndex: 0 };
  semiMatches[1].advanceTo = { matchId: finalMatch.id, slotIndex: 1 };
  semiMatches[1].loserTo = { matchId: thirdPlaceMatch.id, slotIndex: 1 };

  rounds.push({ key: "semi-final", name: "Semi Final", type: "semifinal", bracketPath: "semifinal", matches: semiMatches });
  rounds.push({ key: "third-place", name: "Third Place", type: "third_place", bracketPath: "third_place", matches: [thirdPlaceMatch] });
  rounds.push({ key: "final", name: "Final", type: "final", bracketPath: "final", matches: [finalMatch] });

  return {
    engine: "duel",
    matchSize: 2,
    entryCount: entries.length,
    targetCount: target,
    rounds
  };
};
