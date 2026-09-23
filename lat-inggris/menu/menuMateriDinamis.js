import { MATERI_BAB_CONFIG } from "./materiBabConfig.js";
import { MATERI_CONTENT } from "../materi/materiContentConfig.js";

window.MATERI_BAB_CONFIG = MATERI_BAB_CONFIG;
window.MATERI_CONTENT = MATERI_CONTENT;

let mmsMateriDbOverlayLoaded = false;
let mmsMateriDbOverlayLoading = false;

function safeVideoUrl(url) {
    url = String(url || "").trim();
    if (!url) return "";
    if (/^https?:\/\//i.test(url) || url.startsWith("/") || url.startsWith("lat-inggris/")) return url;
    return "";
}

function normalizeVideoType(type, url = "") {
    const value = String(type || "none").toLowerCase();
    if (["youtube", "embed", "url", "upload", "local", "none"].includes(value)) return value;
    return /\.(mp4|webm|mov)$/i.test(String(url || "")) ? "local" : "none";
}

async function loadMateriDbOverlayOnce() {
    if (mmsMateriDbOverlayLoaded || mmsMateriDbOverlayLoading) return;
    mmsMateriDbOverlayLoading = true;
    try {
        const response = await fetch("https://rw6selor.org/common/api/english_public_materi.php?limit=500");
        const payload = await response.json();
        const rows = Array.isArray(payload.data) ? payload.data : [];
        const validItems = new Map();
        MATERI_BAB_CONFIG.forEach(bab => (bab.items || []).forEach(item => validItems.set(item.id, item)));

        rows.forEach(row => {
            const key = row.materi_key || "";
            if (!validItems.has(key)) return;
            const item = validItems.get(key);
            const videoUrl = safeVideoUrl(row.video_url || "");
            if (videoUrl) {
                const video = {
                    type: normalizeVideoType(row.video_type, videoUrl),
                    url: videoUrl,
                    title: row.title || item.label || "Video Penjelasan"
                };
                item.video = video;
                if (MATERI_CONTENT[key]) {
                    MATERI_CONTENT[key].video = video;
                }
            }
            if (MATERI_CONTENT[key]) {
                if (row.description) MATERI_CONTENT[key].description = row.description;
                if (row.rumus) MATERI_CONTENT[key].formula = row.rumus;
                if (Array.isArray(row.notes) && row.notes.length) MATERI_CONTENT[key].notes = row.notes;
                if (Array.isArray(row.patterns) && row.patterns.length) MATERI_CONTENT[key].patterns = row.patterns;
                if (Array.isArray(row.quiz) && row.quiz.length) MATERI_CONTENT[key].quiz = row.quiz;
            }
        });
        mmsMateriDbOverlayLoaded = true;
    } catch (error) {
        console.warn("Overlay materi dari DB gagal dimuat, memakai config lokal.", error);
    } finally {
        mmsMateriDbOverlayLoading = false;
    }
}

function renderMateriVideo(video) {
    const url = safeVideoUrl(video?.url);
    const type = normalizeVideoType(video?.type, url);
    if (!url || type === "none") return "";

    if (type === "youtube" || type === "embed") {
        return `
            <div class="mms-video-inline">
                <iframe src="${url}" loading="lazy" allowfullscreen></iframe>
            </div>
        `;
    }

    if (type === "url") {
        return `
            <div class="mms-video-trigger" onclick="window.open('${encodeURIComponent(url)}'.replaceAll('%2F','/').replaceAll('%3A',':'), '_blank', 'noopener')">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                <div class="mms-video-trigger-text">
                    <strong>${video?.title || "Video Penjelasan"}</strong>
                    <span>Buka video materi</span>
                </div>
            </div>
        `;
    }

    return `
        <div class="mms-video-inline">
            <video controls src="${url}"></video>
        </div>
    `;
}

function getTotalLearningProgress() {
    const babConfig = window.MATERI_BAB_CONFIG || MATERI_BAB_CONFIG || [];

    const allItems = babConfig.flatMap(bab => bab.items || []);
    const total = allItems.length;

    const selesai = allItems.filter(item => {
        const id = typeof item === "string" ? item : item.id;
        return localStorage.getItem(`mms_materi_quiz_${id}`);
    }).length;

    return {
        totalBab: babConfig.length,
        total,
        selesai,
        percent: total ? Math.round((selesai / total) * 100) : 0
    };
}

function scrollPageToAbsoluteTop() {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    });

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const materiBody = document.getElementById("materi-body");
    if (materiBody) {
        materiBody.scrollTop = 0;
    }
}

export function renderMenuMateriDinamis() {
    const materiBody = document.getElementById("materi-body");
    if (!materiBody) return;

    if (!mmsMateriDbOverlayLoaded && !mmsMateriDbOverlayLoading) {
        loadMateriDbOverlayOnce().then(() => {
            if (mmsMateriDbOverlayLoaded) renderMenuMateriDinamis();
        });
    }

    const totalProgress = getTotalLearningProgress();

    const resumeBab = getCurrentBabToResume() || MATERI_BAB_CONFIG[0];
    const resumeProgress = getBabProgress(resumeBab);
    const achievements = getAchievements();
    const levelData = getUserLevel();
    const streakData = getStudyStreak();
    const dailyMission = getDailyMission();

    const resumeCardHtml = hasStartedLearning() ? `
    <div class="mms-resume-card" onclick="bukaResumeMateri()">
        <div class="mms-resume-info">
            <span>Lanjut Belajar</span>
            <h3>${resumeBab.title}</h3>
            <p>${resumeProgress.selesai}/${resumeProgress.total} materi selesai</p>
        </div>

        <i class="fa-solid fa-play"></i>
    </div>
` : "";


    materiBody.innerHTML = `
        <div class="mms-materi-page">
            <div class="mms-materi-header">
                <button class="mms-materi-back-mini" onclick="kembaliKeDashboard()">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>

                <div>
                    <h2>Ruang Belajar Mandiri</h2>
                   
                </div>
            </div>


${resumeCardHtml}

<div class="mms-learning-flow">

    <div id="mms-learning-hud" class="mms-learning-summary-card">
    <div class="mms-summary-top">

    <div>
        <div class="mms-summary-label">Level Belajar</div>
        <h3>Level ${levelData.level}</h3>
        <p>${levelData.current}/${levelData.target} XP menuju level berikutnya</p>
    </div>

   <div class="mms-summary-badges">
    <div class="mms-level-streak-text">
        🔥 ${streakData.streak} Hari
    </div>

    ${
    dailyMission.claimed
        ? `<div class="mms-level-mission-text claimed">✅ Selesai</div>`
        : dailyMission.completed
            ? `<div class="mms-level-mission-text ready" onclick="claimDailyMissionReward()">🎁 Klaim +25 XP</div>`
            : `<div class="mms-level-mission-text">🎯 0/1</div>`
}
</div>

</div>



    <div class="mms-summary-xp">
        ${levelData.xp} XP
    </div>

    <div class="mms-level-progress">
        <div style="width:${levelData.current}%"></div>
    </div>

    <div class="mms-summary-divider"></div>

    <div class="mms-summary-bottom">
        <strong>${totalProgress.percent}%</strong>

        <span></span>

        <div>
            <h3>Progress Belajar</h3>
           <p>${totalProgress.selesai}/${totalProgress.total} materi selesai • ${totalProgress.totalBab} BAB</p>
        </div>
    </div>


    <div class="mms-total-progress-bar">
        <div style="width:${totalProgress.percent}%"></div>
    </div>
</div>



            <div id="mms-materi-dynamic-menu"></div>
</div>


            <button class="materi-body-back-btn" onclick="kembaliKeDashboard()">
                <i class="fa-solid fa-arrow-left"></i>
                Kembali ke Dashboard
            </button>
        </div>

<button class="mms-achievement-float-btn" onclick="openAchievementOverlay()">
    🏆
</button>

    `;

    const target = document.getElementById("mms-materi-dynamic-menu");


    const babConfig = window.MATERI_BAB_CONFIG || MATERI_BAB_CONFIG;

    target.innerHTML = babConfig.map((bab, babIndex) => {
    const babUnlocked = isBabUnlocked(babIndex);
        
    const progress = getBabProgress(bab);
    const statusText =
    progress.percent === 100
        ? "Selesai"
        : progress.percent > 0
            ? "Sedang Belajar"
            : "Belum Mulai";

    const statusClass =
    progress.percent === 100
        ? "complete"
        : progress.percent > 0
            ? "progress"
            : "empty";
    return `
       <div class="mms-learning-card ${!babUnlocked ? "mms-bab-locked" : ""}">
    <div class="mms-learning-header"
        ${babUnlocked
            ? `onclick="toggleBabMateri('${bab.id}')"`
            : `onclick="showLockedBabNotice()"`
        }
    >

                <div class="mms-learning-info">
                    <div class="mms-learning-title">
                        ${bab.title}
                    </div>

                    <div class="mms-learning-subtitle">
                        ${bab.level} • ${progress.selesai}/${progress.total} Selesai
                    </div>

                    <div class="mms-bab-progress-row">
    <div class="mms-bab-progress">
        <div style="width:${progress.percent}%"></div>
    </div>

    <span class="mms-bab-percent">
        ${progress.percent}%
    </span>
</div>



                </div>

                ${babUnlocked ? `
    <i class="fa-solid fa-chevron-down" style="color:#94a3b8;"></i>
` : `
    <div class="mms-bab-lock-badge">
        <i class="fa-solid fa-lock"></i>
        Terkunci
    </div>
`}
            </div>

            <div id="content-${bab.id}" class="mms-bab-content" style="display:none;">
                ${(bab.items || []).map((item, index) => {
                    const label = typeof item === "string" ? item : item.label;
                    const id = typeof item === "string" ? item : item.id;
                    const itemProgress = JSON.parse(localStorage.getItem(`mms_materi_quiz_${id}`) || "null");

                    const unlocked = babUnlocked && isMateriUnlocked(bab, index);

return `
    <button
        class="mms-materi-item ${!unlocked ? "locked" : ""}"
        ${unlocked
            ? `onclick="bukaDetailMateriDinamis('${encodeURIComponent(id)}', '${encodeURIComponent(label)}')"`
            : ""}
    >
                            <span>${label}</span>


    ${itemProgress ? `
    <span class="mms-item-progress">
        <i class="fa-solid fa-circle-check"></i>
        ${itemProgress.percent}%
    </span>
` : unlocked ? `
    <span class="mms-item-next">
        Lanjut
    </span>
` : `
    <span class="mms-item-lock">
        <i class="fa-solid fa-lock"></i>
    </span>
`}
                        </button>
                    `;
                }).join("")}
            </div>
        </div>
    `;
}).join("");

setTimeout(() => {
    autoOpenActiveBab();
    scrollPageToAbsoluteTop();
}, 80);

}


function getBabProgress(bab) {

    if (!bab || !Array.isArray(bab.items)) {

        return {

            total: 0,

            selesai: 0,

            percent: 0

        };

    }
    
    const total = (bab.items || []).length;

    const selesai = (bab.items || []).filter(item => {
        const id = typeof item === "string" ? item : item.id;
        return localStorage.getItem(`mms_materi_quiz_${id}`);
    }).length;

    return {
        total,
        selesai,
        percent: total ? Math.round((selesai / total) * 100) : 0
    };
}


window.renderMenuMateriDinamis = renderMenuMateriDinamis;

window.bukaMateriMenu = function () {
    const dashboard = document.getElementById("dashboard-menu");
    const materiBody = document.getElementById("materi-body");

    localStorage.setItem("mms_last_menu", "materi");

    if (dashboard) dashboard.style.display = "none";
    if (materiBody) materiBody.style.display = "block";

    renderMenuMateriDinamis();

    setTimeout(() => {
        if (typeof window.forceScrollTop === "function") {
            window.forceScrollTop();
        }
    }, 150);
};

window.togglePatternGroup = function (groupIndex) {
    document.querySelectorAll(".mms-pattern-group-content").forEach((el, i) => {
        el.style.display = i === groupIndex && el.style.display === "none" ? "block" : "none";
    });

    document.querySelectorAll(".mms-pattern-group-chip").forEach((chip, i) => {
        const groupEl = document.getElementById(`pattern-group-${i}`);
        const aktif = groupEl && groupEl.style.display === "block";

        chip.classList.toggle("mms-pattern-group-active", aktif);
    });

    document.querySelectorAll(".mms-pattern-detail-card").forEach(el => {
        el.style.display = "none";
    });

    document.querySelectorAll(".mms-pattern-chip").forEach(chip => {
        chip.classList.remove("mms-pattern-chip-active");
    });
};

window.togglePatternDetail = function (groupIndex, itemIndex) {
    document.querySelectorAll(".mms-pattern-detail-card").forEach(el => {
        el.style.display = "none";
    });

    document.querySelectorAll(".mms-pattern-chip").forEach(chip => {
        chip.classList.remove("mms-pattern-chip-active");
    });

    const detail = document.getElementById(`pattern-detail-${groupIndex}-${itemIndex}`);
    if (detail) detail.style.display = "block";

    const group = document.getElementById(`pattern-group-${groupIndex}`);
    const chips = group.querySelectorAll(".mms-pattern-chip");
    if (chips[itemIndex]) chips[itemIndex].classList.add("mms-pattern-chip-active");
};


window.kembaliKeDashboard = function () {
    const dashboard = document.getElementById("dashboard-menu");
    const materiBody = document.getElementById("materi-body");

    if (materiBody) materiBody.style.display = "none";
    if (dashboard) dashboard.style.display = "block";
};


window.bukaDetailMateriDinamis = function (idMateri, judulMateri) {

    idMateri = decodeURIComponent(idMateri);

    judulMateri = decodeURIComponent(judulMateri);

    window.mmsMateriAktifId = idMateri;

    localStorage.setItem("mms_last_opened_materi", idMateri);

    const materiBody = document.getElementById("materi-body");

    if (!materiBody) return;

    const materi = MATERI_CONTENT[idMateri];
    const materiItem = getMateriItemById(idMateri);

    const materiVideo = materi?.video || materiItem?.video || null;

    const materiProgress = JSON.parse(
    localStorage.getItem(`mms_materi_quiz_${idMateri}`) || "null"
);

const isMateriDone = materiProgress && materiProgress.percent >= 100;

materiBody.innerHTML = `
    <div class="mms-detail-loading">
        <i class="fa-solid fa-spinner"></i>
        <span>Membuka materi...</span>
    </div>
`;

setTimeout(() => {
    
    materiBody.innerHTML = `
        <div class="mms-materi-page">
            <div class="mms-materi-header">
                <button class="mms-materi-back-mini" onclick="renderMenuMateriDinamis()">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>

                <div>
                    <h2>${materi?.title || judulMateri}</h2>
                    <p>ID Materi: ${idMateri}</p>
                </div>
            </div>

            
            <div class="mms-materi-detail-card">
                <h3>${materi?.title || judulMateri}</h3>
                <div class="mms-lesson-intro">
    <div class="mms-lesson-intro-icon">
        <i class="fa-solid fa-lightbulb"></i>
    </div>

    <p>${materi?.description || "Konten materi belum tersedia."}</p>
</div>

                ${renderMateriVideo(materiVideo)}

                ${materi?.formula ? `
                    <div class="mms-formula-box">
                        ${materi.formula}
                    </div>
                ` : ""}

                ${materi?.notes?.length ? `
                    <div class="mms-notes-box">
                        <h4>Catatan Penting</h4>
                        ${materi.notes.map(note => `
                            <div class="mms-note-item">
                                <i class="fa-solid fa-circle-check"></i>
                                <span>${note}</span>
                            </div>
                        `).join("")}
                    </div>
                ` : ""}

                ${materi?.patterns?.length ? `
                    <div class="mms-pattern-section">
                        <h4>Pola Kalimat</h4>

                        <div class="mms-pattern-group-row">
                            ${materi.patterns.map((group, groupIndex) => `
                                <button class="mms-pattern-group-chip" onclick="togglePatternGroup(${groupIndex})">
                                    <i class="fa-solid ${group.group === "Verbal" ? "fa-pen" : "fa-user"}"></i>
                                    ${group.group}
                                </button>
                            `).join("")}
                        </div>

                        ${materi.patterns.map((group, groupIndex) => `
                            <div id="pattern-group-${groupIndex}" class="mms-pattern-group-content" style="display:none;">
                                <div class="mms-pattern-chip-row">
                                    ${(group.items || []).map((item, itemIndex) => `
                                        <button class="mms-pattern-chip" onclick="togglePatternDetail(${groupIndex}, ${itemIndex})">
                                            ${item.label}
                                        </button>
                                    `).join("")}
                                </div>

                                ${(group.items || []).map((item, itemIndex) => `
                                    <div id="pattern-detail-${groupIndex}-${itemIndex}" class="mms-pattern-detail-card" style="display:none;">
                                        <div class="mms-pattern-label">${item.label}</div>
                                        <div class="mms-pattern-formula">${item.formula}</div>

                                        ${item.examples?.length ? `
                                            <div class="mms-pattern-examples">
                                                <h5>Contoh Kalimat</h5>
                                                ${item.examples.map(sentence => `
                                                    <div class="mms-example-item">
                                                        <span>${sentence}</span>
                                                    </div>
                                                `).join("")}
                                            </div>
                                        ` : ""}
                                    </div>
                                `).join("")}
                            </div>
                        `).join("")}
                    </div>
                ` : ""}



                ${materi?.quiz?.length ? `
                    <div class="mms-mini-quiz">
                        <div class="mms-mini-quiz-head" onclick="toggleMiniQuiz()">
                            <div>
                                <h4>Mini Quiz</h4>
                                <p>Uji pemahaman singkat sebelum lanjut materi.</p>
                            </div>
                            <i class="fa-solid fa-chevron-down"></i>
                        </div>


<div class="mms-quiz-progress-wrap">
    <div class="mms-quiz-progress-info">
        <span>Progress Quiz</span>
        <strong id="mms-quiz-progress-text">0/${materi.quiz.length}</strong>
    </div>

    <div class="mms-quiz-progress-bar">
        <div id="mms-quiz-progress-fill"></div>
    </div>
</div>


<div id="mms-mini-quiz-content" class="mms-mini-quiz-content" style="display:none;">

    ${materi.quiz.map((q, index) => `

        <div class="mms-quiz-card">

            ${q.type ? `

                <div class="mms-quiz-type">

                    <i class="fa-solid ${q.type === "Verbal" ? "fa-pen" : "fa-user"}"></i>

                    ${q.type}

                </div>

            ` : ""}

            <div class="mms-quiz-question">

                <div class="mms-quiz-number">${index + 1}</div>

                <span>${q.question}</span>

            </div>

            <div class="mms-quiz-options">

                ${q.options.map(opt => `

                    <button

    data-answer="${String(q.answer).replace(/"/g, "&quot;")}"

    data-explanation="${String(q.explanation || "").replace(/"/g, "&quot;")}"

    onclick="cekMiniQuiz(this)"

>

                        ${opt}

                    </button>

                `).join("")}

            </div>

                                    <div class="mms-quiz-explanation" style="display:none;"></div>
                                </div>
                            `).join("")}

                            <div id="mms-mini-quiz-score" class="mms-mini-quiz-score" style="display:none;"></div>
                        </div>
                    </div>
                ` : ""}






            </div>
        </div>
    `;
}, 180);
            
};

window.toggleBabMateri = function (babId) {
    document.querySelectorAll(".mms-bab-content").forEach(el => {
        if (el.id !== `content-${babId}`) {
            el.style.display = "none";
        }
    });

    document.querySelectorAll(".mms-learning-card").forEach(card => {
        card.classList.remove("mms-learning-active");
    });

    const target = document.getElementById(`content-${babId}`);
    if (!target) return;

    const isOpen = target.style.display === "grid";
    target.style.display = isOpen ? "none" : "grid";

    if (!isOpen) {
        target.closest(".mms-learning-card")?.classList.add("mms-learning-active");
    }
};



window.bukaVideoMateri = function (url, type) {
    url = decodeURIComponent(url);
    url = safeVideoUrl(url);
    type = normalizeVideoType(type, url);
    if (!url) return;

    const popup = document.createElement("div");
    popup.className = "mms-video-popup";
    popup.innerHTML = `
        <div class="mms-video-popup-card">
            <button class="mms-video-close" onclick="this.closest('.mms-video-popup').remove()">
                <i class="fa-solid fa-xmark"></i>
            </button>

            ${type === "embed" || type === "youtube" ? `
                <iframe src="${url}" allowfullscreen></iframe>
            ` : `
                <video controls>
                    <source src="${url}">
                </video>
            `}
        </div>
    `;

    document.body.appendChild(popup);
};

window.toggleMiniQuiz = function () {
    const el = document.getElementById("mms-mini-quiz-content");
    if (!el) return;

    const isOpen = el.style.display === "block";
    el.style.display = isOpen ? "none" : "block";

    if (!isOpen) {
        setTimeout(() => {
            const firstCard = el.querySelector(".mms-quiz-card");

            if (firstCard) {
                firstCard.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        }, 180);
    }
};


window.mmsQuizSession = 0;

window.mmsQuizOverlayTimer = null;


window.cekMiniQuiz = function (btn) {

    const card = btn.closest(".mms-quiz-card");

    if (!card) return;

    const selected = btn.textContent.trim();

    const answer = btn.dataset.answer;

    const explanation = btn.dataset.explanation || "";

    const buttons = card.querySelectorAll(".mms-quiz-options button");

    buttons.forEach(b => {

        b.disabled = true;

    });

    card.classList.add("mms-quiz-answered");

    if (selected === answer) {

        btn.classList.add("correct");

        card.classList.add("mms-quiz-correct-card");

    } else {

        btn.classList.add("wrong");

        buttons.forEach(b => {

            if (b.textContent.trim() === answer) {

                b.classList.add("correct");

            }

        });

    }

    const explainBox = card.querySelector(".mms-quiz-explanation");

    if (explainBox) {

        explainBox.style.display = "block";

        explainBox.innerHTML = `

            <strong>${selected === answer ? "Benar." : "Belum tepat."}</strong>

            <span>${explanation}</span>

        `;

    }

    updateMiniQuizProgress();

    updateMiniQuizScore();

    const totalCards = document.querySelectorAll(".mms-quiz-card").length;

    const answeredCards = document.querySelectorAll(".mms-quiz-card.mms-quiz-answered").length;

    if (answeredCards === totalCards) {
    const sessionAtAnswer = window.mmsQuizSession;

    clearTimeout(window.mmsQuizOverlayTimer);

    window.mmsQuizOverlayTimer = setTimeout(() => {
        if (sessionAtAnswer !== window.mmsQuizSession) return;

        const stillAnswered = document.querySelectorAll(".mms-quiz-card.mms-quiz-answered").length;
        const stillTotal = document.querySelectorAll(".mms-quiz-card").length;

        if (stillAnswered === stillTotal && stillTotal > 0) {
            tampilkanOverlayHasilQuiz();
        }
    }, 2000);
}

simpanProgressMateriQuiz();


const nextCard = card.nextElementSibling;
const scoreBox = document.getElementById("mms-mini-quiz-score");

if (nextCard && nextCard.classList.contains("mms-quiz-card")) {
    setTimeout(() => {
        nextCard.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }, 350);
} else if (scoreBox && scoreBox.style.display === "block") {
    setTimeout(() => {
        scoreBox.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }, 50);
}

};


window.updateMiniQuizScore = function () {
    const cards = document.querySelectorAll(".mms-quiz-card");
    const answered = document.querySelectorAll(".mms-quiz-card.mms-quiz-answered");
    const correct = document.querySelectorAll(".mms-quiz-card.mms-quiz-correct-card");
    const scoreBox = document.getElementById("mms-mini-quiz-score");

    if (!scoreBox || answered.length !== cards.length) return;

    const score = correct.length;
    const total = cards.length;
    const percent = score / total;

    let badge = "Keep Learning";
    let icon = "fa-book-open";
    let message = "Pelajari lagi bagian pola kalimat di atas.";

    if (percent === 1) {
        badge = "Excellent";
        icon = "fa-trophy";
        message = "Mantap, semua benar.";
    } else if (percent >= 0.7) {
        badge = "Good Job";
        icon = "fa-medal";
        message = "Bagus, tinggal sedikit lagi.";
    }

    scoreBox.style.display = "block";
    scoreBox.innerHTML = `
        <div class="mms-score-badge">
            <i class="fa-solid ${icon}"></i>
            ${badge}
        </div>

        <div class="mms-score-title">Hasil Quiz</div>
        <div class="mms-score-number">${score}/${total}</div>
        <div class="mms-score-message">${message}</div>

        <button class="mms-reset-quiz-btn" onclick="resetMiniQuiz()">
            <i class="fa-solid fa-rotate-right"></i>
            Ulangi Quiz
        </button>

        <button class="mms-next-materi-btn" onclick="bukaMateriBerikutnya(window.mmsMateriAktifId)">
            <i class="fa-solid fa-arrow-right"></i>
            Lanjut Materi Berikutnya
        </button>
    `;
    if (percent === 1) {
    tampilkanQuizConfetti(3);
}
};

window.resetMiniQuiz = function () {

window.mmsQuizSession++;
clearTimeout(window.mmsQuizOverlayTimer);
window.mmsQuizOverlayTimer = null;
tutupQuizOverlay();

    document.querySelectorAll(".mms-quiz-card").forEach(card => {
        card.classList.remove(
            "mms-quiz-answered",
            "mms-quiz-correct-card"
        );

        card.querySelectorAll(".mms-quiz-options button").forEach(btn => {
            btn.disabled = false;
            btn.classList.remove("correct", "wrong");
        });

        const explanation = card.querySelector(".mms-quiz-explanation");
        if (explanation) {
            explanation.style.display = "none";
            explanation.innerHTML = "";
        }
    });

    const scoreBox = document.getElementById("mms-mini-quiz-score");
    if (scoreBox) {
        scoreBox.style.display = "none";
        scoreBox.innerHTML = "";
    }

    updateMiniQuizProgress();

    const firstCard = document.querySelector(".mms-quiz-card");
    if (firstCard) {
        firstCard.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
};

window.bukaMateriBerikutnya = function () {
    const currentId = window.mmsMateriAktifId;

    if (!currentId) {
        renderMenuMateriDinamis();
        return;
    }

    const babConfig = window.MATERI_BAB_CONFIG || MATERI_BAB_CONFIG;
    const allItems = babConfig.flatMap(bab => bab.items || []);

    const currentIndex = allItems.findIndex(item => item.id === currentId);

    if (currentIndex === -1) {
        renderMenuMateriDinamis();
        return;
    }

    const nextItem = allItems[currentIndex + 1];

    if (!nextItem) {
        renderMenuMateriDinamis();
        return;
    }

    bukaDetailMateriDinamis(
        encodeURIComponent(nextItem.id),
        encodeURIComponent(nextItem.label)
    );

    setTimeout(() => {
        const materiPage = document.querySelector(".mms-materi-page");

        if (materiPage) {
            materiPage.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, 350);
};

window.updateMiniQuizProgress = function () {
    const total = document.querySelectorAll(".mms-quiz-card").length;
    const answered = document.querySelectorAll(".mms-quiz-card.mms-quiz-answered").length;

    const text = document.getElementById("mms-quiz-progress-text");
    const fill = document.getElementById("mms-quiz-progress-fill");

    if (text) text.textContent = `${answered}/${total}`;
    if (fill) fill.style.width = total ? `${(answered / total) * 100}%` : "0%";
};

window.tampilkanQuizConfetti = function (repeat = 1) {
    let count = 0;

    const run = () => {
        const scoreBox = document.getElementById("mms-mini-quiz-score");
        if (!scoreBox) return;

        const box = document.createElement("div");
        box.className = "mms-confetti-box";

        box.innerHTML = Array.from({ length: 22 }).map(() => `
            <span style="
                --x:${Math.random() * 260 - 130}px;
                --y:${Math.random() * -170 - 30}px;
                --r:${Math.random() * 360}deg;
                --d:${Math.random() * .25}s;
            "></span>
        `).join("");

        scoreBox.appendChild(box);
        setTimeout(() => box.remove(), 1200);

        count++;
        if (count < repeat) setTimeout(run, 350);
    };

    run();
};

window.simpanProgressMateriQuiz = function () {
    const materiId = window.mmsMateriAktifId;
    if (!materiId) return;

    const total = document.querySelectorAll(".mms-quiz-card").length;
    const answered = document.querySelectorAll(".mms-quiz-card.mms-quiz-answered").length;
    const correct = document.querySelectorAll(".mms-quiz-card.mms-quiz-correct-card").length;

    if (answered !== total) return;

    const data = {
    materiId,
    total,
    correct,
    percent: Math.round((correct / total) * 100),
    finishedAt: new Date().toISOString()
};

localStorage.setItem(`mms_materi_quiz_${materiId}`, JSON.stringify(data));

checkAchievements();
addXPFromQuiz(data.percent);
updateStudyStreak();
updateDailyMission();



};



function isMateriUnlocked(bab, index) {

    if (index === 0) return true;

    const prevItem = bab.items[index - 1];
    const prevId = typeof prevItem === "string"
        ? prevItem
        : prevItem.id;

    const progress = JSON.parse(
        localStorage.getItem(`mms_materi_quiz_${prevId}`) || "null"
    );

    return progress && progress.percent >= 70;
}


window.autoOpenActiveBab = function () {
    const selectedBab = MATERI_BAB_CONFIG.find(bab => {
        const progress = getBabProgress(bab);
        return progress.percent < 100;
    });

    if (selectedBab) {
        toggleBabMateri(selectedBab.id);
    }
};

function getCurrentBabToResume() {
    return MATERI_BAB_CONFIG.find(bab => {
        const progress = getBabProgress(bab);
        return progress.percent < 100;
    }) || MATERI_BAB_CONFIG[0];
}

function getNextMateriToResume(bab) {
    return (bab.items || []).find((item, index) => {
        const id = typeof item === "string" ? item : item.id;
        const progress = localStorage.getItem(`mms_materi_quiz_${id}`);

        return !progress && isMateriUnlocked(bab, index);
    });
}

window.bukaResumeMateri = function () {
    const lastId = localStorage.getItem("mms_last_opened_materi");

    if (lastId) {
        const semuaMateri = MATERI_BAB_CONFIG.flatMap(bab => bab.items || []);
        const item = semuaMateri.find(item => {
            const id = typeof item === "string" ? item : item.id;
            return id === lastId;
        });

        if (item) {
            const id = typeof item === "string" ? item : item.id;
            const label = typeof item === "string" ? item : item.label;

            bukaDetailMateriDinamis(
                encodeURIComponent(id),
                encodeURIComponent(label)
            );
            return;
        }
    }

    const bab = getCurrentBabToResume();
    const item = getNextMateriToResume(bab);

    if (!item) {
        toggleBabMateri(bab.id);
        return;
    }

    const id = typeof item === "string" ? item : item.id;
    const label = typeof item === "string" ? item : item.label;

    bukaDetailMateriDinamis(
        encodeURIComponent(id),
        encodeURIComponent(label)
    );
};

window.getAchievements = function () {
    return JSON.parse(
        localStorage.getItem("mms_achievements") || "{}"
    );
};

window.saveAchievements = function (data) {
    localStorage.setItem(
        "mms_achievements",
        JSON.stringify(data)
    );
};

window.getTotalCompletedMateri = function () {
    let total = 0;

    MATERI_BAB_CONFIG.forEach(bab => {
        (bab.items || []).forEach(item => {
            const id = typeof item === "string" ? item : item.id;

            if (localStorage.getItem(`mms_materi_quiz_${id}`)) {
                total++;
            }
        });
    });

    return total;
};

window.checkAchievements = function () {
    const achievements = getAchievements();
    const newlyUnlocked = [];

    const completedMateri = getTotalCompletedMateri();
    const totalProgress = getTotalLearningProgress();
    const hasOpened = localStorage.getItem("mms_last_opened_materi") !== null;

    if ((completedMateri >= 1 || hasOpened) && !achievements.firstStep) {
        achievements.firstStep = true;
        newlyUnlocked.push("🌱 First Step");
        giveAchievementReward("firstStep", 25);
    }

    const currentXP = getUserLevel().xp;

if (currentXP >= 100 && !achievements.onFire) {
    achievements.onFire = true;
    newlyUnlocked.push("🔥 On Fire");
    giveAchievementReward("onFire", 50);
}

    if (completedMateri >= 3 && !achievements.explorer) {
        achievements.explorer = true;
        newlyUnlocked.push("📚 Grammar Explorer");
        giveAchievementReward("explorer", 100);
    }

    if (totalProgress.percent === 100 && !achievements.master) {
        achievements.master = true;
        newlyUnlocked.push("🏆 English Master");
        giveAchievementReward("master", 500);
    }

    saveAchievements(achievements);

    newlyUnlocked.forEach((name, index) => {
        setTimeout(() => {
            showAchievementToast(name, "Achievement Unlocked", "🏆");
        }, index * 500);
    });
};

window.getUserXP = function () {
    return Number(localStorage.getItem("mms_user_xp") || 0);
};

window.saveUserXP = function (xp) {
    localStorage.setItem("mms_user_xp", String(xp));
};

window.getUserLevel = function () {
    const xp = getUserXP();

    return {
        xp,
        level: Math.floor(xp / 100) + 1,
        current: xp % 100,
        target: 100
    };
};

window.addXPFromQuiz = function (percent) {
    const materiId = window.mmsMateriAktifId;
    const xpKey = `mms_xp_claimed_${materiId}`;

    if (localStorage.getItem(xpKey)) return;

    let gainedXP = 20;

    if (percent === 100) {
        gainedXP = 50;
    } else if (percent >= 70) {
        gainedXP = 35;
    }

    const oldXP = getUserXP();
    const oldLevel = Math.floor(oldXP / 100) + 1;

    const newXP = oldXP + gainedXP;
    const newLevel = Math.floor(newXP / 100) + 1;

    saveUserXP(newXP);
    localStorage.setItem(xpKey, "true");

    showAchievementToast(`+${gainedXP} XP`, "XP Bertambah", "⭐");

    if (newLevel > oldLevel) {
        setTimeout(() => {
            showAchievementToast(
                `Kamu naik ke Level ${newLevel}`,
                "Level Up!",
                "🚀"
            );
        }, 900);
    }
};

function hasStartedLearning() {
    return localStorage.getItem("mms_last_opened_materi") !== null
        || getTotalLearningProgress().selesai > 0;
}


function isBabUnlocked(babIndex) {
    const babConfig = window.MATERI_BAB_CONFIG || MATERI_BAB_CONFIG || [];

    const currentBab = babConfig[babIndex];

    // BAB 1 selalu terbuka
    if (babIndex === 0) return true;

    // Kalau BAB ini sudah punya progress, tetap terbuka
    const currentProgress = getBabProgress(currentBab);
    if (currentProgress.selesai > 0 || currentProgress.percent > 0) return true;

    // Kalau BAB sebelumnya selesai minimal 70%, BAB ini terbuka
    const prevBab = babConfig[babIndex - 1];
    const prevProgress = getBabProgress(prevBab);

    return prevProgress.percent >= 70;
}

window.showLockedBabNotice = function () {
    showAchievementToast(
        "Selesaikan BAB sebelumnya dulu",
        "Materi Terkunci",
        "🔒"
    );
};

window.getStudyStreak = function () {
    const data = JSON.parse(
        localStorage.getItem("mms_study_streak") || JSON.stringify({
            streak: 0,
            lastStudyDate: null
        })
    );

    if (!data.lastStudyDate) return data;

    const today = getTodayKey();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().slice(0, 10);

    if (data.lastStudyDate !== today && data.lastStudyDate !== yesterdayKey) {
        data.streak = 0;
        saveStudyStreak(data);
    }

    return data;
};

window.saveStudyStreak = function (data) {
    localStorage.setItem("mms_study_streak", JSON.stringify(data));
};

window.getTodayKey = function () {
    return new Date().toISOString().slice(0, 10);
};

window.updateStudyStreak = function () {
    const data = getStudyStreak();
    const today = getTodayKey();

    if (data.lastStudyDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().slice(0, 10);

    if (data.lastStudyDate === yesterdayKey) {
        data.streak += 1;
    } else {
        data.streak = 1;
    }

    data.lastStudyDate = today;
    saveStudyStreak(data);

    showAchievementToast(
        `${data.streak} hari berturut-turut`,
        "Streak Belajar",
        "🔥"
    );
};

window.openAchievementOverlay = function () {
    const achievements = getAchievements();
    const totalCompleted = getTotalCompletedMateri();
    const totalProgress = getTotalLearningProgress();
    const levelData = getUserLevel();

    const overlay = document.createElement("div");
    overlay.className = "mms-achievement-panel-overlay";

    overlay.innerHTML = `
        <div class="mms-achievement-panel">
            <div class="mms-achievement-panel-head">
                <h3>🏆 Achievement</h3>
                <button onclick="this.closest('.mms-achievement-panel-overlay').remove()">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div class="mms-achievement-row ${achievements.firstStep ? "unlocked" : "locked"}" onclick="focusAchievementItem(this)">
                <div class="mms-achievement-row-icon">🌱</div>
                <div class="mms-achievement-row-info">
                    <strong>First Step</strong>
                    <span>Selesaikan 1 materi</span>
                </div>
                <div class="mms-achievement-status">
                    ${achievements.firstStep ? "✓ Selesai" : "🔒 Terkunci"}
                </div>
            </div>

            <div class="mms-achievement-row ${achievements.onFire ? "unlocked" : "locked"}" onclick="focusAchievementItem(this)">
                <div class="mms-achievement-row-icon">🔥</div>
                <div class="mms-achievement-row-info">
                    <strong>On Fire</strong>
                    <span>Dapatkan minimal 100 XP</span>
                    <div class="mms-achievement-mini-progress">
                        <div style="width:${Math.min(levelData.xp, 100)}%"></div>
                    </div>
                    <small>${Math.min(levelData.xp, 100)}/100 XP</small>
                </div>
                <div class="mms-achievement-status">
                    ${achievements.onFire ? "✓ Selesai" : "🔒 Terkunci"}
                </div>
            </div>

            <div class="mms-achievement-row ${achievements.explorer ? "unlocked" : "locked"}" onclick="focusAchievementItem(this)">
                <div class="mms-achievement-row-icon">📚</div>
                <div class="mms-achievement-row-info">
                    <strong>Grammar Explorer</strong>
                    <span>Selesaikan 3 materi</span>
                    <div class="mms-achievement-mini-progress">
                        <div style="width:${Math.min((totalCompleted / 3) * 100, 100)}%"></div>
                    </div>
                    <small>${Math.min(totalCompleted, 3)}/3 materi</small>
                </div>
                <div class="mms-achievement-status">
                    ${achievements.explorer ? "✓ Selesai" : "🔒 Terkunci"}
                </div>
            </div>

            <div class="mms-achievement-row ${achievements.master ? "unlocked" : "locked"}" onclick="focusAchievementItem(this)">
                <div class="mms-achievement-row-icon">🏆</div>
                <div class="mms-achievement-row-info">
                    <strong>English Master</strong>
                    <span>Selesaikan semua materi</span>
                    <div class="mms-achievement-mini-progress">
                        <div style="width:${totalProgress.percent}%"></div>
                    </div>
                    <small>${totalProgress.selesai}/${totalProgress.total} materi</small>
                </div>
                <div class="mms-achievement-status">
                    ${achievements.master ? "✓ Selesai" : "🔒 Terkunci"}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.classList.add("show");
    }, 30);
};

window.focusAchievementItem = function (item) {
    const panel = item.closest(".mms-achievement-panel");

    panel.querySelectorAll(".mms-achievement-row").forEach(row => {
        row.classList.remove("focused");
        row.classList.add("blurred");
    });

    item.classList.remove("blurred");
    item.classList.add("focused");

    setTimeout(() => {
        panel.querySelectorAll(".mms-achievement-row").forEach(row => {
            row.classList.remove("blurred", "focused");
        });
    }, 1400);
};

window.getDailyMission = function () {
    const today = getTodayKey();
    const key = `mms_daily_mission_${today}`;

    return JSON.parse(
        localStorage.getItem(key) || JSON.stringify({
            completed: false,
            claimed: false
        })
    );
};

window.saveDailyMission = function (data) {
    const today = getTodayKey();
    const key = `mms_daily_mission_${today}`;

    localStorage.setItem(key, JSON.stringify(data));
};

window.updateDailyMission = function () {
    const mission = getDailyMission();

    if (mission.completed) return;

    mission.completed = true;
    saveDailyMission(mission);

    showAchievementToast(
        "Selesaikan 1 materi hari ini",
        "Misi Harian Selesai",
        "🎯"
    );
};

window.claimDailyMissionReward = function () {
    const mission = getDailyMission();

    if (!mission.completed || mission.claimed) return;

    const oldXP = getUserXP();
    const oldLevel = Math.floor(oldXP / 100) + 1;

    mission.claimed = true;
    saveDailyMission(mission);

    const newXP = oldXP + 25;
    const newLevel = Math.floor(newXP / 100) + 1;

    saveUserXP(newXP);

    checkAchievements();

    window.showAchievementToast("+25 XP", "Reward Misi Harian", "🎁");

    if (newLevel > oldLevel) {
        setTimeout(() => {
            window.showAchievementToast(
                `Kamu naik ke Level ${newLevel}`,
                "Level Up!",
                "🚀"
            );
        }, 900);
    }

    renderMenuMateriDinamis();
};

window.showAchievementToast = function (name, title = "Achievement Unlocked", icon = "🏆") {
    const overlay = document.createElement("div");
    overlay.className = "mms-achievement-overlay";

    const toast = document.createElement("div");
    toast.className = "mms-achievement-toast";

    toast.innerHTML = `
        <div class="mms-achievement-toast-icon">${icon}</div>
        <div>
            <strong>${title}</strong>
            <span>${name}</span>
        </div>
    `;

    overlay.appendChild(toast);
    document.body.appendChild(overlay);

    setTimeout(() => overlay.classList.add("show"), 30);

    setTimeout(() => {
        overlay.classList.remove("show");
        setTimeout(() => overlay.remove(), 300);
    }, 3000);
};


window.resetRW06LearningDev = function () {
    Object.keys(localStorage)
        .filter(key => key.startsWith("mms_"))
        .forEach(key => localStorage.removeItem(key));

    renderMenuMateriDinamis();

    console.log("RW06 learning data reset.");
};

window.completeMateriManual = function () {
    const materiId = window.mmsMateriAktifId;

    if (!materiId) return;

    const key = `mms_materi_quiz_${materiId}`;

    const oldData = JSON.parse(localStorage.getItem(key) || "null");

    if (oldData && oldData.percent >= 100) {
        window.showAchievementToast("Materi ini sudah selesai", "Info", "✅");
        return;
    }

    const data = {
        materiId: materiId,
        total: 1,
        correct: 1,
        percent: 100,
        finishedAt: new Date().toISOString(),
        completedManually: true
    };

    localStorage.setItem(key, JSON.stringify(data));

    addXPFromQuiz(100);
    updateStudyStreak();
    updateDailyMission();

    setTimeout(() => {
    checkAchievements();
}, 80);

window.showAchievementToast("Materi selesai", "Progress Tersimpan", "✅");

   setTimeout(() => {
    const materiId = window.mmsMateriAktifId;
    const materi = MATERI_CONTENT[materiId];
    const title = materi?.title || materiId;

    bukaDetailMateriDinamis(
        encodeURIComponent(materiId),
        encodeURIComponent(title)
    );
}, 900);
};

window.giveAchievementReward = function (achievementKey, xpReward) {
    const rewardKey = `mms_achievement_reward_${achievementKey}`;

    if (localStorage.getItem(rewardKey)) return false;

    const oldXP = getUserXP();
    saveUserXP(oldXP + xpReward);

    localStorage.setItem(rewardKey, "true");

    return true;
};




window.tampilkanOverlayHasilQuiz = function () {
    const cards = document.querySelectorAll(".mms-quiz-card");
    const total = cards.length;
    const correct = document.querySelectorAll(".mms-quiz-card.mms-quiz-correct-card").length;
    const percent = Math.round((correct / total) * 100);
    simpanBestScoreQuiz(correct, total, percent);
    let icon = "📚";
    let title = "Perlu Belajar Lagi";
    let subtitle = "Coba baca ulang materi dan kerjakan quiz sekali lagi.";

    if (percent >= 100) {
        icon = "🎯";
        title = "Perfect Score";
        subtitle = "Luar biasa! Semua jawaban benar.";
    } else if (percent >= 80) {
        icon = "🏆";
        title = "Good Job";
        subtitle = "Bagus. Kamu sudah memahami sebagian besar materi.";
    } else if (percent >= 60) {
        icon = "👍";
        title = "Cukup Baik";
        subtitle = "Kamu sudah lulus, tetapi masih ada beberapa konsep yang perlu diperkuat.";
    }

    const lulus = percent >= 60;

    const oldOverlay = document.getElementById("quizResultOverlay");
    if (oldOverlay) oldOverlay.remove();

    document.body.insertAdjacentHTML("beforeend", `
        <div id="quizResultOverlay" class="mms-quiz-overlay">
            <div class="mms-quiz-result-card">
                <div class="mms-quiz-result-icon">${icon}</div>

                <div class="mms-quiz-result-title">${title}</div>

                <div class="mms-quiz-result-score">${correct}/${total}</div>

                <div class="mms-quiz-result-subtitle">${subtitle}</div>

                ${
                    lulus ? `
                        <div class="mms-quiz-result-question">
                            Apakah kamu sudah memahami materi ini?
                        </div>

                        <div class="mms-quiz-result-actions three">
                            <button onclick="tutupQuizOverlay()">
                                Belum
                            </button>

                            <button onclick="resetMiniQuiz(); tutupQuizOverlay();">
                                Ulangi Quiz
                            </button>

                            <button class="primary" onclick="selesaikanMateriDariQuiz()">
                                Sudah, Lanjut
                            </button>
                        </div>
                    ` : `
                        <div class="mms-quiz-result-actions">
                            <button onclick="scrollKeAtasMateri(); tutupQuizOverlay();">
                                Baca Ulang Materi
                            </button>

                            <button class="primary" onclick="resetMiniQuiz(); tutupQuizOverlay();">
                                Ulangi Quiz
                            </button>
                        </div>
                    `
                }
            </div>
        </div>
    `);
};


window.tutupQuizOverlay = function () {
    const el = document.getElementById("quizResultOverlay");
    if (el) el.remove();
};

window.scrollKeAtasMateri = function () {
    const target = document.querySelector(".mms-materi-detail-card");
    if (target) {
        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
};

window.selesaikanMateriDariQuiz = function () {
    const materiId = window.mmsMateriAktifId;
    if (!materiId) return;

    const cards = document.querySelectorAll(".mms-quiz-card");
    const total = cards.length;
    const correct = document.querySelectorAll(".mms-quiz-card.mms-quiz-correct-card").length;
    const percent = Math.round((correct / total) * 100);

    const key = `mms_materi_quiz_${materiId}`;
    const oldData = JSON.parse(localStorage.getItem(key) || "null");
            localStorage.setItem(key, JSON.stringify({

            ...(oldData || {}),

            materiId,

            percent: 100,

            completedByQuiz: true,

            finishedAt: new Date().toISOString()

}));
const oldBestScore = oldData?.bestScore || oldData?.quizScore || 0;
const newScore = percent;
const bestScore = Math.max(oldBestScore, newScore);

localStorage.setItem(key, JSON.stringify({
    materiId,
    total,
    correct,
    percent: 100,
    quizScore: newScore,
    bestScore: bestScore,
    bestCorrect: bestScore === newScore ? correct : oldData?.bestCorrect,
    bestTotal: bestScore === newScore ? total : oldData?.bestTotal,
    finishedAt: new Date().toISOString(),
    completedByQuiz: true
}));
    

    addXPFromQuiz(percent);
    updateStudyStreak();
    updateDailyMission();
    checkAchievements();

    tutupQuizOverlay();

window.showAchievementToast("Materi selesai", "Progress Tersimpan", "✅");

setTimeout(() => {
    bukaMateriBerikutnya();

    setTimeout(() => {
        const materiPage = document.querySelector(".mms-materi-page");

        if (materiPage) {
            materiPage.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        } else {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    }, 350);
}, 700);
};

window.simpanBestScoreQuiz = function (correct, total, percent) {
    const materiId = window.mmsMateriAktifId;
    if (!materiId) return;

    const key = `mms_materi_quiz_${materiId}`;
    const oldData = JSON.parse(localStorage.getItem(key) || "null");

    const oldBestScore = Number(oldData?.bestScore || 0);
    const newScore = Number(percent || 0);

    if (newScore > oldBestScore) {
        localStorage.setItem(key, JSON.stringify({
            ...(oldData || {}),
            materiId,
            total,
            correct,
            quizScore: newScore,
            bestScore: newScore,
            bestCorrect: correct,
            bestTotal: total,
            bestUpdatedAt: new Date().toISOString()
        }));
    }
};


function getMateriItemById(id) {
    const babConfig = window.MATERI_BAB_CONFIG || MATERI_BAB_CONFIG || [];

    for (const bab of babConfig) {
        const found = (bab.items || []).find(item => {
            const itemId = typeof item === "string" ? item : item.id;
            return itemId === id;
        });

        if (found) return found;
    }

    return null;
}


window.bukaVideoMateri = function (encodedUrl, type = "youtube") {
    try {
        const url = decodeURIComponent(encodedUrl || "");
        const videoType = (type || "youtube").toLowerCase();

        if (!url) {
            alert("Video URL kosong atau belum tersedia.");
            console.error("Video URL kosong:", { encodedUrl, type });
            return;
        }

        let overlay = document.getElementById("mms-video-overlay");

        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "mms-video-overlay";
            overlay.className = "mms-video-overlay";
            document.body.appendChild(overlay);
        }

        const videoContent = videoType === "mp4" ? `
            <video
                class="mms-video-player"
                controls
                controlsList="nodownload"
                playsinline
                preload="metadata"
            >
                <source src="${url}" type="video/mp4">
                Browser Anda tidak mendukung video.
            </video>
        ` : `
            <iframe
                src="${url}"
                title="Video Materi"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
            ></iframe>
        `;

        overlay.innerHTML = `
            <div class="mms-video-modal">
                <button class="mms-video-close" onclick="tutupVideoMateri()">
                    <i class="fa-solid fa-xmark"></i>
                </button>

                <div class="mms-video-modal-frame">
                    ${videoContent}
                </div>
            </div>
        `;

        overlay.style.display = "flex";
        document.body.classList.add("mms-video-open");

    } catch (err) {
        alert("Gagal membuka video materi. Cek console.");
        console.error("bukaVideoMateri error:", err);
    }
};

window.tutupVideoMateri = function () {
    const overlay = document.getElementById("mms-video-overlay");

    if (overlay) {
        overlay.style.display = "none";
        overlay.innerHTML = "";
    }

    document.body.classList.remove("mms-video-open");
};

function mmsCompleteAllMateriForTest() {
    const babConfig = window.MATERI_BAB_CONFIG || MATERI_BAB_CONFIG || [];

    const allItems = babConfig.flatMap(bab => bab.items || []);

    allItems.forEach(item => {
        const id = typeof item === "string" ? item : item.id;

        localStorage.setItem(`mms_materi_quiz_${id}`, JSON.stringify({
            percent: 100,
            completed: true,
            score: 100,
            testMode: true,
            completedAt: new Date().toISOString()
        }));
    });

    console.log(`DONE: ${allItems.length} materi ditandai selesai.`);
    location.reload();
}

window.mmsCompleteAllMateriForTest = mmsCompleteAllMateriForTest;
