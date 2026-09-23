window.LombaExport = {
  init({ store, api, ui }) {
    this.store = store;
    this.api = api;
    this.ui = ui;

    document.getElementById("btnSaveBracket")?.addEventListener("click", () => this.saveBracket());
    document.getElementById("btnExportPdf")?.addEventListener("click", () => this.printBracket());
  },

  async saveBracket() {
    const state = this.store.getState();
    if (!state.bracket) {
      this.ui.showStatus("Generate bagan terlebih dahulu sebelum menyimpan.");
      return;
    }

    const response = await this.api.saveBracket({
      settings: state.settings,
      groups: state.groups,
      bracket: state.bracket,
      winner: state.winner
    });

    this.ui.showStatus(response.message || "Bagan siap disimpan.");
  },

  printBracket() {
    const state = this.store.getState();
    if (!state.bracket) {
      this.ui.showStatus("Generate bagan terlebih dahulu sebelum export.");
      return;
    }

    window.print();
  }
};
