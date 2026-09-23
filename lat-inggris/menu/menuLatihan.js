const ENGLISH_PUBLIC_API_BASE = "https://rw6selor.org/common/api";
const URL_LATIHAN = `${ENGLISH_PUBLIC_API_BASE}/english_public_exercises.php?limit=1000`;

const latihanState = {
    semuaSoal: [],
    soalAktif: [],
    level: "",
    index: 0,
    skor: 0,
    benar: 0,
    salah: 0
};

export async function loadLatihanFromTSV() {
    try {
        const response = await fetch(URL_LATIHAN, {
            headers: { Accept: "application/json" }
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Gagal memuat soal latihan.");
        }

        latihanState.semuaSoal = (Array.isArray(result.data) ? result.data : []).map(item => [
            item.id || "",
            String(item.level || "").toLowerCase().trim() === "expert" ? "advanced" : String(item.level || "").toLowerCase().trim(),
            item.kategori || "",
            item.pertanyaan || "",
            item.pilihan_a || "",
            item.pilihan_b || "",
            item.pilihan_c || "",
            item.pilihan_d || "",
            item.jawaban_benar || "",
            item.pembahasan || "",
            item.media_type || "",
            item.media_url || "",
            item.media_url || ""
        ]);
    } catch (error) {
        latihanState.semuaSoal = [];
        tampilkanErrorLatihanKoneksi();
    }
}


export function tampilkanErrorLatihanKoneksi() {
    const modal = document.getElementById("mms-modal-latihan");
    if (!modal) return;

    modal.innerHTML = `
        <div style="width:min(520px,100%); background:#ffffff; border-radius:22px; padding:24px; box-shadow:0 18px 45px rgba(15,23,42,0.28);">
            <div style="font-size:24px; font-weight:900; color:#0f172a; margin-bottom:8px;">
                Gagal Memuat Latihan
            </div>
            <div style="font-size:14px; color:#64748b; margin-bottom:18px;">
                Periksa koneksi internet, lalu coba muat ulang soal.
            </div>

            <button onclick="bukaLatihanMenu()" style="width:100%; border:none; border-radius:14px; padding:14px; background:#f59e0b; color:white; font-weight:900; cursor:pointer; margin-bottom:10px;">
                Refresh Soal
            </button>

            <button onclick="tutupLatihanMenu()" style="width:100%; border:2px solid #e2e8f0; border-radius:14px; padding:14px; background:white; color:#334155; font-weight:900; cursor:pointer;">
                Kembali
            </button>
        </div>
    `;
}


export async function bukaLatihanMenu() {
    let modal = document.getElementById("mms-modal-latihan");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "mms-modal-latihan";

        modal.onclick = function(e) {
    if (e.target === modal) {
        keluarLatihanDenganKonfirmasi();
    }
};

        modal.style.cssText = "position:fixed; inset:0; background:rgba(15,23,42,0.55); backdrop-filter:blur(6px); z-index:10000; display:none; align-items:flex-start; justify-content:center; padding:18px; box-sizing:border-box; overflow-y:auto;";
        document.body.appendChild(modal);
    }

    modal.style.display = "flex";

    await loadLatihanFromTSV();

    if (!latihanState.semuaSoal.length) return;

const basicData =
    JSON.parse(localStorage.getItem("mms_latihan_hasil_basic") || "null");

const intermediateData =
    JSON.parse(localStorage.getItem("mms_latihan_hasil_intermediate") || "null");

const advancedData =
    JSON.parse(localStorage.getItem("mms_latihan_hasil_advanced") || "null");

const playerData = hitungXPPlayerLatihan();

const levelStatus = getLevelStatus();

const rankName = getPlayerRank(playerData.playerLevel);

const statistikGlobal = getStatistikGlobalLatihan();

const streakLatihan = getDailyStreakLatihan();

const jumlahBasic =
    latihanState.semuaSoal.filter(
        row => String(row[1] || "").toLowerCase().trim() === "basic"
    ).length;

const jumlahIntermediate =
    latihanState.semuaSoal.filter(
        row => String(row[1] || "").toLowerCase().trim() === "intermediate"
    ).length;

const jumlahAdvanced =
    latihanState.semuaSoal.filter(
        row => String(row[1] || "").toLowerCase().trim() === "advanced"
    ).length;



 const basicDisabled = jumlahBasic === 0;

const intermediateDisabled =
    levelStatus.intermediate === "locked" || jumlahIntermediate === 0;

const advancedDisabled =
    levelStatus.advanced === "locked" || jumlahAdvanced === 0;




function renderProgress(data) {
    if (!data) {
        return `
            <div style="margin-top:6px; height:6px; margin-top:6px; width:80%;font-size:12px; font-weight:700; color:#94a3b8;">
                Belum pernah dikerjakan
            </div>
        `;
    }

    let badge = "";
    const progress = data?.akurasi || 0;

    if (data.akurasi === 100) {
        badge = `
            <div style="margin-top:6px; font-size:11px; font-weight:800; color:#16a34a;">
                🏆 Selesai Sempurna
            </div>
        `;
    } else if (data.akurasi >= 80) {
        badge = `
            <div style="margin-top:6px; font-size:11px; font-weight:800; color:#2563eb;">
                ⭐ Sangat Baik
            </div>
        `;
    } else if (data.akurasi >= 50) {
        badge = `
            <div style="margin-top:6px; font-size:11px; font-weight:800; color:#f59e0b;">
                👍 Cukup
            </div>
        `;
    }

    return `
        ${badge}

        <div style="height:7px; background:#fde68a; border-radius:999px; overflow:hidden; margin-top:8px;">
            <div style="height:100%; width:${progress}%; background:#f59e0b;"></div>
        </div>

        <div style="margin-top:4px; font-size:12px; font-weight:700; color:#64748b;">
            Akurasi ${data.akurasi}% • Skor ${data.skor}
        </div>
    `;
}

if (!document.getElementById("mms-latihan-ticker-style")) {
    const style = document.createElement("style");
    style.id = "mms-latihan-ticker-style";
    style.innerHTML = `
    @keyframes mmsLatihanTicker {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }
`;
    document.head.appendChild(style);
}

    modal.innerHTML = `
    <div style="width:min(520px,100%); background:#ffffff; border-radius:22px; padding:24px; box-shadow:0 18px 45px rgba(15,23,42,0.28); box-sizing:border-box; position:relative;">
        <button onclick="tutupLatihanMenu()" style="position:absolute; top:16px; right:16px; width:42px; height:42px; border:none; border-radius:50%; background:#f1f5f9; color:#64748b; font-size:20px; font-weight:800; cursor:pointer;">
            <i class="fa-solid fa-xmark"></i>
        </button>

        <div style="display:flex; align-items:center; gap:12px; margin-bottom:18px; padding-right:48px;">
            <div style="width:56px; height:56px; border-radius:18px; background:#f59e0b; color:#ffffff; display:flex; align-items:center; justify-content:center; font-size:24px; flex-shrink:0;">
                <i class="fa-solid fa-pen-to-square"></i>
            </div>

            <div style="flex:1; min-width:0;">
                <div style="font-size:24px; font-weight:900; color:#0f172a;">Latihan</div>
                <div style="font-size:13px; font-weight:700; color:#64748b;">Pilih level latihan bahasa Inggris</div>

                <div style="font-size:13px; font-weight:800; color:#f59e0b; margin-top:6px;">
                    XP ${playerData.totalXP} • Level ${playerData.playerLevel}
                </div>

                <div style="margin-top:8px;">
                    <div style="height:8px; background:#f1f5f9; border-radius:999px; overflow:hidden;">
                        <div style="height:100%; width:${playerData.xpProgress}%; background:#f59e0b;"></div>
                    </div>

                    <div style="margin-top:5px; font-size:11px; font-weight:800; color:#94a3b8; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                        <span>${playerData.xpSisa} XP lagi menuju Level ${playerData.playerLevel + 1}</span>
                        <span style="background:#fef3c7; color:#92400e; padding:4px 9px; border-radius:999px;">
                            ${rankName}
                        </span>
                    </div>

                    <div style="margin-top:10px; display:flex; align-items:center; gap:8px; flex-wrap:wrap; font-size:11px; font-weight:800;">
                        ${streakLatihan > 0 ? `
                            <span style="background:#fee2e2; color:#991b1b; padding:4px 9px; border-radius:999px;">
                                🔥 Streak ${streakLatihan} hari
                            </span>
                        ` : `
                            <span style="background:#f1f5f9; color:#64748b; padding:4px 9px; border-radius:999px;">
                                🔥 Mulai streak hari ini
                            </span>
                        `}

                        <button onclick="bukaAchievementDetail()" style="border:none; background:#f8fafc; color:#64748b; padding:4px 9px; border-radius:999px; font-size:11px; font-weight:800; cursor:pointer;">
                         🏆 Achievement ${getAchievements().length}/9
                        </button>
                    </div>
                </div>
            </div>
        </div>

        ${statistikGlobal.soalDijawab === 0 ? `
            <div style="width:100%; margin:12px 0 14px 0; padding:10px 12px; background:#fff7ed; border:1px solid #fed7aa; border-radius:14px; overflow:hidden; white-space:nowrap; box-sizing:border-box;">
                <div style="display:inline-block; font-size:12px; font-weight:800; color:#92400e; animation:mmsLatihanTicker 18s linear infinite;">
                    ----- 🚀 Selamat datang! Mulai latihan pertamamu untuk mendapatkan XP ----- 🏆 Buka achievement ----- 📈 Lacak progres belajar ----- 🚀 Selamat datang! Mulai latihan pertamamu untuk mendapatkan XP ----- 🏆 Buka achievement ----- 📈 Lacak progres belajar
                </div>
            </div>
        ` : `
            <div style="width:100%; margin:12px 0 14px 0; padding:10px 12px; background:#f8fafc; border-radius:14px; border:1px solid #e2e8f0; display:flex; gap:8px; flex-wrap:wrap; font-size:11px; font-weight:800; color:#64748b; box-sizing:border-box;">
                <span>📚 ${statistikGlobal.levelSelesai}/3 Level</span>
                <span>📝 ${statistikGlobal.soalDijawab} Soal</span>
                <span>✅ ${statistikGlobal.jawabanBenar} Benar</span>
                <span>🎯 ${statistikGlobal.akurasiTotal}%</span>
            </div>
        `}

        <div style="display:grid; gap:12px;">
            <button onclick="mulaiLatihan('basic')" ${basicDisabled ? "disabled" : ""} style="width:100%; border:2px solid #fed7aa; background:#fff7ed; border-radius:16px; padding:14px; cursor:${basicDisabled ? "not-allowed" : "pointer"}; opacity:${basicDisabled ? "0.65" : "1"}; text-align:left; color:#92400e;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <div style="font-size:16px; font-weight:900;">Basic</div>
                    ${renderStatusBadge(levelStatus.basic, jumlahBasic)}
                </div>
                ${renderProgress(basicData)}
                <div style="margin-top:4px; font-size:11px; font-weight:700; color:#94a3b8;">
                    ${jumlahBasic} soal tersedia
                </div>
            </button>

            <button onclick="mulaiLatihan('intermediate')" ${intermediateDisabled ? "disabled" : ""} style="width:100%; border:2px solid #bfdbfe; background:#eff6ff; border-radius:16px; padding:14px; cursor:${intermediateDisabled ? "not-allowed" : "pointer"}; opacity:${intermediateDisabled ? "0.65" : "1"}; text-align:left; color:#1d4ed8;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <div style="font-size:16px; font-weight:900;">Intermediate</div>
                    ${renderStatusBadge(levelStatus.intermediate, jumlahIntermediate)}
                </div>
                ${renderProgress(intermediateData)}
                <div style="margin-top:4px; font-size:11px; font-weight:700; color:#94a3b8;">
                    ${jumlahIntermediate} soal tersedia
                </div>
            </button>

            <button onclick="mulaiLatihan('advanced')" ${advancedDisabled ? "disabled" : ""} style="width:100%; border:2px solid #ddd6fe; background:#f5f3ff; border-radius:16px; padding:14px; cursor:${advancedDisabled ? "not-allowed" : "pointer"}; opacity:${advancedDisabled ? "0.65" : "1"}; text-align:left; color:#6d28d9;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <div style="font-size:16px; font-weight:900;">Advanced</div>
                    ${renderStatusBadge(levelStatus.advanced, jumlahAdvanced)}
                </div>
                ${renderProgress(advancedData)}
                <div style="margin-top:4px; font-size:11px; font-weight:700; color:#94a3b8;">
                    ${jumlahAdvanced} soal tersedia
                </div>
            </button>
        </div>
    </div>
`;
        }
export function mulaiLatihan(level) {

    latihanState.level = level;

    latihanState.soalAktif =
        latihanState.semuaSoal
            .filter(row =>
                String(row[1] || "")
                    .toLowerCase()
                    .trim() === level
            );
    
    latihanState.soalAktif = acakArray(latihanState.soalAktif);
preloadMediaLatihan();

latihanState.index = 0;
latihanState.skor = 0;
latihanState.benar = 0;
latihanState.salah = 0;

if (!latihanState.soalAktif.length) {
    tampilkanErrorLatihanKoneksi();
    return;
}

renderSoalLatihan();
}

function acakArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

function acakPilihanLatihan(soal) {
    const jawabanBenar = String(soal[8] || "").toUpperCase().trim();

    const pilihan = [
        { hurufAsli: "A", teks: soal[4] || "" },
        { hurufAsli: "B", teks: soal[5] || "" },
        { hurufAsli: "C", teks: soal[6] || "" },
        { hurufAsli: "D", teks: soal[7] || "" }
    ];

    return acakArray(pilihan).map((item, index) => ({
        labelTampil: ["A", "B", "C", "D"][index],
        hurufAsli: item.hurufAsli,
        teks: item.teks,
        benar: item.hurufAsli === jawabanBenar
    }));
}

export function renderSoalLatihan() {
    const modal = document.getElementById("mms-modal-latihan");
    if (!modal) return;

    const soal = latihanState.soalAktif[latihanState.index];

    if (!soal) {
    simpanHasilLatihan();

    const total = latihanState.benar + latihanState.salah;
    const akurasi = total ? Math.round((latihanState.benar / total) * 100) : 0;
    const bolehLanjut = akurasi >= 60;

    const levelBerikutnya =
    latihanState.level === "basic" ? "intermediate" :
    latihanState.level === "intermediate" ? "advanced" :
    null;

    const levelBerikutnyaAdaSoal =
    levelBerikutnya &&
    latihanState.semuaSoal.some(
        row => String(row[1] || "").toLowerCase().trim() === levelBerikutnya
    );

    const bisaLanjutLevel = bolehLanjut && levelBerikutnyaAdaSoal;

    let badge = "Keep Learning";
    let warna = "#ef4444";
    let icon = "fa-seedling";
    let pesanHasil = "Pertahankan progresmu.";

    if (akurasi >= 100) {
        badge = "Perfect!";
        warna = "#22c55e";
        icon = "fa-crown";
    } else if (akurasi >= 80) {
        badge = "Excellent";
        warna = "#10b981";
        icon = "fa-trophy";
    } else if (akurasi >= 60) {
        badge = "Good Job";
        warna = "#f59e0b";
        icon = "fa-star";
    } else if (akurasi >= 40) {
        badge = "Belajar Lagi";
        warna = "#ef4444";
        icon = "fa-book-open-reader";
        pesanHasil = "Coba ulangi level ini agar lebih paham.";
    } else {
        badge = "Belajar Lagi";
        warna = "#ef4444";
        icon = "fa-book-open-reader";
        pesanHasil = "Coba ulangi level ini dari awal.";
    }

    modal.innerHTML = `
        <div style="width:min(520px,100%); background:#ffffff; border-radius:24px; padding:26px; margin:24px 0; box-shadow:0 18px 45px rgba(15,23,42,0.28); text-align:center;">
            <div style="width:78px; height:78px; border-radius:24px; background:${warna}; color:#ffffff; display:flex; align-items:center; justify-content:center; font-size:34px; margin:0 auto 16px auto;">
                <i class="fa-solid ${icon}"></i>
            </div>

            <div style="font-size:26px; font-weight:900; color:#0f172a; margin-bottom:6px;">
                Latihan Selesai
            </div>

            <div style="font-size:15px; font-weight:800; color:${warna}; margin-bottom:18px;">
                ${badge}
            </div>

            <div style="font-size:13px; font-weight:700; color:#64748b; margin-bottom:18px;">
                ${pesanHasil}
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:18px;">
                <div style="background:#f8fafc; border-radius:16px; padding:14px;">
                    <div style="font-size:12px; font-weight:800; color:#64748b;">Skor</div>
                    <div style="font-size:24px; font-weight:900; color:#0f172a;">${latihanState.skor}</div>
                </div>

                <div style="background:#f8fafc; border-radius:16px; padding:14px;">
                    <div style="font-size:12px; font-weight:800; color:#64748b;">Akurasi</div>
                    <div style="font-size:24px; font-weight:900; color:${warna};">${akurasi}%</div>
                </div>

                <div style="background:#dcfce7; border-radius:16px; padding:14px;">
                    <div style="font-size:12px; font-weight:800; color:#166534;">Benar</div>
                    <div style="font-size:24px; font-weight:900; color:#166534;">${latihanState.benar}</div>
                </div>

                <div style="background:#fee2e2; border-radius:16px; padding:14px;">
                    <div style="font-size:12px; font-weight:800; color:#991b1b;">Salah</div>
                    <div style="font-size:24px; font-weight:900; color:#991b1b;">${latihanState.salah}</div>
                </div>
            </div>

            <button onclick="${bisaLanjutLevel ? `mulaiLatihan('${levelBerikutnya}')` : `mulaiLatihan('${latihanState.level}')`}" style="width:100%; border:none; border-radius:16px; padding:15px; background:#f59e0b; color:white; font-weight:900; cursor:pointer;">
               ${bisaLanjutLevel ? "Lanjut ke Level Berikutnya" : "Ulangi Level"}
            </button>

            <button onclick="bukaLatihanMenu()" style="width:100%; margin-top:10px; border:2px solid #f59e0b; border-radius:16px; padding:15px; background:#fff7ed; color:#92400e; font-weight:900; cursor:pointer;">
             Kembali ke Menu Latihan
            </button>
        </div>
    `;

    return;
}

    const pertanyaan = soal[3] || "";
    const pilihanA = soal[4] || "";
    const pilihanB = soal[5] || "";
    const pilihanC = soal[6] || "";
    const pilihanD = soal[7] || "";
    const pembahasan = soal[9] || "";
    const mediaType = (soal[10] || "").toLowerCase().trim();
    const mediaUrl = (soal[12] || soal[11] || "").trim();
    const pilihanAcak = acakPilihanLatihan(soal);
    const kategori = (soal[2] || "").trim();

   
let mediaHTML = "";

if (mediaType === "image" && mediaUrl) {
    mediaHTML = `
        <img src="${mediaUrl}" style="width:100%; max-height:260px; object-fit:contain; border-radius:16px; margin-bottom:18px; background:#f8fafc;">
    `;
}

if (mediaType === "audio" && mediaUrl) {
    mediaHTML = `
        <audio controls style="width:100%; margin-bottom:18px;">
            <source src="${mediaUrl}">
        </audio>
    `;
}

if (mediaType === "video" && mediaUrl) {
    mediaHTML = `
        <video controls style="width:100%; max-height:300px; border-radius:16px; margin-bottom:18px; background:#000;">
            <source src="${mediaUrl}">
        </video>
    `;
}

 const kategoriHTML = kategori ? `
    <div style="text-align:center; margin-bottom:12px;">
        <div style="display:inline-flex; align-items:center; gap:6px; background:#fff7ed; color:#92400e; padding:6px 14px; border-radius:999px; font-size:12px; font-weight:800;">
            📚 ${escapeHTML(kategori)}
        </div>
    </div>
` : "";


    modal.innerHTML = `
        <div style="width:min(640px,100%); background:#ffffff; border-radius:22px; padding:24px; margin:24px 0; box-shadow:0 18px 45px rgba(15,23,42,0.28); box-sizing:border-box;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
                <div>
                    <div style="font-size:13px; font-weight:800; color:#f59e0b;">
                        Soal ${latihanState.index + 1} dari ${latihanState.soalAktif.length}
                    </div>
                    <div style="font-size:22px; font-weight:900; color:#0f172a;">Latihan ${latihanState.level}</div>
                </div>
                <button onclick="keluarLatihanDenganKonfirmasi()" style="width:40px; height:40px; border:none; border-radius:50%; background:#f1f5f9; color:#64748b; font-size:18px; cursor:pointer;">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div style="height:10px; background:#f1f5f9; border-radius:999px; overflow:hidden; margin-bottom:20px;">
                <div style="height:100%; width:${((latihanState.index + 1) / latihanState.soalAktif.length) * 100}%; background:#f59e0b;"></div>
            </div>

            ${kategoriHTML}
${mediaHTML}

<div style="
    background:#f1f5f9;
    border:2px solid #e2e8f0;
    border-radius:18px;
    padding:16px;
    margin-bottom:18px;
">
    <div style="
        font-size:11px;
        font-weight:900;
        color:#f59e0b;
        text-transform:uppercase;
        letter-spacing:.04em;
        margin-bottom:8px;">
        Pertanyaan
    </div>

    <div style="
        font-size:20px;
        font-weight:900;
        color:#0f172a;
        line-height:1.35;">
        ${escapeHTML(pertanyaan)}
    </div>
</div>

<div id="mms-latihan-options" style="display:grid; gap:10px;">
    ${pilihanAcak.map(item => `
        <button
            data-benar="${item.benar ? "true" : "false"}"
            data-label="${item.labelTampil}"
            onclick="cekJawabanLatihan(this)"
            style="text-align:left; padding:14px; border:2px solid #e2e8f0; border-radius:14px; background:white; font-weight:800; cursor:pointer;">
            ${item.labelTampil}. ${escapeHTML(item.teks)}
        </button>
    `).join("")}
</div>

<div id="mms-latihan-feedback" style="margin-top:14px;"></div>
        </div>
    `;
}

export function tutupLatihanMenu() {
    const modal = document.getElementById("mms-modal-latihan");
    if (modal) modal.style.display = "none";
}

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

export function cekJawabanLatihan(button) {
    const soal = latihanState.soalAktif[latihanState.index];
    if (!soal) return;

    const pembahasan = soal[9] || "-";
    const benar = button.dataset.benar === "true";

    document.querySelectorAll("#mms-latihan-options button").forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = "default";

        if (btn.dataset.benar === "true") {
            btn.style.borderColor = "#22c55e";
            btn.style.background = "#dcfce7";
            btn.style.color = "#166534";
        }

        if (btn === button && !benar) {
            btn.style.borderColor = "#ef4444";
            btn.style.background = "#fee2e2";
            btn.style.color = "#991b1b";
        }
    });

    if (benar) {
        latihanState.skor += 10;
        latihanState.benar += 1;
    } else {
        latihanState.salah += 1;
    }

    const feedback = document.getElementById("mms-latihan-feedback");
    if (feedback) {
     feedback.innerHTML = `
    <div style="border-radius:16px; padding:16px; background:${benar ? "#dcfce7" : "#fee2e2"}; border:2px solid ${benar ? "#22c55e" : "#ef4444"};">
        <div style="font-size:18px; font-weight:900; color:${benar ? "#166534" : "#991b1b"}; margin-bottom:8px;">
            ${benar ? "✅ Benar!" : "❌ Salah Blok!"}
        </div>

        <div style="font-size:13px; font-weight:700; color:#334155; line-height:1.45;">
            ${escapeHTML(pembahasan)}
        </div>

        <button onclick="lanjutSoalLatihan()" style="width:100%; margin-top:12px; border:none; border-radius:14px; padding:13px; background:${benar ? "#22c55e" : "#ef4444"}; color:white; font-weight:900; cursor:pointer;">
            Lanjut
        </button>
    </div>
`;
    }
}

export function lanjutSoalLatihan() {
    latihanState.index += 1;
    renderSoalLatihan();
}


function preloadMediaLatihan() {
    latihanState.soalAktif.forEach(soal => {
        const mediaType = (soal[10] || "").toLowerCase().trim();
        const mediaUrl = (soal[12] || soal[11] || "").trim();

        if (mediaType === "image" && mediaUrl) {
            const img = new Image();
            img.src = mediaUrl;
        }
    });
}

export function keluarLatihanDenganKonfirmasi() {
    const sudahSelesai = latihanState.index >= latihanState.soalAktif.length;

    if (sudahSelesai) {
        resetLatihan();
        tutupLatihanMenu();
        return;
    }

    tampilkanKonfirmasiKeluarLatihan();
}

export function tampilkanKonfirmasiKeluarLatihan() {
    let modal = document.getElementById("mms-modal-konfirmasi-latihan");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "mms-modal-konfirmasi-latihan";
        modal.style.cssText = "position:fixed; inset:0; background:rgba(15,23,42,0.35); z-index:12000; display:none; align-items:center; justify-content:center; padding:18px; box-sizing:border-box;";
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div style="width:min(420px,100%); background:#ffffff; border-radius:22px; padding:22px; box-shadow:0 18px 45px rgba(15,23,42,0.35); box-sizing:border-box;">
            <div style="width:54px; height:54px; border-radius:16px; background:#fff7ed; color:#f59e0b; display:flex; align-items:center; justify-content:center; font-size:24px; margin-bottom:14px;">
                <i class="fa-solid fa-triangle-exclamation"></i>
            </div>

            <div style="font-size:22px; font-weight:900; color:#0f172a; margin-bottom:8px;">
                Keluar dari latihan?
            </div>

            <div style="font-size:14px; font-weight:700; color:#64748b; line-height:1.5; margin-bottom:18px;">
                Progress latihan akan diulang dari awal.
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <button onclick="tutupKonfirmasiKeluarLatihan()" style="border:2px solid #e2e8f0; background:#ffffff; color:#334155; border-radius:14px; padding:13px; font-weight:900; cursor:pointer;">
                    Batal
                </button>

                <button onclick="konfirmasiKeluarLatihanYa()" style="border:none; background:#ef4444; color:#ffffff; border-radius:14px; padding:13px; font-weight:900; cursor:pointer;">
                    Keluar
                </button>
            </div>
        </div>
    `;

    modal.style.display = "flex";
}

export function tutupKonfirmasiKeluarLatihan() {
    const modal = document.getElementById("mms-modal-konfirmasi-latihan");
    if (modal) modal.style.display = "none";
}

export function konfirmasiKeluarLatihanYa() {
    resetLatihan();
    tutupKonfirmasiKeluarLatihan();
    bukaLatihanMenu();
}

function resetLatihan() {
    latihanState.soalAktif = [];
    latihanState.level = "";
    latihanState.index = 0;
    latihanState.skor = 0;
    latihanState.benar = 0;
    latihanState.salah = 0;
}

function simpanHasilLatihan() {

    const totalSoal = latihanState.soalAktif.length;

    const sudahSelesai = latihanState.index >= totalSoal;

    if (!sudahSelesai || totalSoal === 0) return;


    const total = latihanState.benar + latihanState.salah;
    const akurasi = total ? Math.round((latihanState.benar / total) * 100) : 0;

    const hasil = {
        level: latihanState.level,
        skor: latihanState.skor,
        benar: latihanState.benar,
        salah: latihanState.salah,
        akurasi: akurasi,
        waktu: new Date().toISOString()
    };

    const key = `mms_latihan_hasil_${latihanState.level}`;
    const hasilLama = JSON.parse(localStorage.getItem(key) || "null");

    const hasilTerbaik =
    !hasilLama ||
    hasil.akurasi > hasilLama.akurasi ||
    (hasil.akurasi === hasilLama.akurasi && hasil.skor > hasilLama.skor)
        ? hasil
        : hasilLama;

    const achievementSebelum = getAchievements();

    localStorage.setItem(key, JSON.stringify(hasilTerbaik));

    const achievementSesudah = getAchievements();

    achievementSesudah.forEach(id => {
    if (!achievementSebelum.includes(id)) {
        tampilAchievementToast(id);
    }
});

    updateDailyStreakLatihan();
}

function hitungXPPlayerLatihan() {
    const levels = ["basic", "intermediate", "advanced"];

    const totalXP = levels.reduce((total, level) => {
        const data = JSON.parse(localStorage.getItem(`mms_latihan_hasil_${level}`) || "null");
        return total + (data?.skor || 0);
    }, 0);

    const xpPerLevel = 100;
    const playerLevel = Math.floor(totalXP / xpPerLevel) + 1;
    const xpDalamLevel = totalXP % xpPerLevel;
    const xpProgress = Math.round((xpDalamLevel / xpPerLevel) * 100);
    const xpSisa = xpPerLevel - xpDalamLevel;

    return {
        totalXP,
        playerLevel,
        xpProgress,
        xpSisa
    };
}

function getPlayerRank(level) {
    if (level >= 20) return "👑 English Master";
    if (level >= 15) return "🏆 Champion";
    if (level >= 10) return "🔥 Advanced Learner";
    if (level >= 5) return "⭐ Active Learner";
    return "🌱 Rookie Learner";
}

function getLevelStatus() {
    const basic =
        JSON.parse(localStorage.getItem("mms_latihan_hasil_basic") || "null");

    const intermediate =
        JSON.parse(localStorage.getItem("mms_latihan_hasil_intermediate") || "null");

    const advanced =
        JSON.parse(localStorage.getItem("mms_latihan_hasil_advanced") || "null");

    return {
        basic:
            basic?.akurasi >= 80
                ? "completed"
                : "open",

        intermediate:
            intermediate?.akurasi >= 80
                ? "completed"
                : (basic?.akurasi >= 80
                    ? "open"
                    : "locked"),

        advanced:
            advanced?.akurasi >= 80
                ? "completed"
                : (intermediate?.akurasi >= 80
                    ? "open"
                    : "locked")
    };
}

function renderStatusBadge(status, jumlahSoal) {
    if (jumlahSoal === 0) {
        return `<span style="font-size:11px; font-weight:900; color:#94a3b8;">📚 Soal Belum Ditambahkan</span>`;
    }

    if (status === "completed") {
        return `<span style="font-size:11px; font-weight:900; color:#16a34a;">✔ COMPLETED</span>`;
    }

    if (status === "locked") {
        return `<span style="font-size:11px; font-weight:900; color:#94a3b8;">🔒 LOCKED</span>`;
    }

    return `<span style="font-size:11px; font-weight:900; color:#2563eb;">▶ Mulai</span>`;
}


function getAchievements() {
    const achievements = [];

    const basic = JSON.parse(localStorage.getItem("mms_latihan_hasil_basic") || "null");
    const intermediate = JSON.parse(localStorage.getItem("mms_latihan_hasil_intermediate") || "null");
    const advanced = JSON.parse(localStorage.getItem("mms_latihan_hasil_advanced") || "null");

    if (basic?.akurasi >= 50) achievements.push("first_level");
if (basic?.akurasi >= 70) achievements.push("basic_champion");
if (basic?.akurasi === 100) achievements.push("perfect_basic");

if (intermediate?.akurasi >= 50) achievements.push("grammar_junior");
if (intermediate?.akurasi >= 70) achievements.push("grammar_expert");
if (intermediate?.akurasi === 100) achievements.push("grammar_master");

if (advanced?.akurasi >= 50) achievements.push("english_learner");
if (advanced?.akurasi >= 70) achievements.push("english_champion");
if (advanced?.akurasi === 100) achievements.push("english_master");

    return achievements;
}

if (!document.getElementById("mms-achievement-toast-style")) {
    const style = document.createElement("style");
    style.id = "mms-achievement-toast-style";
    style.innerHTML = `
        @keyframes mmsAchievementPop {
            0% { opacity:0; transform:translate(-50%, -50%) scale(.82); }
            65% { opacity:1; transform:translate(-50%, -50%) scale(1.08); }
            100% { opacity:1; transform:translate(-50%, -50%) scale(1); }
        }

        @keyframes mmsConfettiFall {
            0% { transform:translateY(-20px) rotate(0deg); opacity:1; }
            100% { transform:translateY(110px) rotate(220deg); opacity:0; }
        }
    `;
    document.head.appendChild(style);
}

function tampilAchievementToast(achievementId) {
    const achievementMap = {
        first_level: "First Level",
        perfect_basic: "Perfect Basic",
        grammar_master: "Grammar Master",
        english_champion: "English Champion"
    };

    const title = achievementMap[achievementId] || "Achievement Baru";

    const oldToast = document.getElementById("mms-achievement-toast");
    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");
    toast.id = "mms-achievement-toast";

    toast.style.cssText = `
        position:fixed;
        left:50%;
        top:50%;
        transform:translate(-50%, -50%);
        z-index:13000;
        background:#ffffff;
        border:2px solid #f59e0b;
        border-radius:22px;
        padding:22px 26px;
        box-shadow:0 22px 60px rgba(15,23,42,0.35);
        font-weight:900;
        color:#0f172a;
        text-align:center;
        min-width:260px;
        animation:mmsAchievementPop .35s cubic-bezier(.2,.9,.25,1.25);
    `;

    toast.innerHTML = `
        <div style="position:absolute; inset:0; pointer-events:none; overflow:hidden; border-radius:22px;">
            ${["#f59e0b","#22c55e","#3b82f6","#ef4444","#a855f7","#14b8a6"].map((color, i) => `
                <span style="
                    position:absolute;
                    left:${15 + i * 13}%;
                    top:8px;
                    width:7px;
                    height:12px;
                    background:${color};
                    border-radius:2px;
                    animation:mmsConfettiFall ${0.9 + i * 0.08}s ease-out forwards;
                "></span>
            `).join("")}
        </div>

        <div style="font-size:30px; margin-bottom:6px;">🏆</div>
        <div style="font-size:13px; color:#f59e0b;">Achievement Unlocked!</div>
        <div style="font-size:18px; margin-top:4px;">${title}</div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3600);
}

window.bukaAchievementDetail = function () {
    const unlocked = getAchievements();

    const items = [
        { id: "first_level", label: "First Level", desc: "Selesaikan level pertama." },
        { id: "perfect_basic", label: "Perfect Basic", desc: "Selesaikan Basic dengan akurasi 100%." },
        { id: "grammar_master", label: "Grammar Master", desc: "Selesaikan Intermediate." },
        { id: "english_champion", label: "English Champion", desc: "Selesaikan Advanced." }
    ];

    const html = items.map(item => {
        const done = unlocked.includes(item.id);

        return `
            <div style="padding:12px; border-radius:14px; background:${done ? "#dcfce7" : "#f8fafc"}; border:1px solid ${done ? "#22c55e" : "#e2e8f0"}; margin-bottom:8px;">
                <div style="font-size:13px; font-weight:900; color:${done ? "#166534" : "#64748b"};">
                    ${done ? "✅" : "🔒"} ${item.label}
                </div>
                <div style="margin-top:4px; font-size:11px; font-weight:700; color:#64748b;">
                    ${item.desc}
                </div>
            </div>
        `;
    }).join("");

    const oldPopup = document.getElementById("mms-achievement-popup");
if (oldPopup) oldPopup.remove();

const popup = document.createElement("div");
popup.id = "mms-achievement-popup";
popup.style.cssText = `
    position:fixed;
    inset:0;
    z-index:12000;
    background:rgba(15,23,42,0.55);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:18px;
    box-sizing:border-box;
`;

popup.innerHTML = `
    <div style="width:min(420px,100%); background:white; border-radius:22px; padding:22px; box-shadow:0 20px 50px rgba(15,23,42,0.35);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <div>
                <div style="font-size:22px; font-weight:900; color:#0f172a;">Achievement</div>
                <div style="font-size:12px; font-weight:800; color:#64748b;">${unlocked.length}/4 terbuka</div>
            </div>

            <button onclick="document.getElementById('mms-achievement-popup')?.remove()" style="width:38px; height:38px; border:none; border-radius:50%; background:#f1f5f9; color:#64748b; font-size:18px; cursor:pointer;">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>

        ${html}
    </div>
`;

document.body.appendChild(popup);
};


function getStatistikGlobalLatihan() {
    const levels = ["basic", "intermediate", "advanced"];

    const dataLevels = levels
        .map(level => JSON.parse(localStorage.getItem(`mms_latihan_hasil_${level}`) || "null"))
        .filter(Boolean);

    const levelSelesai = dataLevels.length;
    const soalDijawab = dataLevels.reduce((sum, data) => sum + (data.benar || 0) + (data.salah || 0), 0);
    const jawabanBenar = dataLevels.reduce((sum, data) => sum + (data.benar || 0), 0);
    const akurasiTotal = soalDijawab ? Math.round((jawabanBenar / soalDijawab) * 100) : 0;

    return { levelSelesai, soalDijawab, jawabanBenar, akurasiTotal };
}

function updateDailyStreakLatihan() {
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = localStorage.getItem("mms_latihan_last_date");
    let streak = Number(localStorage.getItem("mms_latihan_streak") || 0);

    if (lastDate === today) {
        return streak || 1;
    }

    if (lastDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayText = yesterday.toISOString().slice(0, 10);

        streak = lastDate === yesterdayText ? streak + 1 : 1;
    } else {
        streak = 1;
    }

    localStorage.setItem("mms_latihan_last_date", today);
    localStorage.setItem("mms_latihan_streak", streak);

    return streak;
}

function getDailyStreakLatihan() {
    return Number(localStorage.getItem("mms_latihan_streak") || 0);
}
