import { categoryLabel } from "./lomba-storage.js";
import { renderGenderIcon } from "./render-gender.js";

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const medalIcon = {
  first: "fa-trophy",
  second: "fa-medal",
  third: "fa-award"
};

const medalLabel = {
  first: "Juara 1",
  second: "Juara 2",
  third: "Juara 3"
};

const displayEntryName = (entry) => {
  if (!entry) return "Belum ditentukan";
  if (entry.type === "group" || entry.members?.length) {
    return String(entry.name || "").replace(/^Kel\.\s*/i, "Kelompok ");
  }
  return entry.name;
};

const memberCategory = (member) => categoryLabel(member.category);

const memberLine = (entry) => {
  if (!entry?.members?.length) return "";
  return `
    <div class="podium-member-line">
      ${entry.members.map((member) => `
        <div class="group-member-row">
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

export const renderPodium = (target, podium) => {
  if (!target) return;
  if (!podium) {
    target.innerHTML = "";
    return;
  }

  target.innerHTML = `
    <section class="mms-podium" aria-label="Podium pemenang">
      ${["first", "second", "third"].map((rank) => {
        const entry = podium[rank];
        return `
          <article class="mms-podium-card ${rank}">
            <i class="fa-solid ${medalIcon[rank]}"></i>
            <span>${medalLabel[rank]}</span>
            <strong>${escapeHtml(displayEntryName(entry))}</strong>
            ${memberLine(entry)}
          </article>
        `;
      }).join("")}
    </section>
  `;
};
