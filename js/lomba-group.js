window.LombaGroup = {
  init({ store, renderer, participants }) {
    this.store = store;
    this.renderer = renderer;
    this.participants = participants;
  },

  prepareGroups() {
    const state = this.store.getState();

    if (state.settings.competitionMode === "individual") {
      this.store.actions.setGroups([]);
      this.renderer.renderGroups([]);
      return [];
    }

    const selectedParticipants = this.participants.getSelectedEntries();
    const groups = this.createAutoGroups(selectedParticipants, state.settings.groupSize);
    this.store.actions.setGroups(groups);
    this.renderer.renderGroups(groups);
    return groups;
  },

  createAutoGroups(participants, groupSize) {
    const size = Math.max(1, Number(groupSize) || 1);
    const groups = [];

    for (let index = 0; index < participants.length; index += size) {
      const members = participants.slice(index, index + size);
      groups.push({
        id: `group-${groups.length + 1}`,
        name: `Kelompok ${groups.length + 1}`,
        members,
        valid: members.length === size
      });
    }

    return groups;
  },

  validateGroups(groups) {
    const invalidGroups = groups.filter((group) => !group.valid);
    return {
      ok: invalidGroups.length === 0,
      invalidGroups
    };
  }
};
