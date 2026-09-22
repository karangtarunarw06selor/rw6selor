import { planBracket } from "./bracket-planner.js";
import { renderBracket } from "./render-bracket.js";
import { renderGenderIcon } from "./render-gender.js";
import { api } from "./lomba-api.js";
import {
  categoryLabel,
  GENDER_LABELS,
  isAdultCategory,
  isChildCategory,
  MODE_LABELS,
  normalizeCategory,
  createStore,
  defaultState
} from "./lomba-storage.js";
import {
  bindAccordion,
  getAdminElements,
  hydrateSettings,
  readSettingsFromFields,
  setStatus,
  updateModeVisibility,
  updateSummary
} from "./lomba-ui.js";

const bracketTypeLabels = {
  single_elimination: "Single Elimination",
  round_robin: "Round Robin",
  group_stage: "Group Stage"
};

const generateInfoVisibility = {
  bracketVisible: false,
  actionsVisible: false
};

const MONITOR_PUBLIC_URL = window.location.protocol === "file:"
  ? "../website-mms05-main/monitor-lomba.html"
  : "https://mudamudiselor.biz.id/monitor-lomba.html";

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const modalRoot = () => {
  let root = document.getElementById("lombaConfirmModal");
  if (root) return root;
  document.body.insertAdjacentHTML("beforeend", `
    <div class="mms-modal-overlay" id="lombaConfirmModal" hidden>
      <div class="mms-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="lombaConfirmTitle">
        <h3 id="lombaConfirmTitle"></h3>
        <p id="lombaConfirmMessage"></p>
        <div class="mms-confirm-input-wrap is-hidden">
          <label for="lombaConfirmInput">Ketik konfirmasi</label>
          <input id="lombaConfirmInput" type="text" autocomplete="off">
          <small id="lombaConfirmHint"></small>
        </div>
        <div class="mms-confirm-actions">
          <button type="button" class="mms-btn mms-btn-ghost" data-modal-cancel>Batal</button>
          <button type="button" class="mms-btn mms-btn-primary" data-modal-confirm>Lanjutkan</button>
        </div>
      </div>
    </div>
  `);
  return document.getElementById("lombaConfirmModal");
};

const confirmAction = ({ title, message, confirmText = "Lanjutkan", requireText = null, hint = "" }) => {
  if (window.createDeleteConfirmToast) {
    return window.createDeleteConfirmToast({
      title,
      message,
      confirmLabel: confirmText,
      cancelLabel: "Batal",
      requireWord: requireText || "",
      hint
    }).then((result) => result.confirmed);
  }

  return new Promise((resolve) => {
    const root = modalRoot();
    const titleEl = root.querySelector("#lombaConfirmTitle");
    const messageEl = root.querySelector("#lombaConfirmMessage");
    const inputWrap = root.querySelector(".mms-confirm-input-wrap");
    const input = root.querySelector("#lombaConfirmInput");
    const hintEl = root.querySelector("#lombaConfirmHint");
    const cancelBtn = root.querySelector("[data-modal-cancel]");
    const confirmBtn = root.querySelector("[data-modal-confirm]");

    const accepted = Array.isArray(requireText) ? requireText : requireText ? [requireText] : [];
    const cleanup = (value) => {
      root.hidden = true;
      root.classList.remove("is-open");
      cancelBtn.removeEventListener("click", onCancel);
      confirmBtn.removeEventListener("click", onConfirm);
      input.removeEventListener("input", validate);
      resolve(value);
    };
    const validate = () => {
      confirmBtn.disabled = accepted.length > 0 && !accepted.includes(input.value.trim().toLowerCase());
    };
    const onCancel = () => cleanup(false);
    const onConfirm = () => cleanup(true);

    titleEl.textContent = title;
    messageEl.textContent = message;
    confirmBtn.textContent = confirmText;
    input.value = "";
    hintEl.textContent = hint;
    inputWrap.classList.toggle("is-hidden", accepted.length === 0);
    validate();

    cancelBtn.addEventListener("click", onCancel);
    confirmBtn.addEventListener("click", onConfirm);
    input.addEventListener("input", validate);
    root.hidden = false;
    root.classList.add("is-open");
    if (accepted.length) input.focus();
  });
};

const showValidationModal = (message) => confirmAction({
  title: "Validasi belum lengkap",
  message,
  confirmText: "Mengerti"
});

const apiErrorMessage = (error) => error?.message || "Koneksi API gagal. Periksa endpoint PHP dan database.";

const closeParticipantPanel = (elements) => {
  elements.participantPanel?.classList.remove("is-open");
  elements.participantToggle?.classList.remove("is-open");
};

const bindParticipantAutoClose = (elements) => {
  const bracketCard = document.querySelector(".mms-bracket-card");
  if (!bracketCard || !elements.participantPanel || !elements.participantToggle) return;

  const closeWhenBracketVisible = () => {
    const rect = bracketCard.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (isVisible) closeParticipantPanel(elements);
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) closeParticipantPanel(elements);
    }, { threshold: 0.12 });
    observer.observe(bracketCard);
    return;
  }

  window.addEventListener("scroll", closeWhenBracketVisible, { passive: true });
  window.addEventListener("resize", closeWhenBracketVisible);
  closeWhenBracketVisible();
};

const settingsAreReady = (settings) => {
  if (!settings.competitionName?.trim()) return false;
  if (!settings.competitionMode || !settings.genderFilter || !settings.ageCategoryFilter || !settings.bracketType) return false;
  if (settings.competitionMode === "individual") return Number(settings.individualMatchSize) >= 2;
  return Number(settings.groupSize) >= 2 && Number(settings.groupMatchSize) >= 2;
};

const ensureGenerateInfoBar = () => {
  let bar = document.getElementById("generateFloatingInfoBar");
  if (bar) return bar;
  document.body.insertAdjacentHTML("beforeend", `
    <aside class="mms-generate-floating-info" id="generateFloatingInfoBar" aria-live="polite" hidden>
      <div>
        <strong data-floating-name></strong>
        <span data-floating-summary></span>
      </div>
    </aside>
  `);
  return document.getElementById("generateFloatingInfoBar");
};

const floatingSummary = (settings) => {
  const age = categoryLabel(settings.ageCategoryFilter, "Semua");
  const mode = MODE_LABELS[settings.competitionMode] || settings.competitionMode || "-";
  const gender = GENDER_LABELS[settings.genderFilter] || settings.genderFilter || "-";
  const matchText = settings.competitionMode === "individual"
    ? `${settings.individualMatchSize} peserta/match`
    : `${settings.groupSize} anggota/kelompok | ${settings.groupMatchSize} kelompok/match`;
  const bracketType = bracketTypeLabels[settings.bracketType] || settings.bracketType || "-";
  return `${age} | ${mode} | ${gender} | ${matchText} | ${bracketType}`;
};

const updateGenerateInfoBar = (state) => {
  const bar = ensureGenerateInfoBar();
  const shouldShow = settingsAreReady(state.settings)
    && generateInfoVisibility.bracketVisible
    && !generateInfoVisibility.actionsVisible;

  bar.hidden = !shouldShow;
  bar.classList.toggle("is-visible", shouldShow);
  if (!shouldShow) return;

  bar.querySelector("[data-floating-name]").textContent = state.settings.competitionName.trim();
  bar.querySelector("[data-floating-summary]").textContent = floatingSummary(state.settings);
};

const bindGenerateInfoBarVisibility = (getState) => {
  const bracketCard = document.querySelector(".mms-bracket-card");
  const actionBar = document.querySelector(".mms-bracket-bottom-actions");
  if (!bracketCard || !actionBar) return;

  const updateFromRects = () => {
    const bracketRect = bracketCard.getBoundingClientRect();
    const actionRect = actionBar.getBoundingClientRect();
    generateInfoVisibility.bracketVisible = bracketRect.top < window.innerHeight && bracketRect.bottom > 0;
    generateInfoVisibility.actionsVisible = actionRect.top < window.innerHeight && actionRect.bottom > 0;
    updateGenerateInfoBar(getState());
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === bracketCard) generateInfoVisibility.bracketVisible = entry.isIntersecting;
        if (entry.target === actionBar) generateInfoVisibility.actionsVisible = entry.isIntersecting;
      });
      updateGenerateInfoBar(getState());
    }, { threshold: 0.02 });
    observer.observe(bracketCard);
    observer.observe(actionBar);
    updateFromRects();
    return;
  }

  window.addEventListener("scroll", updateFromRects, { passive: true });
  window.addEventListener("resize", updateFromRects);
  updateFromRects();
};

const playableSlot = (slot) => slot?.resolved || slot;

const findMatch = (bracket, matchId) => {
  for (const round of bracket.rounds) {
    const match = round.matches.find((item) => item.id === matchId);
    if (match) return match;
  }
  return null;
};

const findEntryInMatch = (match, entryId) =>
  match?.slots.map(playableSlot).find((slot) => slot?.id === entryId) || null;

const getWinnerEntry = (match) => findEntryInMatch(match, match?.winnerId);

const getLoserEntry = (match) => {
  const winnerId = match?.winnerId;
  if (!winnerId) return null;
  const playable = match.slots.map(playableSlot).filter((slot) => slot && !slot.locked);
  return playable.find((slot) => slot.id !== winnerId) || null;
};

const isFilledSlot = (slot) => {
  const entry = playableSlot(slot);
  return Boolean(entry && !entry.id?.startsWith("source:") && !entry.id?.startsWith("loser:"));
};

const resetMatchResult = (match) => {
  if (!match) return;
  match.winnerId = null;
  if (match.rankings) {
    match.rankings = { first: "", second: "", third: "" };
  }
};

const resetDependentResults = (bracket, changedMatchIds) => {
  bracket.rounds.forEach((round) => {
    round.matches.forEach((match) => {
      const dependsOnChangedMatch = match.slots.some((slot) =>
        changedMatchIds.has(slot?.sourceMatchId) || changedMatchIds.has(slot?.loserSourceMatchId)
      );
      if (dependsOnChangedMatch) resetMatchResult(match);
    });
  });
};

const swapBracketSlots = (bracket, source, target) => {
  const sourceMatch = findMatch(bracket, source.matchId);
  const targetMatch = findMatch(bracket, target.matchId);
  if (!sourceMatch || !targetMatch) return false;

  const sourceIndex = Number(source.slotIndex);
  const targetIndex = Number(target.slotIndex);
  const sourceSlot = sourceMatch.slots[sourceIndex];
  const targetSlot = targetMatch.slots[targetIndex];

  if (!isFilledSlot(sourceSlot) || !isFilledSlot(targetSlot)) return false;
  if (sourceMatch.id === targetMatch.id && sourceIndex === targetIndex) return false;

  sourceMatch.slots[sourceIndex] = targetSlot;
  targetMatch.slots[targetIndex] = sourceSlot;

  const changedMatchIds = new Set([sourceMatch.id, targetMatch.id]);
  resetMatchResult(sourceMatch);
  resetMatchResult(targetMatch);
  resetDependentResults(bracket, changedMatchIds);
  refreshResolvedSlots(bracket);
  bracket.podium = buildPodium(bracket);
  return true;
};

const buildPodium = (bracket) => {
  if (!bracket) return null;

  if (bracket.engine === "multi") {
    const finalMatch = findMatch(bracket, "final-01");
    const first = findEntryInMatch(finalMatch, finalMatch?.rankings?.first);
    const second = findEntryInMatch(finalMatch, finalMatch?.rankings?.second);
    const third = findEntryInMatch(finalMatch, finalMatch?.rankings?.third);
    return first && second && third ? { first, second, third } : null;
  }

  const finalMatch = findMatch(bracket, "final-01");
  const thirdPlaceMatch = findMatch(bracket, "third-place-01");
  const first = getWinnerEntry(finalMatch);
  const second = getLoserEntry(finalMatch);
  const third = getWinnerEntry(thirdPlaceMatch);
  return first && second && third ? { first, second, third } : null;
};

const isBracketComplete = (bracket) => Boolean(bracket && buildPodium(bracket));

const syncPublishIfActive = async (store) => {
  const state = store.getState();
  if (!state.ui.publishActive || !state.bracket) return;
  await api.togglePublish({
    active: true,
    settings: state.settings,
    bracket: state.bracket,
    podium: state.bracket.podium || state.podium
  });
};

const displayGroupName = (name = "") => String(name).replace(/^Kel\.\s*/i, "Kelompok ");

const participantMeta = (participant) => categoryLabel(participant.category);

const normalizeManualGroup = (group, index = 0) => ({
  id: group.id || `manual-kel-${Date.now()}-${index + 1}`,
  name: group.name || `Kelompok ${index + 1}`,
  type: "group",
  members: group.members || [],
  complete: Boolean(group.members?.length)
});

const createManualGroup = (groups) => ({
  id: `manual-kel-${Date.now()}-${groups.length + 1}`,
  name: `Kelompok ${groups.length + 1}`,
  type: "group",
  members: [],
  complete: false
});

const manualGroups = (groups = []) => groups.map(normalizeManualGroup);

const findParticipantById = (participants, participantId) =>
  participants.find((participant) => participant.id === participantId) || null;

const addParticipantToManualGroup = (groups, participants, participantId, targetGroupId) => {
  const participant = findParticipantById(participants, participantId);
  if (!participant) return groups;
  const nextGroups = manualGroups(groups).map((group) => ({
    ...group,
    members: group.members.filter((member) => member.id !== participant.id)
  }));
  return nextGroups.map((group) => group.id === targetGroupId
    ? { ...group, members: [...group.members, participant], complete: true }
    : { ...group, complete: group.members.length > 0 }
  );
};

const moveManualMember = (groups, source, target, groupSize) => {
  const nextGroups = manualGroups(groups).map((group) => ({ ...group, members: [...group.members] }));
  const sourceGroup = nextGroups.find((group) => group.id === source.sourceGroupId);
  const targetGroup = nextGroups.find((group) => group.id === target.targetGroupId);
  if (!sourceGroup || !targetGroup) return nextGroups;

  const sourceIndex = sourceGroup.members.findIndex((member) => member.id === source.memberId);
  if (sourceIndex < 0) return nextGroups;

  const targetIndex = target.targetMemberId
    ? targetGroup.members.findIndex((member) => member.id === target.targetMemberId)
    : -1;

  if (targetIndex >= 0) {
    const temp = sourceGroup.members[sourceIndex];
    sourceGroup.members[sourceIndex] = targetGroup.members[targetIndex];
    targetGroup.members[targetIndex] = temp;
  } else if (sourceGroup.id !== targetGroup.id) {
    const [moved] = sourceGroup.members.splice(sourceIndex, 1);
    targetGroup.members.push(moved);
    const maxSize = Math.max(2, Number(groupSize) || 2);
    if (targetGroup.members.length > maxSize) {
      const overflowIndex = targetGroup.members.length - 2;
      const [overflow] = targetGroup.members.splice(overflowIndex, 1);
      sourceGroup.members.push(overflow);
    }
  }

  return nextGroups.map((group) => ({ ...group, complete: group.members.length > 0 }));
};

const syncGroupMembers = (bracket, groupId, members) => {
  const updateEntry = (entry) => {
    if (!entry || entry.id !== groupId) return;
    entry.name = displayGroupName(entry.name);
    entry.members = members.map((member) => ({ ...member }));
    entry.complete = entry.members.length > 0;
  };

  bracket.groups?.forEach(updateEntry);
  bracket.rounds.forEach((round) => {
    round.matches.forEach((match) => {
      match.slots.forEach((slot) => {
        updateEntry(slot);
        updateEntry(slot?.resolved);
      });
    });
  });
};

const findGroup = (bracket, groupId) => bracket?.groups?.find((group) => group.id === groupId) || null;

const resetMatchesContainingGroups = (bracket, groupIds) => {
  const changedMatchIds = new Set();
  bracket.rounds.forEach((round) => {
    round.matches.forEach((match) => {
      const hasChangedGroup = match.slots.some((slot) => {
        const entry = playableSlot(slot);
        return entry && groupIds.has(entry.id);
      });
      if (hasChangedGroup) {
        resetMatchResult(match);
        changedMatchIds.add(match.id);
      }
    });
  });
  resetDependentResults(bracket, changedMatchIds);
};

const moveGroupMember = (bracket, source, target, groupSize) => {
  if (!bracket || bracket.mode !== "auto_group") return false;

  const sourceGroup = findGroup(bracket, source.sourceGroupId);
  const targetGroup = findGroup(bracket, target.targetGroupId);
  if (!sourceGroup || !targetGroup) return false;
  if (sourceGroup.id === targetGroup.id && source.memberId === target.targetMemberId) return false;
  if (sourceGroup.members.length <= 1 && sourceGroup.id !== targetGroup.id) return false;

  const sourceIndex = sourceGroup.members.findIndex((member) => member.id === source.memberId);
  if (sourceIndex < 0) return false;

  const targetIndex = target.targetMemberId
    ? targetGroup.members.findIndex((member) => member.id === target.targetMemberId)
    : -1;

  if (targetIndex >= 0) {
    const temp = sourceGroup.members[sourceIndex];
    sourceGroup.members[sourceIndex] = targetGroup.members[targetIndex];
    targetGroup.members[targetIndex] = temp;
  } else {
    if (sourceGroup.id === targetGroup.id) return false;
    const [moved] = sourceGroup.members.splice(sourceIndex, 1);
    targetGroup.members.push(moved);
    const maxSize = Math.max(2, Number(groupSize) || 2);
    if (targetGroup.members.length > maxSize) {
      const overflowIndex = targetGroup.members.length - 2;
      if (overflowIndex >= 0) {
        const [overflow] = targetGroup.members.splice(overflowIndex, 1);
        sourceGroup.members.push(overflow);
      }
    }
  }

  syncGroupMembers(bracket, sourceGroup.id, sourceGroup.members);
  syncGroupMembers(bracket, targetGroup.id, targetGroup.members);
  const changedGroupIds = new Set([sourceGroup.id, targetGroup.id]);
  resetMatchesContainingGroups(bracket, changedGroupIds);
  refreshResolvedSlots(bracket);
  bracket.podium = buildPodium(bracket);
  return true;
};

const refreshResolvedSlots = (bracket) => {
  bracket.rounds.forEach((round) => {
    round.matches.forEach((match) => {
      match.slots.forEach((slot) => {
        if (!slot?.sourceMatchId && !slot?.loserSourceMatchId) return;
        const source = findMatch(bracket, slot.sourceMatchId || slot.loserSourceMatchId);
        const resolved = slot.sourceMatchId ? getWinnerEntry(source) : getLoserEntry(source);
        if (resolved) {
          slot.resolved = { ...resolved };
        } else {
          delete slot.resolved;
        }
      });
    });
  });

  bracket.rounds.forEach((round) => {
    round.matches.forEach((match) => {
      if (!match.winnerId) return;
      const validWinner = match.slots.map(playableSlot).some((slot) => slot?.id === match.winnerId && !slot.locked);
      if (!validWinner) match.winnerId = null;
    });
  });
};

const filterParticipants = (participants, state) => {
  const search = state.filters.search.trim().toLowerCase();
  const age = normalizeCategory(state.filters.age === "all" ? state.settings.ageCategoryFilter : state.filters.age);
  return participants.filter((participant) => {
    const participantCategory = normalizeCategory(participant.category);
    const genderOk = state.settings.genderFilter === "mixed" || participant.gender === state.settings.genderFilter;
    const ageOk = age === "all"
      || (age === "anak_all" && isChildCategory(participantCategory))
      || (age === "umum_dewasa" && isAdultCategory(participantCategory))
      || participantCategory === age;
    const searchOk = !search || participant.name.toLowerCase().includes(search);
    return genderOk && ageOk && searchOk;
  });
};

const renderParticipants = (elements, state) => {
  const selected = new Set(state.selectedParticipantIds);
  const isManualGroupMode = state.settings.competitionMode === "existing_group";
  elements.participantCount.textContent = `${selected.size}/${state.visibleParticipants.length} dipilih`;

  if (!state.visibleParticipants.length) {
    elements.participantList.innerHTML = '<div class="participant-empty-state">Tidak ada peserta sesuai filter.</div>';
    return;
  }

  elements.participantList.innerHTML = `
    <div class="participant-list-inner">
      ${state.visibleParticipants.map((participant) => `
        <div
          class="participant-item"
          ${isManualGroupMode ? `draggable="true" data-manual-participant-id="${escapeHtml(participant.id)}"` : ""}
        >
          <label>
            <input type="checkbox" data-participant-id="${escapeHtml(participant.id)}" ${selected.has(participant.id) ? "checked" : ""}>
            ${renderGenderIcon(participant.gender)}
            <span class="participant-choice-text">
              <strong>${escapeHtml(participant.name)}</strong>
              <small>${escapeHtml(categoryLabel(participant.category))}</small>
            </span>
          </label>
        </div>
      `).join("")}
    </div>
  `;
};

const renderGroups = (elements, state) => {
  const groups = state.groups || [];
  const isManualGroupMode = state.settings.competitionMode === "existing_group";
  if (!groups.length && !isManualGroupMode) {
    elements.groupList.innerHTML = '<div class="participant-empty-state">Kelompok akan terbentuk setelah Generate.</div>';
    return;
  }

  elements.groupList.innerHTML = `
    ${isManualGroupMode ? `
      <div class="manual-group-toolbar">
        <button type="button" class="mms-btn mms-btn-primary" data-add-manual-group>
          <i class="fa-solid fa-plus"></i> Tambah Kelompok
        </button>
      </div>
    ` : ""}
    ${groups.length ? groups.map((group) => `
      <article class="group-item" data-manual-group-id="${escapeHtml(group.id)}">
        <div class="group-item-head">
          ${isManualGroupMode
            ? `<input type="text" class="manual-group-name-input" data-manual-group-name="${escapeHtml(group.id)}" value="${escapeHtml(displayGroupName(group.name))}" aria-label="Nama kelompok">`
            : `<strong>${escapeHtml(displayGroupName(group.name))}</strong>`}
          ${isManualGroupMode ? `<button type="button" class="mms-icon-btn mms-icon-danger" data-delete-manual-group="${escapeHtml(group.id)}" aria-label="Hapus kelompok"><i class="fa-solid fa-trash"></i></button>` : ""}
        </div>
        <small>${group.members.length} anggota</small>
        <div class="group-member-list" data-manual-group-drop-id="${escapeHtml(group.id)}">
          ${group.members.length ? group.members.map((member) => `
            <div
              class="group-member-row"
              ${isManualGroupMode ? `draggable="true" data-manual-member-group-id="${escapeHtml(group.id)}" data-manual-member-id="${escapeHtml(member.id)}"` : ""}
            >
              <span class="group-member-left">
                ${renderGenderIcon(member.gender)}
                <span class="group-member-name">${escapeHtml(member.name)}</span>
              </span>
              <span class="group-member-age">${escapeHtml(participantMeta(member))}</span>
              ${isManualGroupMode ? `<button type="button" class="manual-member-remove" data-remove-manual-member="${escapeHtml(member.id)}" data-remove-manual-group="${escapeHtml(group.id)}" aria-label="Hapus anggota"><i class="fa-solid fa-xmark"></i></button>` : ""}
            </div>
          `).join("") : `<div class="manual-group-empty">Tarik peserta ke sini.</div>`}
        </div>
      </article>
    `).join("") : '<div class="participant-empty-state">Belum ada kelompok. Klik Tambah Kelompok untuk mulai.</div>'}
  `;
};

const renderAll = (elements, state) => {
  updateModeVisibility(elements, state.settings);
  updateSummary(elements.summary, state.settings);
  renderParticipants(elements, state);
  renderGroups(elements, state);
  renderBracket({
    target: elements.bracketArea,
    podiumTarget: elements.podiumArea,
    bracket: state.bracket,
    zoom: state.zoom
  });
  setStatus(elements.draftStatus, state.ui.status);
  const isPublished = Boolean(state.ui.publishActive);
  elements.buttons.publish?.classList.toggle("is-published", isPublished);
  elements.buttons.publish?.classList.toggle("is-unpublished", !isPublished);
  if (elements.buttons.publish) {
    elements.buttons.publish.innerHTML = isPublished
      ? '<i class="fa-solid fa-circle-check"></i> Aktif Publish'
      : '<i class="fa-solid fa-broadcast-tower"></i> Belum Publish';
  }
  updateGenerateInfoBar(state);
};

const selectedParticipants = (state) => {
  const selectedIds = new Set(state.selectedParticipantIds);
  return state.participants.filter((participant) => selectedIds.has(participant.id));
};

const initAdminLomba = async () => {
  const elements = getAdminElements();
  if (!elements.bracketArea) return;

  const monitorLink = document.getElementById("btnOpenPublicMonitor");
  if (monitorLink) {
    monitorLink.href = MONITOR_PUBLIC_URL;
  }

  if (!elements.podiumArea) {
    elements.bracketArea.insertAdjacentHTML("afterend", '<div id="podiumArea"></div>');
    elements.podiumArea = document.getElementById("podiumArea");
  }

  const store = createStore(defaultState);
  let participants = [];
  try {
    participants = await api.getParticipants();
    const publishPayload = await api.getPublish().catch(() => ({ data: { is_active: false } }));
    store.setState((state) => ({
      participants,
      visibleParticipants: filterParticipants(participants, { ...state, participants }),
      ui: {
        publishActive: Boolean(publishPayload.data?.is_active),
        status: publishPayload.data?.is_active ? "Publish aktif." : "Belum Publish"
      }
    }), { persist: false });
  } catch (error) {
    store.setState({ ui: { status: apiErrorMessage(error), publishActive: false } }, { persist: false });
  }

hydrateSettings(elements.fields, store.getState().settings);
bindAccordion(elements.generatorToggle, elements.generatorPanel, true);
bindAccordion(elements.participantToggle, elements.participantPanel, false);
bindParticipantAutoClose(elements);
bindGenerateInfoBarVisibility(() => store.getState());

const generatePanel = elements.generatorPanel;
const floatingInfo = document.getElementById("generateFloatingInfoBar");

if (generatePanel && floatingInfo && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(([entry]) => {
    floatingInfo.hidden = entry.isIntersecting;
    floatingInfo.classList.toggle("is-visible", !entry.isIntersecting);
  }, { threshold: 0.1 });

  observer.observe(generatePanel);
}

renderAll(elements, store.getState());
  let dragSource = null;

  const updateFilters = () => {
    store.setState((state) => ({
      visibleParticipants: filterParticipants(state.participants, state)
    }));
  };

  const handleSettingsChange = () => {
    const current = store.getState();
    const nextSettings = readSettingsFromFields(elements.fields);
    const modeChanged = current.settings.competitionMode !== nextSettings.competitionMode;
    store.setState({
      settings: nextSettings,
      groups: modeChanged ? [] : current.groups,
      ui: { status: "Pengaturan berubah. Klik Generate Lomba untuk membuat bracket baru." }
    });
    updateFilters();
    renderAll(elements, store.getState());
  };

  Object.values(elements.fields).forEach((field) => {
    field?.addEventListener("input", handleSettingsChange);
    field?.addEventListener("change", handleSettingsChange);
  });

  elements.search?.addEventListener("input", () => {
    store.setState({ filters: { search: elements.search.value } });
    updateFilters();
    renderAll(elements, store.getState());
  });

  elements.ageChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      elements.ageChips.forEach((item) => item.classList.toggle("is-active", item === chip));
      store.setState({ filters: { age: chip.dataset.ageFilter || "all" } });
      updateFilters();
      renderAll(elements, store.getState());
    });
  });

  elements.participantList.addEventListener("change", (event) => {
    const checkbox = event.target;
    if (!checkbox.matches("[data-participant-id]")) return;
    const selected = new Set(store.getState().selectedParticipantIds);
    if (checkbox.checked) selected.add(checkbox.dataset.participantId);
    else selected.delete(checkbox.dataset.participantId);
    store.setState({ selectedParticipantIds: [...selected], ui: { status: "Pilihan peserta berubah." } });
    renderAll(elements, store.getState());
  });

  elements.buttons.refresh?.addEventListener("click", async () => {
    try {
      const latest = await api.getParticipants();
      participants = latest;
      store.setState((state) => ({
        participants: latest,
        visibleParticipants: filterParticipants(latest, { ...state, participants: latest }),
        ui: { status: "Peserta direfresh dari API." }
      }));
      renderAll(elements, store.getState());
    } catch (error) {
      store.setState({ ui: { status: apiErrorMessage(error) } });
      renderAll(elements, store.getState());
    }
  });

  elements.buttons.selectAllVisible?.addEventListener("click", () => {
    const state = store.getState();
    const selected = new Set(state.selectedParticipantIds);
    state.visibleParticipants.forEach((participant) => selected.add(participant.id));
    store.setState({ selectedParticipantIds: [...selected], ui: { status: "Peserta tampil dipilih." } });
    renderAll(elements, store.getState());
  });

  elements.buttons.clearSelection?.addEventListener("click", () => {
    store.setState({ selectedParticipantIds: [], ui: { status: "Pilihan dibersihkan." } });
    renderAll(elements, store.getState());
  });

  elements.participantList.addEventListener("dragstart", (event) => {
    const participantCard = event.target.closest("[data-manual-participant-id]");
    if (!participantCard || store.getState().settings.competitionMode !== "existing_group") return;
    dragSource = {
      type: "manual-participant",
      participantId: participantCard.dataset.manualParticipantId
    };
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("application/json", JSON.stringify(dragSource));
    }
  });

  elements.groupList?.addEventListener("click", (event) => {
    const state = store.getState();
    if (state.settings.competitionMode !== "existing_group") return;

    if (event.target.closest("[data-add-manual-group]")) {
      store.setState({
        groups: [...manualGroups(state.groups), createManualGroup(state.groups)],
        ui: { status: "Kelompok manual ditambahkan." }
      });
      renderAll(elements, store.getState());
      return;
    }

    const deleteGroupButton = event.target.closest("[data-delete-manual-group]");
    if (deleteGroupButton) {
      store.setState({
        groups: manualGroups(state.groups).filter((group) => group.id !== deleteGroupButton.dataset.deleteManualGroup),
        ui: { status: "Kelompok manual dihapus." }
      });
      renderAll(elements, store.getState());
      return;
    }

    const removeMemberButton = event.target.closest("[data-remove-manual-member][data-remove-manual-group]");
    if (removeMemberButton) {
      store.setState({
        groups: manualGroups(state.groups).map((group) => group.id === removeMemberButton.dataset.removeManualGroup
          ? {
              ...group,
              members: group.members.filter((member) => member.id !== removeMemberButton.dataset.removeManualMember),
              complete: group.members.length > 1
            }
          : group
        ),
        ui: { status: "Anggota kelompok dihapus." }
      });
      renderAll(elements, store.getState());
    }
  });

  elements.groupList?.addEventListener("input", (event) => {
    const input = event.target.closest("[data-manual-group-name]");
    if (!input || store.getState().settings.competitionMode !== "existing_group") return;
    const name = input.value.trim();
    store.setState((state) => ({
      groups: manualGroups(state.groups).map((group) => group.id === input.dataset.manualGroupName
        ? { ...group, name: name || group.name }
        : group
      ),
      ui: { status: "Nama kelompok diperbarui." }
    }));
  });

  elements.groupList?.addEventListener("dragstart", (event) => {
    const member = event.target.closest("[data-manual-member-group-id][data-manual-member-id]");
    if (!member || store.getState().settings.competitionMode !== "existing_group") return;
    dragSource = {
      type: "manual-member",
      sourceGroupId: member.dataset.manualMemberGroupId,
      memberId: member.dataset.manualMemberId
    };
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("application/json", JSON.stringify(dragSource));
    }
  });

  elements.groupList?.addEventListener("dragover", (event) => {
    const groupTarget = event.target.closest("[data-manual-group-drop-id]");
    const memberTarget = event.target.closest("[data-manual-member-group-id][data-manual-member-id]");
    if (!groupTarget && !memberTarget) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    (memberTarget || groupTarget).classList.add("is-member-drag-over");
  });

  elements.groupList?.addEventListener("dragleave", (event) => {
    event.target.closest(".is-member-drag-over")?.classList.remove("is-member-drag-over");
  });

  elements.groupList?.addEventListener("drop", (event) => {
    const state = store.getState();
    if (state.settings.competitionMode !== "existing_group") return;
    const groupTarget = event.target.closest("[data-manual-group-drop-id]");
    const memberTarget = event.target.closest("[data-manual-member-group-id][data-manual-member-id]");
    const targetGroupId = memberTarget?.dataset.manualMemberGroupId || groupTarget?.dataset.manualGroupDropId;
    if (!targetGroupId) return;

    const transfer = event.dataTransfer?.getData("application/json");
    let source = dragSource;
    if (transfer) {
      try {
        source = JSON.parse(transfer);
      } catch (error) {
        source = dragSource;
      }
    }
    if (!source) return;

    event.preventDefault();
    event.target.closest(".is-member-drag-over")?.classList.remove("is-member-drag-over");

    if (source.type === "manual-participant") {
      store.setState({
        groups: addParticipantToManualGroup(state.groups, state.participants, source.participantId, targetGroupId),
        ui: { status: "Peserta dimasukkan ke kelompok manual." }
      });
    }

    if (source.type === "manual-member") {
      store.setState({
        groups: moveManualMember(state.groups, source, {
          targetGroupId,
          targetMemberId: memberTarget?.dataset.manualMemberId || ""
        }, state.settings.groupSize),
        ui: { status: "Anggota kelompok manual dipindah." }
      });
    }

    dragSource = null;
    renderAll(elements, store.getState());
  });

  const generateBracket = () => {
    try {
      const state = store.getState();
      const bracket = planBracket({
        settings: state.settings,
        participants: selectedParticipants(state),
        groups: state.settings.competitionMode === "existing_group" ? state.groups : []
      });
      refreshResolvedSlots(bracket);
      store.setState({ bracket, groups: bracket.groups, podium: null, ui: { status: `Draft dibuat: ${bracket.entryCount} peserta/kelompok.`, publishActive: false } });
    } catch (error) {
      store.setState({ ui: { status: error.message } });
    }
    renderAll(elements, store.getState());
  };

  elements.buttons.generate?.addEventListener("click", async () => {
    const currentState = store.getState();
    if (currentState.bracket) {
      const confirmed = await confirmAction({
        title: "Generate ulang bracket?",
        message: "Bracket lama akan diganti dan pilihan pemenang/podium akan dihapus.",
        confirmText: "Lanjutkan"
      });
      if (!confirmed) return;
      if (currentState.ui.publishActive) {
        await api.togglePublish({ active: false, settings: currentState.settings, bracket: currentState.bracket, podium: currentState.podium }).catch(() => null);
      }
    }
    generateBracket();
  });

  elements.bracketArea.addEventListener("change", (event) => {
    const input = event.target;
    const state = store.getState();
    if (!state.bracket) return;

    if (input.matches("[data-winner-id]")) {
      const match = findMatch(state.bracket, input.dataset.matchId);
      match.winnerId = input.checked ? input.dataset.winnerId : null;
      refreshResolvedSlots(state.bracket);
      state.bracket.podium = buildPodium(state.bracket);
      store.setState({ bracket: state.bracket, podium: state.bracket.podium, ui: { status: state.bracket.podium ? "Podium sudah lengkap." : "Pemenang tersimpan di draft." } });
      syncPublishIfActive(store).catch((error) => {
        store.setState({ ui: { status: apiErrorMessage(error), publishActive: false } });
        renderAll(elements, store.getState());
      });
      renderAll(elements, store.getState());
    }

    if (input.matches("[data-rank-select]")) {
      const match = findMatch(state.bracket, input.dataset.matchId);
      const rank = input.dataset.rankSelect;
      const finalistId = input.dataset.finalistId;

      if (input.checked) {
        Object.keys(match.rankings).forEach((key) => {
          if (key !== rank && match.rankings[key] === finalistId) match.rankings[key] = "";
        });
        match.rankings[rank] = finalistId;
      } else if (match.rankings[rank] === finalistId) {
        match.rankings[rank] = "";
      }

      state.bracket.podium = buildPodium(state.bracket);
      store.setState({ bracket: state.bracket, podium: state.bracket.podium, ui: { status: state.bracket.podium ? "Podium sudah lengkap." : "Ranking final belum lengkap." } });
      syncPublishIfActive(store).catch((error) => {
        store.setState({ ui: { status: apiErrorMessage(error), publishActive: false } });
        renderAll(elements, store.getState());
      });
      renderAll(elements, store.getState());
    }
  });

  elements.bracketArea.addEventListener("dragstart", (event) => {
    const member = event.target.closest(".group-member-row[data-group-id][data-member-id]");
    const currentState = store.getState();
    if (member && currentState.bracket?.mode === "auto_group") {
      event.stopPropagation();
      dragSource = {
        type: "member",
        sourceGroupId: member.dataset.groupId,
        memberId: member.dataset.memberId
      };
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("application/json", JSON.stringify(dragSource));
      }
      return;
    }

    const slot = event.target.closest(".bracket-slot[data-match-id][data-slot-index]");
    if (!slot || slot.classList.contains("empty")) {
      event.preventDefault();
      return;
    }

    dragSource = {
      type: "slot",
      matchId: slot.dataset.matchId,
      slotIndex: slot.dataset.slotIndex
    };
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("application/json", JSON.stringify(dragSource));
    }
  });

  elements.bracketArea.addEventListener("dragover", (event) => {
    const memberSource = dragSource?.type === "member";
    const memberTarget = event.target.closest(".group-member-row[data-group-id][data-member-id]");
    const groupTarget = event.target.closest("[data-group-drop-id]");
    if (memberSource && (memberTarget || groupTarget)) {
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
      (memberTarget || groupTarget).classList.add("is-member-drag-over");
      return;
    }

    const slot = event.target.closest(".bracket-slot[data-match-id][data-slot-index]");
    if (!slot || slot.classList.contains("empty")) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    slot.classList.add("is-drag-over");
  });

  elements.bracketArea.addEventListener("dragleave", (event) => {
    event.target.closest(".bracket-slot")?.classList.remove("is-drag-over");
    event.target.closest(".is-member-drag-over")?.classList.remove("is-member-drag-over");
  });

  elements.bracketArea.addEventListener("drop", (event) => {
    const state = store.getState();
    if (!state.bracket) return;

    const transfer = event.dataTransfer?.getData("application/json");
    let source = dragSource;
    if (transfer) {
      try {
        source = JSON.parse(transfer);
      } catch (error) {
        source = dragSource;
      }
    }
    if (!source) return;

    if (source.type === "member") {
      const memberTarget = event.target.closest(".group-member-row[data-group-id][data-member-id]");
      const groupTarget = event.target.closest("[data-group-drop-id]");
      const targetGroupId = memberTarget?.dataset.groupId || groupTarget?.dataset.groupDropId;
      if (!targetGroupId) return;

      event.preventDefault();
      event.target.closest(".is-member-drag-over")?.classList.remove("is-member-drag-over");

      const moved = moveGroupMember(state.bracket, source, {
        targetGroupId,
        targetMemberId: memberTarget?.dataset.memberId || ""
      }, state.settings.groupSize);
      if (!moved) return;

      store.setState({
        bracket: state.bracket,
        groups: state.bracket.groups || [],
        podium: state.bracket.podium,
        ui: { status: "Anggota kelompok dipindah. Winner pada match terkait direset." }
      });
      syncPublishIfActive(store).catch((error) => {
        store.setState({ ui: { status: apiErrorMessage(error), publishActive: false } });
        renderAll(elements, store.getState());
      });
      dragSource = null;
      renderAll(elements, store.getState());
      return;
    }

    const slot = event.target.closest(".bracket-slot[data-match-id][data-slot-index]");
    if (!slot || slot.classList.contains("empty")) return;

    event.preventDefault();
    slot.classList.remove("is-drag-over");

    const target = {
      matchId: slot.dataset.matchId,
      slotIndex: slot.dataset.slotIndex
    };

    const swapped = swapBracketSlots(state.bracket, source, target);
    if (!swapped) return;

    store.setState({
      bracket: state.bracket,
      podium: state.bracket.podium,
      ui: { status: "Slot bracket ditukar. Winner pada match terkait direset." }
    });
    syncPublishIfActive(store).catch((error) => {
      store.setState({ ui: { status: apiErrorMessage(error), publishActive: false } });
      renderAll(elements, store.getState());
    });
    dragSource = null;
    renderAll(elements, store.getState());
  });

  elements.bracketArea.addEventListener("dragend", () => {
    dragSource = null;
    elements.bracketArea.querySelectorAll(".is-drag-over").forEach((slot) => {
      slot.classList.remove("is-drag-over");
    });
    elements.bracketArea.querySelectorAll(".is-member-drag-over").forEach((target) => {
      target.classList.remove("is-member-drag-over");
    });
  });

  const confirmSaveIntent = ({ title, message, confirmText }) => confirmAction({
    title,
    message,
    confirmText,
    requireText: ["simpan", "save"],
    hint: 'Ketik "simpan" atau "save" untuk mengaktifkan tombol.'
  });

  const saveBracketWithStatus = async ({ status, successMessage }) => {
    const state = store.getState();
    if (!state.bracket) {
      await showValidationModal("Bracket belum dibuat.");
      store.setState({ ui: { status: "Bracket belum dibuat." } });
      renderAll(elements, store.getState());
      return false;
    }

    await api.saveBracket({ settings: state.settings, bracket: state.bracket, podium: state.podium, status });
    store.saveDraft();
    store.setState({ ui: { status: successMessage } });
    renderAll(elements, store.getState());
    return true;
  };

  elements.buttons.save?.addEventListener("click", async () => {
    const confirmed = await confirmAction({
      title: "Simpan draft?",
      message: "Simpan draft bracket saat ini?",
      confirmText: "Simpan",
      requireText: ["simpan", "save"],
      hint: 'Ketik "simpan" atau "save" untuk mengaktifkan tombol.'
    });
    if (!confirmed) return;
    try {
      const saved = await saveBracketWithStatus({ status: "draft", successMessage: "Draft disimpan." });
      if (!saved) return;
      const clearEditor = await confirmAction({
        title: "Draft tersimpan",
        message: "Apakah ingin menghapus data bracket dari editor?",
        confirmText: "Ya"
      });
      if (clearEditor) {
        store.setState({ bracket: null, podium: null, groups: [], zoom: 1, ui: { status: "Editor bracket dikosongkan. Draft tetap tersimpan." } });
      }
    } catch (error) {
      store.setState({ ui: { status: apiErrorMessage(error) } });
    }
    renderAll(elements, store.getState());
  });

  elements.buttons.archive?.addEventListener("click", async () => {
    const confirmed = await confirmSaveIntent({
      title: "Selesai & arsipkan?",
      message: "Bracket saat ini akan disimpan sebagai lomba selesai dan tampil di arsip monitor.",
      confirmText: "Simpan"
    });
    if (!confirmed) return;
    try {
      await saveBracketWithStatus({ status: "completed", successMessage: "Lomba selesai disimpan ke arsip monitor." });
    } catch (error) {
      store.setState({ ui: { status: apiErrorMessage(error) } });
      renderAll(elements, store.getState());
    }
  });

  elements.buttons.publish?.addEventListener("click", async () => {
    const state = store.getState();
    const nextActive = !state.ui.publishActive;
    if (nextActive && !state.bracket) {
      await showValidationModal("Bracket belum dibuat.");
      store.setState({ ui: { status: "Bracket belum dibuat." } });
      renderAll(elements, store.getState());
      return;
    }

    try {
      await api.togglePublish({
        active: nextActive,
        settings: state.settings,
        bracket: state.bracket,
        podium: state.podium
      });
      store.setState({ ui: { publishActive: nextActive, status: nextActive ? "Publish aktif. Monitor menampilkan bracket aktif." : "Publish dimatikan." } });
    } catch (error) {
      store.setState({ ui: { status: apiErrorMessage(error), publishActive: false } });
    }
    renderAll(elements, store.getState());
  });

  elements.buttons.print?.addEventListener("click", () => window.print());
  elements.buttons.reset?.addEventListener("click", async () => {
    const confirmed = await confirmAction({
      title: "Reset bracket?",
      message: "Reset hanya menghapus bracket aktif dan podium. Peserta terpilih tetap dipertahankan.",
      confirmText: "Reset",
      requireText: ["hapus", "reset"],
      hint: 'Ketik "hapus" atau "reset" untuk mengaktifkan tombol.'
    });
    if (!confirmed) return;
    await api.togglePublish({
      active: false,
      settings: store.getState().settings,
      bracket: store.getState().bracket,
      podium: store.getState().podium
    }).catch(() => null);
    store.setState({ bracket: null, podium: null, groups: [], zoom: 1, ui: { status: "Bracket dan podium direset.", publishActive: false } });
    renderAll(elements, store.getState());
  });

  elements.buttons.zoomOut?.addEventListener("click", () => {
    store.setState((state) => ({ zoom: Math.max(0.7, Number((state.zoom - 0.1).toFixed(2))) }));
    renderAll(elements, store.getState());
  });
  elements.buttons.zoomReset?.addEventListener("click", () => {
    store.setState({ zoom: 1 });
    renderAll(elements, store.getState());
  });
  elements.buttons.zoomIn?.addEventListener("click", () => {
    store.setState((state) => ({ zoom: Math.min(1.4, Number((state.zoom + 0.1).toFixed(2))) }));
    renderAll(elements, store.getState());
  });
};


document.addEventListener("DOMContentLoaded", initAdminLomba);
