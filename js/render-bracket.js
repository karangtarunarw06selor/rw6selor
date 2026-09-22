import { categoryLabel } from "./lomba-storage.js";
import { renderGenderIcon } from "./render-gender.js";
import { renderPodium } from "./render-podium.js";

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const displayEntryName = (entry) => {
  if (!entry) return "";
  if (entry.type === "group" || entry.members?.length) {
    return String(entry.name || "").replace(/^Kel\.\s*/i, "Kelompok ");
  }
  return entry.name;
};

const metaLabel = (entry) => {
  if (!entry) return "";
  if (entry.members?.length || entry.type === "group") return "";
  if (entry.type === "source" || entry.type === "loser") return "Menunggu hasil";
  return categoryLabel(entry.category);
};

const memberCategory = (member) => categoryLabel(member.category);

const playableSlot = (slot) => slot?.resolved || slot;

const BRACKET_PATH_LABELS = {
  preliminary: "PRELIMINARY",
  main: "MAIN BRACKET",
  qualifier: "QUALIFIER",
  lower: "LOWER BRACKET",
  semifinal: "SEMI FINAL",
  third_place: "THIRD PLACE",
  final: "FINAL"
};

const roundTitle = (round) => BRACKET_PATH_LABELS[round.bracketPath] || BRACKET_PATH_LABELS[round.type] || "BRACKET";

const syncRoundWidths = (target) => {
  target.querySelectorAll(".bracket-round").forEach((round) => {
    const matches = [...round.querySelectorAll(".bracket-match")];
    const title = round.querySelector(".bracket-round-title");
    [...matches, title].filter(Boolean).forEach((element) => {
      element.style.width = "";
      element.style.minWidth = "";
    });

    const maxWidth = Math.ceil(Math.max(
      title?.scrollWidth || 0,
      ...matches.map((match) => match.scrollWidth)
    ));
    if (!maxWidth) return;

    round.style.width = `${maxWidth}px`;
    title.style.width = `${maxWidth}px`;
    matches.forEach((match) => {
      match.style.width = `${maxWidth}px`;
      match.style.minWidth = `${maxWidth}px`;
    });
  });
};

const resetBracketAreaSize = (target) => {
  target.style.height = "";
  target.style.minHeight = "";
};

const syncBracketAreaHeight = (target, zoom = 1) => {
  const board = target.querySelector(".bracket-board");
  if (!board) {
    resetBracketAreaSize(target);
    return;
  }

  const numericZoom = Number.parseFloat(zoom) || 1;
  if (Math.abs(numericZoom - 1) < 0.001) {
    target.style.height = "";
    target.style.minHeight = "0px";
    return;
  }

  const styles = window.getComputedStyle(target);
  const paddingY = Number.parseFloat(styles.paddingTop || "0") + Number.parseFloat(styles.paddingBottom || "0");
  const visualHeight = Math.ceil(board.getBoundingClientRect().height + paddingY + 2);
  target.style.minHeight = "0px";
  target.style.height = visualHeight ? `${visualHeight}px` : "";
};

export const renderBracket = ({ target, podiumTarget, bracket, zoom = 1 }) => {
  if (!target) return;
  if (!bracket) {
    target.classList.remove("has-bracket");
    target.classList.add("is-empty");
    resetBracketAreaSize(target);
    target.innerHTML = `
      <div class="bracket-empty-state">
        <i class="fa-solid fa-sitemap"></i>
        <strong>Bagan belum digenerate</strong>
        <span>Pilih peserta dan pengaturan lomba, lalu klik Generate Lomba.</span>
      </div>
    `;
    renderPodium(podiumTarget, null);
    return;
  }

  target.classList.remove("is-empty");
  target.classList.add("has-bracket");
  target.innerHTML = `
    <div class="bracket-board" style="transform:scale(${zoom});transform-origin:top left;">
      ${bracket.rounds.map((round, roundIndex) => `
        <section class="bracket-round" data-bracket-path="${escapeHtml(round.bracketPath || round.type || "")}">
          <div class="bracket-round-title">
            <span>${escapeHtml(roundTitle(round))}</span>
            ${round.name && round.name.toUpperCase() !== roundTitle(round) ? `<small>${escapeHtml(round.name)}</small>` : ""}
          </div>
          ${round.matches.map((match) => renderMatch(match, bracket, roundIndex)).join("")}
        </section>
      `).join("")}
    </div>
  `;
  syncRoundWidths(target);
  syncBracketAreaHeight(target, zoom);
  requestAnimationFrame(() => syncBracketAreaHeight(target, zoom));
  renderPodium(podiumTarget, bracket.podium);
};

const matchHasWoSlot = (match) => match.slots.some((slot) => {
  const entry = playableSlot(slot);
  return Boolean(entry?.wo || slot?.wo);
});

const renderMatch = (match, bracket, roundIndex = 0) => {
  const readySlots = match.slots.filter((slot) => playableSlot(slot) && !slot.locked || slot?.resolved);
  const isFinalMulti = bracket.engine === "multi" && match.type === "final";
  const canDragMembers = bracket.mode === "auto_group";
  const showWoPathBadge = roundIndex === 0 && Boolean(match.woPath || matchHasWoSlot(match));

  return `
    <article class="bracket-match ${showWoPathBadge ? "wo-path" : ""} ${match.displayOnly ? "display-only" : ""}" data-match-id="${escapeHtml(match.id)}">
      <div class="bracket-match-label">
        ${escapeHtml(match.label)}
        ${showWoPathBadge ? '<span class="wo-match-badge">Jalur WO</span>' : ""}
      </div>
      ${match.slots.map((slot, index) => renderSlot(slot, match, index, isFinalMulti, canDragMembers)).join("")}
      ${isFinalMulti ? renderRankingSelectors(match, readySlots) : ""}
    </article>
  `;
};

const renderGroupMembers = (entry, canDragMembers) => {
  if (!entry.members?.length) {
    return `<div class="group-member-rows is-empty" data-group-drop-id="${escapeHtml(entry.id)}">Belum ada anggota</div>`;
  }
  return `
    <div class="group-member-rows" data-group-drop-id="${escapeHtml(entry.id)}">
      ${entry.members.map((member) => `
        <div
          class="group-member-row"
          data-group-id="${escapeHtml(entry.id)}"
          data-member-id="${escapeHtml(member.id)}"
          draggable="${canDragMembers ? "true" : "false"}"
        >
          <span class="group-member-left">
            ${renderGenderIcon(member.gender)}
            <span class="group-member-name">${escapeHtml(member.name)}</span>
          </span>
          <span class="group-member-age">${escapeHtml(memberCategory(member))}</span>
        </div>
      `).join("")}
    </div>
  `;
};

const renderPersonRow = (entry, attrs = "") => `
  <div class="group-member-row participant-entry-row" ${attrs}>
    <span class="group-member-left">
      ${renderGenderIcon(entry.gender)}
      <span class="group-member-name">${escapeHtml(entry.name)}</span>
    </span>
    <span class="group-member-age">${escapeHtml(memberCategory(entry))}</span>
  </div>
`;

const renderWoInfo = (entry) => entry?.wo ? `
  <span class="wo-info">
    <span class="wo-badge">${escapeHtml(entry.woLabel || "WO")}</span>
    <small>${escapeHtml(entry.woNote || "Lolos otomatis karena WO")}</small>
  </span>
` : "";

const renderSlot = (slot, match, slotIndex, isFinalMulti, canDragMembers) => {
  const entry = playableSlot(slot);
  const pending = !entry || (slot.locked && !slot.resolved) || entry.id?.startsWith("source:") || entry.id?.startsWith("loser:");
  if (pending) {
    return `
      <div class="bracket-slot empty" draggable="false">
        <span class="participant-main">
          <strong class="participant-display-name">${escapeHtml(slot?.name || "TBD")}</strong>
          <small>${escapeHtml(metaLabel(slot))}</small>
          ${renderWoInfo(slot)}
        </span>
      </div>
    `;
  }

  return `
    <div
      class="bracket-slot ${match.winnerId === entry.id ? "winner" : ""}"
      draggable="${match.displayOnly ? "false" : "true"}"
      ${match.displayOnly ? "" : `data-match-id="${escapeHtml(match.id)}" data-slot-index="${slotIndex}"`}
      ${entry.type === "group" || entry.members?.length ? `data-group-id="${escapeHtml(entry.id)}"` : ""}
    >
      ${match.displayOnly ? "" : '<span class="drag-handle">::</span>'}
      <span class="participant-main">
        ${entry.members?.length || entry.type === "group"
          ? `<strong class="participant-display-name">${escapeHtml(displayEntryName(entry))}</strong>${renderWoInfo(entry)}${renderGroupMembers(entry, canDragMembers)}`
          : `${renderPersonRow(entry)}${renderWoInfo(entry)}`}
      </span>
      ${match.displayOnly ? "" : isFinalMulti ? renderInlineRankControls(match, entry) : `
        <label class="winner-check-wrap" title="Tandai pemenang">
          <input
            type="checkbox"
            class="winner-check"
            data-match-id="${escapeHtml(match.id)}"
            data-winner-id="${escapeHtml(entry.id)}"
            ${match.winnerId === entry.id ? "checked" : ""}
          >
        </label>
      `}
    </div>
  `;
};

const renderRankingSelectors = (match, slots) => {
  const rankings = match.rankings || { first: "", second: "", third: "" };
  return `
    <div class="mms-ranking-panel">
      <span>${slots.length} finalis. Pilih podium pada kartu finalis.</span>
    </div>
  `;
};

const rankLabels = {
  first: "🥇",
  second: "🥈",
  third: "🥉"
};

const renderInlineRankControls = (match, entry) => {
  const rankings = match.rankings || { first: "", second: "", third: "" };
  return `
    <div class="final-rank-controls" aria-label="Ranking final">
      ${Object.entries(rankLabels).map(([rank, label]) => `
        <label class="final-rank-option ${rankings[rank] === entry.id ? "is-selected" : ""}">
          <input
            type="checkbox"
            data-rank-select="${rank}"
            data-match-id="${escapeHtml(match.id)}"
            data-finalist-id="${escapeHtml(entry.id)}"
            ${rankings[rank] === entry.id ? "checked" : ""}
          >
          <span>${label}</span>
        </label>
      `).join("")}
    </div>
  `;
};
