// =========================================================================
// /lat-inggris/menu/menuMateri.js - ROUTER MANAGEMENT WITH FALLBACK SAFETY
// =========================================================================

import { state } from '../state.js';
import { prosesMateriNonTenses } from '../materi/materiNonTenses.js';
import { prosesMateriTenses } from '../materi/materiTenses.js';

export function eksekusiKlikDoubleBounce(idKotak, namaMenu) {
    if (window.event) window.event.stopPropagation();

    let gridContainer = document.getElementById("mms-container-grid-icon");
    let wrapperIcon = document.getElementById(`mms-item-box-${idKotak}`);

    if (state.mmsKotakTerpilihSekarang === idKotak) {
        if (namaMenu === 'materi') {
            bukaMateriMenu();
        } else {
            document.getElementById("mms-lbl-dev-title").innerText = "Modul " + namaMenu.toUpperCase();
            document.getElementById("mms-modal-dev").style.display = "flex";
        }
        resetSeleksiDashboardEsensial();
        return;
    }

    state.mmsKotakTerpilihSekarang = idKotak;
    document.querySelectorAll(".menu-icon-wrapper").forEach(el => el.classList.remove("mms-selected-bounce"));
    
    if (gridContainer) gridContainer.classList.add("has-selection");
    if (wrapperIcon) wrapperIcon.classList.add("mms-selected-bounce");
}

export function resetSeleksiDashboardEksternal(e) {
    const appContainer = e.target.closest('.mms-app-container');
    if (!appContainer) return; 

    if (!e.target.closest('.menu-icon-wrapper')) {
        resetSeleksiDashboardEsensial();
    }
}

export function resetSeleksiDashboardEsensial() {
    state.mmsKotakTerpilihSekarang = null;
    let gridContainer = document.getElementById("mms-container-grid-icon");
    if (gridContainer) gridContainer.classList.remove("has-selection");
    document.querySelectorAll(".menu-icon-wrapper").forEach(el => el.classList.remove("mms-selected-bounce"));
}

export function tampilkanMateriSpesifik(namaMateriKolomC, subMateriKolomD) {
    if (subMateriKolomD === undefined) {
        subMateriKolomD = namaMateriKolomC;
    }

    let boxVisualMateri = document.getElementById("box-media-materi");
    let boxRumusAktif = document.getElementById("box-txt-rumus-aktif");
    let boxPembahasan = document.getElementById("box-txt-pembahasan");
    let btnVideo = document.getElementById("mms-btn-buka-video");

    let elementBoxAktifUtama = document.getElementById("box-txt-rumus-aktif") ? document.getElementById("box-txt-rumus-aktif").closest('.info-box-item') : null;
    let elementBoxPasifUtama = document.getElementById("wrapper-box-pasif");
    let elementBoxTipsUtama = document.getElementById("wrapper-box-tips-pintar");
    let panelTipsTabel = document.getElementById('panel-tips-tabel');

    // Bersihkan string parameter untuk pencarian longgar
    let idLower = subMateriKolomD.toLowerCase().trim();
    let idLowerClean = idLower.replace(/[^a-z0-9]/g, ""); // Menghilangkan tanda strip (-) agar toleran

    if (!idLower.startsWith("pasif-") && !idLower.startsWith("aktif-")) {
        if (elementBoxAktifUtama) elementBoxAktifUtama.style.display = "none";  
        if (elementBoxPasifUtama) elementBoxPasifUtama.style.display = "none";  
        if (elementBoxTipsUtama) elementBoxTipsUtama.style.display = "none";   
    }

    if (boxVisualMateri) boxVisualMateri.style.display = "none";
    
    if (btnVideo) {
        btnVideo.innerHTML = `<i class="fa-solid fa-circle-play"></i> <span>Ketuk untuk Lihat Penjelasan Video</span>`;
        btnVideo.style.background = "#eff6ff"; btnVideo.style.color = "var(--mms-accent)"; btnVideo.style.borderColor = "var(--mms-accent)";
    }

    if(document.getElementById('panel-aktif-contoh')) document.getElementById('panel-aktif-contoh').style.display = "none";
    if(document.getElementById('panel-pasif-contoh')) document.getElementById('panel-pasif-contoh').style.display = "none";
    if(panelTipsTabel) panelTipsTabel.style.display = "none"; 

    let judulTense = document.getElementById("lbl-judul-tense-aktif");

    // 🎯 PERBAIKAN SEARCH ENGINE MAPPING (GARANSI ANTI-FREEZE)
    // Jalur 1: Cari langsung berdasarkan kecocokan mutlak Kolom D (Sub-Materi) tanpa peduli spasi/strip
    let dataCocok = state.bankMateri.find(m => {
        let subSheetClean = (m.subMateri || "").toLowerCase().trim().replace(/[^a-z0-9]/g, "");
        return subSheetClean === idLowerClean;
    });

    // Jalur 2: Fallback jika jalur 1 tidak ketemu, cari kecocokan berbasis kata kunci di Kolom C
    if (!dataCocok) {
        dataCocok = state.bankMateri.find(m => {
            let matSheet = (m.materi || "").toLowerCase().trim();
            return matSheet === namaMateriKolomC.toLowerCase().trim();
        });
    }

    let laciCustomLama = document.getElementById("mms-laci-tutup-sembunyi-bab14");
    if (laciCustomLama) laciCustomLama.remove();

    // Jaring pengaman darurat jika data di Sheets benar-benar tidak sinkron
    if (!dataCocok) {
        if (judulTense) judulTense.innerHTML = `Modul: <b>${namaMateriKolomC}</b>`;
        if (boxRumusAktif) boxRumusAktif.innerText = "Data Belum Sinkron";
        if (boxPembahasan) boxPembahasan.innerText = `Pencarian modul '${subMateriKolomD}' gagal. Hubungan mapping Google Sheets terputus.`;
        document.getElementById("materi-pembahasan-box").style.display = "flex";
        return;
    }

    // Alihkan penanganan ke file materi masing-masing
    if (!idLower.startsWith("pasif-") && !idLower.startsWith("aktif-")) {
        prosesMateriNonTenses(namaMateriKolomC, subMateriKolomD, idLower, dataCocok);
    } else {
        prosesMateriTenses(namaMateriKolomC, subMateriKolomD, idLower, dataCocok);
    }
    
    // Pastikan jendela popup modal Layer 5 dipaksa terbuka ke layar
    document.getElementById("materi-pembahasan-box").style.display = "flex";
}

export function toggleAccordionBox(panelId) {
    let panel = document.getElementById(panelId); if (!panel) return;
    if (panelId === 'panel-aktif-contoh' || panelId === 'panel-pasif-contoh' || panelId === 'panel-tips-tabel') {
        panel.style.display = (panel.style.display === "none" || panel.style.display === "") ? "block" : "none"; return;
    }
    let isOpening = (panel.style.display === "none" || panel.style.display === "");
    let semuaKotakWaktu = ['act-box-present', 'pas-box-present'];
    semuaKotakWaktu.forEach(id => { let p = document.getElementById(id); if (p) p.style.display = "none"; });
    document.querySelectorAll('.mms-sub-laci').forEach(laci => laci.style.display = "none");
    if (isOpening) panel.style.display = "flex";
    else panel.style.display = "none";
}

export function toggleSubLaci(idLaci) {
    let el = document.getElementById(idLaci); if (!el) return;
    let isOpening = (el.style.display === "none" || el.style.display === "");
    document.querySelectorAll('.mms-sub-laci').forEach(laci => { if (laci.id !== idLaci) laci.style.display = "none"; });
    if (isOpening) el.style.display = "block";
    else el.style.display = "none";
}

export function toggleRumpunSmart(idBab) {
    let semuaBab = ['mms-bab-1-content', 'mms-bab-2-content', 'mms-bab-3-content', 'mms-bab-4-content'];
    semuaBab.forEach(id => {
        let el = document.getElementById(id); if (!el) return;
        if (id === idBab) {
            el.style.display = (el.style.display === "none" || el.style.display === "") ? "flex" : "none";
        } else {
            el.style.display = "none";
        }
    });
}

export function resetTampilanDashboard() {
    document.getElementById("dashboard-menu").style.display = "block";
    document.getElementById("materi-body").style.display = "none";
    resetSeleksiDashboardEsensial();
}

export function bukaMateriMenu() {
    document.getElementById("dashboard-menu").style.display = "none";
    document.getElementById("materi-body").style.display = "block";
    document.getElementById("materi-pembahasan-box").style.display = "none";

    pasangHeaderProgressMateri();
}

function pasangHeaderProgressMateri() {
    const materiBody = document.getElementById("materi-body");
    if (!materiBody) return;

    let oldHeader = document.getElementById("mms-materi-progress-header");
    if (oldHeader) oldHeader.remove();

    const totalMateri = document.querySelectorAll("#materi-body button[onclick*='tampilkanMateriSpesifik']").length;
    const selesai = Object.keys(localStorage)
        .filter(key => key.startsWith("mms_materi_selesai_"))
        .length;

    const persen = totalMateri ? Math.round((selesai / totalMateri) * 100) : 0;

    const header = document.createElement("div");
    header.id = "mms-materi-progress-header";
    header.innerHTML = `
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:16px; margin-bottom:16px; box-shadow:0 8px 20px rgba(15,23,42,0.06);">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:10px;">
                <div>
                    <div style="font-size:18px; font-weight:900; color:#0f172a;">
                        📚 Progress Materi
                    </div>
                    <div style="font-size:12px; font-weight:700; color:#64748b; margin-top:3px;">
                        ${selesai}/${totalMateri} materi dipelajari
                    </div>
                </div>

                <div style="font-size:18px; font-weight:900; color:#3b82f6;">
                    ${persen}%
                </div>
            </div>

            <div style="height:9px; background:#f1f5f9; border-radius:999px; overflow:hidden;">
                <div style="height:100%; width:${persen}%; background:#3b82f6;"></div>
            </div>
        </div>
    `;

    materiBody.prepend(header);
}

export function kembaliKeDashboard() { resetTampilanDashboard(); }

export function tutupModalMateri(e) { 
    let m = document.getElementById("materi-pembahasan-box"); 
    if (m && (!e || e.target.id === "materi-pembahasan-box")) {
        m.style.display = "none";
        let vidLokal = document.getElementById("mms-media-video-lokal");
        if (vidLokal) vidLokal.pause();
    } 
}

export function mmsToggleVideoSaja() {
    let bv = document.getElementById("box-media-materi"); let btn = document.getElementById("mms-btn-buka-video"); if (!bv) return;
    let vid = document.getElementById("mms-media-video-lokal");
    if (bv.style.display === "flex") {
        bv.style.display = "none"; 
        if (vid) vid.pause();
        if (btn) btn.innerHTML = `<i class="fa-solid fa-circle-play"></i> <span>Ketuk untuk Lihat Penjelasan Video</span>`;
    } else {
        bv.style.display = "flex"; 
        if (vid) { vid.currentTime = 0; vid.play().catch(e => {}); }
        if (btn) btn.innerHTML = `<i class="fa-solid fa-circle-minus"></i> <span>Ketuk untuk Sembunyikan Video Materi</span>`;
    }
}

window.toggleAccordionBox = toggleAccordionBox;
window.toggleSubLaci = toggleSubLaci;
window.toggleRumpunSmart = toggleRumpunSmart;
window.tampilkanMateriSpesifik = tampilkanMateriSpesifik;
window.tutupModalMateri = tutupModalMateri;
window.mmsToggleVideoSaja = mmsToggleVideoSaja;
window.kembaliKeDashboard = kembaliKeDashboard;
