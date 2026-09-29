/* ==========================================================================
   NAMA ORGANISASI : RW06 SELOR
   BERKAS UTAMA    : SCRIPT.JS (LOGIKA INTERAKTIF & DATABASE REAL-TIME)
   ========================================================================== */

const namaBulanIndo = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
let pemicuInstal = null; 

function injectDeleteConfirmStyles() {
    if (document.getElementById('global-delete-confirm-style')) return;
    const style = document.createElement('style');
    style.id = 'global-delete-confirm-style';
    style.textContent = `
        .delete-confirm-toast-overlay {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.45);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            padding: 16px;
        }
        .delete-confirm-toast {
            width: min(92vw, 420px);
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 20px 60px rgba(0,0,0,.25);
            border: 1px solid #e5e7eb;
            overflow: hidden;
        }
        .delete-confirm-toast-header {
            background: #0f2a44;
            color: #fff;
            padding: 14px 16px;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        .delete-confirm-toast-body {
            padding: 16px;
            color: #111827;
            line-height: 1.55;
        }
        .delete-confirm-toast-body input[type="text"] {
            width: 100%;
            box-sizing: border-box;
            margin-top: 12px;
            padding: 12px 14px;
            border: 1px solid #d1d5db;
            border-radius: 10px;
            font: inherit;
        }
        .delete-confirm-toast small {
            display: block;
            margin-top: 8px;
            color: #6b7280;
        }
        .delete-confirm-toast-actions {
            display: flex;
            gap: 10px;
            padding: 0 16px 16px;
        }
        .delete-confirm-toast-actions button {
            flex: 1;
            min-height: 46px;
            border-radius: 10px;
            border: 0;
            font-weight: 800;
            cursor: pointer;
        }
        .delete-confirm-btn-danger {
            background: #dc2626;
            color: #fff;
        }
        .delete-confirm-btn-cancel {
            background: #e5e7eb;
            color: #111827;
        }
    `;
    document.head.appendChild(style);
}

window.createDeleteConfirmToast = async function createDeleteConfirmToast(options) {
    injectDeleteConfirmStyles();
    const opts = Object.assign({
        title: 'Konfirmasi Hapus',
        message: 'Ketik "hapus" untuk melanjutkan.',
        confirmLabel: 'Hapus',
        cancelLabel: 'Batal',
        requireWord: 'hapus',
        hint: ''
    }, options || {});

    const acceptedWords = Array.isArray(opts.requireWord)
        ? opts.requireWord.map((item) => String(item).trim().toLowerCase()).filter(Boolean)
        : [String(opts.requireWord).trim().toLowerCase()].filter(Boolean);
    const placeholderText = acceptedWords.length > 1 ? acceptedWords.join(' / ') : (acceptedWords[0] || 'hapus');
    const hintText = opts.hint || (acceptedWords.length > 1
        ? `Ketik <strong>${acceptedWords.join('</strong> atau <strong>')}</strong> untuk konfirmasi.`
        : `Ketik <strong>${placeholderText}</strong> untuk konfirmasi.`);

    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'delete-confirm-toast-overlay';
        overlay.innerHTML = `
            <div class="delete-confirm-toast" role="dialog" aria-modal="true">
                <div class="delete-confirm-toast-header">
                    <span>${opts.title}</span>
                    <button type="button" aria-label="Tutup" style="background:none;border:0;color:#fff;font-size:24px;line-height:1;cursor:pointer;">&times;</button>
                </div>
                <div class="delete-confirm-toast-body">
                    <div>${opts.message}</div>
                    <input type="text" placeholder="ketik: ${placeholderText}" autocomplete="off">
                    <small>${hintText}</small>
                </div>
                <div class="delete-confirm-toast-actions">
                    <button type="button" class="delete-confirm-btn-cancel">${opts.cancelLabel}</button>
                    <button type="button" class="delete-confirm-btn-danger" disabled>${opts.confirmLabel}</button>
                </div>
            </div>
        `;

        const closeBtn = overlay.querySelector('.delete-confirm-toast-header button');
        const input = overlay.querySelector('input');
        const cancelBtn = overlay.querySelector('.delete-confirm-btn-cancel');
        const okBtn = overlay.querySelector('.delete-confirm-btn-danger');

        const cleanup = (result) => {
            overlay.remove();
            resolve(result);
        };

        input.addEventListener('input', () => {
            okBtn.disabled = acceptedWords.length > 0 && !acceptedWords.includes(input.value.trim().toLowerCase());
        });
        closeBtn.addEventListener('click', () => cleanup({ confirmed: false }));
        cancelBtn.addEventListener('click', () => cleanup({ confirmed: false }));
        okBtn.addEventListener('click', () => cleanup({ confirmed: true, input: input.value }));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) cleanup({ confirmed: false });
        });

        document.body.appendChild(overlay);
        input.focus();
    });
};

/* ==========================================================================
   1. SISTEM INISIALISASI UTAMA
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function() {
    initNavigasiMobile();
    initCarouselOrganisasi();
    initHeroSlider(); 
    initSistemPWA();
    
    if (document.getElementById('data-tabel-keuangan')) loadKeuanganDariDrive();
    if (document.getElementById('data-tabel-rapat')) loadRapatDariDrive();
    if (document.getElementById('data-tabel-dokumentasi')) loadDokumentasiDariDrive();
    if (document.getElementById('data-tabel-anggota')) loadAnggotaDariDrive(); 
});

/* ==========================================================================
   2. SISTEM NAVIGASI & MENU DROPDOWN MOBILE (HP)
   ========================================================================== */
function initNavigasiMobile() {
    if (initNavigasiMobile.sudahAktif) return;
    initNavigasiMobile.sudahAktif = true;

    const menuBtn = document.getElementById('mobile-menu-btn') || document.getElementById('mobileMenuButton');
    const navBar = document.querySelector('.main-navbar') || document.querySelector('.mms-main-navbar');
    const header = document.querySelector('.site-header') || document.querySelector('.mms-site-header');

    const syncHeaderOffset = () => {
        if (!header) return;
        const headerBottom = Math.ceil(header.getBoundingClientRect().bottom);
        const headerHeight = Math.ceil(header.getBoundingClientRect().height);
        const offset = Math.max(headerBottom, headerHeight, 0);
        document.documentElement.style.setProperty('--site-header-height', `${offset}px`);
    };

    const syncNavOpenState = () => {
        const isOpen = Boolean(navBar && (navBar.classList.contains('aktif') || navBar.classList.contains('active') || navBar.classList.contains('is-open')));
        document.body.classList.toggle('nav-open', isOpen);
        header?.classList.toggle('is-open', isOpen);
        menuBtn?.classList.toggle('active', isOpen);
        menuBtn?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

        syncHeaderOffset();
        if (isOpen && header) {
            requestAnimationFrame(() => {
                syncHeaderOffset();
                document.documentElement.style.setProperty('--mobile-nav-offset', getComputedStyle(document.documentElement).getPropertyValue('--site-header-height').trim());
            });
        } else {
            document.documentElement.style.removeProperty('--mobile-nav-offset');
        }
    };

    syncHeaderOffset();
    window.addEventListener('load', syncHeaderOffset);
    window.addEventListener('scroll', syncHeaderOffset, { passive: true });
    if (header && 'ResizeObserver' in window) {
        new ResizeObserver(syncHeaderOffset).observe(header);
    }
    
    if (menuBtn && navBar) {
        menuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navBar.classList.toggle('aktif');
            navBar.classList.toggle('active', navBar.classList.contains('aktif'));
            navBar.classList.toggle('is-open', navBar.classList.contains('aktif'));
            requestAnimationFrame(syncNavOpenState);
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navBar.classList.remove('aktif', 'active', 'is-open');
                document.querySelectorAll('.nav-item.open').forEach((item) => item.classList.remove('open'));
            }
            syncNavOpenState();
        });

        syncNavOpenState();
    } else {
        window.addEventListener('resize', syncHeaderOffset);
    }

    const btnBulanan = document.getElementById('btn-bulanan');
    const menuRapat = document.getElementById('menu-rapat');
    const btnTahunan = document.getElementById('btn-tahunan');
    const menu17an = document.getElementById('menu-17an');

    if (btnBulanan && menuRapat) {
        btnBulanan.addEventListener('click', function(e) {
            e.preventDefault(); e.stopPropagation();
            if (menu17an) menu17an.classList.remove('buka'); 
            menuRapat.classList.toggle('buka');
            syncNavOpenState();
        });
    }

    if (btnTahunan && menu17an) {
        btnTahunan.addEventListener('click', function(e) {
            e.preventDefault(); e.stopPropagation();
            if (menuRapat) menuRapat.classList.remove('buka'); 
            menu17an.classList.toggle('buka');
            syncNavOpenState();
        });
    }

    document.querySelectorAll('.nav-item').forEach((item) => {
        const submenu = item.querySelector(':scope > .submenu');
        const link = item.querySelector(':scope > a');

        if (!submenu || !link) return;

        link.addEventListener('click', (e) => {
            if (window.innerWidth > 768) return;

            e.preventDefault();
            item.classList.toggle('open');
            syncNavOpenState();
        });
    });
}

/* ==========================================================================
   3. SISTEM CAROUSEL & SLIDER GAMBAR
   ========================================================================== */
function initCarouselOrganisasi() {
    if (document.querySelector('.mySwiper') && typeof Swiper !== 'undefined') {
        new Swiper(".mySwiper", {
            slidesPerView: 1, 
            spaceBetween: 15,
            centeredSlides: true, 
            loop: true,
            initialSlide: 2, 
            observer: true,
            observeParents: true,
            breakpoints: {
                768: { slidesPerView: 3, spaceBetween: 30 }
            }
        });
    }
}

const kegiatanData = [
   {
        gambar: "images/jalansehat.avif", 
        judul: "Jalan Sehat",
        deskripsi: "Foto Bersama setelah Serangkaian Kegiatan untuk memperingati HUT-RI ke81 dengan kegiatan jalan sehat dengan dresscode lurik dan kebaya sebagai identisa budaya jawa "
    },
    {
        gambar: "images/upacara.avif", 
        judul: "Upacara",
        deskripsi: "Foto Bersama setelah melaksanakan prosesi yang khidmat dalam kegiatan upacara bendera untuk memperingati Hari Ulangtahun Kemerdekaan Indonesia yang Ke-81 Tahun"
    },
    {
        gambar: "images/estafetair.avif", 
        judul: "Fun Games (Estafet Air)",
        deskripsi: "Keseruan dalam kebersamaan saat melakukan fun games estafer air, walaupun basah kuyub tapi terasa hangat ketika bisa berkumpul bersama dalam keceriaan.. "
    },
    {
        gambar: "images/estafetkaret2.avif",
        judul: "Fun Games (Estafet Karet)",
        deskripsi: "Segala cara akan kulakukan biar teamku bisa menang, wkwkwwk. Saking semangatnya memindahkan karet dengan sedotan, kepala sampai seperti robot gedeg xixixi.."
    },
    {
        gambar: "images/estafetsarung.avif",
        judul: "Fun Games (Estafet Sarung)",
        deskripsi: "rekor tercepat adalah 1 menit lebih 25 detik, padahal itu karena mereka tidak tahan dengan aroma sarung yang jarang dicuci itu wkwkwk..  "
    },
     {
        gambar: "images/hitungcepat.avif",
        judul: "Fun Games (Hitung Cepat)",
        deskripsi: "Melatih konsentrasi dengan berhitung cepat, saking serunya sampai gk sadar semua muka kita menjadi putih semua wkwkwkw, mana paling mentok cuma sampai hitungan 25, pada konsentrasi gk seeeh, hadehh"
    },
    {
        gambar: "images/makanbersama.avif",
        judul: "Makan Bersama (Makrab)",
        deskripsi: "Walaupun cuma makan mie saja asal makan bersama dengan duduk melingkar bersama teman teman rasanya seperti makan spagetti di italy bersama valentino rossi, anjayyy slebeww.. "
    },
    {
        gambar: "images/makrab.avif",
        judul: "Malam Keakraban",
        deskripsi: "Berkumpul, berkenalan, bersendagurau, bertukar pikiran, sebuah momen yang hangat di malam yang dingin"
    }
];

let slideIndex = 1, slideTimer;

function initHeroSlider() {
    const sliderContainer = document.getElementById('slider-container');
    const dotsContainer = document.getElementById('dots-container');
    
    if (!sliderContainer || !dotsContainer) return;

    let slidesHTML = "", dotsHTML = "";
    kegiatanData.forEach((item, index) => {
        slidesHTML += `
            <div class="slide ${index === 0 ? 'aktif' : ''}">
                <img src="${item.gambar}" alt="${item.judul}" class="slide-img">
                <div class="slide-content">
                    <h3>${item.judul}</h3><p>${item.deskripsi}</p>
                </div>
            </div>`;
        dotsHTML += `<span class="dot ${index === 0 ? 'aktif' : ''}" onclick="currentSlide(${index + 1})"></span>`;
    });
    
    sliderContainer.innerHTML = slidesHTML;
    dotsContainer.innerHTML = dotsHTML;

    showSlides(slideIndex);
    autoSlide();
}

function showSlides(n) {
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    
    if (slides.length === 0) return;

    if (n > slides.length) slideIndex = 1;    
    if (n < 1) slideIndex = slides.length;
    
    Array.from(slides).forEach(s => s.classList.remove("aktif"));
    Array.from(dots).forEach(d => d.classList.remove("aktif"));
    
    slides[slideIndex-1].classList.add("aktif");  
    dots[slideIndex-1].classList.add("aktif");
}

function autoSlide() {
    slideTimer = setInterval(() => { slideIndex++; showSlides(slideIndex); }, 5000);
}

window.currentSlide = function(n) { 
    showSlides(slideIndex = n); 
    clearInterval(slideTimer);
    autoSlide();
}

/* ==========================================================================
   4. SISTEM TRANSPARANSI KAS KEUANGAN (VPS DB)
   ========================================================================== */
let dataKeuanganGlobal = [];
let dataTersaringGlobal = [];
let halamanSaatIni = 1;
const barisPerHalaman = 7;

function parseTanggalKeObjek(strTanggal) {
    if (!strTanggal) return new Date(0);
    const bagian = strTanggal.split("/");
    if (bagian.length !== 3) return new Date(0);
    return new Date(parseInt(bagian[2], 10), parseInt(bagian[1], 10) - 1, parseInt(bagian[0], 10));
}

function bersihkanNominal(teksNominal) {
    if (!teksNominal) return 0;
    let bersih = teksNominal.toString().replace(/Rp/gi, "").replace(/\s/g, "");
    bersih = bersih.replace(/[\.\,]/g, "");
    bersih = bersih.replace(/[^0-9-]/g, "");
    return parseInt(bersih, 10) || 0;
}

async function loadKeuanganDariDrive() {
    try {
        const response = await fetch(`/common/api/cashflow_list.php?cache=${Date.now()}`);
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || "Gagal memuat data keuangan.");
        }

        dataKeuanganGlobal = [];
        const daftarTahun = new Set();
        const daftarBulan = new Set();

        (result.data || []).forEach((row) => {
            const tanggalRaw = String(row.tanggal_format || row.tanggal || "").trim();
            const bagianTanggal = tanggalRaw.split("/");
            const tahun = bagianTanggal[2] || String(row.tanggal || "").slice(0, 4) || "";
            const nomorBulan = bagianTanggal[1] || String(row.tanggal || "").slice(5, 7);
            const bulan = namaBulanIndo[parseInt(nomorBulan, 10) - 1] || "Semua";

            if (tahun) daftarTahun.add(tahun);
            if (bulan !== "Semua") daftarBulan.add(bulan);

            dataKeuanganGlobal.push({
                tanggal: tanggalRaw,
                bulan,
                tahun,
                keterangan: String(row.keterangan || "-"),
                tipe: row.jenis === "keluar" ? "keluar" : "masuk",
                jumlah: String(row.jumlah || 0),
                linkNota: String(row.bukti_file || ""),
            });
        });

        dataKeuanganGlobal.sort((a, b) => parseTanggalKeObjek(b.tanggal) - parseTanggalKeObjek(a.tanggal));
        isiDropdown('filter-tahun', Array.from(daftarTahun).sort().reverse());
        isiDropdown('filter-bulan', Array.from(daftarBulan).sort((a,b) => namaBulanIndo.indexOf(a) - namaBulanIndo.indexOf(b)));
        terapkanFilter();
    } catch (e) {
        console.error("Gagal memuat data keuangan", e);
        const tBody = document.getElementById('data-tabel-keuangan');
        if (tBody) tBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">Gagal memuat data dari database.</td></tr>`;
    }
}

window.terapkanFilter = function() {
    const thnInput = document.getElementById('filter-tahun');
    const blnInput = document.getElementById('filter-bulan');
    const katInput = document.getElementById('filter-kategori');
    const cariInput = document.getElementById('input-cari');

    if(!thnInput || !blnInput || !katInput || !cariInput) return;

    const thn = thnInput.value;
    const bln = blnInput.value;
    const kat = katInput.value;
    const cari = cariInput.value.toLowerCase();

    dataTersaringGlobal = dataKeuanganGlobal.filter(item => {
        return (thn === "Semua" || item.tahun === thn) && 
               (bln === "Semua" || item.bulan === bln) && 
               (kat === "Semua" || item.tipe === kat) && 
               (item.keterangan.toLowerCase().includes(cari) || item.tanggal.toLowerCase().includes(cari));
    });

    let m = 0, k = 0;
    let dataUntukKartu = thn === "Semua" ? dataKeuanganGlobal : dataKeuanganGlobal.filter(item => item.tahun === thn);

    dataUntukKartu.forEach(i => {
        let n = parseInt(i.jumlah) || 0; 
        i.tipe === 'masuk' ? m += n : k += n;
    });

    document.getElementById('total-masuk').innerText = formatRupiah(m);
    document.getElementById('total-keluar').innerText = formatRupiah(k);
    
    const saldoCardTitle = document.querySelector('.card-box.saldo h4');
    if (saldoCardTitle) saldoCardTitle.innerHTML = `<i class="fa-solid fa-wallet"></i> Saldo Kas ${thn === "Semua" ? "Keseluruhan" : "(" + thn + ")"}`;
    document.getElementById('saldo-akhir').innerText = formatRupiah(m - k);

    halamanSaatIni = 1; 
    renderTabel();
}

function renderTabel() {
    const tbody = document.getElementById('data-tabel-keuangan');
    if (!tbody) return;

    if (dataTersaringGlobal.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:#666;">Data transaksi tidak ditemukan.</td></tr>`;
        return;
    }

    const start = (halamanSaatIni - 1) * barisPerHalaman;
    const pageData = dataTersaringGlobal.slice(start, start + barisPerHalaman);
    let saldoBerjalan = 0;
    const notaUrl = (path) => /^https?:\/\//i.test(path) ? path : `/${path.replace(/^\/+/, '')}`;
    
    let html = pageData.map(i => {
        const jumlah = parseInt(i.jumlah) || 0;
        const masuk = i.tipe === 'masuk' ? jumlah : 0;
        const keluar = i.tipe === 'keluar' ? jumlah : 0;
        saldoBerjalan += masuk - keluar;
        return `
        <tr>
            <td>${i.tanggal}</td>
            <td>${i.keterangan}</td>
            <td style="font-weight:bold; color:#2e7d32;">${masuk ? formatRupiah(masuk) : '-'}</td>
            <td style="font-weight:bold; color:#0b477f;">${keluar ? formatRupiah(keluar) : '-'}</td>
            <td><strong>${formatRupiah(saldoBerjalan)}</strong></td>
            <td>${i.linkNota && i.linkNota !== "-" && i.linkNota.trim() !== "" ? `<a href="${notaUrl(i.linkNota)}" target="_blank" style="color:#0f5ea8; font-size:12px; font-weight:bold; text-decoration:underline;">Lihat Nota</a>` : "-"}</td>
        </tr>`;
    }).join('');

    const totalHal = Math.ceil(dataTersaringGlobal.length / barisPerHalaman);
    if (totalHal > 1) {
        let tombolNav = "";
        const styleBtn = "padding:8px 16px; background:#0f5ea8; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold; font-size:12px;";
        if (halamanSaatIni === 1) {
            tombolNav = `<div style="text-align:right;"><button onclick="nav(1)" style="${styleBtn}">Halaman Selanjutnya <i class="fa-solid fa-chevron-right"></i></button></div>`;
        } else if (halamanSaatIni === totalHal) {
            tombolNav = `<div style="text-align:left;"><button onclick="nav(-1)" style="${styleBtn}"><i class="fa-solid fa-chevron-left"></i> Halaman Sebelumnya</button></div>`;
        } else {
            tombolNav = `<div style="display:flex; justify-content:space-between;"><button onclick="nav(-1)" style="${styleBtn}"><i class="fa-solid fa-chevron-left"></i> Halaman Sebelumnya</button><button onclick="nav(1)" style="${styleBtn}">Halaman Selanjutnya <i class="fa-solid fa-chevron-right"></i></button></div>`;
        }
        html += `<tr><td colspan="4" style="padding:15px; background:#f9f9f9; border-top:1px solid #eee;">${tombolNav}</td></tr>`;
    }
    tbody.innerHTML = html;
}

window.nav = (dir) => { halamanSaatIni += dir; renderTabel(); };

/* ==========================================================================
   4B. DEKLARASI AKSES DOKUMENTASI
   ========================================================================== */
function callToast(msg, type="info") {
    const toast = document.getElementById("auth-toast");
    const icon = document.getElementById("auth-toast-icon");
    const msgEl = document.getElementById("auth-toast-msg");
    if (!toast || !icon || !msgEl) return;
    msgEl.innerText = msg;
    icon.className = type === "success" ? "fa-solid fa-circle-check" : "fa-solid fa-circle-exclamation";
    toast.style.background = type === "success" ? "#10b981" : "#0f5ea8";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

window.verifikasiAksesAnggota = async function() {
    const input = document.getElementById("user-email-auth");
    const emailInput = input ? input.value.trim().toLowerCase() : "";
    if (!emailInput) return callToast("Alamat email wajib diisi!", "warning");

    const loader = document.getElementById("custom-loader");
    if (loader) loader.style.display = "flex";

    try {
        const response = await fetch('/common/api/members.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'verify', email: emailInput }),
        });
        const result = await response.json();
        if (!response.ok || !result.ok) {
            throw new Error(result.message || "Email Anda tidak terdaftar di database Anggota!");
        }
        localStorage.setItem("mms_auth_email", emailInput);
        callToast("Akses terverifikasi!", "success");
        window.bukaAksesHalaman(emailInput);
    } catch (error) {
        callToast(error.message || "Email Anda tidak terdaftar di database Anggota!", "danger");
    } finally {
        if (loader) loader.style.display = "none";
    }
};

window.bukaAksesHalaman = function(email) {
    const authFrame = document.getElementById("auth-frame-anggota");
    const dataFrame = document.getElementById("data-frame-anggota");
    const label = document.getElementById("lbl-user-auth");
    if (authFrame) authFrame.style.display = "none";
    if (dataFrame) dataFrame.style.display = "block";
    if (label) label.innerText = email;
    if (typeof loadDokumentasiDariDrive === "function") {
        loadDokumentasiDariDrive();
    }
};

window.logoutAksesAnggota = function() {
    localStorage.removeItem("mms_auth_email");
    location.reload();
};

document.addEventListener('DOMContentLoaded', () => {
    const halamanDokumentasi = (location.pathname.split('/').pop() || '').toLowerCase() === 'dokumentasi-kegiatan.html';
    if (!halamanDokumentasi) return;

    const authFrame = document.getElementById("auth-frame-anggota");
    const dataFrame = document.getElementById("data-frame-anggota");
    if (!authFrame || !dataFrame) return;
    const emailSaved = localStorage.getItem("mms_auth_email");
    if (emailSaved) {
        window.bukaAksesHalaman(emailSaved);
    } else {
        authFrame.style.display = "block";
        dataFrame.style.display = "none";
    }
});

/* ==========================================================================
   5. SISTEM NOTULEN & HASIL MUSYAWARAH RAPAT BULANAN (VPS DB)
   ========================================================================== */
const RAPAT_API_BASE = '/common/api/hasil_rapat_list.php';
let dataRapatGlobal = []; let dataRapatTersaring = []; let halRapatSaatIni = 1; const barisRapatPerHal = 5;

async function loadRapatDariDrive() {
    try {
        const response = await fetch(`${RAPAT_API_BASE}?cache=${Date.now()}`);
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Gagal memuat data rapat.');
        }

        dataRapatGlobal = [];
        let daftarTahunRapat = new Set();
        let daftarBulanRapat = new Set();

        (result.data || []).forEach((row) => {
            const tglRaw = row.tanggal_rapat_format || row.tanggal_rapat || '';
            let thn = '', bln = 'Semua';
            if (tglRaw) {
                const parts = tglRaw.split('/');
                thn = parts[2] || parts[0] || '';
                const bulanIdx = parseInt(parts[1] || '0', 10) - 1;
                if (bulanIdx >= 0 && bulanIdx < namaBulanIndo.length) bln = namaBulanIndo[bulanIdx];
            }
            if (thn) daftarTahunRapat.add(thn);
            if (bln !== 'Semua') daftarBulanRapat.add(bln);

            const hasilFormatBaris = String(row.hasil_musyawarah || '-').replace(/\r\n/g, '<br>').replace(/\n/g, '<br>').replace(/\r/g, '<br>');
            dataRapatGlobal.push({
                tanggal: tglRaw,
                bulan: bln,
                tahun: thn,
                agenda: row.agenda || '-',
                hasil: hasilFormatBaris,
                lokasi: row.lokasi_rapat || '-',
                status: row.status_publikasi || 'draft'
            });
        });

        isiDropdown('filter-rapat-tahun', Array.from(daftarTahunRapat).sort().reverse());
        isiDropdown('filter-rapat-bulan', Array.from(daftarBulanRapat).sort((a,b) => namaBulanIndo.indexOf(a) - namaBulanIndo.indexOf(b)));
        terapkanFilterRapat();
    } catch (e) { console.error("Gagal memuat arsip rapat", e); }
}

window.terapkanFilterRapat = function() {
    const thn = document.getElementById('filter-rapat-tahun').value;
    const bln = document.getElementById('filter-rapat-bulan').value;
    const cari = document.getElementById('input-cari-rapat').value.toLowerCase();

    dataRapatTersaring = dataRapatGlobal.filter(item => {
        return (thn === "Semua" || item.tahun === thn) && (bln === "Semua" || item.bulan === bln) && 
               (item.agenda.toLowerCase().includes(cari) || item.hasil.toLowerCase().includes(cari) || item.lokasi.toLowerCase().includes(cari));
    });
    halRapatSaatIni = 1; renderTabelRapat();
}

function renderTabelRapat() {
    const tbody = document.getElementById('data-tabel-rapat'); if (!tbody) return;
    if (dataRapatTersaring.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px; color:#666;">Tidak ada arsip hasil rapat yang cocok.</td></tr>`; return;
    }
    const start = (halRapatSaatIni - 1) * barisRapatPerHal;
    const pageData = dataRapatTersaring.slice(start, start + barisRapatPerHal);
    
    let html = pageData.map(i => `
        <tr>
            <td style="font-weight: 500; color: #333; vertical-align: top;"><i class="fa-regular fa-calendar-days" style="color:#0f5ea8; margin-right:5px;"></i> ${i.tanggal}</td>
            <td style="font-weight: bold; color: #0f5ea8; vertical-align: top;">${i.agenda}</td>
            <td style="vertical-align: top; padding-right:20px;"><div style="line-height: 1.6; text-align: left; color: #333;">${i.hasil}</div></td>
            <td style="vertical-align: top;"><i class="fa-solid fa-location-dot" style="color: #666; margin-right:4px;"></i> ${i.lokasi}</td>
        </tr>
    `).join('');

    const totalHal = Math.ceil(dataRapatTersaring.length / barisRapatPerHal);
    if (totalHal > 1) {
        let tombolNav = ""; const styleBtn = "padding:8px 16px; background:#0f5ea8; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold;";
        if (halRapatSaatIni === 1) {
            tombolNav = `<div style="text-align:right;"><button onclick="navRapat(1)" style="${styleBtn}">Halaman Selanjutnya <i class="fa-solid fa-chevron-right"></i></button></div>`;
        } else if (halRapatSaatIni === totalHal) {
            tombolNav = `<div style="text-align:left;"><button onclick="navRapat(-1)" style="${styleBtn}"><i class="fa-solid fa-chevron-left"></i> Halaman Sebelumnya</button></div>`;
        } else {
            tombolNav = `<div style="display:flex; justify-content:space-between;"><button onclick="navRapat(-1)" style="${styleBtn}"><i class="fa-solid fa-chevron-left"></i> Halaman Sebelumnya</button><button onclick="navRapat(1)" style="${styleBtn}">Halaman Selanjutnya <i class="fa-solid fa-chevron-right"></i></button></div>`;
        }
        html += `<tr><td colspan="4" style="padding:15px; background:#f9f9f9;">${tombolNav}</td></tr>`;
    }
    tbody.innerHTML = html;
}
window.navRapat = (dir) => { halRapatSaatIni += dir; renderTabelRapat(); setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 100); };

/* ==========================================================================
   6. SISTEM DOKUMENTASI & GALERI KEGIATAN
   Dokumentasi dikelola oleh dokumentasi-public.js dari TSV Google Sheet khusus.
   ========================================================================== */

/* ==========================================================================
   7. DATABASE ANGGOTA, UMUR JUJUR & FOTO POPUP
   ========================================================================== */
const URL_API_ANGGOTA_PUBLIC = "/common/api/members.php";
let dataAnggotaGlobal = []; let dataAnggotaTersaring = []; let halAnggotaSaatIni = 1; const barisAnggotaPerHal = 7;

async function loadAnggotaDariDrive() {
    try {
        const response = await fetch(`${URL_API_ANGGOTA_PUBLIC}?cache=${Date.now()}`);
        const result = await response.json();
        if (!response.ok || !result.ok) {
            throw new Error(result.message || "Gagal memuat database anggota.");
        }

        dataAnggotaGlobal = (result.data || []).map((item) => ({
            nim: String(item.member_code || "-"),
            nama: String(item.full_name || "-"),
            tahunLahirInt: Number(item.birth_year || 0),
            usia: item.age_years ? `${Number(item.age_years)} Tahun` : "-",
            foto: String(item.resolved_photo || item.photo_file || item.photo_url || ""),
        }));
        terapkanFilterAnggota();
    } catch (e) { console.error("Gagal memuat database anggota", e); }
}

window.terapkanFilterAnggota = function() {
    const cariInput = document.getElementById('input-cari-anggota'); if(!cariInput) return;
    const cari = cariInput.value.toLowerCase();
    dataAnggotaTersaring = dataAnggotaGlobal.filter(item => item.nama.toLowerCase().includes(cari) || item.nim.toLowerCase().includes(cari));
    halAnggotaSaatIni = 1; renderTabelAnggota();
}

function renderTabelAnggota() {
    const tbody = document.getElementById('data-tabel-anggota'); if (!tbody) return;
    if (dataAnggotaTersaring.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:#666;"><strong>Data anggota tidak ditemukan.</strong></td></tr>`; return;
    }
    const start = (halAnggotaSaatIni - 1) * barisAnggotaPerHal; const dataPerHalaman = dataAnggotaTersaring.slice(start, start + barisAnggotaPerHal);
    
    let html = dataPerHalaman.map(i => {
        let linkDefaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(i.nama)}&background=0f5ea8&color=fff&size=150&bold=true`;
        let urlFotoTampil = linkDefaultAvatar; 
        
        if (i.foto && i.foto !== "" && i.foto !== "-") {
            let idFile = "";
            if (i.foto.includes("id=")) { idFile = i.foto.split("id=")[1].split("&")[0]; } 
            else if (i.foto.includes("/d/")) { idFile = i.foto.split("/d/")[1].split("/")[0]; }
            if (idFile !== "") { urlFotoTampil = `https://drive.google.com/thumbnail?id=${idFile}&sz=w800`; } 
            else if (i.foto.startsWith("http")) { urlFotoTampil = i.foto; }
        }

        let generasi = "-";
        if (i.tahunLahirInt <= 1964) generasi = '<span style="background-color: #5D4037; color: white; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; display: inline-block; min-width: 85px; text-align: center;">Baby Boomer</span>';
        else if (i.tahunLahirInt >= 1965 && i.tahunLahirInt <= 1980) generasi = '<span style="background-color: #7B1FA2; color: white; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; display: inline-block; min-width: 85px; text-align: center;">Gen X</span>';
        else if (i.tahunLahirInt >= 1981 && i.tahunLahirInt <= 1996) generasi = '<span style="background-color: #0288D1; color: white; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; display: inline-block; min-width: 85px; text-align: center;">Millennial</span>';
        else if (i.tahunLahirInt >= 1997 && i.tahunLahirInt <= 2012) generasi = '<span style="background-color: #388E3C; color: white; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; display: inline-block; min-width: 85px; text-align: center;">Gen Z</span>';
        else if (i.tahunLahirInt >= 2013 && i.tahunLahirInt <= 2024) generasi = '<span style="background-color: #F57C00; color: white; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; display: inline-block; min-width: 85px; text-align: center;">Gen Alpha</span>';

        return `<tr style="height: 90px; vertical-align: middle;"> 
            <td style="font-size: 14px; font-weight: bold; color: #555;">${i.nim}</td>
            <td style="padding: 10px 0;"><img src="${urlFotoTampil}" alt="Foto ${i.nama}" style="width: 75px; height: 75px; object-fit: cover; border-radius: 50%; border: 3px solid #0f5ea8; box-shadow: 0 4px 8px rgba(0,0,0,0.15); display: block; margin: 0 auto; cursor: pointer;" onerror="this.src='${linkDefaultAvatar}'" onclick="event.stopPropagation(); window.bukaFotoFull('${urlFotoTampil}');"></td>
            <td style="text-align: left; padding-left: 20px; font-size: 15px; font-weight: 600; color: #333;"><i class="fa-solid fa-user" style="color:#0f5ea8; margin-right:8px;"></i> ${i.nama}</td>
            <td><span class="badge-usia" style="font-size: 13px; font-weight: 600; padding: 4px 10px;">${i.usia}</span></td>
            <td>${generasi}</td>
        </tr>`;
    }).join('');

    const totalHal = Math.ceil(dataAnggotaTersaring.length / barisAnggotaPerHal);
    if (totalHal > 1) {
        let tombolNav = ""; const styleBtn = "padding:8px 16px; background:#0f5ea8; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold; font-size:12px;";
        if (halAnggotaSaatIni === 1) {
            tombolNav = `<div style="text-align:right;"><button onclick="window.navAnggota(1)" style="${styleBtn}">Halaman Selanjutnya <i class="fa-solid fa-chevron-right"></i></button></div>`;
        } else if (halAnggotaSaatIni === totalHal) {
            tombolNav = `<div style="text-align:left;"><button onclick="window.navAnggota(-1)" style="${styleBtn}"><i class="fa-solid fa-chevron-left"></i> Halaman Sebelumnya</button></div>`;
        } else {
            tombolNav = `<div style="display:flex; justify-content:space-between;"><button onclick="window.navAnggota(-1)" style="${styleBtn}"><i class="fa-solid fa-chevron-left"></i> Halaman Sebelumnya</button><button onclick="window.navAnggota(1)" style="${styleBtn}">Halaman Selanjutnya <i class="fa-solid fa-chevron-right"></i></button></div>`;
        }
        html += `<tr><td colspan="5" style="padding:12px; background:#f9f9f9; border-top:1px solid #eee;">${tombolNav}</td></tr>`;
    }
    tbody.innerHTML = html;
}

window.navAnggota = function(arah) { halAnggotaSaatIni += arah; renderTabelAnggota(); setTimeout(() => { document.querySelector('.finance-table').scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50); };
window.bukaFotoFull = function(url) { const modal = document.getElementById('modal-foto-full'); const imgModal = document.getElementById('img-modal-tampil'); if(modal && imgModal) { imgModal.src = url; modal.style.display = 'flex'; } };
window.tutupFoto = function() { const modal = document.getElementById('modal-foto-full'); if(modal) modal.style.display = 'none'; };

/* ==========================================================================
   8. SISTEM PROMPT SEBELUM INSTALASI PWA (VERSI FIX MACET HP)
   ========================================================================== */
function initSistemPWA() {
    const popup = document.getElementById('pwa-install-popup');
    const tombolInstal = document.getElementById('btn-instal-pwa');

    // Amankan: Langsung paksa tampil secara visual di gateway login
    if (popup) {
        popup.style.display = 'block';
    }

    // Tangkap pemicu instalasi resmi dari browser HP
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault(); 
        pemicuInstal = e;
        if (popup) popup.style.display = 'block';
    });

    // Logika klik tombol "Instal Sekarang"
    if (tombolInstal) {
        tombolInstal.addEventListener('click', async () => {
            // JIKA DI HP PEMICU OTOMATIS BELUM SIAP / MACET, JALANKAN ALTERNATIF INI:
            if (!pemicuInstal) {
                // Deteksi apakah user pakai perangkat iOS (iPhone/iPad)
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
                
                if (isIOS) {
                    alert("Untuk iPhone/iOS, silakan klik tombol 'Share' (ikon kotak panah ke atas) di bagian bawah Safari, lalu pilih 'Add to Home Screen' / 'Tambahkan ke Layar Utama', Bro!");
                } else {
                    alert("Sistem browser HP kamu sedang memproses. Silakan klik tombol Titik Tiga di pojok kanan atas browser Chrome kamu, lalu pilih 'Tambahkan ke Layar Utama' atau 'Instal Aplikasi' ya, Bro!");
                }
                return;
            }
            
            // Jika pemicu otomatis browser siap, langsung jalankan instalasi resmi
            pemicuInstal.prompt();
            const { outcome } = await pemicuInstal.userChoice;
            console.log(`Pilihan user PWA: ${outcome}`);
            
            pemicuInstal = null; 
            tutupPopupInstal();
        });
    }

    window.addEventListener('appinstalled', () => { 
        console.log('Karang Taruna RW06 Sukses Terinstal!');
        tutupPopupInstal(); 
    });
}

function tutupPopupInstal() { 
    const popup = document.getElementById('pwa-install-popup'); 
    if (popup) popup.style.display = 'none'; 
}
/* ==========================================================================
   9. GATEWAY LOGIN & VALIDASI ADMIN SECURITY
   ========================================================================== */
function validasiLogin() {
    const inputBox = document.getElementById('access-code');
    const errorBox = document.getElementById('error-message');
    if (!inputBox) return;
    
    const password = inputBox.value.trim(); 
    if (errorBox) { errorBox.textContent = ""; errorBox.style.display = "none"; }
    
    if (password === "admin1234") {
        sessionStorage.setItem("statusAdmin", "aktif");
        window.location.href = "admin.html";
    } else if (password === "") {
        if (errorBox) { errorBox.textContent = "Password tidak boleh kosong!"; errorBox.style.display = "block"; }
        inputBox.focus();
    } else {
        if (errorBox) { errorBox.textContent = "Password salah! Khusus internal RW06 SELOR."; errorBox.style.display = "block"; }
        inputBox.value = ""; inputBox.focus();
    }
}



/* ==========================================================================
   10. UTILITIES / FUNGSI PEMBANTU UMUM
   ========================================================================== */
function isiDropdown(id, dataArray) {
    const el = document.getElementById(id); if (!el) return;
    el.innerHTML = el.options[0].outerHTML; 
    dataArray.forEach(item => {
        let opt = document.createElement("option"); opt.value = item; opt.text = item; el.appendChild(opt);
    });
}
function formatRupiah(angka) { return 'Rp ' + Math.abs(angka).toLocaleString('id-ID'); }

window.closeModal = function() {
    const modal = document.getElementById('modalOverlay');
    if (modal) modal.classList.remove('active');
};

const HERO_BG_STORAGE_KEY = 'karangtarunaHeroBackground';
const HERO_BG_OPTIONS = ['1', '2'];

function applyHeroBackground(value) {
    const nextValue = HERO_BG_OPTIONS.includes(String(value)) ? String(value) : '1';
    document.documentElement.style.setProperty('--hero-bg-current', `var(--hero-bg-${nextValue})`);
    localStorage.setItem(HERO_BG_STORAGE_KEY, nextValue);
    return nextValue;
}

window.setHeroBackground = function(value) {
    return applyHeroBackground(value);
};

window.toggleHeroBackground = function() {
    const currentValue = localStorage.getItem(HERO_BG_STORAGE_KEY) || '1';
    return applyHeroBackground(currentValue === '1' ? '2' : '1');
};

let heroBgAutoRotateTimer = null;

window.startHeroBackgroundAutoRotate = function(intervalMs = 8000) {
    if (heroBgAutoRotateTimer) clearInterval(heroBgAutoRotateTimer);
    heroBgAutoRotateTimer = setInterval(() => {
        window.toggleHeroBackground();
    }, intervalMs);
};

window.stopHeroBackgroundAutoRotate = function() {
    if (heroBgAutoRotateTimer) {
        clearInterval(heroBgAutoRotateTimer);
        heroBgAutoRotateTimer = null;
    }
};

document.addEventListener('DOMContentLoaded', function() {
    applyHeroBackground(localStorage.getItem(HERO_BG_STORAGE_KEY) || '1');
    window.startHeroBackgroundAutoRotate(8000);
});



/* ==========================================================================
   11. DETECTOR DEVICE (ANDROID/IPHONE)

   ===========================================*/
function isIos() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

function isInStandaloneMode() {
  return ('standalone' in window.navigator) && (window.navigator.standalone);
}

// Jalankan logika setelah halaman selesai dimuat
window.addEventListener('DOMContentLoaded', () => {
  if (isIos() && !isInStandaloneMode()) {
    const iosPrompt = document.getElementById('ios-prompt');
    if (iosPrompt) {
      iosPrompt.style.display = 'block';
    }
  }
});

/* ==========================================================================
   12. SISTEM MANAJEMEN ELIMINASI TURNAMEN
   ========================================================================== */
function turnamenBelumTersedia() {
    alert("Fitur turnamen belum diaktifkan di database VPS.");
}
window.triggerAcakBaganOtomatis = turnamenBelumTersedia;
window.muatBaganLombaVisual = function() {
    const container = document.getElementById('bracket-container');
    if (container) {
        container.innerHTML = `<p style="text-align:center; color:#64748b; width:100%; padding:20px;">Fitur turnamen sedang disiapkan di database VPS.</p>`;
    }
};
window.triggerResetRobotTotal = turnamenBelumTersedia;
window.arsipDanAutoResetBagan = turnamenBelumTersedia;
window.simpanSkorPertandingan = turnamenBelumTersedia;
window.triggerLanjutBabakRonde = turnamenBelumTersedia;
