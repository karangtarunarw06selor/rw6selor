import { planDuelBracket } from "./duel-engine.js";
import { planMultiBracket } from "./multi-engine.js";
import { balanceParticipantsForMatches, createBalancedGroups } from "./balancer-engine.js";
import { normalizeCategory } from "./lomba-storage.js";

export const normalizeParticipantEntry = (participant) => ({
  id: participant.id,
  name: participant.name,
  type: "participant",
  gender: participant.gender,
  category: normalizeCategory(participant.category),
  members: []
});

export const normalizeGroupEntry = (group) => ({
  id: group.id,
  name: group.name,
  type: "group",
  members: (group.members || []).map((member) => ({ ...member, category: normalizeCategory(member.category) })),
  category: "Kelompok"
});

export const createAutoGroups = (participants, groupSize) => {
  const size = Math.max(2, Number(groupSize) || 2);
  const groups = [];
  for (let index = 0; index < participants.length; index += size) {
    const members = participants.slice(index, index + size);
    groups.push({
      id: `kel-${groups.length + 1}`,
      name: `Kel. ${groups.length + 1}`,
      type: "group",
      members,
      complete: members.length === size
    });
  }
  return groups;
};

export const createExistingGroups = (groups = []) => groups
  .filter((group) => group.members?.length)
  .map((group, index) => ({
    id: group.id || `manual-kel-${index + 1}`,
    name: group.name || `Kelompok ${index + 1}`,
    type: "group",
    members: group.members || [],
    complete: Boolean(group.members?.length)
  }));

export const prepareEntries = ({ settings, participants, groups = [] }) => {
  if (settings.competitionMode === "individual") {
    const balancedParticipants = balanceParticipantsForMatches(participants, settings);
    return {
      groups: [],
      entries: balancedParticipants.map(normalizeParticipantEntry),
      matchSize: Number(settings.individualMatchSize)
    };
  }

  const preparedGroups = settings.competitionMode === "auto_group"
    ? createBalancedGroups(participants, settings, settings.groupSize)
    : createExistingGroups(groups);

  return {
    groups: preparedGroups,
    entries: preparedGroups.map(normalizeGroupEntry),
    matchSize: Number(settings.groupMatchSize)
  };
};

export const planBracket = ({ settings, participants, groups = [] }) => {
  const prepared = prepareEntries({ settings, participants, groups });
  const matchSize = prepared.matchSize;

  if (prepared.entries.length < 4) {
    throw new Error("Minimal dibutuhkan 4 peserta/kelompok untuk membuat bracket.");
  }

  if (prepared.entries.length > 100) {
    throw new Error("Maksimal 100 peserta/kelompok untuk membuat bracket.");
  }

  const planner = matchSize === 2
    ? planDuelBracket(prepared.entries)
    : planMultiBracket(prepared.entries, matchSize);

  return {
    id: `bracket-${Date.now()}`,
    competitionName: settings.competitionName || "Lomba Tanpa Nama",
    mode: settings.competitionMode,
    bracketType: settings.bracketType,
    matchSize,
    groups: prepared.groups,
    engine: planner.engine,
    entryCount: planner.entryCount,
    targetCount: planner.targetCount,
    rounds: planner.rounds,
    podium: null,
    generatedAt: new Date().toISOString()
  };
};
