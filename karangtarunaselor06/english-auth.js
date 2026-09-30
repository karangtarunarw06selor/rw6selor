(() => {
    const AUTH_KEY = "rw06_member_auth";
    const AUTH_EMAIL_KEY = "mms_auth_email";
    const AUTH_API = "/common/api/member_auth.php";
    const SESSION_TTL = 7 * 24 * 60 * 60 * 1000;

    function $(id) {
        return document.getElementById(id);
    }

    function showToast(message, type = "info") {
        let toast = $("toast-auth-english");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "toast-auth-english";
            toast.className = "toast-auth";
            document.body.appendChild(toast);
        }
        const icon = type === "success" ? "fa-circle-check" : type === "warning" ? "fa-triangle-exclamation" : "fa-circle-info";
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;
        toast.classList.add("show");
        window.setTimeout(() => toast.classList.remove("show"), 2600);
    }

    function getSessionEnglish() {
        try {
            const raw = localStorage.getItem(AUTH_KEY);
            if (!raw) return null;
            const session = JSON.parse(raw);
            if (!session || !session.email) return null;
            if (session.expires_at && Date.now() > Number(session.expires_at)) {
                clearSessionEnglish();
                return null;
            }
            return session;
        } catch (_) {
            clearSessionEnglish();
            return null;
        }
    }

    function setSessionEnglish(member) {
        const session = {
            id: member.id,
            email: member.email,
            member_code: member.member_code,
            full_name: member.full_name,
            rt: member.rt || "",
            expires_at: Date.now() + SESSION_TTL
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(session));
        localStorage.setItem(AUTH_EMAIL_KEY, session.email);
        return session;
    }

    function clearSessionEnglish() {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(AUTH_EMAIL_KEY);
    }

    function showAuthFrame() {
        const authFrame = $("auth-frame-anggota");
        const dataFrame = $("data-frame-anggota");
        if (authFrame) authFrame.style.display = "block";
        if (dataFrame) dataFrame.style.display = "none";
    }

    function showDataFrame(session) {
        const authFrame = $("auth-frame-anggota");
        const dataFrame = $("data-frame-anggota");
        const label = $("lbl-user-auth");
        if (authFrame) authFrame.style.display = "none";
        if (dataFrame) dataFrame.style.display = "block";
        if (label) label.textContent = `${session.full_name || session.email} (${session.member_code || "-"})`;
    }

    window.verifikasiAksesEnglish = async function () {
        const input = $("user-email-auth");
        const submit = $("english-auth-submit");
        const email = input ? input.value.trim().toLowerCase() : "";
        if (!email) {
            showToast("Alamat email wajib diisi!", "warning");
            return;
        }

        try {
            if (submit) {
                submit.disabled = true;
                submit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Memeriksa...';
            }
            const response = await fetch(AUTH_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const result = await response.json();
            if (!response.ok || !result.ok) {
                throw new Error(result.message || "Email belum terdaftar sebagai anggota aktif.");
            }
            const session = setSessionEnglish(result.member);
            showDataFrame(session);
            showToast("Akses English Academy dibuka.", "success");
        } catch (error) {
            showToast(error.message || "Email belum terdaftar sebagai anggota aktif.", "warning");
        } finally {
            if (submit) {
                submit.disabled = false;
                submit.innerHTML = "Verifikasi Akun English Academy";
            }
        }
    };

    window.logoutAksesEnglish = function () {
        clearSessionEnglish();
        showAuthFrame();
        showToast("Akses English Academy dikunci.", "info");
    };

    document.addEventListener("DOMContentLoaded", () => {
        const input = $("user-email-auth");
        if (input) {
            input.addEventListener("keydown", (event) => {
                if (event.key === "Enter") window.verifikasiAksesEnglish();
            });
        }

        const session = getSessionEnglish();
        if (session) {
            showDataFrame(session);
            return;
        }
        showAuthFrame();
    });
})();
