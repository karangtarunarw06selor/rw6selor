const categoryLabels = {
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
const categoryAliases = {
  adult_all: "umum_dewasa",
  "3sd_5sd": "sd_3_5",
  "6sd_smp": "sd6_smp",
  "4sd_smp": "sd4_smp",
  ibu2: "ibu_ibu",
  bapak2: "bapak_bapak"
};
const normalizeCategory = (category = "") => categoryAliases[category] || category;
const categoryLabel = (category = "") => categoryLabels[normalizeCategory(category)] || category || "-";

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const participantMeta = (participant) => categoryLabel(participant.category);
const renderGenderIcon = (gender) => {
  const isFemale = gender === "female";
  return `
    <span class="gender-icon-badge ${isFemale ? "female" : "male"}" aria-label="${isFemale ? "Perempuan" : "Laki-laki"}">
      <i class="fa-solid ${isFemale ? "fa-person-dress" : "fa-person"}"></i>
    </span>
  `;
};

window.LombaRenderer = {
  init() {
    this.participantsTarget = document.querySelector('[data-render-target="participants"]');
    this.groupsTarget = document.querySelector('[data-render-target="groups"]');
    this.selectedTarget = document.getElementById("selectedParticipantList");
    this.bracketTarget = document.querySelector('[data-render-target="bracket"]');
  },

  renderParticipants(participants = [], selectedIds = []) {
    if (!this.participantsTarget) return;

    if (!participants.length) {
      this.participantsTarget.innerHTML = '<div class="participant-empty-state">Data peserta belum dimuat.</div>';
      return;
    }

    const selectedSet = new Set(selectedIds);
    this.participantsTarget.innerHTML = `
      <div class="participant-list-inner">
        ${participants.map((participant) => this.renderParticipantRow(participant, selectedSet)).join("")}
      </div>
    `;
  },

  renderParticipantRow(participant, selectedSet) {
    const checked = selectedSet.has(participant.id) ? "checked" : "";
    return `
      <label class="participant-item">
        <input type="checkbox" data-participant-id="${participant.id}" ${checked}>
        ${renderGenderIcon(participant.gender)}
        <span class="participant-choice-text">
          <strong>${escapeHtml(participant.name)}</strong>
          <small>${escapeHtml(participantMeta(participant))}</small>
        </span>
      </label>
    `;
  },

  renderSelectedParticipants(participants = [], selectedIds = []) {
    if (!this.selectedTarget) return;

    const selectedSet = new Set(selectedIds);
    const selected = participants.filter((participant) => selectedSet.has(participant.id));

    if (!selected.length) {
      this.selectedTarget.innerHTML = '<div class="mms-empty-mini">Belum ada peserta yang dipilih.</div>';
      return;
    }

    this.selectedTarget.innerHTML = `
      <div class="selected-participant-grid">
        ${selected.map((participant) => `
          <div class="selected-participant-item">
            <strong>${escapeHtml(participant.name)}</strong>
            <small>${escapeHtml(participantMeta(participant))}</small>
          </div>
        `).join("")}
      </div>
    `;
  },

  renderGroups(groups = []) {
    if (!this.groupsTarget) return;

    if (!groups.length) {
      this.groupsTarget.innerHTML = '<div class="participant-empty-state">Data kelompok belum dimuat.</div>';
      return;
    }

    this.groupsTarget.innerHTML = groups.map((group) => `
      <article class="group-item">
        <strong>${escapeHtml(group.name)}</strong>
        <small>${group.members.length} anggota</small>
        <div class="group-member-list">
          ${group.members.map((member) => `
            <span class="group-member-chip">${escapeHtml(member.name)}</span>
          `).join("")}
        </div>
      </article>
    `).join("");
  },

  renderBracket(bracket, zoom = 1) {
    if (!this.bracketTarget) return;

    if (!bracket || !bracket.rounds?.length) {
      this.bracketTarget.classList.remove("has-bracket");
      this.bracketTarget.classList.add("is-empty");
      this.resetBracketAreaSize();
      this.bracketTarget.innerHTML = `
        <div class="bracket-empty-state">
          <i class="fa-solid fa-sitemap"></i>
          <strong>Bagan belum digenerate</strong>
          <span>Pilih peserta dan pengaturan lomba, lalu klik Generate Lomba.</span>
        </div>
      `;
      return;
    }

    this.bracketTarget.classList.remove("is-empty");
    this.bracketTarget.classList.add("has-bracket");
    this.bracketTarget.innerHTML = `
      <div class="bracket-board" style="transform:scale(${zoom});transform-origin:top left;">
        ${bracket.rounds.map((round) => `
          <section class="bracket-round">
            <div class="bracket-round-title">${escapeHtml(round.name)}</div>
            ${round.matches.map((match) => this.renderMatch(match)).join("")}
          </section>
        `).join("")}
      </div>
    `;
    this.syncBracketAreaHeight(zoom);
    requestAnimationFrame(() => this.syncBracketAreaHeight(zoom));
  },

  resetBracketAreaSize() {
    if (!this.bracketTarget) return;
    this.bracketTarget.style.height = "";
    this.bracketTarget.style.minHeight = "";
  },

  syncBracketAreaHeight(zoom = 1) {
    if (!this.bracketTarget) return;
    const board = this.bracketTarget.querySelector(".bracket-board");
    if (!board) {
      this.resetBracketAreaSize();
      return;
    }

    const numericZoom = Number.parseFloat(zoom) || 1;
    if (Math.abs(numericZoom - 1) < 0.001) {
      this.bracketTarget.style.height = "";
      this.bracketTarget.style.minHeight = "0px";
      return;
    }

    const styles = window.getComputedStyle(this.bracketTarget);
    const paddingY = Number.parseFloat(styles.paddingTop || "0") + Number.parseFloat(styles.paddingBottom || "0");
    const visualHeight = Math.ceil(board.getBoundingClientRect().height + paddingY + 2);
    this.bracketTarget.style.minHeight = "0px";
    this.bracketTarget.style.height = visualHeight ? `${visualHeight}px` : "";
  },

  renderMatch(match) {
    return `
      <article class="bracket-match ${match.status === "pending" ? "is-pending" : ""}" data-match-id="${escapeHtml(match.id)}">
        <div class="bracket-match-label">${escapeHtml(match.label)}</div>
        ${match.slots.map((slot, index) => this.renderSlot(slot, index)).join("")}
      </article>
    `;
  },

  renderSlot(slot, index) {
    if (!slot) {
      return `<div class="bracket-slot empty" data-slot-key="slot-${index + 1}">TBD</div>`;
    }

    const meta = slot.members?.length
      ? slot.members.map((member) => member.name).join(" • ")
      : categoryLabel(slot.meta);

    return `
      <div class="bracket-slot" data-slot-key="slot-${index + 1}" draggable="true">
        <span class="drag-handle">::</span>
        ${slot.gender ? renderGenderIcon(slot.gender) : ""}
        <span class="participant-main">
          <strong class="participant-display-name">${escapeHtml(slot.name)}</strong>
          <small class="${slot.members?.length ? "group-member-line" : ""}">${escapeHtml(meta)}</small>
        </span>
        <label class="winner-check-wrap" title="Tandai pemenang">
          <input type="checkbox" class="winner-check" data-winner-id="${escapeHtml(slot.id)}">
        </label>
      </div>
    `;
  }
};
