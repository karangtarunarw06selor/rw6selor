import { state } from './state.js';

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.addEventListener("beforeunload", () => {
    window.scrollTo(0, 0);
});

window.addEventListener("load", () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        const materiBody = document.getElementById("materi-body");
        if (materiBody) materiBody.scrollTop = 0;
    }, 0);
});

window.state = state;
console.log("MAIN.JS LOADED", window.state);

window.state = state;
console.log("MAIN.JS LOADED", window.state);

import {
    eksekusiKlikDoubleBounce as eksekusiKlikDoubleBounceMateri,
    resetSeleksiDashboardEsensial,
    resetSeleksiDashboardEksternal,
    toggleAccordionBox,
    toggleSubLaci,
    toggleRumpunSmart,
    tampilkanMateriSpesifik,
    tutupModalMateri,
    mmsToggleVideoSaja,
    kembaliKeDashboard,
    bukaMateriMenu
} from './menu/menuMateri.js';

import {
    bukaEnsiklopediaMenu,
    tutupEnsiklopediaMenu,
    mmsBukaFiturEnsiklopedia,

    bukaModalKamus,
    tutupModalKamus,
    filterKamusData,
    isiFilterKamus,
    mmsPlayPronunciation,

    bukaModalVerb,
    tutupModalVerb,
    filterVerbData,
    isiFilterVerb,
    bukaDetailVerb,
    bukaModalDetailVerb,
    tutupModalDetailVerb,

    loadEncyclopediaFromSheets,
    switchEncyclopediaTab,
    filterEncyclopediaData 
} from './menu/menuEnsiklopedia.js';


import {
    bukaLatihanMenu,
    mulaiLatihan,
    tutupLatihanMenu,
    cekJawabanLatihan,
    renderSoalLatihan,
    tampilkanErrorLatihanKoneksi,
    keluarLatihanDenganKonfirmasi,
    tampilkanKonfirmasiKeluarLatihan,
    tutupKonfirmasiKeluarLatihan,
    konfirmasiKeluarLatihanYa,
    lanjutSoalLatihan
} from './menu/menuLatihan.js';



export function eksekusiKlikDoubleBounce(idKotak, namaMenu) {
    if (window.event) window.event.stopPropagation();


    if (namaMenu === "latihan") {
    const gridContainer = document.getElementById("mms-container-grid-icon");
    const wrapperIcon = document.getElementById(`mms-item-box-${idKotak}`);

    if (state.mmsKotakTerpilihSekarang === idKotak) {
        bukaLatihanMenu();
        resetSeleksiDashboardEsensial();
        return;
    }

    state.mmsKotakTerpilihSekarang = idKotak;

    document.querySelectorAll(".menu-icon-wrapper")
        .forEach(el => el.classList.remove("mms-selected-bounce"));

    if (gridContainer) gridContainer.classList.add("has-selection");
    if (wrapperIcon) wrapperIcon.classList.add("mms-selected-bounce");

    return;
}

    if (namaMenu !== 'ensiklopedia') {
        eksekusiKlikDoubleBounceMateri(idKotak, namaMenu);
        return;
    }

    const gridContainer = document.getElementById('mms-container-grid-icon');
    const wrapperIcon = document.getElementById(`mms-item-box-${idKotak}`);

    if (state.mmsKotakTerpilihSekarang === idKotak) {
        bukaEnsiklopediaMenu();
        resetSeleksiDashboardEsensial();
        return;
    }


    state.mmsKotakTerpilihSekarang = idKotak;
    document.querySelectorAll('.menu-icon-wrapper').forEach(el => el.classList.remove('mms-selected-bounce'));

    if (gridContainer) gridContainer.classList.add('has-selection');
    if (wrapperIcon) wrapperIcon.classList.add('mms-selected-bounce');
}

window.eksekusiKlikDoubleBounce = eksekusiKlikDoubleBounce;
window.resetSeleksiDashboardEksternal = resetSeleksiDashboardEksternal;
window.resetSeleksiDashboardEsensial = resetSeleksiDashboardEsensial;

window.toggleAccordionBox = toggleAccordionBox;
window.toggleSubLaci = toggleSubLaci;
window.toggleRumpunSmart = toggleRumpunSmart;
window.tampilkanMateriSpesifik = tampilkanMateriSpesifik;
window.tutupModalMateri = tutupModalMateri;
window.mmsToggleVideoSaja = mmsToggleVideoSaja;
window.kembaliKeDashboard = kembaliKeDashboard;
window.bukaMateriMenu = bukaMateriMenu;

window.bukaEnsiklopediaMenu = bukaEnsiklopediaMenu;
window.tutupEnsiklopediaMenu = tutupEnsiklopediaMenu;
window.mmsBukaFiturEnsiklopedia = mmsBukaFiturEnsiklopedia;
window.loadEncyclopediaFromSheets = loadEncyclopediaFromSheets;
window.switchEncyclopediaTab = switchEncyclopediaTab;
window.filterEncyclopediaData = filterEncyclopediaData;

window.bukaModalKamus = bukaModalKamus;
window.tutupModalKamus = tutupModalKamus;
window.filterKamusData = filterKamusData;
window.isiFilterKamus = isiFilterKamus;
window.mmsPlayPronunciation = mmsPlayPronunciation;
window.bukaModalVerb = bukaModalVerb;
window.tutupModalVerb = tutupModalVerb;
window.filterVerbData = filterVerbData;
window.isiFilterVerb = isiFilterVerb;
window.bukaDetailVerb = bukaDetailVerb;
window.bukaModalDetailVerb = bukaModalDetailVerb;
window.tutupModalDetailVerb = tutupModalDetailVerb;
window.bukaLatihanMenu = bukaLatihanMenu;
window.mulaiLatihan = mulaiLatihan;
window.tutupLatihanMenu = tutupLatihanMenu;
window.renderSoalLatihan = renderSoalLatihan;
window.cekJawabanLatihan = cekJawabanLatihan;
window.tampilkanErrorLatihanKoneksi = tampilkanErrorLatihanKoneksi;
window.lanjutSoalLatihan = lanjutSoalLatihan;
window.keluarLatihanDenganKonfirmasi = keluarLatihanDenganKonfirmasi;
window.tampilkanKonfirmasiKeluarLatihan = tampilkanKonfirmasiKeluarLatihan;
window.tutupKonfirmasiKeluarLatihan = tutupKonfirmasiKeluarLatihan;
window.konfirmasiKeluarLatihanYa = konfirmasiKeluarLatihanYa;