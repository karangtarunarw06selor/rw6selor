const chunk = (items, size) => {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

window.LombaBracket = {
  init({ store, renderer, participants, groups, ui }) {
    this.store = store;
    this.renderer = renderer;
    this.participants = participants;
    this.groups = groups;
    this.ui = ui;

    document.getElementById("btnGenerateBracket")?.addEventListener("click", () => this.generate());
    document.getElementById("btnResetBracket")?.addEventListener("click", () => this.reset());
    document.getElementById("btnZoomOut")?.addEventListener("click", () => this.changeZoom(-0.1));
    document.getElementById("btnZoomReset")?.addEventListener("click", () => this.resetZoom());
    document.getElementById("btnZoomIn")?.addEventListener("click", () => this.changeZoom(0.1));

    document.addEventListener("change", (event) => {
      const winnerInput = event.target;
      if (winnerInput?.matches?.("[data-winner-id]")) {
        this.store.actions.setWinner(winnerInput.dataset.winnerId);
      }
    });
  },

  generate() {
    const state = this.store.getState();
    const entries = this.getEntriesForMode(state);

    if (entries.length < 2) {
      this.ui.showStatus("Minimal 2 peserta/kelompok untuk membuat bagan.");
      return;
    }

    const bracket = this.createBracket(entries, state.settings);
    this.store.actions.setBracket(bracket);
    this.renderer.renderBracket(bracket, state.zoom);
    this.ui.showStatus(`Bagan: ${entries.length} peserta/kelompok`);
  },

  getEntriesForMode(state) {
    if (state.settings.competitionMode === "individual") {
      return this.participants.getSelectedEntries().map((participant) => ({
        id: `participant-${participant.id}`,
        name: participant.name,
        meta: participant.category
      }));
    }

    return this.groups.prepareGroups().map((group) => ({
      id: group.id,
      name: group.name,
      meta: `${group.members.length} anggota`
    }));
  },

  createBracket(entries, settings) {
    const matchSize = settings.competitionMode === "individual"
      ? Number(settings.individualMatchSize)
      : Number(settings.groupMatchSize);

    if (settings.bracketType === "round_robin") {
      return this.createRoundRobinBracket(entries);
    }

    if (settings.bracketType === "group_stage") {
      return this.createGroupStageBracket(entries, matchSize);
    }

    return this.createSingleEliminationBracket(entries, matchSize);
  },

  createSingleEliminationBracket(entries, matchSize) {
    const firstRoundMatches = chunk(entries, matchSize).map((slots, index) => ({
      id: `r1-m${index + 1}`,
      label: `Match ${index + 1}`,
      status: "ready",
      slots
    }));

    if (firstRoundMatches.length === 1) {
      return {
        type: "single_elimination",
        rounds: [{ name: "Final", matches: firstRoundMatches }]
      };
    }

    const nextRoundCount = Math.max(1, Math.ceil(firstRoundMatches.length / matchSize));
    const finalMatches = Array.from({ length: nextRoundCount }, (_, index) => ({
      id: `final-m${index + 1}`,
      label: nextRoundCount === 1 ? "Final" : `Match ${index + 1}`,
      status: "pending",
      slots: Array.from({ length: Math.min(matchSize, firstRoundMatches.length) }, () => null)
    }));

    return {
      type: "single_elimination",
      rounds: [
        { name: "Ronde 1", matches: firstRoundMatches },
        { name: nextRoundCount === 1 ? "Final" : "Ronde Berikutnya", matches: finalMatches }
      ]
    };
  },

  createRoundRobinBracket(entries) {
    const matches = [];
    entries.forEach((entry, index) => {
      entries.slice(index + 1).forEach((opponent) => {
        matches.push({
          id: `rr-m${matches.length + 1}`,
          label: `Match ${matches.length + 1}`,
          status: "ready",
          slots: [entry, opponent]
        });
      });
    });

    return {
      type: "round_robin",
      rounds: [{ name: "Round Robin", matches }]
    };
  },

  createGroupStageBracket(entries, matchSize) {
    const groups = chunk(entries, matchSize).map((slots, index) => ({
      id: `stage-g${index + 1}`,
      label: `Grup ${index + 1}`,
      status: "ready",
      slots
    }));

    return {
      type: "group_stage",
      rounds: [{ name: "Penyisihan Grup", matches: groups }]
    };
  },

  changeZoom(delta) {
    const state = this.store.getState();
    this.store.actions.setZoom(state.zoom + delta);
    const nextState = this.store.getState();
    this.renderer.renderBracket(nextState.bracket, nextState.zoom);
  },

  resetZoom() {
    this.store.actions.setZoom(1);
    const state = this.store.getState();
    this.renderer.renderBracket(state.bracket, state.zoom);
  },

  reset() {
    this.store.actions.resetRuntime();
    this.renderer.renderGroups([]);
    this.renderer.renderBracket(null, 1);
    this.ui.showStatus("Bagan direset.");
  }
};
