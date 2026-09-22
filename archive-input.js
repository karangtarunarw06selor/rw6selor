const ARCHIVE_INPUT_API_BASE = getArchiveInputApiBase();

let archiveInputRows = [];
let pendingArchiveDeleteId = null;

function getArchiveInputApiBase() {
    const host = location.hostname;
    const isLocal = host === "localhost" || host === "127.0.0.1";

    if (isLocal) {
        if (location.pathname.startsWith("/mudamudiselor.biz.id/")) {
            return `${location.origin}/public_html/common/api`;
        }
        return `${location.origin}/common/api`;
    }

    if (host.includes("mudamudiselor.biz.id")) {
        return "https://mudamudiselor.web.id/common/api";
    }

    return `${location.origin}/common/api`;
}

function getArchivePublicBase() {
    const host = location.hostname;
    const isLocal = host === "localhost" || host === "127.0.0.1";

    if (isLocal) {
        if (location.pathname.startsWith("/mudamudiselor.biz.id/")) {
            return `${location.origin}/public_html`;
        }
        return location.origin;
    }

    if (host.includes("mudamudiselor.biz.id")) {
        return "https://mudamudiselor.web.id";
    }

    return location.origin;
}

function archiveInputEscape(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    }[char]));
}

function archiveInputShowAlert(message, type = "info") {
    const alert = document.getElementById("archiveInputAlert");
    if (!alert) return;
    alert.textContent = message;
    alert.className = `archive-input-alert ${type}`;
    alert.hidden = false;
}

function archiveInputFormatFileUrl(value) {
    const file = String(value || "").trim();
    if (!file) return "";
    if (/^https?:\/\//i.test(file)) return file;
    return `${getArchivePublicBase()}/${file.replace(/^\/+/, "")}`;
}

function archiveInputEnsureEditControls() {
    const form = document.getElementById("archiveInputForm");
    const submitBtn = document.getElementById("archiveSubmitBtn");
    if (!form || !submitBtn) return;

    if (!form.querySelector('input[name="id"]')) {
        const idInput = document.createElement("input");
        idInput.type = "hidden";
        idInput.name = "id";
        idInput.id = "archiveRecordId";
        form.prepend(idInput);
    }

    if (!document.getElementById("archiveCancelEditBtn")) {
        const cancelBtn = document.createElement("button");
        cancelBtn.type = "button";
        cancelBtn.id = "archiveCancelEditBtn";
        cancelBtn.className = "archive-cancel-btn";
        cancelBtn.hidden = true;
        cancelBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> Batal Edit';
        cancelBtn.addEventListener("click", archiveInputResetForm);
        submitBtn.insertAdjacentElement("afterend", cancelBtn);
    }
}

function archiveInputEnsureDeleteOverlay() {
    if (document.getElementById("archiveDeleteOverlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "archiveDeleteOverlay";
    overlay.className = "member-delete-overlay";
    overlay.hidden = true;
    overlay.innerHTML = `
        <div class="member-delete-dialog" role="dialog" aria-modal="true" aria-labelledby="archiveDeleteTitle">
            <button type="button" class="member-delete-close" id="archiveDeleteCloseBtn" aria-label="Tutup">&times;</button>
            <div class="member-delete-icon"><i class="fa-solid fa-trash-can"></i></div>
            <h3 id="archiveDeleteTitle">Hapus Data Arsip?</h3>
            <p>
                Data <strong id="archiveDeleteName">arsip ini</strong> akan dihapus dari database.
                Ketik <strong>hapus</strong> untuk melanjutkan.
            </p>
            <input type="text" id="archiveDeleteConfirmInput" autocomplete="off" placeholder="ketik: hapus">
            <div class="member-delete-actions">
                <button type="button" class="member-delete-cancel" id="archiveDeleteCancelBtn">Batal</button>
                <button type="button" class="member-delete-submit" id="archiveDeleteSubmitBtn" disabled>OK Hapus</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById("archiveDeleteCloseBtn")?.addEventListener("click", closeArchiveDeleteOverlay);
    document.getElementById("archiveDeleteCancelBtn")?.addEventListener("click", closeArchiveDeleteOverlay);
    document.getElementById("archiveDeleteSubmitBtn")?.addEventListener("click", () => confirmArchiveDelete());
    document.getElementById("archiveDeleteConfirmInput")?.addEventListener("input", (event) => {
        const submit = document.getElementById("archiveDeleteSubmitBtn");
        if (submit) submit.disabled = event.target.value.trim().toLowerCase() !== "hapus";
    });
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) closeArchiveDeleteOverlay();
    });
}

function archiveInputInitUploadPreview() {
    const input = document.getElementById("archiveFile");
    const toggle = document.querySelector(".archive-upload-toggle");
    const fileName = document.getElementById("archiveFileName");
    if (!input) return;

    input.addEventListener("change", () => {
        const file = input.files && input.files[0];
        if (file) {
            toggle?.classList.add("is-selected");
            if (fileName) fileName.textContent = file.name;
            return;
        }
        toggle?.classList.remove("is-selected");
        if (fileName) fileName.textContent = "Belum ada file dipilih";
    });
}

function archiveInputSetSubmitMode(mode) {
    const submitBtn = document.getElementById("archiveSubmitBtn");
    const cancelBtn = document.getElementById("archiveCancelEditBtn");
    const config = window.ARCHIVE_INPUT_CONFIG || {};
    const label = config.type ? config.type.toUpperCase() : "ARSIP";

    if (submitBtn) {
        submitBtn.innerHTML = mode === "edit"
            ? '<i class="fa-solid fa-floppy-disk"></i> Update Data Arsip'
            : `<i class="fa-solid fa-floppy-disk"></i> Simpan Arsip ${label}`;
    }
    if (cancelBtn) cancelBtn.hidden = mode !== "edit";
}

function archiveInputResetForm() {
    const form = document.getElementById("archiveInputForm");
    if (form) form.reset();
    const idInput = document.getElementById("archiveRecordId");
    if (idInput) idInput.value = "";
    document.querySelector(".archive-upload-toggle")?.classList.remove("is-selected");
    const fileName = document.getElementById("archiveFileName");
    if (fileName) fileName.textContent = "Belum ada file dipilih";
    archiveInputSetSubmitMode("create");
}

async function archiveInputLoadRecent() {
    const tbody = document.getElementById("archiveRecentTable");
    const config = window.ARCHIVE_INPUT_CONFIG || {};
    if (!tbody || !config.type) return;

    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:16px;">Memuat data...</td></tr>`;

    try {
        const response = await fetch(`${ARCHIVE_INPUT_API_BASE}/archives_list.php?type=${encodeURIComponent(config.type)}&cache=${Date.now()}`);
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || "Gagal memuat data arsip.");
        }

        archiveInputRows = result.data || [];
        const rows = archiveInputRows.slice(0, 8);
        if (rows.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:16px;">Belum ada data arsip.</td></tr>`;
            return;
        }

        tbody.innerHTML = rows.map((item) => {
            const fileUrl = archiveInputFormatFileUrl(item.file_url);
            const sourceBadge = item.local_exists ? "Local" : (item.external_url ? "Link" : "-");
            const viewAction = fileUrl
                ? `<a class="archive-mini-btn" href="${archiveInputEscape(fileUrl)}" target="_blank" rel="noopener"><i class="fa-solid fa-eye"></i> Lihat</a>`
                : `<span style="color:#777;">Tidak ada file</span>`;

            return `
                <tr>
                    <td>${archiveInputEscape(item.tanggal || "-")}</td>
                    <td><strong>${archiveInputEscape(item.title || item.nama || "-")}</strong></td>
                    <td>${archiveInputEscape(item.category || item.person_name || "-")}</td>
                    <td><span class="archive-source-badge">${archiveInputEscape(sourceBadge)}</span></td>
                    <td>
                        <div class="archive-action-group">
                            ${viewAction}
                            <button type="button" class="archive-mini-btn archive-edit-btn" data-id="${item.id}"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                            <button type="button" class="archive-mini-btn archive-delete-btn" data-id="${item.id}"><i class="fa-solid fa-trash-can"></i> Hapus</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        tbody.querySelectorAll(".archive-edit-btn").forEach((button) => {
            button.addEventListener("click", () => editArchiveRow(Number(button.dataset.id || 0)));
        });
        tbody.querySelectorAll(".archive-delete-btn").forEach((button) => {
            button.addEventListener("click", () => openArchiveDeleteOverlay(Number(button.dataset.id || 0)));
        });
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:16px; color:#D32F2F;">${archiveInputEscape(error.message)}</td></tr>`;
    }
}

function editArchiveRow(id) {
    const item = archiveInputRows.find((row) => Number(row.id) === Number(id));
    const form = document.getElementById("archiveInputForm");
    if (!item || !form) return;

    const idInput = document.getElementById("archiveRecordId");
    if (idInput) idInput.value = item.id;
    const dateInput = form.elements.archive_date;
    const titleInput = form.elements.title;
    const categoryInput = form.elements.category;
    const personInput = form.elements.person_name;
    const externalInput = form.elements.external_url;
    const fileInput = form.elements.archive_file;

    if (dateInput) dateInput.value = item.archive_date || "";
    if (titleInput) titleInput.value = item.title || item.nama || "";
    if (categoryInput) categoryInput.value = item.category || item.kategori || "";
    if (personInput) personInput.value = item.person_name || "";
    if (externalInput) externalInput.value = item.external_url || "";
    if (fileInput) fileInput.value = "";

    document.querySelector(".archive-upload-toggle")?.classList.remove("is-selected");
    const fileName = document.getElementById("archiveFileName");
    if (fileName) fileName.textContent = item.local_file ? `File tersimpan: ${item.local_file}` : "Belum ada file dipilih";

    archiveInputSetSubmitMode("edit");
    archiveInputShowAlert("Mode edit aktif. Ubah data lalu tekan Update Data Arsip.", "info");
    form.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function archiveInputSave(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const submitBtn = document.getElementById("archiveSubmitBtn");
    const config = window.ARCHIVE_INPUT_CONFIG || {};
    const formData = new FormData(form);
    formData.set("type", config.type || "");

    try {
        if (submitBtn) submitBtn.disabled = true;
        archiveInputShowAlert("Menyimpan data arsip...", "info");

        const response = await fetch(`${ARCHIVE_INPUT_API_BASE}/archives_save.php`, {
            method: "POST",
            body: formData,
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || "Gagal menyimpan data arsip.");
        }

        archiveInputResetForm();
        archiveInputShowAlert(result.message || "Data arsip berhasil disimpan.", "success");
        archiveInputLoadRecent();
    } catch (error) {
        archiveInputShowAlert(error.message, "error");
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
}

async function openArchiveDeleteOverlay(id) {
    const item = archiveInputRows.find((row) => Number(row.id) === Number(id));
    if (!item) return;

    pendingArchiveDeleteId = id;
    const itemName = item.title || item.nama || 'arsip ini';

    if (window.createDeleteConfirmToast) {
        const confirmed = await window.createDeleteConfirmToast({
            title: 'Hapus Data Arsip?',
            message: `Data <strong>${itemName}</strong> akan dihapus dari database.`,
            confirmLabel: 'Hapus',
            requireWord: 'hapus'
        });
        if (!confirmed || !confirmed.confirmed) {
            pendingArchiveDeleteId = null;
            return;
        }
        await confirmArchiveDelete('hapus');
        return;
    }

    const overlay = document.getElementById("archiveDeleteOverlay");
    const name = document.getElementById("archiveDeleteName");
    const input = document.getElementById("archiveDeleteConfirmInput");
    const submit = document.getElementById("archiveDeleteSubmitBtn");

    if (name) name.textContent = itemName;
    if (input) input.value = "";
    if (submit) submit.disabled = true;
    if (overlay) overlay.hidden = false;
    setTimeout(() => input?.focus(), 50);
}

function closeArchiveDeleteOverlay() {
    pendingArchiveDeleteId = null;
    const overlay = document.getElementById("archiveDeleteOverlay");
    if (overlay) overlay.hidden = true;
}

async function confirmArchiveDelete(forcedConfirmation) {
    if (!pendingArchiveDeleteId) return;
    const config = window.ARCHIVE_INPUT_CONFIG || {};
    const input = document.getElementById("archiveDeleteConfirmInput");
    const submit = document.getElementById("archiveDeleteSubmitBtn");
    const confirmation = (forcedConfirmation || input?.value || "").trim().toLowerCase();

    if (confirmation !== "hapus") return;

    try {
        if (submit) submit.disabled = true;
        const response = await fetch(`${ARCHIVE_INPUT_API_BASE}/archives_delete.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: config.type || "",
                id: pendingArchiveDeleteId,
                confirmation,
            }),
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || "Gagal menghapus data arsip.");
        }

        closeArchiveDeleteOverlay();
        archiveInputResetForm();
        archiveInputShowAlert(result.message || "Data arsip berhasil dihapus.", "success");
        archiveInputLoadRecent();
    } catch (error) {
        archiveInputShowAlert(error.message, "error");
        if (submit) submit.disabled = false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("archiveInputForm");
    archiveInputEnsureEditControls();
    archiveInputEnsureDeleteOverlay();
    if (form) form.addEventListener("submit", archiveInputSave);
    archiveInputInitUploadPreview();
    archiveInputLoadRecent();
});
