const STRUKTUR_API_BASE = "/common/api";

let strukturRows = [];
let pendingDeleteId = null;

function strukturEscape(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    }[char]));
}

function showStrukturAlert(message, type = "info") {
    const alert = document.getElementById("strukturInputAlert");
    if (!alert) return;
    alert.textContent = message;
    alert.className = `struktur-input-alert ${type}`;
    alert.hidden = false;
}

function getPublicBase() {
    if (location.hostname.includes("rw6selor.org")) return "https://karangtaruna.rw6selor.org";
    return location.origin;
}

function formatPhotoUrl(value) {
    const file = String(value || "").trim();
    if (!file) return "";
    if (/^https?:\/\//i.test(file)) return file;
    return `${getPublicBase()}/${file.replace(/^\/+/, "")}`;
}

function ensureEditControls() {
    const form = document.getElementById("strukturInputForm");
    const submitBtn = document.getElementById("strukturSubmitBtn");
    if (!form || !submitBtn) return;

    if (!form.querySelector('input[name="id"]')) {
        const idInput = document.createElement("input");
        idInput.type = "hidden";
        idInput.name = "id";
        idInput.id = "strukturRecordId";
        form.prepend(idInput);
    }

    if (!document.getElementById("strukturCancelEditBtn")) {
        const cancelBtn = document.createElement("button");
        cancelBtn.type = "button";
        cancelBtn.id = "strukturCancelEditBtn";
        cancelBtn.className = "archive-cancel-btn";
        cancelBtn.hidden = true;
        cancelBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> Batal Edit';
        cancelBtn.addEventListener("click", resetStrukturForm);
        submitBtn.insertAdjacentElement("afterend", cancelBtn);
    }
}

function ensureDeleteOverlay() {
    if (document.getElementById("strukturDeleteOverlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "strukturDeleteOverlay";
    overlay.className = "member-delete-overlay";
    overlay.hidden = true;
    overlay.innerHTML = `
        <div class="member-delete-dialog" role="dialog" aria-modal="true" aria-labelledby="strukturDeleteTitle">
            <button type="button" class="member-delete-close" id="strukturDeleteCloseBtn" aria-label="Tutup">&times;</button>
            <div class="member-delete-icon"><i class="fa-solid fa-trash-can"></i></div>
            <h3 id="strukturDeleteTitle">Hapus Data Pengurus?</h3>
            <p>Data <strong id="strukturDeleteName">pengurus ini</strong> akan dihapus dari struktur publik. Ketik <strong>hapus</strong> untuk melanjutkan.</p>
            <input type="text" id="strukturDeleteConfirmInput" autocomplete="off" placeholder="ketik: hapus">
            <div class="member-delete-actions">
                <button type="button" class="member-delete-cancel" id="strukturDeleteCancelBtn">Batal</button>
                <button type="button" class="member-delete-submit" id="strukturDeleteSubmitBtn" disabled>OK Hapus</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById("strukturDeleteCloseBtn")?.addEventListener("click", closeDeleteOverlay);
    document.getElementById("strukturDeleteCancelBtn")?.addEventListener("click", closeDeleteOverlay);
    document.getElementById("strukturDeleteSubmitBtn")?.addEventListener("click", confirmDeleteStruktur);
    document.getElementById("strukturDeleteConfirmInput")?.addEventListener("input", (event) => {
        const submit = document.getElementById("strukturDeleteSubmitBtn");
        if (submit) submit.disabled = event.target.value.trim().toLowerCase() !== "hapus";
    });
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) closeDeleteOverlay();
    });
}

function initUploadPreview() {
    const input = document.getElementById("strukturFile");
    const toggle = document.querySelector(".struktur-upload-toggle");
    const fileName = document.getElementById("strukturFileName");
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

function setSubmitMode(mode) {
    const submitBtn = document.getElementById("strukturSubmitBtn");
    const cancelBtn = document.getElementById("strukturCancelEditBtn");
    if (submitBtn) {
        submitBtn.innerHTML = mode === "edit"
            ? '<i class="fa-solid fa-floppy-disk"></i> Update Struktur Pengurus'
            : '<i class="fa-solid fa-floppy-disk"></i> Simpan Struktur Pengurus';
    }
    if (cancelBtn) cancelBtn.hidden = mode !== "edit";
}

function resetStrukturForm() {
    const form = document.getElementById("strukturInputForm");
    if (form) form.reset();
    const idInput = document.getElementById("strukturRecordId");
    if (idInput) idInput.value = "";
    document.querySelector(".struktur-upload-toggle")?.classList.remove("is-selected");
    const fileName = document.getElementById("strukturFileName");
    if (fileName) fileName.textContent = "Belum ada file dipilih";
    setSubmitMode("create");
}

async function uploadStrukturFileIfNeeded() {
    const input = document.getElementById("strukturFile");
    const file = input?.files?.[0];
    if (!file) return "";

    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${STRUKTUR_API_BASE}/structure_upload.php`, {
        method: "POST",
        body: formData,
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
        throw new Error(result.message || "Upload foto gagal.");
    }
    return result.path || "";
}

async function loadStrukturRows() {
    const tbody = document.getElementById("strukturRecentTable");
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:16px;">Memuat data...</td></tr>`;

    try {
        const response = await fetch(`${STRUKTUR_API_BASE}/structure_manage.php?cache=${Date.now()}`);
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || "Gagal memuat struktur.");
        }
        strukturRows = result.data || [];

        if (!strukturRows.length) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:16px;">Belum ada data struktur pengurus.</td></tr>`;
            return;
        }

        tbody.innerHTML = strukturRows.map((item) => {
            const photoUrl = formatPhotoUrl(item.foto_url);
            const sourceClass = item.foto_url ? (String(item.foto_url).startsWith("uploads/") ? "local" : "link") : "none";
            const sourceText = item.foto_url ? (sourceClass === "local" ? "Local" : "Link") : "-";
            const viewAction = photoUrl
                ? `<a class="struktur-mini-btn view" href="${strukturEscape(photoUrl)}" target="_blank" rel="noopener"><i class="fa-solid fa-eye"></i> Lihat</a>`
                : `<span style="color:#777;">Tidak ada foto</span>`;

            return `
                <tr>
                    <td><strong>${strukturEscape(item.jabatan || "-")}</strong></td>
                    <td>${strukturEscape(item.nama || "-")}</td>
                    <td>${strukturEscape(item.nim || "-")}</td>
                    <td><span class="struktur-source-badge ${sourceClass}">${sourceText}</span></td>
                    <td>${Number(item.urutan || 0)}</td>
                    <td>${Number(item.is_active) === 1 ? "Aktif" : "Nonaktif"}</td>
                    <td>
                        <div class="struktur-action-group">
                            ${viewAction}
                            <button type="button" class="struktur-mini-btn edit" data-id="${item.id}"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                            <button type="button" class="struktur-mini-btn delete" data-id="${item.id}"><i class="fa-solid fa-trash-can"></i> Hapus</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        tbody.querySelectorAll(".struktur-mini-btn.edit").forEach((button) => {
            button.addEventListener("click", () => editStrukturRow(Number(button.dataset.id || 0)));
        });
        tbody.querySelectorAll(".struktur-mini-btn.delete").forEach((button) => {
            button.addEventListener("click", () => openDeleteOverlay(Number(button.dataset.id || 0)));
        });
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:16px; color:#991b1b;">${strukturEscape(error.message)}</td></tr>`;
    }
}

function editStrukturRow(id) {
    const item = strukturRows.find((row) => Number(row.id) === id);
    const form = document.getElementById("strukturInputForm");
    if (!item || !form) return;

    form.elements.id.value = item.id;
    form.elements.nama.value = item.nama || "";
    form.elements.jabatan.value = item.jabatan || "";
    form.elements.nim.value = item.nim || "";
    form.elements.foto_url.value = item.foto_url || "";
    form.elements.instagram_url.value = item.instagram_url || "";
    form.elements.tiktok_url.value = item.tiktok_url || "";
    form.elements.urutan.value = item.urutan || 0;
    form.elements.is_active.value = Number(item.is_active) === 1 ? "1" : "0";
    setSubmitMode("edit");
    form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openDeleteOverlay(id) {
    const item = strukturRows.find((row) => Number(row.id) === id);
    if (!item) return;
    pendingDeleteId = id;
    const overlay = document.getElementById("strukturDeleteOverlay");
    const name = document.getElementById("strukturDeleteName");
    const input = document.getElementById("strukturDeleteConfirmInput");
    const submit = document.getElementById("strukturDeleteSubmitBtn");
    if (name) name.textContent = item.nama || "pengurus ini";
    if (input) input.value = "";
    if (submit) submit.disabled = true;
    if (overlay) overlay.hidden = false;
    input?.focus();
}

function closeDeleteOverlay() {
    pendingDeleteId = null;
    const overlay = document.getElementById("strukturDeleteOverlay");
    if (overlay) overlay.hidden = true;
}

async function confirmDeleteStruktur() {
    if (!pendingDeleteId) return;
    try {
        const response = await fetch(`${STRUKTUR_API_BASE}/structure_manage.php?id=${pendingDeleteId}`, {
            method: "DELETE",
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || "Gagal menghapus data.");
        }
        closeDeleteOverlay();
        showStrukturAlert("Data struktur berhasil dihapus.", "success");
        await loadStrukturRows();
    } catch (error) {
        showStrukturAlert(error.message, "danger");
    }
}

async function submitStrukturForm(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const submitBtn = document.getElementById("strukturSubmitBtn");
    const id = Number(form.elements.id?.value || 0);

    try {
        if (submitBtn) submitBtn.disabled = true;
        let uploadedPath = await uploadStrukturFileIfNeeded();
        const payload = {
            nama: form.elements.nama.value.trim(),
            jabatan: form.elements.jabatan.value.trim(),
            nim: form.elements.nim.value.trim(),
            foto_url: uploadedPath || form.elements.foto_url.value.trim(),
            instagram_url: form.elements.instagram_url.value.trim(),
            tiktok_url: form.elements.tiktok_url.value.trim(),
            urutan: Number(form.elements.urutan.value || 0),
            is_active: form.elements.is_active.value === "1",
        };

        const response = await fetch(`${STRUKTUR_API_BASE}/structure_manage.php${id ? `?id=${id}` : ""}`, {
            method: id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || "Gagal menyimpan struktur.");
        }

        showStrukturAlert(id ? "Data struktur berhasil diperbarui." : "Data struktur berhasil disimpan.", "success");
        resetStrukturForm();
        await loadStrukturRows();
    } catch (error) {
        showStrukturAlert(error.message, "danger");
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    ensureEditControls();
    ensureDeleteOverlay();
    initUploadPreview();
    document.getElementById("strukturInputForm")?.addEventListener("submit", submitStrukturForm);
    loadStrukturRows();
});
