import { api } from "./lomba-api.js";
import { renderGenderIcon } from "./render-gender.js";
import { CATEGORY_OPTIONS, categoryLabel, isAdultCategory, isChildCategory, normalizeCategory } from "./lomba-storage.js";

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

let participants = [];
let filterAge = "all";
let searchQuery = "";

const apiErrorMessage = (error) => error?.message || "API peserta gagal. Periksa endpoint PHP dan database.";

const modalRoot = () => {
  let root = document.getElementById("registrationModal");
  if (root) return root;
  document.body.insertAdjacentHTML("beforeend", `
    <div class="mms-modal-overlay" id="registrationModal" hidden>
      <div class="mms-confirm-modal" role="dialog" aria-modal="true">
        <h3 id="registrationModalTitle"></h3>
        <div id="registrationModalBody"></div>
        <div class="mms-confirm-actions">
          <button type="button" class="mms-btn mms-btn-ghost" data-modal-cancel>Batal</button>
          <button type="button" class="mms-btn mms-btn-primary" data-modal-confirm>Lanjutkan</button>
        </div>
      </div>
    </div>
  `);
  return document.getElementById("registrationModal");
};

const confirmModal = ({ title, body, confirmText = "Lanjutkan", requireText = null }) => new Promise((resolve) => {
  const root = modalRoot();
  root.querySelector("#registrationModalTitle").textContent = title;
  root.querySelector("#registrationModalBody").innerHTML = body;
  const cancelBtn = root.querySelector("[data-modal-cancel]");
  const confirmBtn = root.querySelector("[data-modal-confirm]");
  const input = root.querySelector("[data-confirm-input]");
  const accepted = Array.isArray(requireText) ? requireText : requireText ? [requireText] : [];
  confirmBtn.textContent = confirmText;

  const validate = () => {
    confirmBtn.disabled = accepted.length > 0 && !accepted.includes(input?.value.trim().toLowerCase());
  };
  const cleanup = (value) => {
    root.hidden = true;
    root.classList.remove("is-open");
    cancelBtn.removeEventListener("click", onCancel);
    confirmBtn.removeEventListener("click", onConfirm);
    input?.removeEventListener("input", validate);
    resolve(value);
  };
  const onCancel = () => cleanup(false);
  const onConfirm = () => cleanup(true);
  validate();
  cancelBtn.addEventListener("click", onCancel);
  confirmBtn.addEventListener("click", onConfirm);
  input?.addEventListener("input", validate);
  root.hidden = false;
  root.classList.add("is-open");
  input?.focus();
});

const filteredParticipants = () => participants.filter((participant) => {
  const category = normalizeCategory(participant.category);
  const age = normalizeCategory(filterAge);
  const ageOk = age === "all"
    || (age === "anak_all" && isChildCategory(category))
    || (age === "umum_dewasa" && isAdultCategory(category))
    || category === age;
  const searchOk = !searchQuery || participant.name.toLowerCase().includes(searchQuery);
  return ageOk && searchOk;
});

const renderParticipants = () => {
  const target = document.getElementById("registrationList");
  const count = document.getElementById("registrationCount");
  const visible = filteredParticipants();
  if (count) count.textContent = `${participants.length} peserta`;
  if (!target) return;

  if (!visible.length) {
    target.innerHTML = '<div class="participant-empty-state">Tidak ada peserta sesuai filter.</div>';
    return;
  }

  target.innerHTML = `
    <div class="participant-list-inner">
      ${visible.map((participant) => `
        <div class="participant-item registration-item">
          ${renderGenderIcon(participant.gender)}
          <span class="participant-choice-text">
            <strong>${escapeHtml(participant.name)}</strong>
            <small>${escapeHtml(categoryLabel(participant.category))}</small>
          </span>
          <span class="registration-actions">
            <button type="button" class="mms-icon-btn" data-edit-id="${escapeHtml(participant.id)}" aria-label="Edit peserta"><i class="fa-solid fa-pen"></i></button>
            <button type="button" class="mms-icon-btn mms-icon-danger" data-delete-id="${escapeHtml(participant.id)}" aria-label="Hapus peserta"><i class="fa-solid fa-trash"></i></button>
          </span>
        </div>
      `).join("")}
    </div>
  `;
};

const loadParticipants = async () => {
  participants = await api.getParticipants();
  renderParticipants();
};

const editForm = (participant) => `
  <div class="mms-control-grid modal-form-grid">
    <div class="mms-form-group mms-wide-field">
      <label for="editName">Nama Peserta</label>
      <input id="editName" value="${escapeHtml(participant.name)}">
    </div>
    <div class="mms-form-group">
      <label for="editGender">Gender</label>
      <select id="editGender">
        <option value="male" ${participant.gender === "male" ? "selected" : ""}>Laki-laki</option>
        <option value="female" ${participant.gender === "female" ? "selected" : ""}>Perempuan</option>
      </select>
    </div>
    <div class="mms-form-group">
      <label for="editCategory">Kategori Usia</label>
      <select id="editCategory">
        ${CATEGORY_OPTIONS.map((value) => `
          <option value="${value}" ${normalizeCategory(participant.category) === value ? "selected" : ""}>${categoryLabel(value)}</option>
        `).join("")}
      </select>
    </div>
  </div>
`;

document.addEventListener("DOMContentLoaded", async () => {
  const status = document.getElementById("registrationCount");
  try {
    await loadParticipants();
  } catch (error) {
    if (status) status.textContent = apiErrorMessage(error);
  }

  document.getElementById("registrationForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const participant = {
      name: String(data.get("name") || "").trim(),
      gender: String(data.get("gender") || "male"),
      category: normalizeCategory(String(data.get("category") || "remaja"))
    };
    if (!participant.name) return;
    try {
      await api.createParticipant(participant);
      form.reset();
      await loadParticipants();
    } catch (error) {
      await confirmModal({ title: "Gagal menyimpan", body: `<p>${escapeHtml(apiErrorMessage(error))}</p>`, confirmText: "Mengerti" });
    }
  });

  document.getElementById("registrationSearch")?.addEventListener("input", (event) => {
    searchQuery = event.target.value.trim().toLowerCase();
    renderParticipants();
  });

  document.getElementById("btnDeleteAllParticipants")?.addEventListener("click", async () => {
    if (!participants.length) {
      await confirmModal({
        title: "Belum ada peserta",
        body: "<p>Daftar peserta masih kosong.</p>",
        confirmText: "Mengerti"
      });
      return;
    }

    const confirmed = await confirmModal({
      title: "Hapus semua peserta?",
      body: `
        <p>Semua data peserta terdaftar akan dihapus dari database. Aksi ini tidak bisa dibatalkan.</p>
        <div class="mms-confirm-input-wrap">
          <label for="deleteAllParticipantsInput">Ketik "hapus" untuk konfirmasi</label>
          <input id="deleteAllParticipantsInput" type="text" data-confirm-input autocomplete="off">
          <small>Tombol Hapus Semua aktif setelah teks konfirmasi sesuai.</small>
        </div>
      `,
      confirmText: "Hapus Semua",
      requireText: "hapus"
    });
    if (!confirmed) return;

    try {
      await api.deleteAllParticipants();
      participants = [];
      renderParticipants();
      await confirmModal({
        title: "Data peserta dihapus",
        body: "<p>Semua data peserta berhasil dihapus.</p>",
        confirmText: "Mengerti"
      });
    } catch (error) {
      await confirmModal({ title: "Gagal hapus semua", body: `<p>${escapeHtml(apiErrorMessage(error))}</p>`, confirmText: "Mengerti" });
    }
  });

  document.querySelectorAll("[data-age-filter]").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll("[data-age-filter]").forEach((item) => item.classList.toggle("is-active", item === chip));
      filterAge = normalizeCategory(chip.dataset.ageFilter || "all");
      renderParticipants();
    });
  });

  document.getElementById("registrationList")?.addEventListener("click", async (event) => {
    const editButton = event.target.closest("[data-edit-id]");
    const deleteButton = event.target.closest("[data-delete-id]");

    if (editButton) {
      const participant = participants.find((item) => item.id === editButton.dataset.editId);
      if (!participant) return;
      const confirmed = await confirmModal({ title: "Edit peserta", body: editForm(participant), confirmText: "Simpan" });
      if (!confirmed) return;
      try {
        await api.updateParticipant(participant.id, {
          name: document.getElementById("editName").value.trim(),
          gender: document.getElementById("editGender").value,
          category: normalizeCategory(document.getElementById("editCategory").value)
        });
        await loadParticipants();
      } catch (error) {
        await confirmModal({ title: "Gagal edit", body: `<p>${escapeHtml(apiErrorMessage(error))}</p>`, confirmText: "Mengerti" });
      }
    }

    if (deleteButton) {
      const participant = participants.find((item) => item.id === deleteButton.dataset.deleteId);
      if (!participant) return;
      const confirmed = await confirmModal({
        title: "Hapus peserta?",
        body: `<p>Peserta <strong>${escapeHtml(participant.name)}</strong> akan dihapus dari database.</p>`,
        confirmText: "Hapus",
        requireText: "hapus"
      });
      if (!confirmed) return;
      try {
        await api.deleteParticipant(participant.id);
        await loadParticipants();
      } catch (error) {
        await confirmModal({ title: "Gagal hapus", body: `<p>${escapeHtml(apiErrorMessage(error))}</p>`, confirmText: "Mengerti" });
      }
    }
  });
});
