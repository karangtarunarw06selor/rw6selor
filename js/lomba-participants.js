const legacyCategoryAliases = {
  adult_all: "umum_dewasa",
  "3sd_5sd": "sd_3_5",
  "6sd_smp": "sd6_smp",
  "4sd_smp": "sd4_smp",
  ibu2: "ibu_ibu",
  bapak2: "bapak_bapak"
};
const normalizeCategory = (category = "") => legacyCategoryAliases[category] || category;
const childCategories = new Set(["tk_2sd", "sd_3_5", "sd6_smp", "tk_3sd", "sd4_smp"]);
const adultCategories = new Set(["remaja", "ibu_ibu", "bapak_bapak"]);

window.LombaParticipants = {
  init({ store, renderer, api }) {
    this.store = store;
    this.renderer = renderer;
    this.api = api;

    document.addEventListener("change", (event) => {
      const checkbox = event.target;
      if (checkbox?.matches?.("[data-participant-id]")) {
        this.toggleSelection(Number(checkbox.dataset.participantId), checkbox.checked);
      }
    });

    document.getElementById("btnRefreshPeserta")?.addEventListener("click", () => this.load());
    this.load();
  },

  async load() {
    const participants = await this.api.fetchParticipants();
    this.store.actions.setParticipants(participants);
    this.applyFilters();
  },

  applyFilters() {
    const state = this.store.getState();
    const filteredParticipants = state.participants.filter((participant) => {
      return this.matchesGender(participant, state.settings.genderFilter)
        && this.matchesCategory(participant, state.settings.ageCategoryFilter);
    });

    this.store.actions.setFilteredParticipants(filteredParticipants);
    const nextState = this.store.getState();
    this.renderer.renderParticipants(nextState.filteredParticipants, nextState.selectedParticipants);
    this.renderer.renderSelectedParticipants(nextState.participants, nextState.selectedParticipants);
    this.updateCounters(nextState.filteredParticipants.length, nextState.selectedParticipants.length);
  },

  matchesGender(participant, genderFilter) {
    return genderFilter === "mixed" || participant.gender === genderFilter;
  },

  matchesCategory(participant, categoryFilter) {
    const filter = normalizeCategory(categoryFilter);
    const category = normalizeCategory(participant.category);
    if (filter === "all") return true;
    if (filter === "anak_all") return childCategories.has(category);
    if (filter === "umum_dewasa") return adultCategories.has(category);
    return category === filter;
  },

  toggleSelection(id, selected) {
    const state = this.store.getState();
    const selectedIds = new Set(state.selectedParticipants);

    if (selected) {
      selectedIds.add(id);
    } else {
      selectedIds.delete(id);
    }

    const nextSelected = [...selectedIds];
    this.store.actions.setSelectedParticipants(nextSelected);
    this.renderer.renderParticipants(state.filteredParticipants, nextSelected);
    this.renderer.renderSelectedParticipants(state.participants, nextSelected);
    this.updateCounters(state.filteredParticipants.length, nextSelected.length);
  },

  getSelectedEntries() {
    const state = this.store.getState();
    const selectedIds = new Set(state.selectedParticipants);
    return state.participants.filter((participant) => selectedIds.has(participant.id));
  },

  updateCounters(total, selectedCount) {
    [document.getElementById("participantCounter"), document.getElementById("selectedParticipantCount")]
      .forEach((element) => {
        if (element) element.textContent = `${selectedCount}/${total} dipilih`;
      });
  }
};
