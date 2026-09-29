(function () {
    function setActiveTab(tabName) {
        document.querySelectorAll('[data-tab]').forEach((button) => {
            button.classList.toggle('is-active', button.dataset.tab === tabName);
        });
        document.querySelectorAll('[data-panel]').forEach((panel) => {
            panel.classList.toggle('is-active', panel.dataset.panel === tabName);
        });
    }

    function setMessage(message, type) {
        const node = document.getElementById('memberLoginMessage');
        if (!node) return;
        node.textContent = message || '';
        node.className = `auth-message ${type || ''}`.trim();
    }

    function showUnregisteredPopup() {
        const popup = document.getElementById('memberLoginPopup');
        if (!popup) return;
        popup.hidden = false;
    }

    function hideUnregisteredPopup() {
        const popup = document.getElementById('memberLoginPopup');
        if (!popup) return;
        popup.hidden = true;
    }

    document.addEventListener('DOMContentLoaded', () => {
        const auth = window.RW06MemberAuth;
        const next = auth.safeNext(auth.nextUrl());
        const inlineAuthPages = new Set(['daftar-anggota.html', 'dokumentasi-kegiatan.html']);
        if (inlineAuthPages.has(next.split(/[?#]/)[0])) {
            location.replace(next);
            return;
        }

        const existing = auth.getSession();
        if (existing) {
            location.replace(next);
            return;
        }

        const registerLink = document.getElementById('registerLink');
        const popupRegisterLink = document.getElementById('popupRegisterLink');
        if (registerLink) registerLink.href = auth.registerPage;
        if (popupRegisterLink) popupRegisterLink.href = auth.registerPage;

        document.querySelectorAll('[data-tab]').forEach((button) => {
            button.addEventListener('click', () => setActiveTab(button.dataset.tab));
        });

        document.getElementById('accessPopupClose')?.addEventListener('click', hideUnregisteredPopup);
        document.getElementById('memberLoginPopup')?.addEventListener('click', (event) => {
            if (event.target.id === 'memberLoginPopup') hideUnregisteredPopup();
        });

        const form = document.getElementById('memberLoginForm');
        const submit = document.getElementById('memberLoginButton');
        form?.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('memberEmail')?.value.trim().toLowerCase();
            if (!email) {
                setMessage('Email wajib diisi.', 'error');
                return;
            }

            try {
                if (submit) {
                    submit.disabled = true;
                    submit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Memeriksa...';
                }
                setMessage('', '');
                await auth.login(email);
                setMessage('Login berhasil. Mengarahkan halaman...', 'success');
                setTimeout(() => location.replace(next), 450);
            } catch (error) {
                setMessage('Email belum terdaftar. Daftar dulu.', 'error');
                showUnregisteredPopup();
            } finally {
                if (submit) {
                    submit.disabled = false;
                    submit.innerHTML = '<i class="fa-solid fa-lock-open"></i> Verifikasi & Buka Data';
                }
            }
        });
    });
})();
