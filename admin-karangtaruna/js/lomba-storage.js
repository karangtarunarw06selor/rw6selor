export const STORAGE_KEYS = {
  draft: "lomba_admin_draft_v2"
};

export const CATEGORY_LABELS = {
  all: "Semua Kategori",
  anak_all: "Semua Anak",
  umum_dewasa: "Umum/Dewasa",
  tk_2sd: "TK - 2 SD",
  sd_3_5: "3 - 5 SD",
  sd6_smp: "6 SD - SMP",
  tk_3sd: "TK - 3 SD",
  sd4_smp: "4 SD - SMP",
  remaja: "Remaja",
  ibu_ibu: "Ibu-Ibu",
  bapak_bapak: "Bapak-Bapak"
};

export const CATEGORY_ALIASES = {
  adult_all: "umum_dewasa",
  "3sd_5sd": "sd_3_5",
  "6sd_smp": "sd6_smp",
  "4sd_smp": "sd4_smp",
  ibu2: "ibu_ibu",
  bapak2: "bapak_bapak"
};

export const CHILD_CATEGORIES = ["tk_2sd", "sd_3_5", "sd6_smp", "tk_3sd", "sd4_smp"];
export const ADULT_CATEGORIES = ["remaja", "ibu_ibu", "bapak_bapak"];
export const CATEGORY_OPTIONS = [...CHILD_CATEGORIES, ...ADULT_CATEGORIES];
export const FILTER_CATEGORY_OPTIONS = ["all", "anak_all", "umum_dewasa", ...CATEGORY_OPTIONS];

export const normalizeCategory = (category = "") => CATEGORY_ALIASES[category] || category;
export const categoryLabel = (category = "", fallback = "-") => CATEGORY_LABELS[normalizeCategory(category)] || category || fallback;
export const isChildCategory = (category = "") => CHILD_CATEGORIES.includes(normalizeCategory(category));
export const isAdultCategory = (category = "") => ADULT_CATEGORIES.includes(normalizeCategory(category));

export const MODE_LABELS = {
  individual: "Individu",
  existing_group: "Kelompok Sudah Jadi",
  auto_group: "Kelompok Otomatis"
};

export const GENDER_LABELS = {
  mixed: "Campuran",
  male: "Laki-laki",
  female: "Perempuan"
};

export const defaultSettings = {
  competitionName: "",
  competitionMode: "individual",
  genderFilter: "mixed",
  ageCategoryFilter: "all",
  individualMatchSize: 2,
  groupSize: 2,
  groupMatchSize: 2,
  bracketType: "single_elimination"
};

export const defaultState = {
  settings: { ...defaultSettings },
  participants: [],
  visibleParticipants: [],
  selectedParticipantIds: [],
  groups: [],
  selectedGroupIds: [],
  planner: null,
  bracket: null,
  podium: null,
  zoom: 1,
  filters: {
    search: "",
    age: "all"
  },
  ui: {
    generatorOpen: true,
    participantOpen: true,
    status: "Draft belum dibuat"
  }
};

const clone = (value) => JSON.parse(JSON.stringify(value));

export const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : clone(fallback);
  } catch (error) {
    console.warn(`LocalStorage ${key} tidak dapat dibaca.`, error);
    return clone(fallback);
  }
};

export const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeJson = (key) => {
  localStorage.removeItem(key);
};

export const createStore = (initialState = defaultState) => {
  let state = {
    ...clone(initialState),
    ...readJson(STORAGE_KEYS.draft, {})
  };
  state.settings = { ...defaultSettings, ...(state.settings || {}) };
  state.settings.ageCategoryFilter = normalizeCategory(state.settings.ageCategoryFilter);
  state.filters = { ...initialState.filters, ...(state.filters || {}) };
  state.filters.age = normalizeCategory(state.filters.age);
  state.ui = { ...initialState.ui, ...(state.ui || {}) };

  const listeners = new Set();

  const getState = () => clone(state);

  const setState = (patchOrUpdater, options = {}) => {
    const patch = typeof patchOrUpdater === "function" ? patchOrUpdater(getState()) : patchOrUpdater;
    state = {
      ...state,
      ...patch,
      settings: { ...state.settings, ...(patch.settings || {}) },
      filters: { ...state.filters, ...(patch.filters || {}) },
      ui: { ...state.ui, ...(patch.ui || {}) }
    };
    if (options.persist !== false) writeJson(STORAGE_KEYS.draft, state);
    listeners.forEach((listener) => listener(getState()));
  };

  return {
    getState,
    setState,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    saveDraft() {
      writeJson(STORAGE_KEYS.draft, state);
    },
    resetDraft() {
      state = clone(initialState);
      removeJson(STORAGE_KEYS.draft);
      listeners.forEach((listener) => listener(getState()));
    },
  };
};

if (typeof window !== "undefined") {
  window.LombaStorage = { STORAGE_KEYS, createStore };
}
