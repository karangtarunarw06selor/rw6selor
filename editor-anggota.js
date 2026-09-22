/**
 * Editor Data Anggota - Admin
 * Muda Mudi Sedahromo Lor 05
 */

const MEMBERS_ADMIN_API_BASE = getMembersAdminApiBase();
const MEMBERS_ADMIN_PUBLIC_BASE = 'https://mudamudiselor.web.id';

function getMembersAdminApiBase() {
    return 'https://mudamudiselor.web.id/common/api';
}

let membersData = [];
let memberSortState = {
    key: '',
    direction: 'asc'
};
let pendingDeleteMemberId = null;
let isDuplicateAdmin = false;
let adminCheckTimeout = null;

document.addEventListener('DOMContentLoaded', function() {
    loadMembers();
    initAdminPhotoUploadPreview();

    const form = document.getElementById('memberAdminForm');
    const cancelBtn = document.getElementById('memberAdminCancelEditBtn');
    const searchInput = document.getElementById('memberSearchInput');
    const statusFilter = document.getElementById('memberStatusFilter');
    const activeFilter = document.getElementById('memberActiveFilter');
    const sortButtons = document.querySelectorAll('.member-sort-btn');
    const deleteOverlay = document.getElementById('memberDeleteOverlay');
    const deleteInput = document.getElementById('memberDeleteConfirmInput');
    const deleteSubmitBtn = document.getElementById('memberDeleteSubmitBtn');
    const alertDiv = document.getElementById('memberAdminAlert');

    form.addEventListener('submit', saveMember);
    cancelBtn.addEventListener('click', cancelEdit);

    searchInput.addEventListener('input', renderMembers);
    statusFilter.addEventListener('change', renderMembers);
    activeFilter.addEventListener('change', renderMembers);
    sortButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            setMemberSort(button.dataset.sortKey || '');
        });
    });

    document.getElementById('memberDeleteCloseBtn')?.addEventListener('click', closeDeleteOverlay);
    document.getElementById('memberDeleteCancelBtn')?.addEventListener('click', closeDeleteOverlay);
    deleteSubmitBtn?.addEventListener('click', confirmDeleteMember);
    deleteInput?.addEventListener('input', function() {
        deleteSubmitBtn.disabled = deleteInput.value.trim().toLowerCase() !== 'hapus';
    });
    deleteOverlay?.addEventListener('click', function(event) {
        if (event.target === deleteOverlay) closeDeleteOverlay();
    });

    // === Real-time duplicate check for admin form ===
    const adminNameInput = document.getElementById('admin_full_name');
    const adminEmailInput = document.getElementById('admin_email');
    const adminBirthDateInput = document.getElementById('admin_birth_date');

    function performAdminCheck() {
        const name = adminNameInput ? adminNameInput.value.trim() : '';
        const mail = adminEmailInput ? adminEmailInput.value.trim() : '';
        const birthDate = adminBirthDateInput ? adminBirthDateInput.value.trim() : '';
        const memberId = document.getElementById('memberId').value;

        // Jika sedang edit member yang sudah ada (id !== ''), jangan cek duplikat
        if (memberId !== '') {
            if (isDuplicateAdmin) {
                isDuplicateAdmin = false;
                hideAdminDuplicateAlert();
            }
            return;
        }

        // Butuh semua 3 field untuk validasi
        if (name === '' || birthDate === '' || mail === '') {
            if (isDuplicateAdmin) {
                isDuplicateAdmin = false;
                hideAdminDuplicateAlert();
            }
            return;
        }

        const params = new URLSearchParams();
        params.set('full_name', name);
        params.set('email', mail);
        params.set('birth_date', birthDate);

        fetch(MEMBERS_ADMIN_API_BASE + '/members_check.php?' + params.toString())
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.success && data.exists) {
                    isDuplicateAdmin = true;
                    alertDiv.style.display = 'block';
                    alertDiv.className = 'member-alert member-alert-error';
                    alertDiv.innerHTML =
                        '<strong>⛔ Data Sudah Terdaftar!</strong><br>' +
                        'Anggota dengan nama <strong>' + escapeHtml(name) + '</strong>, email <strong>' + escapeHtml(mail) + '</strong>, dan tanggal lahir <strong>' + escapeHtml(birthDate) + '</strong> sudah ada di sistem.<br>' +
                        'Pastikan tidak mendaftarkan anggota yang sama. Anda tetap bisa menyimpan jika ingin mengupdate data yang sudah ada.';
                } else if (data.success && !data.exists) {
                    if (isDuplicateAdmin) {
                        isDuplicateAdmin = false;
                        hideAdminDuplicateAlert();
                    }
                }
            })
            .catch(function() {
                // Abaikan error, biarkan admin tetap bisa submit
            });
    }

    function scheduleAdminCheck() {
        clearTimeout(adminCheckTimeout);
        adminCheckTimeout = setTimeout(performAdminCheck, 600);
    }

    function hideAdminDuplicateAlert() {
        if (alertDiv.classList.contains('member-alert-error')) {
            alertDiv.style.display = 'none';
            alertDiv.className = 'member-alert';
        }
    }

    if (adminNameInput) adminNameInput.addEventListener('input', scheduleAdminCheck);
    if (adminEmailInput) adminEmailInput.addEventListener('input', scheduleAdminCheck);
    if (adminBirthDateInput) adminBirthDateInput.addEventListener('change', scheduleAdminCheck);
});

function initAdminPhotoUploadPreview() {
    const photoInput = document.querySelector("#admin_photo_file");
    const photoPreview = document.querySelector("#adminPhotoPreview");
    const photoPlaceholder = document.querySelector("#adminPhotoPlaceholder");
    const photoFileName = document.querySelector("#adminPhotoFileName");
    const uploadButton = document.querySelector(".admin-photo-upload-button");

    if (!photoInput) return;

    const clearPreview = () => {
        if (photoFileName) photoFileName.textContent = "Belum ada foto dipilih";
        if (uploadButton) uploadButton.classList.remove("is-selected");
        if (photoPreview) {
            photoPreview.hidden = true;
            photoPreview.removeAttribute("src");
        }
        if (photoPlaceholder) photoPlaceholder.hidden = false;
    };

    photoInput.addEventListener("change", () => {
        const file = photoInput.files && photoInput.files[0];

        if (!file) {
            clearPreview();
            return;
        }

        const allowed = ["image/jpeg", "image/png", "image/webp"];
        if (!allowed.includes(file.type)) {
            alert("Format foto harus JPG, PNG, atau WEBP.");
            photoInput.value = "";
            clearPreview();
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert("Ukuran foto maksimal 10 MB.");
            photoInput.value = "";
            clearPreview();
            return;
        }

        if (photoFileName) photoFileName.textContent = file.name;
        if (uploadButton) uploadButton.classList.add("is-selected");

        if (photoPreview) {
            photoPreview.src = URL.createObjectURL(file);
            photoPreview.hidden = false;
        }

        if (photoPlaceholder) {
            photoPlaceholder.hidden = true;
        }
    });
}

function resetAdminPhotoPreview(srcUrl) {
    const photoFileName = document.querySelector("#adminPhotoFileName");
    const photoPreview = document.querySelector("#adminPhotoPreview");
    const photoPlaceholder = document.querySelector("#adminPhotoPlaceholder");
    const photoInput = document.querySelector("#admin_photo_file");
    const uploadButton = document.querySelector(".admin-photo-upload-button");

    if (photoInput) photoInput.value = "";
    if (uploadButton) uploadButton.classList.toggle("is-selected", Boolean(srcUrl && srcUrl.trim() !== ""));

    if (srcUrl && srcUrl.trim() !== "") {
        if (photoFileName) photoFileName.textContent = "Foto tersimpan";
        if (photoPreview) {
            photoPreview.src = resolveMemberPhotoUrl(srcUrl);
            photoPreview.hidden = false;
        }
        if (photoPlaceholder) photoPlaceholder.hidden = true;
    } else {
        if (photoFileName) photoFileName.textContent = "Belum ada foto dipilih";
        if (photoPreview) {
            photoPreview.hidden = true;
            photoPreview.removeAttribute("src");
        }
        if (photoPlaceholder) photoPlaceholder.hidden = false;
    }
}

function resolveMemberPhotoUrl(url) {
    if (!url) return "";

    let normalized = String(url).trim();
    if (!normalized) return "";

    if (normalized.startsWith("public_html/")) {
        normalized = normalized.slice("public_html/".length);
    }

    if (normalized.includes("drive.google.com")) {
        let idFile = "";
        if (normalized.includes("id=")) idFile = normalized.split("id=")[1].split("&")[0];
        else if (normalized.includes("/d/")) idFile = normalized.split("/d/")[1].split("/")[0];
        if (idFile) return "https://drive.google.com/thumbnail?id=" + encodeURIComponent(idFile) + "&sz=w800";
    }

    if (/^https?:\/\//i.test(normalized)) {
        return normalized;
    }

    if (normalized.startsWith("/")) {
        return `${MEMBERS_ADMIN_PUBLIC_BASE}${normalized}`;
    }

    return `${MEMBERS_ADMIN_PUBLIC_BASE}/${normalized.replace(/^\/+/, "")}`;
}

async function loadMembers() {
    const tbody = document.getElementById('membersTableBody');
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">Memuat data...</td></tr>';

    try {
        const params = new URLSearchParams();
        const response = await fetch(MEMBERS_ADMIN_API_BASE + '/members_list.php?' + params.toString());
        const result = await response.json();

        if (result.success) {
            membersData = Array.isArray(result.data)
                ? result.data
                : Array.isArray(result.members)
                    ? result.members
                    : Array.isArray(result.rows)
                        ? result.rows
                        : [];
        } else {
            membersData = [];
        }
    } catch (err) {
        membersData = [];
    }

    renderMembers();
}

function renderMembers() {
    const tbody = document.getElementById('membersTableBody');
    const searchInput = document.getElementById('memberSearchInput');
    const statusFilter = document.getElementById('memberStatusFilter');
    const activeFilter = document.getElementById('memberActiveFilter');

    const q = (searchInput.value || '').toLowerCase();
    const status = statusFilter.value;
    const isActive = activeFilter.value;

    let filtered = membersData;

    if (q) {
        filtered = filtered.filter(function(m) {
            return (
                (m.full_name && m.full_name.toLowerCase().includes(q)) ||
                (m.member_code && m.member_code.toLowerCase().includes(q)) ||
                (m.whatsapp && m.whatsapp.toLowerCase().includes(q)) ||
                (m.email && m.email.toLowerCase().includes(q))
            );
        });
    }

    if (status) {
        filtered = filtered.filter(function(m) {
            return m.current_status === status;
        });
    }

    if (isActive !== '') {
        filtered = filtered.filter(function(m) {
            return String(m.is_active) === isActive;
        });
    }

    filtered = applyMemberSort(filtered);
    updateMemberSortButtons();

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">Tidak ada data anggota.</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    filtered.forEach(function(m) {
        const tr = document.createElement('tr');
        tr.innerHTML =
            '<td>' + escapeHtml(m.member_code || '-') + '</td>' +
            '<td>' + escapeHtml(m.full_name || '') + '</td>' +
            '<td>' + escapeHtml(m.whatsapp || '-') + '</td>' +
            '<td>' + escapeHtml(m.birth_place || '') + (m.birth_date ? '<br>' + formatDateIndo(m.birth_date) : '') + '</td>' +
            '<td>' + (m.age_years !== null ? m.age_years + ' thn' : '-') + '</td>' +
            '<td>' + escapeHtml(m.current_status || '-') + '</td>' +
            '<td><span class="member-badge ' + (m.is_active == 1 ? 'active' : 'inactive') + '">' + (m.is_active == 1 ? 'Aktif' : 'Nonaktif') + '</span></td>' +
            '<td class="member-action-btn">' +
                '<button class="member-edit-btn" onclick="editMember(' + m.id + ')"><i class="fa-solid fa-pen"></i> Edit</button> ' +
                '<button class="member-toggle-btn ' + (m.is_active == 1 ? 'is-active' : 'is-inactive') + '" onclick="toggleActiveMember(' + m.id + ',' + m.is_active + ')" title="' + (m.is_active == 1 ? 'Nonaktifkan anggota' : 'Aktifkan anggota') + '">' +
                    '<span class="toggle-track"><span class="toggle-knob"></span></span>' +
                    '<span>' + (m.is_active == 1 ? 'Aktif' : 'Nonaktif') + '</span>' +
                '</button>' +
                '<button class="member-delete-btn" onclick="openDeleteOverlay(' + m.id + ')" title="Hapus anggota"><i class="fa-solid fa-trash-can"></i> Hapus</button>' +
            '</td>';
        tbody.appendChild(tr);
    });
}

function setMemberSort(key) {
    if (!key) return;

    if (memberSortState.key === key) {
        memberSortState.direction = memberSortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
        memberSortState.key = key;
        memberSortState.direction = 'asc';
    }

    renderMembers();
}

function applyMemberSort(rows) {
    if (!memberSortState.key) return rows;

    const directionFactor = memberSortState.direction === 'desc' ? -1 : 1;

    return rows.slice().sort(function(a, b) {
        const valueA = getMemberSortValue(a, memberSortState.key);
        const valueB = getMemberSortValue(b, memberSortState.key);

        if (memberSortState.key === 'member_code' || memberSortState.key === 'age_years') {
            return (Number(valueA) - Number(valueB)) * directionFactor;
        }

        return String(valueA).localeCompare(String(valueB), 'id', {
            sensitivity: 'base',
            numeric: true
        }) * directionFactor;
    });
}

function getMemberSortValue(member, key) {
    if (key === 'member_code') {
        const numericCode = parseInt(member.member_code, 10);
        return Number.isFinite(numericCode) ? numericCode : 0;
    }

    if (key === 'full_name') {
        return member.full_name || '';
    }

    if (key === 'age_years') {
        const numericAge = parseInt(member.age_years, 10);
        return Number.isFinite(numericAge) ? numericAge : 0;
    }

    return '';
}

function updateMemberSortButtons() {
    document.querySelectorAll('.member-sort-btn').forEach(function(button) {
        const icon = button.querySelector('.sort-icon');
        const isActive = button.dataset.sortKey === memberSortState.key;

        button.classList.toggle('is-active', isActive);
        if (icon) {
            icon.textContent = isActive
                ? (memberSortState.direction === 'asc' ? '↑' : '↓')
                : '↕';
        }
    });
}

async function editMember(id) {
    try {
        const response = await fetch(MEMBERS_ADMIN_API_BASE + '/members_detail.php?id=' + id);
        const result = await response.json();

        if (!result.success || !result.data) {
            showAdminAlert('error', 'Gagal mengambil data anggota.');
            return;
        }

        const m = result.data;

        document.getElementById('memberId').value = m.id || '';
        document.getElementById('member_code').value = m.member_code || '';
        document.getElementById('admin_full_name').value = m.full_name || '';
        document.getElementById('admin_email').value = m.email || '';
        document.getElementById('admin_whatsapp').value = m.whatsapp || '';
        document.getElementById('admin_birth_place').value = m.birth_place || '';
        document.getElementById('admin_birth_date').value = m.birth_date || '';
        document.getElementById('admin_parent_name').value = m.parent_name || '';
        document.getElementById('admin_current_status').value = m.current_status || '';
        document.getElementById('admin_hobby').value = m.hobby || '';
        document.getElementById('admin_organization_experience').value = m.organization_experience || '';
        document.getElementById('admin_is_active').value = m.is_active !== null ? m.is_active : 1;

        // Show existing photo preview
        const resolvedPhoto = m.resolved_photo || m.photo_file || m.photo_url || '';
        resetAdminPhotoPreview(resolvedPhoto);

        document.getElementById('memberAdminSubmitBtn').textContent = 'Update Anggota';
        document.getElementById('memberAdminCancelEditBtn').style.display = 'inline-block';

        document.querySelector('.member-admin-box').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
        showAdminAlert('error', 'Gagal mengambil data anggota.');
    }
}

async function saveMember(event) {
    event.preventDefault();

    const alertDiv = document.getElementById('memberAdminAlert');
    alertDiv.style.display = 'none';
    alertDiv.className = 'member-alert';

    const form = document.getElementById('memberAdminForm');
    const formData = new FormData(form);

    // Map field names correctly from admin IDs
    formData.set('full_name', document.getElementById('admin_full_name').value);
    formData.set('email', document.getElementById('admin_email').value);
    formData.set('whatsapp', document.getElementById('admin_whatsapp').value);
    formData.set('birth_place', document.getElementById('admin_birth_place').value);
    formData.set('birth_date', document.getElementById('admin_birth_date').value);
    formData.set('parent_name', document.getElementById('admin_parent_name').value);
    formData.set('current_status', document.getElementById('admin_current_status').value);
    formData.set('hobby', document.getElementById('admin_hobby').value);
    formData.set('organization_experience', document.getElementById('admin_organization_experience').value);
    formData.set('is_active', document.getElementById('admin_is_active').value);

    const submitBtn = document.getElementById('memberAdminSubmitBtn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Menyimpan...';

    try {
        const response = await fetch(MEMBERS_ADMIN_API_BASE + '/members_save.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showAdminAlert('success', result.message || 'Data anggota berhasil disimpan.');
            form.reset();
            document.getElementById('memberId').value = '';
            resetAdminPhotoPreview('');
            document.getElementById('memberAdminSubmitBtn').textContent = 'Simpan Anggota';
            document.getElementById('memberAdminCancelEditBtn').style.display = 'none';
            await loadMembers();
        } else {
            showAdminAlert('error', result.message || 'Gagal menyimpan data.');
        }
    } catch (err) {
        showAdminAlert('error', 'Terjadi kesalahan jaringan. Silakan coba lagi.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

function cancelEdit() {
    document.getElementById('memberAdminForm').reset();
    document.getElementById('memberId').value = '';
    resetAdminPhotoPreview('');
    document.getElementById('memberAdminSubmitBtn').textContent = 'Simpan Anggota';
    document.getElementById('memberAdminCancelEditBtn').style.display = 'none';
    document.getElementById('memberAdminAlert').style.display = 'none';
}

async function toggleActiveMember(id, currentIsActive) {
    const newIsActive = currentIsActive == 1 ? 0 : 1;

    try {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('mode', 'toggle');
        formData.append('is_active', newIsActive);

        const response = await fetch(MEMBERS_ADMIN_API_BASE + '/members_delete.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showAdminAlert('success', result.message || 'Status anggota berhasil diperbarui.');
            await loadMembers();
        } else {
            showAdminAlert('error', result.message || 'Gagal memperbarui status.');
        }
    } catch (err) {
        showAdminAlert('error', 'Terjadi kesalahan jaringan.');
    }
}

async function openDeleteOverlay(id) {
    const member = membersData.find(function(item) {
        return Number(item.id) === Number(id);
    });
    pendingDeleteMemberId = id;
    const memberName = member && member.full_name ? member.full_name : 'anggota ini';
    if (window.createDeleteConfirmToast) {
        const confirmed = await window.createDeleteConfirmToast({
            title: 'Hapus Anggota?',
            message: `Data <strong>${memberName}</strong> akan dihapus dari database.`,
            confirmLabel: 'Hapus',
            requireWord: 'hapus'
        });
        if (!confirmed || !confirmed.confirmed) {
            pendingDeleteMemberId = null;
            return;
        }
        await confirmDeleteMember('hapus');
        return;
    }
    const overlay = document.getElementById('memberDeleteOverlay');
    const nameEl = document.getElementById('memberDeleteName');
    const input = document.getElementById('memberDeleteConfirmInput');
    const submitBtn = document.getElementById('memberDeleteSubmitBtn');
    if (nameEl) nameEl.textContent = memberName;
    if (input) input.value = '';
    if (submitBtn) submitBtn.disabled = true;
    if (overlay) overlay.hidden = false;

    setTimeout(function() {
        input?.focus();
    }, 50);
}

function closeDeleteOverlay() {
    const overlay = document.getElementById('memberDeleteOverlay');
    const input = document.getElementById('memberDeleteConfirmInput');
    const submitBtn = document.getElementById('memberDeleteSubmitBtn');

    pendingDeleteMemberId = null;
    if (input) input.value = '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'OK Hapus';
    }
    if (overlay) overlay.hidden = true;
}

async function confirmDeleteMember(forcedConfirmation) {
    const input = document.getElementById('memberDeleteConfirmInput');
    const submitBtn = document.getElementById('memberDeleteSubmitBtn');

    const confirmation = (forcedConfirmation || input?.value || '').trim().toLowerCase();
    if (!pendingDeleteMemberId || confirmation !== 'hapus') {
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Menghapus...';
    }

    try {
        const formData = new FormData();
        formData.append('id', pendingDeleteMemberId);
        formData.append('mode', 'delete');
        formData.append('confirm', 'hapus');

        const response = await fetch(MEMBERS_ADMIN_API_BASE + '/members_delete.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        if (result.success) {
            closeDeleteOverlay();
            showAdminAlert('success', result.message || 'Data anggota berhasil dihapus.');
            await loadMembers();
        } else {
            showAdminAlert('error', result.message || 'Gagal menghapus anggota.');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'OK Hapus';
            }
        }
    } catch (err) {
        showAdminAlert('error', 'Terjadi kesalahan jaringan saat menghapus anggota.');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'OK Hapus';
        }
    }
}

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function formatDateIndo(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return parts[2] + ' ' + months[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
}

function showAdminAlert(type, message) {
    const alertDiv = document.getElementById('memberAdminAlert');
    alertDiv.textContent = message;
    alertDiv.className = 'member-alert ' + type + ' member-alert-' + type;
    alertDiv.style.display = 'block';
    alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
