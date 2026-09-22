// =========================================================================
// 4. SUB-ROUTER B: JALUR KHUSUS BAB 2 & BAB 3 (TENSES) - CODESYNC FIX
// =========================================================================
import { state } from '../state.js'; // Mengambil data state universal

export function prosesMateriTenses(namaMateriKolomC, subMateriKolomD, idLower, dataCocok) {
    let boxVisualMateri = document.getElementById("box-media-materi");
    let boxRumusAktif = document.getElementById("box-txt-rumus-aktif");
    let boxRumusPasif = document.getElementById("box-txt-rumus-pasif");
    let boxArtiAktif = document.getElementById("box-txt-arti-aktif");
    let boxArtiPasif = document.getElementById("box-txt-arti-pasif");
    let boxPembahasan = document.getElementById("box-txt-pembahasan");
    let boxSilabus = document.getElementById("box-txt-silabus");
    let judulTense = document.getElementById("lbl-judul-tense-aktif");

    let elementBoxAktifUtama = document.getElementById("box-txt-rumus-aktif") ? document.getElementById("box-txt-rumus-aktif").closest('.info-box-item') : null;
    let elementBoxPasifUtama = document.getElementById("wrapper-box-pasif");
    let elementBoxTipsUtama = document.getElementById("wrapper-box-tips-pintar");

    let labelTipeTeks = subMateriKolomD.replace(/-/g, " ").toUpperCase();
    if (judulTense) judulTense.innerHTML = `Modul: <b>${dataCocok.materi || namaMateriKolomC} (${labelTipeTeks})</b>`;
    if(boxSilabus) boxSilabus.innerText = dataCocok.judulBab || "MMS Ruang Literasi";

    let isiRumus = (dataCocok.rumus || "").replace(/\\n/g, "\n");
    let isiContoh = (dataCocok.contohKalimat || "").replace(/\\n/g, "\n");
    let isiArti = (dataCocok.arti || "").replace(/\\n/g, "\n");

    if (idLower.startsWith("pasif-")) {
        // [ 🔒 JALUR 2: BAB 3 PASIF - UTUH SAMA SEKALI TIDAK DISENTUH ]
        if (elementBoxTipsUtama) {
            elementBoxTipsUtama.style.display = "block";
            let btnTriggerAsli = elementBoxTipsUtama.querySelector('.mms-toggle-trigger-btn');
            let headerAsli = elementBoxTipsUtama.querySelector('.info-box-header');
            if(btnTriggerAsli) btnTriggerAsli.style.display = "flex";
            if(headerAsli) headerAsli.style.display = "flex";
        }
        if (elementBoxAktifUtama) elementBoxAktifUtama.style.display = "none";
        if (elementBoxPasifUtama) elementBoxPasifUtama.style.display = "block";
        
        if(boxRumusAktif) boxRumusAktif.innerText = "Sistem Kalimat Pasif Aktif.";
        if(boxRumusPasif) boxRumusPasif.innerText = isiRumus; 
        
        if(boxArtiAktif) boxArtiAktif.innerHTML = `<div style='color:#94a3b8; font-style:italic;'>Membuka lembar materi kalimat pasif.</div>`;
        if(boxArtiPasif) {
            boxArtiPasif.innerHTML = `
                <div style="font-style: italic; font-weight: 600; color: var(--mms-navy); margin-bottom: 5px; white-space: pre-line;"><i class="fa-solid fa-quote-left" style="font-size:10px; opacity:0.5; margin-right:4px;"></i>${isiContoh}</div>
                <div style="border-bottom: 1px dashed #cbd5e1; margin-bottom: 5px; width: 100%;"></div>
                <div style="font-size: 12.5px; color: #475569; font-weight: 500; white-space: pre-line;"><b>Artinya:</b> ${isiArti || 'Belum ada terjemahan.'}</div>
            `;
        }

    } else if (idLower.startsWith("aktif-")) {
        // [ 🔒 JALUR 3: BAB 2 AKTIF - UTUH SAMA SEKALI TIDAK DISENTUH ]
        if (elementBoxTipsUtama) {
            elementBoxTipsUtama.style.display = "block";
            let btnTriggerAsli = elementBoxTipsUtama.querySelector('.mms-toggle-trigger-btn');
            let headerAsli = elementBoxTipsUtama.querySelector('.info-box-header');
            if(btnTriggerAsli) btnTriggerAsli.style.display = "flex";
            if(headerAsli) headerAsli.style.display = "flex";
        }
        if (elementBoxPasifUtama) elementBoxPasifUtama.style.display = "none";
        if (elementBoxAktifUtama) elementBoxAktifUtama.style.display = "block";
        
        if(boxRumusAktif) {
            boxRumusAktif.classList.add("mms-txt-rumus-glow");
            boxRumusAktif.innerText = isiRumus; 
        }
        if(boxRumusPasif) boxRumusPasif.innerText = "No Passive Form untuk tipe data ini.";
        
        if(boxArtiAktif) {
            boxArtiAktif.innerHTML = `
                <div style="font-style: italic; font-weight: 600; color: var(--mms-navy); margin-bottom: 5px; white-space: pre-line;"><i class="fa-solid fa-quote-left" style="font-size:10px; opacity:0.5; margin-right:4px;"></i>${isiContoh}</div>
                <div style="border-bottom: 1px dashed #cbd5e1; margin-bottom: 5px; width: 100%;"></div>
                <div style="font-size: 12.5px; color: #475569; font-weight: 500; white-space: pre-line;"><b>Artinya:</b> ${isiArti || 'Belum ada terjemahan.'}</div>
            `;
        }
        if(boxArtiPasif) boxArtiPasif.innerHTML = `<div style='color:#94a3b8; font-style:italic;'>Pilih menu Bab 3 untuk membuka struktur pasif.</div>`;
    }

    if(boxPembahasan) {
        boxPembahasan.innerText = dataCocok.fungsi ? dataCocok.fungsi.replace(/\\n/g, "\n") : `Menampilkan spesifikasi gramatikal rumpun ${dataCocok.judulBab}.`;
    }

    if(boxVisualMateri) {
        let visual = dataCocok.visual || "";
        if (visual.startsWith("fa-")) {
            boxVisualMateri.innerHTML = `<i class="fa-solid ${visual}" style="color:var(--mms-accent); font-size: 3em;"></i>`;
        } else if (visual && (visual.endsWith(".mp4") || visual.endsWith(".webm") || visual.includes("video/") || visual.startsWith("http"))) {
            boxVisualMateri.innerHTML = `<video id="mms-media-video-lokal" style="width:100%; height:100%; object-fit:cover; border-radius:8px;" controls>` +
                                            `<source src="${visual}" type="video/mp4">` +
                                         `</video>`;
        } else if (visual && visual.startsWith("images/")) {
            boxVisualMateri.innerHTML = `<img src="images/verb-categories-classification.png" alt="visual-materi" style="max-height:100%; width:100%; object-fit:cover; border-radius:6px;">`;
        } else {
            boxVisualMateri.innerHTML = `<i class="fa-solid fa-photo-film fa-2xl" style="color:#94a3b8"></i>`;
        }
    }
}
