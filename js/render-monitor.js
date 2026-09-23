import { renderBracket } from "./render-bracket.js";
import { renderPodium } from "./render-podium.js";
import { categoryLabel, GENDER_LABELS, MODE_LABELS } from "./lomba-storage.js";

const MONITOR_API_BASE = "https://rw6selor.org/api/public";

const fetchMonitorJson = async (path, params = {}) => {
  const url = new URL(`${MONITOR_API_BASE}/${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString(), { credentials: "omit" });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || `API monitor gagal: ${response.status}`);
  }

  return payload;
};

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const emptyLive = `
  <div class="bracket-empty-state">
    <i class="fa-solid fa-tv"></i>
    <strong>Belum ada bagan live</strong>
    <span>Bagan akan tampil otomatis setelah admin mengaktifkan Publish.</span>
  </div>
`;

const archiveEmpty = '<div class="participant-empty-state">Belum ada arsip lomba selesai.</div>';

const errorState = (message) => `
  <div class="bracket-empty-state">
    <i class="fa-solid fa-triangle-exclamation"></i>
    <strong>Gagal membaca data monitor</strong>
    <span>${escapeHtml(message)}</span>
  </div>
`;

const state = {
  archiveItems: [],
  archiveSearch: "",
  archiveYear: "all",
  archiveOpen: false,
  activeArchive: null
};

const setStatus = (target, text) => {
  if (target) target.textContent = text;
};

const BRACKET_TYPE_LABELS = {
  single_elimination: "Single Elimination",
  round_robin: "Round Robin",
  group_stage: "Group Stage"
};

const valueOrDash = (value) => value || "-";

const competitionMeta = (source = {}) => {
  const bracket = source.bracket || source;
  const settings = source.settings || bracket?.settings || {};
  const mode = settings.competitionMode || bracket?.mode || "";
  const matchSize = mode === "individual"
    ? settings.individualMatchSize || bracket?.matchSize
    : settings.groupMatchSize || bracket?.matchSize;
  const matchLabel = matchSize ? `${matchSize} peserta/match` : "-";
  const name = settings.competitionName || bracket?.competitionName || source.name || "";
  return {
    name: name || "Lomba Aktif",
    summary: [
      categoryLabel(settings.ageCategoryFilter),
      MODE_LABELS[mode] || mode || "-",
      GENDER_LABELS[settings.genderFilter] || settings.genderFilter || "-",
      matchLabel,
      BRACKET_TYPE_LABELS[settings.bracketType || bracket?.bracketType] || settings.bracketType || bracket?.bracketType || "-"
    ].map(valueOrDash).join(" | ")
  };
};

const renderCompetitionInfo = (target, source) => {
  if (!target) return;
  if (!source?.bracket && !source?.settings && !source?.name) {
    target.hidden = true;
    target.innerHTML = "";
    return;
  }
  const meta = competitionMeta(source);
  target.hidden = false;
  target.innerHTML = `
    <strong>${escapeHtml(meta.name)}</strong>
    <small>${escapeHtml(meta.summary)}</small>
  `;
};

const yearFromItem = (item) => {
  const sourceDate = item.updated_at || item.created_at;
  return sourceDate ? String(new Date(sourceDate).getFullYear()) : "";
};

const filteredArchiveItems = () => state.archiveItems.filter((item) => {
  const yearOk = state.archiveYear === "all" || yearFromItem(item) === state.archiveYear;
  const query = state.archiveSearch.trim().toLowerCase();
  const haystack = `${item.name || ""} ${item.detail || ""}`.toLowerCase();
  const searchOk = !query || haystack.includes(query);
  return yearOk && searchOk;
});

const renderArchiveYears = (yearSelect) => {
  if (!yearSelect) return;
  const current = yearSelect.value || "all";
  const years = [...new Set(state.archiveItems.map(yearFromItem).filter(Boolean))].sort((a, b) => b.localeCompare(a));
  yearSelect.innerHTML = `
    <option value="all">Semua Tahun</option>
    ${years.map((year) => `<option value="${escapeHtml(year)}">${escapeHtml(year)}</option>`).join("")}
  `;
  yearSelect.value = years.includes(current) ? current : "all";
  state.archiveYear = yearSelect.value;
};

const renderArchiveList = (listTarget) => {
  if (!listTarget) return;
  const items = filteredArchiveItems();
  if (!items.length) {
    listTarget.innerHTML = archiveEmpty;
    return;
  }

  listTarget.innerHTML = items.map((item) => {
    const date = item.updated_at ? new Date(item.updated_at).toLocaleDateString("id-ID") : "-";
    return `
      <button type="button" class="monitor-archive-item" data-archive-id="${escapeHtml(item.id)}">
        <span>
          <strong>${escapeHtml(item.name)}</strong>
          <small>${escapeHtml(date)} • ${escapeHtml(item.status)}</small>
        </span>
        <i class="fa-solid fa-up-right-from-square"></i>
      </button>
    `;
  }).join("");
};

export const renderLiveMonitor = async ({ bracketTarget, podiumTarget, statusTarget, infoTarget }) => {
  try {
    const payload = await fetchMonitorJson("get_monitor_bracket.php");
    if (!payload?.bracket) {
      renderCompetitionInfo(infoTarget, null);
      if (bracketTarget) bracketTarget.innerHTML = emptyLive;
      renderPodium(podiumTarget, null);
      setStatus(statusTarget, payload?.message || "Belum ada bagan live");
      return;
    }

    renderCompetitionInfo(infoTarget, { bracket: payload.bracket });
    renderBracket({ target: bracketTarget, podiumTarget, bracket: payload.bracket, zoom: 1 });
    renderPodium(podiumTarget, payload.bracket.podium || null);
    const time = payload.updated_at ? new Date(payload.updated_at).toLocaleString("id-ID") : null;
    setStatus(statusTarget, time ? `Live • diperbarui ${time}` : "Live sekarang");
  } catch (error) {
    renderCompetitionInfo(infoTarget, null);
    if (bracketTarget) bracketTarget.innerHTML = errorState(error.message);
    setStatus(statusTarget, "API monitor gagal");
  }
};

const loadArchive = async (controls) => {
  const payload = await fetchMonitorJson("get_monitor_list.php");
  state.archiveItems = (payload.items || [])
    .filter((item) => item.type === "history")
    .map((item) => ({
      id: item.key,
      name: item.title || item.detail || "Riwayat Lomba",
      detail: item.detail || "",
      status: item.type || "history",
      updated_at: item.updated_at || null
    }));
  renderArchiveYears(controls.year);
  renderArchiveList(controls.list);
};

const openArchiveOverlay = async (id, controls) => {
  const payload = await fetchMonitorJson("get_monitor_bracket.php", { key: id });
  if (!payload?.bracket) return;

  const item = state.archiveItems.find((entry) => entry.id === id);
  const archive = {
    name: item?.name || "Arsip Lomba",
    detail: item?.detail || "",
    bracket: payload.bracket,
    podium: payload.bracket.podium || null,
    updated_at: payload.updated_at || null,
    status: item?.status || "history"
  };

  state.activeArchive = archive;
  controls.overlay.hidden = false;
  controls.overlay.classList.add("is-open");
  controls.title.textContent = archive.name || competitionMeta(archive).name;
  renderCompetitionInfo(controls.archiveInfo, { bracket: archive.bracket, name: archive.name });
  renderBracket({ target: controls.archiveBracket, podiumTarget: controls.archivePodium, bracket: archive.bracket, zoom: 1 });
  renderPodium(controls.archivePodium, archive.podium || archive.bracket.podium);
};

const closeArchiveOverlay = (controls) => {
  state.activeArchive = null;
  controls.overlay.hidden = true;
  controls.overlay.classList.remove("is-open");
  renderCompetitionInfo(controls.archiveInfo, null);
};

export const initMonitorAutoRefresh = (targets) => {
  const controls = {
    toggle: document.getElementById("btnToggleArchive"),
    panel: document.getElementById("monitorArchivePanel"),
    search: document.getElementById("monitorArchiveSearch"),
    year: document.getElementById("monitorArchiveYear"),
    list: document.getElementById("monitorArchiveList"),
    overlay: document.getElementById("monitorArchiveOverlay"),
    title: document.getElementById("archiveModalTitle"),
    archiveInfo: document.getElementById("archiveCompetitionInfo"),
    archiveBracket: document.getElementById("archiveBracketArea"),
    archivePodium: document.getElementById("archivePodiumArea"),
    close: document.getElementById("btnCloseArchive"),
    download: document.getElementById("btnArchiveDownload")
  };

  controls.panel?.classList.remove("is-open");

  controls.toggle?.addEventListener("click", async () => {
    state.archiveOpen = !state.archiveOpen;
    controls.panel?.classList.toggle("is-open", state.archiveOpen);
    controls.toggle.classList.toggle("is-open", state.archiveOpen);
    if (state.archiveOpen) {
      await loadArchive(controls).catch(() => {
        if (controls.list) controls.list.innerHTML = '<div class="participant-empty-state">Arsip lomba belum bisa dimuat.</div>';
      });
    }
  });

  controls.search?.addEventListener("input", async () => {
    state.archiveSearch = controls.search.value.trim();
    await loadArchive(controls).catch(() => {
      if (controls.list) controls.list.innerHTML = '<div class="participant-empty-state">Arsip lomba belum bisa dimuat.</div>';
    });
  });

  controls.year?.addEventListener("change", () => {
    state.archiveYear = controls.year.value;
    renderArchiveList(controls.list);
  });

  controls.list?.addEventListener("click", (event) => {
    const item = event.target.closest("[data-archive-id]");
    if (!item) return;
    openArchiveOverlay(item.dataset.archiveId, controls).catch(() => {
      if (controls.list) controls.list.innerHTML = '<div class="participant-empty-state">Detail arsip belum bisa dibuka.</div>';
    });
  });

  controls.close?.addEventListener("click", () => closeArchiveOverlay(controls));
  controls.overlay?.addEventListener("click", (event) => {
    if (event.target === controls.overlay) closeArchiveOverlay(controls);
  });
  controls.download?.addEventListener("click", () => window.print());

  renderLiveMonitor(targets);
  setInterval(() => renderLiveMonitor(targets), 60000);
};
