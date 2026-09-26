(() => {
/* ==========================================================================...
   DAFTAR ANGGOTA RW06 SELOR - DATABASE API
   ========================================================================== */
const URL_API_ANGGOTA = "/common/api/members.php";
const URL_TSV_ANGGOTA = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR45-ysPdK4uVibwJQbXKvaGGA2zlX3m2GnAS2392fiSDwENSz9ABffImneI-u4ZGmErvHbdM5RJoDi/pub?gid=992968433&single=true&output=tsv";
const PUBLIC_SITE_BASE_ANGGOTA = "https://rw6selor.org";
let dataAnggotaGlobal = [];
let dataAnggotaTersaring = [];
let halAnggotaSaatIni = 1;
const barisAnggotaPerHal = 7;

function escapeHtmlAnggota(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[char]));
}

function resolveLocalFotoAnggota(foto) {
    if (!foto || foto === "-") return "";
    if (/^https?:\/\//i.test(foto)) return foto;

    let normalized = String(foto).trim();
    if (!normalized) return "";

    if (normalized.startsWith("public_html/")) {
        normalized = normalized.slice("public_html/".length);
    }

    if (normalized.startsWith("/")) {
        return `${PUBLIC_SITE_BASE_ANGGOTA}${normalized}`;
    }

    return `${PUBLIC_SITE_BASE_ANGGOTA}/${normalized.replace(/^\/+/, "")}`;
}

function getInitialsAnggota(nama) {
    const words = String(nama ?? "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (words.length === 0) return "A";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

    return (words[0][0] + words[1][0]).toUpperCase();
}

function getFotoAnggota(nama, fotoLocal, fotoDrive) {
    const driveUrl = String(fotoDrive || "").trim();
    if (driveUrl && driveUrl !== "-") {
        let idFile = "";
        if (driveUrl.includes("id=")) idFile = driveUrl.split("id=")[1].split("&")[0];
        else if (driveUrl.includes("/d/")) idFile = driveUrl.split("/d/")[1].split("/")[0];

        if (idFile) return `https://drive.google.com/thumbnail?id=${encodeURIComponent(idFile)}&sz=w800`;
        if (/^https?:\/\//i.test(driveUrl)) return driveUrl;
    }

    const localUrl = resolveLocalFotoAnggota(fotoLocal);
    if (localUrl && !/drive\.google\.com/i.test(localUrl)) return localUrl;
    if (/^https?:\/\//i.test(localUrl)) return localUrl;
    return "";
}

function renderAvatarAnggota(nama, fotoUrl) {
    const namaEscaped = escapeHtmlAnggota(nama);
    const initials = escapeHtmlAnggota(getInitialsAnggota(nama));

    if (!fotoUrl) {
        return `<div class="anggota-avatar anggota-avatar-fallback" aria-label="Foto profil inisial ${namaEscaped}">${initials}</div>`;
    }

    const fotoEscaped = escapeHtmlAnggota(fotoUrl);
    return `
        <div class="anggota-avatar">
            <img
                src="${fotoEscaped}"
                alt="${namaEscaped}"
                loading="lazy"
                onclick="window.bukaFotoFull('${fotoEscaped}');"
                onerror="window.gantiFotoRusakAnggota(this, '${initials}', '${namaEscaped}');"
            >
        </div>
    `;
}

function getGenerasiBadge(tahunLahir) {
    let generasiTeks = "Umum";
    let gayaBadge = "background-color: #757575; color: white;";

    if (tahunLahir >= 1981 && tahunLahir <= 1996) {
        generasiTeks = "Milenial";
        gayaBadge = "background-color: #1A237E; color: white; box-shadow: 0 2px 5px rgba(26, 35, 126, 0.2);";
    } else if (tahunLahir >= 1997 && tahunLahir <= 2005) {
        generasiTeks = "Gen Z";
        gayaBadge = "background-color: #2E7D32; color: white; box-shadow: 0 2px 5px rgba(46, 125, 50, 0.2);";
    } else if (tahunLahir >= 2006 && tahunLahir <= 2012) {
        generasiTeks = "Gen Z";
        gayaBadge = "background-color: #81C784; color: #1B5E20; box-shadow: 0 2px 5px rgba(129, 199, 132, 0.2);";
    } else if (tahunLahir >= 2013 && tahunLahir <= 2026) {
        generasiTeks = "Gen Alpha";
        gayaBadge = "background-color: #008080; color: white; box-shadow: 0 2px 5px rgba(0, 128, 128, 0.2);";
    }

    return `<span style="display:inline-block; padding:4px 12px; border-radius:20px; font-size:0.72rem; font-weight:bold; text-transform:uppercase; ${gayaBadge}">${generasiTeks}</span>`;
}

async function fetchJsonAnggota(url, options = {}) {
    const response = await fetch(url, options);
    const result = await response.json();
    if (!result.ok) throw new Error(result.message || "Gagal memuat data anggota.");
    return result.data;
}

async function fetchFotoTsvAnggotaMap() {
    const response = await fetch(`${URL_TSV_ANGGOTA}&cache=${Date.now()}`);
    const text = await response.text();
    const lines = text.split(/\r\n|\n|\r/).filter(Boolean);
    if (lines.length < 2) return new Map();

    const headers = lines[0].split("\t").map((item) => item.trim());
    const nimIndex = headers.indexOf("NIM");
    const fotoIndex = headers.indexOf("Upload Foto (Profil)") !== -1
        ? headers.indexOf("Upload Foto (Profil)")
        : headers.indexOf("Upload Foto Terbaikmu");
    if (nimIndex === -1 || fotoIndex === -1) return new Map();

    const fotoMap = new Map();
    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split("\t");
        const nim = String(cols[nimIndex] || "").trim();
        const foto = String(cols[fotoIndex] || "").trim();
        if (nim && foto) fotoMap.set(nim, foto);
    }

    return fotoMap;
}

async function loadAnggotaDariApi() {
    const tbody = document.getElementById("data-tabel-anggota");
    if (tbody) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:#666;"><i class="fa-solid fa-spinner fa-spin"></i> Menghubungkan ke Database Anggota...</td></tr>`;
    }

    const [rows, fotoTsvMap] = await Promise.all([
        fetchJsonAnggota(`${URL_API_ANGGOTA}?cache=${Date.now()}`),
        fetchFotoTsvAnggotaMap().catch(() => new Map()),
    ]);

    dataAnggotaGlobal = rows.map((item) => {
        const nim = String(item.member_code ?? "-");
        return {
            nim,
            nama: String(item.full_name ?? "-"),
            tahunLahirInt: Number(item.birth_year || 0),
            usia: item.age_years ? `${Number(item.age_years)} Tahun` : "-",
            fotoLocal: String(item.resolved_photo ?? item.photo_file ?? ""),
            fotoDrive: String(fotoTsvMap.get(nim) || item.photo_url || ""),
        };
    });
    terapkanFilterAnggota();
}

window.terapkanFilterAnggota = function() {
    const cariInput = document.getElementById("input-cari-anggota");
    if (!cariInput) return;

    const cari = cariInput.value.toLowerCase();
    dataAnggotaTersaring = dataAnggotaGlobal.filter((item) => (
        item.nama.toLowerCase().includes(cari) || item.nim.toLowerCase().includes(cari)
    ));
    halAnggotaSaatIni = 1;
    renderTabelAnggota();
};

function renderTabelAnggota() {
    const tbody = document.getElementById("data-tabel-anggota");
    if (!tbody) return;

    if (dataAnggotaTersaring.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:#666;">Data anggota tidak ditemukan.</td></tr>`;
        return;
    }

    const start = (halAnggotaSaatIni - 1) * barisAnggotaPerHal;
    const dataPerHalaman = dataAnggotaTersaring.slice(start, start + barisAnggotaPerHal);

    let html = dataPerHalaman.map((item) => {
        const foto = getFotoAnggota(item.nama, item.fotoLocal, item.fotoDrive);

        return `<tr style="height:90px; vertical-align:middle;">
            <td>${escapeHtmlAnggota(item.nim)}</td>
            <td>${renderAvatarAnggota(item.nama, foto)}</td>
            <td style="text-align:left; padding-left:20px;"><i class="fa-solid fa-user" style="color:#E53935; margin-right:8px;"></i> ${escapeHtmlAnggota(item.nama)}</td>
            <td>${escapeHtmlAnggota(item.usia)}</td>
            <td>${getGenerasiBadge(item.tahunLahirInt)}</td>
        </tr>`;
    }).join("");

    const totalHal = Math.ceil(dataAnggotaTersaring.length / barisAnggotaPerHal);
    if (totalHal > 1) {
        const styleBtn = "padding:8px 16px; background:#D32F2F; color:white; border:none; border-radius:4px; cursor:pointer;";
        let tombolNav = "";
        if (halAnggotaSaatIni === 1) tombolNav = `<div style="text-align:right;"><button onclick="window.navAnggota(1)" style="${styleBtn}">Selanjutnya &gt;</button></div>`;
        else if (halAnggotaSaatIni === totalHal) tombolNav = `<div style="text-align:left;"><button onclick="window.navAnggota(-1)" style="${styleBtn}">&lt; Sebelumnya</button></div>`;
        else tombolNav = `<div style="display:flex; justify-content:space-between;"><button onclick="window.navAnggota(-1)" style="${styleBtn}">&lt; Sebelumnya</button><button onclick="window.navAnggota(1)" style="${styleBtn}">Selanjutnya &gt;</button></div>`;
        html += `<tr><td colspan="5" style="padding:12px; background:#f9f9f9;">${tombolNav}</td></tr>`;
    }

    tbody.innerHTML = html;
}

window.navAnggota = function(dir) {
    halAnggotaSaatIni += dir;
    renderTabelAnggota();
};

window.bukaFotoFull = function(url) {
    const modal = document.getElementById("modal-foto-full");
    const imgModal = document.getElementById("img-modal-tampil");
    if (modal && imgModal) {
        imgModal.src = url;
        modal.style.display = "flex";
    }
};

window.gantiFotoRusakAnggota = function(img, initials, nama) {
    if (!img || !img.parentElement) return;

    const fallback = document.createElement("div");
    fallback.className = "anggota-avatar anggota-avatar-fallback";
    fallback.textContent = initials || "A";
    fallback.setAttribute("aria-label", `Foto profil inisial ${nama || "Anggota"}`);
    img.parentElement.replaceWith(fallback);
};

window.tutupFoto = function() {
    const modal = document.getElementById("modal-foto-full");
    if (modal) modal.style.display = "none";
};

function callToast(msg, type = "info") {
    const toast = document.getElementById("auth-toast");
    const icon = document.getElementById("auth-toast-icon");
    const text = document.getElementById("auth-toast-msg");
    if (!toast || !icon || !text) return alert(msg);

    text.innerText = msg;
    icon.className = type === "success" ? "fa-solid fa-circle-check" : "fa-solid fa-circle-exclamation";
    toast.style.background = type === "success" ? "#10b981" : "#ef4444";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

window.verifikasiAksesAnggota = async function() {
    const emailInput = document.getElementById("user-email-auth")?.value.trim().toLowerCase();
    if (!emailInput) return callToast("Alamat email wajib diisi!", "warning");

    const loader = document.getElementById("custom-loader");
    if (loader) loader.style.display = "flex";

    try {
        await fetchJsonAnggota(URL_API_ANGGOTA, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "verify", email: emailInput }),
        });
        localStorage.setItem("mms_auth_email", emailInput);
        callToast("Akses terverifikasi!", "success");
        await bukaAksesHalaman(emailInput);
    } catch (error) {
        callToast(error.message || "Email Anda tidak terdaftar di database Anggota!", "danger");
    } finally {
        if (loader) loader.style.display = "none";
    }
};

async function bukaAksesHalaman(email) {
    document.getElementById("auth-frame-anggota").style.display = "none";
    document.getElementById("data-frame-anggota").style.display = "block";
    document.getElementById("lbl-user-auth").innerText = email;
    await loadAnggotaDariApi();
}

window.logoutAksesAnggota = function() {
    localStorage.removeItem("mms_auth_email");
    location.reload();
};

window.addEventListener("DOMContentLoaded", async () => {
    const authFrame = document.getElementById("auth-frame-anggota");
    const dataFrame = document.getElementById("data-frame-anggota");
    if (!authFrame || !dataFrame) return;

    const emailSaved = localStorage.getItem("mms_auth_email");
    if (emailSaved) {
        try {
            await bukaAksesHalaman(emailSaved);
        } catch (error) {
            localStorage.removeItem("mms_auth_email");
            authFrame.style.display = "block";
            dataFrame.style.display = "none";
            callToast(error.message || "Sesi perlu diverifikasi ulang.", "danger");
        }
    } else {
        authFrame.style.display = "block";
        dataFrame.style.display = "none";
    }
});
})();
