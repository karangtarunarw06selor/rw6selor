import { ADULT_CATEGORIES, CHILD_CATEGORIES, normalizeCategory } from "./lomba-storage.js";

const childOrder = CHILD_CATEGORIES;
const adultOrder = ADULT_CATEGORIES;
const genderOrder = ["male", "female"];

const categoryOrderForSettings = (settings) => {
  const categoryFilter = normalizeCategory(settings.ageCategoryFilter);
  if (categoryFilter === "anak_all") return childOrder;
  if (categoryFilter === "umum_dewasa") return adultOrder;
  if (categoryFilter === "all") {
    return [...childOrder, ...adultOrder];
  }
  return [categoryFilter, ...childOrder, ...adultOrder].filter(Boolean);
};

const bucketKey = (participant, settings) => {
  const genderPart = settings.genderFilter === "mixed" ? participant.gender : "filtered";
  return `${normalizeCategory(participant.category)}:${genderPart}`;
};

const orderedBucketKeys = (participants, settings) => {
  const categories = categoryOrderForSettings(settings);
  const keys = [];
  categories.forEach((category) => {
    const genders = settings.genderFilter === "mixed" ? genderOrder : ["filtered"];
    genders.forEach((gender) => keys.push(`${category}:${gender}`));
  });
  participants.forEach((participant) => {
    const key = bucketKey(participant, settings);
    if (!keys.includes(key)) keys.push(key);
  });
  return keys;
};

const takeBalanced = (participants, settings) => {
  const buckets = new Map();
  participants.forEach((participant) => {
    const key = bucketKey(participant, settings);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(participant);
  });

  const keys = orderedBucketKeys(participants, settings);
  const result = [];
  while (result.length < participants.length) {
    let moved = false;
    keys.forEach((key) => {
      const bucket = buckets.get(key);
      if (bucket?.length) {
        result.push(bucket.shift());
        moved = true;
      }
    });
    if (!moved) break;
  }
  return result;
};

const groupScore = (group, participant, settings) => {
  let score = group.length * 10;
  if (group.some((member) => normalizeCategory(member.category) === normalizeCategory(participant.category))) score += 4;
  if (settings.genderFilter === "mixed" && group.some((member) => member.gender === participant.gender)) score += 2;
  return score;
};

// Best-effort initial fair distribution before bracket planning; manual correction stays available via drag/drop.
export const balanceParticipantsForMatches = (participants, settings) => takeBalanced(participants, settings);

export const createBalancedGroups = (participants, settings, groupSize) => {
  const size = Math.max(2, Number(groupSize) || 2);
  const ordered = takeBalanced(participants, settings);
  const groupCount = Math.ceil(ordered.length / size);
  const groups = Array.from({ length: groupCount }, (_, index) => ({
    id: `kel-${index + 1}`,
    name: `Kel. ${index + 1}`,
    type: "group",
    members: [],
    complete: false
  }));

  ordered.forEach((participant) => {
    const candidates = groups
      .filter((group) => group.members.length < size)
      .sort((a, b) => groupScore(a.members, participant, settings) - groupScore(b.members, participant, settings));
    candidates[0]?.members.push(participant);
  });

  groups.forEach((group) => {
    group.complete = group.members.length === size;
  });
  return groups;
};
