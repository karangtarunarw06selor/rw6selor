import { categoryLabel, GENDER_LABELS, MODE_LABELS, normalizeCategory } from "./lomba-storage.js";

export const qs = (selector, root = document) => root.querySelector(selector);
export const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

export const getAdminElements = () => ({
  generatorToggle: qs("#btnToggleGenerateSettings"),
  generatorPanel: qs("#generatorPanel"),
  participantToggle: qs("#btnToggleParticipantList"),
  participantPanel: qs("#participantPanel"),
  summary: qs("#generatorModeSummary"),
  draftStatus: qs("#bracketDraftStatus"),
  participantCount: qs("#selectedParticipantCount"),
  bracketArea: qs("#bracketArea"),
  podiumArea: qs("#podiumArea"),
  participantList: qs("#participantList"),
  groupList: qs("#groupList"),
  search: qs("#participantSearch"),
  ageChips: qsa("[data-age-filter]"),
  fields: {
    competitionName: qs("#competitionName"),
    competitionMode: qs("#competitionMode"),
    genderFilter: qs("#genderFilter"),
    ageCategoryFilter: qs("#ageCategoryFilter"),
    individualMatchSize: qs("#individualMatchSize"),
    groupSize: qs("#groupSize"),
    groupMatchSize: qs("#groupMatchSize"),
    bracketType: qs("#bracketType")
  },
  wraps: {
    individualMatchSize: qs("#individualMatchSizeWrap"),
    groupSize: qs("#groupSizeWrap"),
    groupMatchSize: qs("#groupMatchSizeWrap")
  },
  buttons: {
    refresh: qs("#btnRefreshPeserta"),
    selectAllVisible: qs("#btnSelectAllVisible"),
    clearSelection: qs("#btnClearSelection"),
    generate: qs("#btnGenerateBracket"),
    save: qs("#btnSaveBracket"),
    archive: qs("#btnArchiveBracket"),
    publish: qs("#btnPublishBracket"),
    print: qs("#btnExportPdf"),
    reset: qs("#btnResetBracket"),
    zoomOut: qs("#btnZoomOut"),
    zoomReset: qs("#btnZoomReset"),
    zoomIn: qs("#btnZoomIn")
  }
});

export const bindAccordion = (button, panel, open = true) => {
  panel?.classList.toggle("is-open", open);
  button?.classList.toggle("is-open", open);
  button?.addEventListener("click", () => {
    const nextOpen = !panel.classList.contains("is-open");
    panel.classList.toggle("is-open", nextOpen);
    button.classList.toggle("is-open", nextOpen);
  });
};

export const readSettingsFromFields = (fields) => ({
  competitionName: fields.competitionName?.value.trim() || "",
  competitionMode: fields.competitionMode?.value || "individual",
  genderFilter: fields.genderFilter?.value || "mixed",
  ageCategoryFilter: fields.ageCategoryFilter?.value || "all",
  individualMatchSize: Number(fields.individualMatchSize?.value || 2),
  groupSize: Number(fields.groupSize?.value || 2),
  groupMatchSize: Number(fields.groupMatchSize?.value || 2),
  bracketType: fields.bracketType?.value || "single_elimination"
});

export const hydrateSettings = (fields, settings) => {
  Object.entries(fields).forEach(([key, field]) => {
    if (field && settings[key] !== undefined) {
      field.value = key === "ageCategoryFilter" ? normalizeCategory(settings[key]) : settings[key];
    }
  });
};

export const updateModeVisibility = (elements, settings) => {
  const isIndividual = settings.competitionMode === "individual";
  const isGroup = settings.competitionMode === "existing_group" || settings.competitionMode === "auto_group";
  elements.wraps.individualMatchSize?.classList.toggle("is-hidden", !isIndividual);
  elements.wraps.groupSize?.classList.toggle("is-hidden", !isGroup);
  elements.wraps.groupMatchSize?.classList.toggle("is-hidden", !isGroup);
  elements.groupList?.classList.toggle("is-hidden", !isGroup);
};

export const updateSummary = (target, settings) => {
  if (!target) return;
  const matchText = settings.competitionMode === "individual"
    ? `${settings.individualMatchSize} Peserta / match`
    : `${settings.groupSize} Orang / kelompok | ${settings.groupMatchSize} Kelompok / match`;
  const ageText = categoryLabel(settings.ageCategoryFilter, "Semua");
  target.innerHTML = settings.competitionName
    ? `<span>${settings.competitionName}</span><small>${ageText} <em>|</em> ${MODE_LABELS[settings.competitionMode]} <em>|</em> ${GENDER_LABELS[settings.genderFilter]} <em>|</em> ${matchText}</small>`
    : "<span>Belum diatur</span>";
};

export const setStatus = (target, message) => {
  if (target) target.textContent = message;
};
