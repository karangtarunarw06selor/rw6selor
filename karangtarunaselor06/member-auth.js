(function () {
    const AUTH_KEY = 'rw06_member_auth';
    const AUTH_API = '/common/api/member_auth.php';
    const LOGIN_PAGE = 'member-login.html';
    const REGISTER_PAGE = 'form-anggota.html';
    const PROTECTED_PAGES = new Set([
        'daftar-anggota.html',
        'dokumentasi-kegiatan.html'
    ]);

    function currentPage() {
        return (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    }

    function nextUrl() {
        const params = new URLSearchParams(location.search);
        return params.get('next') || 'daftar-anggota.html';
    }

    function safeNext(value) {
        const fallback = 'daftar-anggota.html';
        const raw = String(value || fallback).trim();
        if (/^https?:\/\//i.test(raw) || raw.startsWith('//')) return fallback;
        if (raw.includes('..')) return fallback;
        return raw || fallback;
    }

    function getSession() {
        try {
            const raw = localStorage.getItem(AUTH_KEY);
            if (!raw) return null;
            const session = JSON.parse(raw);
            if (!session || !session.email) return null;
            if (session.expires_at && Date.now() > Number(session.expires_at)) {
                localStorage.removeItem(AUTH_KEY);
                return null;
            }
            return session;
        } catch (_) {
            localStorage.removeItem(AUTH_KEY);
            return null;
        }
    }

    function setSession(member) {
        const session = {
            id: member.id,
            email: member.email,
            member_code: member.member_code,
            full_name: member.full_name,
            rt: member.rt || '',
            expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000)
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(session));
        localStorage.setItem('mms_auth_email', session.email);
        return session;
    }

    function clearSession() {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem('mms_auth_email');
    }

    function redirectToLogin() {
        const page = currentPage();
        const next = encodeURIComponent(`${page}${location.search || ''}${location.hash || ''}`);
        location.replace(`${LOGIN_PAGE}?next=${next}`);
    }

    function requireMemberAuth() {
        const page = currentPage();
        if (!PROTECTED_PAGES.has(page)) return;
        if (!getSession()) redirectToLogin();
    }

    function updateMemberLabels() {
        const session = getSession();
        document.querySelectorAll('[data-member-name]').forEach((node) => {
            node.textContent = session ? session.full_name : '';
        });
        document.querySelectorAll('[data-member-email]').forEach((node) => {
            node.textContent = session ? session.email : '';
        });
    }

    async function login(email) {
        const response = await fetch(AUTH_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const result = await response.json();
        if (!response.ok || !result.ok) {
            throw new Error(result.message || 'Login gagal.');
        }
        return setSession(result.member);
    }

    window.RW06MemberAuth = {
        getSession,
        setSession,
        clearSession,
        login,
        requireMemberAuth,
        updateMemberLabels,
        safeNext,
        nextUrl,
        registerPage: REGISTER_PAGE,
        loginPage: LOGIN_PAGE
    };

    requireMemberAuth();
    document.addEventListener('DOMContentLoaded', updateMemberLabels);
})();
