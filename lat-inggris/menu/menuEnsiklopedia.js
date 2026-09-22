// menuEnsiklopedia.js

const ENGLISH_PUBLIC_API_BASE = "https://mudamudiselor.web.id/common/api";
const URL_KAMUS = `${ENGLISH_PUBLIC_API_BASE}/english_public_vocabulary.php`;
const URL_VERB = `${ENGLISH_PUBLIC_API_BASE}/english_public_verbs.php`;

export function bukaEnsiklopediaMenu() {
    let modal = document.getElementById("mms-modal-ensiklopedia");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "mms-modal-ensiklopedia";
        modal.style.cssText = "position:fixed; inset:0; background:rgba(15,23,42,0.55); backdrop-filter:blur(6px); z-index:9999; display:none; align-items:center; justify-content:center; padding:22px; box-sizing:border-box;";
       
      if (!document.getElementById("mms-ensiklopedia-anim-style")) {
    const style = document.createElement("style");
    style.id = "mms-ensiklopedia-anim-style";
    style.innerHTML = `
        @keyframes mmsPopBounce {
            0% { transform: scale(0.94); opacity: 0; }
            55% { transform: scale(1.04); opacity: 1; }
            75% { transform: scale(0.98); }
            100% { transform: scale(1); }
        }

        .mms-ensiklopedia-card-anim {
            animation: mmsPopBounce 0.42s cubic-bezier(.2,.9,.25,1.25);
        }

        .mms-ensiklopedia-choice {
            transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
        }

        .mms-ensiklopedia-choice:hover {
            transform: translateY(-3px) scale(1.015);
            filter: brightness(1.02);
        }

        .mms-ensiklopedia-choice:active {
            transform: scale(0.96);
        }
    `;
    document.head.appendChild(style);
}
      
        modal.innerHTML = `
    <div class="mms-ensiklopedia-card-anim" style="width:min(520px, 100%); background:#ffffff; border-radius:22px; padding:24px; box-shadow:0 18px 45px rgba(15,23,42,0.28); box-sizing:border-box; position:relative;">
        <button onclick="tutupEnsiklopediaMenu()" style="position:absolute; top:16px; right:16px; width:42px; height:42px; border:none; border-radius:50%; background:#f1f5f9; color:#64748b; font-size:20px; font-weight:800; cursor:pointer; display:flex; align-items:center; justify-content:center;">
            <i class="fa-solid fa-xmark"></i>
        </button>

        <div style="display:flex; align-items:center; gap:12px; margin-bottom:18px; padding-right:48px;">
            <div style="width:64px; height:64px; border-radius:50%; background:#10b981; color:#ffffff; display:flex; align-items:center; justify-content:center; font-size:28px; box-shadow:0 12px 24px rgba(16,185,129,0.24);">
                <i class="fa-solid fa-book-atlas"></i>
            </div>
            <div>
                <div style="font-size:22px; font-weight:900; color:#0f172a;">Ensiklopedia</div>
                <div style="font-size:13px; font-weight:700; color:#64748b;">Pilih database referensi bahasa Inggris</div>
            </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr; gap:12px;">
            <button class="mms-ensiklopedia-choice" onclick="mmsBukaFiturEnsiklopedia('kamus')" style="width:100%; border:2px solid #10b981; background:linear-gradient(135deg,#d1fae5,#ecfdf5); color:#047857; border-radius:16px; padding:16px; cursor:pointer; text-align:left; display:flex; align-items:center; gap:14px; box-sizing:border-box; box-shadow:0 10px 22px rgba(16,185,129,0.18);">
                <div style="width:44px; height:44px; border-radius:12px; background:linear-gradient(135deg,#10b981,#059669); color:#ffffff; display:flex; align-items:center; justify-content:center; font-size:20px;">
                    <i class="fa-solid fa-language"></i>
                </div>
                <div>
                    <div style="font-size:16px; font-weight:900; color:#0f172a;">Kamus / Vocabulary</div>
                    <div style="font-size:12.5px; font-weight:600; color:#475569;">Daftar kosakata, arti, dan contoh konteks.</div>
                </div>
            </button>

            <button class="mms-ensiklopedia-choice" onclick="mmsBukaFiturEnsiklopedia('verb')" style="width:100%; border:2px solid #fed7aa; background:#fff7ed; border-radius:16px; padding:16px; cursor:pointer; text-align:left; display:flex; align-items:center; gap:14px;">
                <div style="width:44px; height:44px; border-radius:12px; background:#ffedd5; color:#c2410c; display:flex; align-items:center; justify-content:center; font-size:20px;">
                    <i class="fa-solid fa-shuffle"></i>
                </div>
                <div>
                    <div style="font-size:16px; font-weight:900; color:#0f172a;">Bentuk Verb</div>
                    <div style="font-size:12.5px; font-weight:600; color:#475569;">Referensi Verb 1, Verb 2, Verb 3, V-ing, dan arti.</div>
                </div>
            </button>
        </div>
    </div>
`;
        document.body.appendChild(modal);
    }

    modal.style.display = "flex";
}

export function tutupEnsiklopediaMenu() {
    const modal = document.getElementById("mms-modal-ensiklopedia");
    if (modal) modal.style.display = "none";
}

export function mmsBukaFiturEnsiklopedia(tipe) {
    tutupEnsiklopediaMenu();

    if (tipe === "kamus") {
        bukaModalKamus();
        return;
    }

    if (tipe === "verb") {
        bukaModalVerb();
        return;
    }

    let judul = "ENSIKLOPEDIA";
    let modalDev = document.getElementById("mms-modal-dev");
    let labelDev = document.getElementById("mms-lbl-dev-title");

    if (labelDev) labelDev.innerText = judul;
    if (modalDev) modalDev.style.display = "flex";
}

export async function bukaModalKamus() {
    let modal = document.getElementById("mms-modal-kamus");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "mms-modal-kamus";
        modal.style.cssText = "position:fixed; inset:0; background:rgba(15,23,42,0.55); backdrop-filter:blur(6px); z-index:10000; display:none; align-items:center; justify-content:center; padding:18px; box-sizing:border-box;";

        
        modal.innerHTML = `
            <div style="width:min(900px, 100%); max-height:88vh; background:#ffffff; border-radius:22px; box-shadow:0 18px 45px rgba(15,23,42,0.28); overflow:hidden; display:flex; flex-direction:column;">
               <div style="padding:18px 20px; border-bottom:1px solid #d1fae5; background:#ecfdf5; display:flex; align-items:center; justify-content:space-between; gap:12px;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div style="width:44px; height:44px; border-radius:14px; color:#10b981; color:#059669; display:flex; align-items:center; justify-content:center; font-size:20px;">
                            <i class="fa-solid fa-language"></i>
                        </div>
                        <div>
                            <div style="font-size:20px; font-weight:900; color:#0f172a;">Kamus / Vocabulary</div>
                            <div style="font-size:12.5px; font-weight:600; color:#64748b;">Data kosakata dari database hosting</div>
                        </div>
                    </div>

                    <button onclick="tutupModalKamus()" style="width:40px; height:40px; border:none; border-radius:50%; background:#f1f5f9; color:#64748b; font-size:18px; cursor:pointer;">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div style="padding:14px 20px; border-bottom:1px solid #e2e8f0;">
    <input id="mms-search-kamus" oninput="filterKamusData()" placeholder="Cari kata, arti, pengucapan, atau abjad..." style="width:100%; padding:12px 14px; border:1px solid #cbd5e1; border-radius:12px; font-size:13px; box-sizing:border-box; outline:none; margin-bottom:10px;">

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <select id="mms-filter-kategori" onchange="filterKamusData()" style="width:100%; padding:12px 10px; border:1px solid #cbd5e1; border-radius:12px; font-size:13px; box-sizing:border-box; outline:none; background:#fff;">
            <option value="">Semua Kategori</option>
        </select>

        <select id="mms-filter-level" onchange="filterKamusData()" style="width:100%; padding:12px 10px; border:1px solid #cbd5e1; border-radius:12px; font-size:13px; box-sizing:border-box; outline:none; background:#fff;">
            <option value="">Semua Level</option>
        </select>
    </div>
</div>

<div style="font-size:11px; color:#64748b; padding:8px 20px 0 20px; display:flex; align-items:center; gap:6px;">

    <i class="fa-solid fa-arrow-right-arrow-left"></i>

    <span>Geser tabel untuk melihat kolom lain.</span>

</div>

                <div style="overflow:auto; padding:0 12px 20px 12px;">
                    <table style="width:100%; border-collapse:collapse; font-size:13px; min-width:900px;">
                        <thead>
                            <tr style="background:#ecfdf5; color:#0f172a; border-bottom:2px solid #a7f3d0;">
                            <th style="padding:12px 10px; text-align:left; width:70px;">Abjad</th>
                            <th style="padding:12px 10px; text-align:left; width:170px;">Indonesia</th>
                            <th style="padding:12px 10px; text-align:left; width:170px;">Inggris</th>
                            <th style="padding:12px 10px; text-align:left; width:180px;">Pengucapan</th>
                            <th style="padding:12px 10px; text-align:center; width:90px;">Audio</th>
                            <th style="padding:12px 10px; text-align:center; width:120px;">Kategori</th>
                            <th style="padding:12px 10px; text-align:center; width:120px;">Level</th>
                            </tr>
                        </thead>
                        <tbody id="tbody-kamus-data">
                            <tr>
                                <td colspan="7" style="padding:18px; text-align:center; color:#64748b;">Memuat data kamus...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    modal.style.display = "flex";
    await loadKamusFromTSV();
}



export function tutupModalKamus() {
    const modal = document.getElementById("mms-modal-kamus");
    if (modal) modal.style.display = "none";
}

export async function loadKamusFromTSV() {
    const tbody = document.getElementById("tbody-kamus-data");
    if (!tbody) return;

    try {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="padding:18px; text-align:center; color:#64748b;">Memuat data kamus...</td>
            </tr>
        `;

        const response = await fetch(URL_KAMUS, {
            headers: { Accept: "application/json" }
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Gagal memuat data kamus.");
        }

        const dataRows = Array.isArray(result.data) ? result.data : [];

        if (!dataRows.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="padding:18px; text-align:center; color:#64748b;">Data kamus masih kosong.</td>
                </tr>
            `;
            return;
        }

        let abjadTerakhir = "";

tbody.innerHTML = dataRows.map(item => {
    const abjadRaw = item.abjad || "";
    const abjad = escapeHTML(abjadRaw);
    const indonesia = escapeHTML(item.indonesia || "");
    const inggris = escapeHTML(item.inggris || "");
    const pengucapan = escapeHTML(item.pengucapan || "");
    const kategori = escapeHTML(item.kategori || "");
    const level = escapeHTML(item.level || "");

    const tampilAbjad = abjadRaw !== abjadTerakhir ? abjad : "";
    abjadTerakhir = abjadRaw;

    return `
        <tr class="mms-row-kamus" data-kategori="${kategori.toLowerCase()}" data-level="${level.toLowerCase()}" style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:11px 10px; font-weight:900; color:#1d4ed8;">${tampilAbjad}</td>
            <td style="padding:11px 10px; color:#334155;">${indonesia}</td>
            <td style="padding:11px 10px; font-weight:800; color:#0f172a;">${inggris}</td>
            <td style="padding:11px 10px; color:#475569; font-style:italic;">${pengucapan}</td>
            <td style="padding:11px 10px; text-align:center;">
                <button onclick="mmsPlayPronunciation('${escapeAttr(item.inggris || "")}')" style="width:34px; height:34px; border:none; border-radius:10px; background:#ecfdf5; color:#059669; cursor:pointer;">
                    <i class="fa-solid fa-volume-high"></i>
                </button>
            </td>
            <td style="padding:11px 10px;"><span style="background:#f1f5f9; color:#475569; padding:4px 8px; border-radius:8px; font-size:11px; font-weight:700;">${kategori}</span></td>
            <td style="padding:11px 10px;"><span style="background:#ecfeff; color:#0f766e; padding:4px 8px; border-radius:8px; font-size:11px; font-weight:700;">${level}</span></td>
        </tr>
    `;
}).join("");

isiFilterKamus();

    } catch (error) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="padding:18px; text-align:center; color:#dc2626;">Gagal memuat data kamus.</td>
            </tr>
        `;
    }
}

export async function bukaModalVerb() {
    let modal = document.getElementById("mms-modal-verb");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "mms-modal-verb";
        modal.style.cssText = "position:fixed; inset:0; background:rgba(15,23,42,0.55); backdrop-filter:blur(6px); z-index:10000; display:none; align-items:center; justify-content:center; padding:18px; box-sizing:border-box;";

        modal.innerHTML = `
            <div style="width:min(1100px, 100%); max-height:88vh; background:#ffffff; border-radius:22px; box-shadow:0 18px 45px rgba(15,23,42,0.28); overflow:hidden; display:flex; flex-direction:column;">
                <div style="padding:18px 20px; border-bottom:1px solid #fed7aa; background:linear-gradient(135deg,#fff7ed,#fffbeb); display:flex; align-items:center; justify-content:space-between;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div style="width:52px; height:52px; border-radius:16px; background:linear-gradient(135deg,#f59e0b,#d97706); color:#fff; display:flex; align-items:center; justify-content:center; font-size:22px;">
                            <i class="fa-solid fa-shuffle"></i>
                        </div>
                        <div>
                            <div style="font-size:20px; font-weight:900; color:#0f172a;">Bentuk Verb</div>
                            <div style="font-size:12.5px; font-weight:600; color:#92400e;">Referensi perubahan kata kerja</div>
                        </div>
                    </div>

                    <button onclick="tutupModalVerb()" style="width:40px; height:40px; border:none; border-radius:50%; background:#fff7ed; color:#92400e; font-size:18px; cursor:pointer;">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div style="padding:14px 20px; border-bottom:1px solid #e2e8f0;">
                    <input id="mms-search-verb" oninput="filterVerbData()" placeholder="Cari V1, V2, V3, V-ing, arti, tipe, atau level..." style="width:100%; padding:12px 14px; border:1px solid #cbd5e1; border-radius:12px; font-size:13px; box-sizing:border-box; outline:none; margin-bottom:10px;">

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        <select id="mms-filter-verb-tipe" onchange="filterVerbData()" style="width:100%; padding:12px 10px; border:1px solid #cbd5e1; border-radius:12px; font-size:13px; box-sizing:border-box; outline:none; background:#fff;">
                            <option value="">Semua Tipe</option>
                        </select>

                        <select id="mms-filter-verb-level" onchange="filterVerbData()" style="width:100%; padding:12px 10px; border:1px solid #cbd5e1; border-radius:12px; font-size:13px; box-sizing:border-box; outline:none; background:#fff;">
                            <option value="">Semua Level</option>
                        </select>
                    </div>
                </div>

                <div style="font-size:11px; color:#64748b; padding:8px 20px 0 20px; display:flex; align-items:center; gap:6px;">
                    <i class="fa-solid fa-arrow-right-arrow-left"></i>
                    <span>Geser tabel untuk melihat kolom lain.</span>
                </div>

                <div style="overflow:auto; padding:0 12px 20px 12px;">
                    <table style="width:100%; border-collapse:collapse; font-size:13px; min-width:700px;">
                        <thead>
                            <tr style="background:#fff7ed; color:#0f172a; border-bottom:2px solid #fed7aa;">
                                <th style="padding:12px 10px; text-align:left;">V1</th>
                                <th style="padding:12px 10px; text-align:left;">V2</th>
                                <th style="padding:12px 10px; text-align:left;">V3</th>
                                <th style="padding:12px 10px; text-align:left;">V-ing</th>
                                <th style="padding:12px 10px; text-align:left;">Arti</th>
                            </tr>
                        </thead>
                        <tbody id="tbody-verb-data">
                            <tr>
                                <td colspan="5" style="padding:18px; text-align:center; color:#64748b;">Memuat data verb...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    modal.style.display = "flex";
    await loadVerbFromTSV();
}

export function tutupModalVerb() {
    const modal = document.getElementById("mms-modal-verb");
    if (modal) modal.style.display = "none";
}

export async function loadVerbFromTSV() {
    const tbody = document.getElementById("tbody-verb-data");
    if (!tbody) return;

    try {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="padding:18px; text-align:center; color:#64748b;">Memuat data verb...</td>
            </tr>
        `;

        const response = await fetch(URL_VERB, {
            headers: { Accept: "application/json" }
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Gagal memuat data verb.");
        }

        const dataRows = Array.isArray(result.data) ? result.data : [];

        if (!dataRows.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="padding:18px; text-align:center; color:#64748b;">Data verb masih kosong.</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = dataRows.map(item => {
            const v1 = escapeHTML(item.v1 || "");
            const v2 = escapeHTML(item.v2 || "");
            const v3 = escapeHTML(item.v3 || "");
            const ving = escapeHTML(item.v_ing || "");
            const arti = escapeHTML(item.arti || "");
            const tipe = escapeHTML(item.tipe || "");
            const level = escapeHTML(item.level || "");

            const tipeLower = String(item.tipe || "").toLowerCase();
            const tipeStyle = tipeLower.includes("irregular")
                ? "background:#fff1f2; color:#991b1b;"
                : "background:#ecfdf5; color:#047857;";

            return `
                <tr
    class="mms-row-verb"
    data-v1="${v1}"
    data-v2="${v2}"
    data-v3="${v3}"
    data-ving="${ving}"
    data-arti="${arti}"
    data-tipe="${tipe.toLowerCase()}"
    data-tipe-label="${tipe}"
    data-level="${level.toLowerCase()}"
    data-level-label="${level}"
    onclick="bukaDetailVerb(this)"
    style="border-bottom:1px solid #e2e8f0; cursor:pointer;"
>
    <td style="padding:11px 10px; font-weight:900; color:#2563eb;">${v1}</td>
    <td style="padding:11px 10px; font-weight:800; color:#ea580c;">${v2}</td>
    <td style="padding:11px 10px; font-weight:800; color:#16a34a;">${v3}</td>
    <td style="padding:11px 10px; font-weight:800; color:#7c3aed;">${ving}</td>
    <td style="padding:11px 10px; color:#334155;">${arti}</td>
</tr>
            `;
        }).join("");

        isiFilterVerb();

    } catch (error) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="padding:18px; text-align:center; color:#dc2626;">Gagal memuat data verb.</td>
            </tr>
        `;
    }
}


export function filterVerbData() {
    const input = document.getElementById("mms-search-verb");
    const filterTipe = document.getElementById("mms-filter-verb-tipe");
    const filterLevel = document.getElementById("mms-filter-verb-level");

    const keyword = (input?.value || "").toLowerCase().trim();
    const tipeDipilih = (filterTipe?.value || "").toLowerCase().trim();
    const levelDipilih = (filterLevel?.value || "").toLowerCase().trim();

    document.querySelectorAll(".mms-row-verb").forEach(row => {
        const text = row.textContent.toLowerCase();
        const tipe = row.dataset.tipe || "";
        const level = row.dataset.level || "";

        const cocokKeyword = text.includes(keyword);
        const cocokTipe = !tipeDipilih || tipe === tipeDipilih;
        const cocokLevel = !levelDipilih || level === levelDipilih;

        row.style.display = cocokKeyword && cocokTipe && cocokLevel ? "" : "none";
    });
}

export function isiFilterVerb() {
    const tipeSelect = document.getElementById("mms-filter-verb-tipe");
    const levelSelect = document.getElementById("mms-filter-verb-level");

    if (!tipeSelect || !levelSelect) return;

    const tipeSet = new Set();
    const levelSet = new Set();

    document.querySelectorAll(".mms-row-verb").forEach(row => {
        if (row.dataset.tipe) tipeSet.add(row.dataset.tipe);
        if (row.dataset.level) levelSet.add(row.dataset.level);
    });

    tipeSelect.innerHTML = `<option value="">Semua Tipe</option>`;
    levelSelect.innerHTML = `<option value="">Semua Level</option>`;

    [...tipeSet].sort().forEach(tipe => {
        tipeSelect.innerHTML += `<option value="${tipe}">${kapitalAwal(tipe)}</option>`;
    });

    [...levelSet].sort().forEach(level => {
        levelSelect.innerHTML += `<option value="${level}">${kapitalAwal(level)}</option>`;
    });
}


export function bukaDetailVerb(row) {
    const v1 = row.dataset.v1 || "-";
    const v2 = row.dataset.v2 || "-";
    const v3 = row.dataset.v3 || "-";
    const ving = row.dataset.ving || "-";
    const arti = row.dataset.arti || "-";
    const tipe = row.dataset.tipeLabel || "-";
    const level = row.dataset.levelLabel || "-";

    bukaModalDetailVerb(v1, v2, v3, ving, arti, tipe, level);
}

export function bukaModalDetailVerb(v1, v2, v3, ving, arti, tipe, level) {
    let modal = document.getElementById("mms-modal-detail-verb");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "mms-modal-detail-verb";
        modal.style.cssText = "position:fixed; inset:0; background:rgba(15,23,42,0.55); backdrop-filter:blur(6px); z-index:11000; display:none; align-items:center; justify-content:center; padding:18px; box-sizing:border-box;";
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div style="width:min(420px,100%); background:#ffffff; border-radius:22px; overflow:hidden; box-shadow:0 18px 45px rgba(15,23,42,0.28);">
            <div style="padding:18px 20px; background:linear-gradient(135deg,#fff7ed,#fffbeb); border-bottom:1px solid #fed7aa; display:flex; align-items:center; justify-content:space-between;">
                <div>
                    <div style="font-size:20px; font-weight:900; color:#0f172a;">Detail Verb</div>
                    <div style="font-size:13px; font-weight:700; color:#92400e;">${v1} / ${v2} / ${v3}</div>
                </div>
                <button onclick="tutupModalDetailVerb()" style="width:38px; height:38px; border:none; border-radius:50%; background:#fff7ed; color:#92400e; font-size:18px; cursor:pointer;">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div style="padding:18px 20px; display:grid; gap:10px; font-size:14px;">
                <div><b style="color:#2563eb;">V1</b> : ${v1}</div>
                <div><b style="color:#ea580c;">V2</b> : ${v2}</div>
                <div><b style="color:#16a34a;">V3</b> : ${v3}</div>
                <div><b style="color:#7c3aed;">V-ing</b> : ${ving}</div>

                <div style="height:1px; background:#e2e8f0; margin:4px 0;"></div>

                <div><b>Arti</b> : ${arti}</div>
                <div><b>Tipe</b> : ${tipe}</div>
                <div><b>Level</b> : ${level}</div>
            </div>
        </div>
    `;

    modal.style.display = "flex";
}

export function tutupModalDetailVerb() {
    const modal = document.getElementById("mms-modal-detail-verb");
    if (modal) modal.style.display = "none";
}

export function filterKamusData() {
    const input = document.getElementById("mms-search-kamus");
    const filterKategori = document.getElementById("mms-filter-kategori");
    const filterLevel = document.getElementById("mms-filter-level");

    const keyword = (input?.value || "").toLowerCase().trim();
    const kategoriDipilih = (filterKategori?.value || "").toLowerCase().trim();
    const levelDipilih = (filterLevel?.value || "").toLowerCase().trim();

    document.querySelectorAll(".mms-row-kamus").forEach(row => {
        const text = row.textContent.toLowerCase();
        const kategori = row.dataset.kategori || "";
        const level = row.dataset.level || "";

        const cocokKeyword = text.includes(keyword);
        const cocokKategori = !kategoriDipilih || kategori === kategoriDipilih;
        const cocokLevel = !levelDipilih || level === levelDipilih;

        row.style.display = cocokKeyword && cocokKategori && cocokLevel ? "" : "none";
    });
}

export function isiFilterKamus() {
    const kategoriSelect = document.getElementById("mms-filter-kategori");
    const levelSelect = document.getElementById("mms-filter-level");

    if (!kategoriSelect || !levelSelect) return;

    const kategoriSet = new Set();
    const levelSet = new Set();

    document.querySelectorAll(".mms-row-kamus").forEach(row => {
        if (row.dataset.kategori) kategoriSet.add(row.dataset.kategori);
        if (row.dataset.level) levelSet.add(row.dataset.level);
    });

    kategoriSelect.innerHTML = `<option value="">Semua Kategori</option>`;
    levelSelect.innerHTML = `<option value="">Semua Level</option>`;

    [...kategoriSet].sort().forEach(kategori => {
        kategoriSelect.innerHTML += `<option value="${kategori}">${kapitalAwal(kategori)}</option>`;
    });

    [...levelSet].sort().forEach(level => {
        levelSelect.innerHTML += `<option value="${level}">${kapitalAwal(level)}</option>`;
    });
}

function kapitalAwal(text) {
    return String(text)
        .split(" ")
        .map(kata => kata.charAt(0).toUpperCase() + kata.slice(1))
        .join(" ");
}

export function mmsPlayPronunciation(word) {
    if (!word) return;

    if (!window.speechSynthesis) {
        alert("Browser tidak mendukung audio pronunciation.");
        return;
    }

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.85;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
    return String(value)
        .replaceAll("\\", "\\\\")
        .replaceAll("'", "\\'")
        .replaceAll('"', "&quot;");
}

export async function loadEncyclopediaFromSheets(urlSpreadsheet) {
    try {
        const response = await fetch(urlSpreadsheet);
        const jsonText = await response.text();
        
        // Membersihkan data JSON Google Sheets API standard
        const rawData = JSON.parse(jsonText.substring(47, jsonText.length - 2));
        const rows = rawData.table.rows;

        const tbodyDictionary = document.getElementById("tbody-dictionary-data");
        const tbodyVerbs = document.getElementById("tbody-verbs-data");

        if (!tbodyDictionary || !tbodyVerbs) return;

        // Reset container tabel sebelum diisi data fresh
        tbodyDictionary.innerHTML = "";
        tbodyVerbs.innerHTML = "";

        rows.forEach(row => {
            const cells = row.c;
            
            // Jaring pengaman: Jika baris kosong atau tidak memiliki array cells, langsung lewati
            if (!cells) return;

            // 📝 Mapping Jalur Tab Kamus (Vocab)
            // Asumsi Kolom: A = Word, B = Part of Speech, C = Meaning, D = Example Context
            if (cells[0] && cells[1] && cells[2] && cells[0].v !== "Word") {
                const word = cells[0].v || "";
                const pos = cells[1].v || "Noun";
                const meaning = cells[2].v || "";
                const context = cells[3] ? cells[3].v : "-";

                // Menentukan warna badge Part of Speech demi keindahan visual
                let badgeColor = "background: #e0f2fe; color: #0369a1;"; // Default Verb
                if (pos.toLowerCase().includes("adj")) badgeColor = "background: #fef9c3; color: #854d0e;";
                if (pos.toLowerCase().includes("noun")) badgeColor = "background: #f0fdf4; color: #166534;";
                if (pos.toLowerCase().includes("adv")) badgeColor = "background: #fae8ff; color: #86198f;";

                const trKamus = document.createElement("tr");
                trKamus.className = "searchable-row";
                trKamus.style.borderBottom = "1px solid #e2e8f0";
                trKamus.innerHTML = `
                    <td style="padding: 11px 14px; font-weight: 700; color: #0f172a;">${word}</td>
                    <td style="padding: 11px 14px;"><span style="${badgeColor} padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">${pos}</span></td>
                    <td style="padding: 11px 14px; color: #334155;">${meaning}</td>
                    <td style="padding: 11px 14px; font-style: italic; color: #64748b;">${context}</td>
                `;
                tbodyDictionary.appendChild(trKamus);
            }

            // 👟 Mapping Jalur Tab Matriks Verb (V1, V2, V3, V-ing)
            // Asumsi Kolom: E = V1, F = V2, G = V3, H = V-ing, I = Type, J = Indonesian Meaning
            if (cells[4] && cells[5] && cells[6] && cells[4].v !== "Infinitive (V1)") {
                const v1 = cells[4].v || "";
                const v2 = cells[5].v || "";
                const v3 = cells[6].v || "";
                const vImg = cells[7] ? cells[7].v : "";
                const type = cells[8] ? cells[8].v : "Regular";
                const arti = cells[9] ? cells[9].v : "";

                let typeBadge = type.toLowerCase().includes("irreg")
                    ? "background: #fff1f2; color: #991b1b;"
                    : "background: #f0fdf4; color: #166534;";

                const trVerb = document.createElement("tr");
                trVerb.className = "searchable-row";
                trVerb.style.borderBottom = "1px solid #e2e8f0";
                trVerb.innerHTML = `
                    <td style="padding: 11px 10px; font-weight: 700; color: #0f172a; border-right: 1px solid #f1f5f9;">${v1}</td>
                    <td style="padding: 11px 10px; color: #2563eb; font-weight: 600; border-right: 1px solid #f1f5f9;">${v2}</td>
                    <td style="padding: 11px 10px; color: #16a34a; font-weight: 600; border-right: 1px solid #f1f5f9;">${v3}</td>
                    <td style="padding: 11px 10px; color: #ea580c; font-weight: 600; border-right: 1px solid #f1f5f9;">${vImg}</td>
                    <td style="padding: 11px 10px; border-right: 1px solid #f1f5f9;"><span style="${typeBadge} padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">${type}</span></td>
                    <td style="padding: 11px 10px; color: #64748b;">${arti}</td>
                `;
                tbodyVerbs.appendChild(trVerb);
            }
        });

    } catch (error) {
        return error;
    }
}

/**
 * 🛠️ FUNGSI 2: MENGATUR NAVIGASI PERPINDAHAN TAB (KAMUS VS VERBS)
 */
export function switchEncyclopediaTab(targetTab) {
    const tabDictionary = document.getElementById("btn-tab-dictionary");
    const tabVerbs = document.getElementById("btn-tab-verbs");
    const panelDictionary = document.getElementById("panel-encyclopedia-dictionary");
    const panelVerbs = document.getElementById("panel-encyclopedia-verbs");
    const searchInput = document.getElementById("mms-encyclopedia-search");

    if (searchInput) searchInput.value = "";

    if (targetTab === "dictionary") {
        if (tabDictionary) tabDictionary.classList.add("active");
        if (tabVerbs) tabVerbs.classList.remove("active");
        if (panelDictionary) panelDictionary.style.display = "block";
        if (panelVerbs) panelVerbs.style.display = "none";
        if (searchInput) searchInput.placeholder = "Cari kata benda, sifat, adverb, atau arti kosakata...";
    } else if (targetTab === "verbs") {
        if (tabVerbs) tabVerbs.classList.add("active");
        if (tabDictionary) tabDictionary.classList.remove("active");
        if (panelVerbs) panelVerbs.style.display = "block";
        if (panelDictionary) panelDictionary.style.display = "none";
        if (searchInput) searchInput.placeholder = "Cari berdasarkan bentuk V1, V2, V3, V-ing, atau arti kata kerja...";
    }
    
    const semuaBaris = document.querySelectorAll(".searchable-row");
    semuaBaris.forEach(row => row.style.display = "");
}

/**
 * 🛠️ FUNGSI 3: LIVE FILTER SEARCH - MENCARI DATA SECARA INSTAN TANPA LAG
 */
export function filterEncyclopediaData() {
    const input = document.getElementById("mms-encyclopedia-search");
    if (!input) return;
    const filter = input.value.toLowerCase().trim();
    
    const panelDictionary = document.getElementById("panel-encyclopedia-dictionary");
    const targetPanelId = (panelDictionary && panelDictionary.style.display === "block") 
        ? "panel-encyclopedia-dictionary" 
        : "panel-encyclopedia-verbs";

    const rows = document.querySelectorAll(`#${targetPanelId} .searchable-row`);

    rows.forEach(row => {
        const textContent = row.textContent.toLowerCase();
        if (textContent.includes(filter)) {
            row.style.display = ""; 
        } else {
            row.style.display = "none"; 
        }
    });
}
