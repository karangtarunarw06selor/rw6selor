/**
 * Form Pendaftaran Anggota - Public
 * Muda Mudi Sedahromo Lor 05
 */

const MEMBERS_API_BASE = getMembersApiBase();

function getMembersApiBase() {
    const host = location.hostname;
    const isLocal = host === 'localhost' || host === '127.0.0.1';

    if (isLocal) {
        if (location.pathname.startsWith('/mudamudiselor.biz.id/')) {
            return `${location.origin}/public_html/common/api`;
        }
        return `${location.origin}/common/api`;
    }

    // Di hosting: api backend hanya di web.id
    if (host.includes('mudamudiselor.biz.id')) {
        return 'https://mudamudiselor.web.id/common/api';
    }

    return `${location.origin}/common/api`;
}

let isDuplicatePublic = false;
let publicCheckTimeout = null;

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('memberPublicForm');
    const alertDiv = document.getElementById('memberPublicAlert');
    const submitBtn = document.getElementById('memberPublicSubmitBtn');

    if (!form) return;

    initPhotoUploadPreview();

    // === Real-time duplicate check ===
    const nameInput = document.getElementById('full_name');
    const emailInput = document.getElementById('email');
    const birthDateInput = document.getElementById('birth_date');

    function performPublicCheck() {
        const name = nameInput ? nameInput.value.trim() : '';
        const mail = emailInput ? emailInput.value.trim() : '';
        const birthDate = birthDateInput ? birthDateInput.value.trim() : '';

        // Butuh semua 3 field untuk validasi
        if (name === '' || birthDate === '' || mail === '') {
            if (isDuplicatePublic) {
                isDuplicatePublic = false;
                hidePublicDuplicateAlert();
            }
            return;
        }

        const params = new URLSearchParams();
        params.set('full_name', name);
        params.set('email', mail);
        params.set('birth_date', birthDate);

        fetch(MEMBERS_API_BASE + '/members_check.php?' + params.toString())
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.success && data.exists) {
                    isDuplicatePublic = true;
                    alertDiv.style.display = 'block';
                    alertDiv.className = 'member-alert member-alert-warning';
                    alertDiv.innerHTML =
                        '<strong>⚠️ Data Sudah Terdaftar!</strong><br>' +
                        'Anggota dengan nama <strong>' + escapeHtml(name) + '</strong>, email <strong>' + escapeHtml(mail) + '</strong>, dan tanggal lahir <strong>' + escapeHtml(birthDate) + '</strong> sudah ada di sistem.<br>' +
                        'Silakan hubungi pengurus jika ada perubahan data.';
                } else if (data.success && !data.exists) {
                    if (isDuplicatePublic) {
                        isDuplicatePublic = false;
                        hidePublicDuplicateAlert();
                    }
                }
            })
            .catch(function() {
                // Abaikan error jaringan
            });
    }

    function schedulePublicCheck() {
        clearTimeout(publicCheckTimeout);
        publicCheckTimeout = setTimeout(performPublicCheck, 600);
    }

    function hidePublicDuplicateAlert() {
        if (alertDiv.classList.contains('member-alert-warning')) {
            alertDiv.style.display = 'none';
            alertDiv.className = 'member-alert';
        }
    }

    if (nameInput) nameInput.addEventListener('input', schedulePublicCheck);
    if (emailInput) emailInput.addEventListener('input', schedulePublicCheck);
    if (birthDateInput) birthDateInput.addEventListener('change', schedulePublicCheck);

    // === Submit handler ===
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        alertDiv.style.display = 'none';
        alertDiv.className = 'member-alert';
        alertDiv.innerHTML = '';

        submitBtn.disabled = true;
        submitBtn.textContent = 'Mengirim...';

        const formData = new FormData(form);
        formData.set('source', 'public_form');

        try {
            const response = await fetch(MEMBERS_API_BASE + '/members_save.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                showAlert('success', '✅ Data anggota berhasil dikirim.');
                form.reset();
                resetPhotoPreview();
                if (isDuplicatePublic) {
                    isDuplicatePublic = false;
                    hidePublicDuplicateAlert();
                }
            } else {
                showAlert('error', result.message || 'Gagal mengirim data. Silakan coba lagi.');
            }
        } catch (err) {
            showAlert('error', 'Terjadi kesalahan jaringan. Silakan coba lagi.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Kirim Data Anggota';
        }
    });

    function showAlert(type, message) {
        alertDiv.innerHTML = message;
        alertDiv.className = 'member-alert member-alert-' + type;
        alertDiv.style.display = 'block';
        alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function initPhotoUploadPreview() {
        const photoInput = document.querySelector('#photo_file');
        const photoPreview = document.querySelector('#photoPreview');
        const photoPlaceholder = document.querySelector('#photoPlaceholder');
        const photoFileName = document.querySelector('.photo-file-name');
        const uploadButton = document.querySelector('.photo-upload-button');

        if (!photoInput) return;

        photoInput.addEventListener('change', function() {
            const file = photoInput.files && photoInput.files[0];

            if (!file) {
                resetPhotoPreview();
                return;
            }

            const allowed = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowed.includes(file.type)) {
                alert('Format foto harus JPG, PNG, atau WEBP.');
                photoInput.value = '';
                resetPhotoPreview();
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                alert('Ukuran foto maksimal 10 MB.');
                photoInput.value = '';
                resetPhotoPreview();
                return;
            }

            if (photoFileName) photoFileName.textContent = file.name;
            if (uploadButton) uploadButton.classList.add('is-selected');
            if (photoPreview) {
                photoPreview.src = URL.createObjectURL(file);
                photoPreview.hidden = false;
            }
            if (photoPlaceholder) photoPlaceholder.hidden = true;
        });
    }

    function resetPhotoPreview() {
        const photoFileName = document.querySelector('.photo-file-name');
        const photoPreview = document.querySelector('#photoPreview');
        const photoPlaceholder = document.querySelector('#photoPlaceholder');
        const photoInput = document.querySelector('#photo_file');
        const uploadButton = document.querySelector('.photo-upload-button');

        if (photoInput) photoInput.value = '';
        if (uploadButton) uploadButton.classList.remove('is-selected');
        if (photoFileName) photoFileName.textContent = 'Belum ada foto dipilih';
        if (photoPreview) {
            photoPreview.hidden = true;
            photoPreview.removeAttribute('src');
        }
        if (photoPlaceholder) photoPlaceholder.hidden = false;
    }
});

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}