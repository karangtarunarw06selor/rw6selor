(function () {
    const API_BASE = "https://rw6selor.org/common/api";
    const IMPORT_URL = API_BASE.replace(/\/api$/, "/import_english_tsv.php");
    const state = { tab: "materi", chapters: [], materi: [], vocabulary: [], verbs: [], exercises: [], editingMateriKey: "" };

    const $ = (sel) => document.querySelector(sel);
    const esc = (v) => String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

    async function api(file, options = {}) {
        const res = await fetch(`${API_BASE}/${file}`, options);
        const json = await res.json();
        if (!json.success) throw new Error(json.message || "Request gagal");
        return json;
    }

    function formData(form) {
        const data = new FormData(form);
        form.querySelectorAll("input[type=checkbox]").forEach(input => data.set(input.name, input.checked ? "1" : "0"));
        return data;
    }

    function status(msg) {
        document.querySelectorAll(".ea-status").forEach(el => el.textContent = msg || "");
    }

async function loadAll() {
    status("Memuat data...");

    const safeLoad = async (file, fallback = []) => {
        try {
            const json = await api(file);
            return Array.isArray(json.data)
                ? json.data
                : Array.isArray(json.rows)
                    ? json.rows
                    : Array.isArray(json.items)
                        ? json.items
                        : fallback;
        } catch (err) {
            return fallback;
        }
    };

    state.chapters = await safeLoad("english_chapter_list.php?is_active=1");
    state.materi = await safeLoad("english_materi_list.php?limit=500&is_active=1");
    state.vocabulary = await safeLoad("english_vocabulary_list.php");
    state.verbs = await safeLoad("english_verb_list.php");
    state.exercises = await safeLoad("english_exercise_list.php");

    render();
    status("");
}

    function chapterOptions(selected) {
        return `<option value="">Tanpa BAB</option>${state.chapters.map(c => `<option value="${c.id}" ${String(selected || "") === String(c.id) ? "selected" : ""}>${esc(c.title)}</option>`).join("")}`;
    }

    function rows(items, cols, editFn, delFn) {
        return `<div class="ea-table-wrap"><table class="ea-table"><thead><tr>${cols.map(c => `<th>${esc(c[0])}</th>`).join("")}<th>Aksi</th></tr></thead><tbody>${items.map(item => `<tr>${cols.map(c => `<td>${c[1](item)}</td>`).join("")}<td>${actionButtons(item, editFn, delFn)}</td></tr>`).join("") || `<tr><td colspan="${cols.length + 1}">Belum ada data.</td></tr>`}</tbody></table></div>`;
    }

    function actionButtons(item, editFn, delFn) {
        if (editFn === "materi") {
            return `<button type="button" class="ea-btn secondary" data-action="edit-materi" data-key="${esc(item.materi_key || "")}"><i class="fa-solid fa-pen"></i></button> <button type="button" class="ea-btn danger" data-del="${delFn}" data-id="${item.id}"><i class="fa-solid fa-trash"></i></button>`;
        }
        return `<button type="button" class="ea-btn secondary" data-edit="${editFn}" data-id="${item.id}"><i class="fa-solid fa-pen"></i></button> <button type="button" class="ea-btn danger" data-del="${delFn}" data-id="${item.id}"><i class="fa-solid fa-trash"></i></button>`;
    }

    function filterBox(type) {
        return `<div class="ea-toolbar">
            <input id="${type}-q" placeholder="Cari data..." oninput="EnglishEditor.render()">
            <select id="${type}-active" onchange="EnglishEditor.render()"><option value="">Semua status</option><option value="1">Aktif</option><option value="0">Nonaktif</option></select>
            <input id="${type}-filter" placeholder="Filter level/kategori/BAB..." oninput="EnglishEditor.render()">
            <button class="ea-btn secondary" onclick="EnglishEditor.clearFilters('${type}')"><i class="fa-solid fa-filter-circle-xmark"></i></button>
        </div>`;
    }

    function applyLocalFilter(type, items, haystack) {
        const q = ($(`#${type}-q`)?.value || "").toLowerCase();
        const active = $(`#${type}-active`)?.value || "";
        const filter = ($(`#${type}-filter`)?.value || "").toLowerCase();
        return items.filter(item => {
            const text = haystack(item).toLowerCase();
            const okQ = !q || text.includes(q);
            const okActive = active === "" || String(item.is_active) === active;
            const okFilter = !filter || text.includes(filter);
            return okQ && okActive && okFilter;
        });
    }

    function renderMateri(edit = {}) {
        const item = edit.id ? edit : {};
        state.editingMateriKey = item.materi_key || "";
        const list = applyLocalFilter("materi", state.materi, m => `${m.title} ${m.materi_key} ${m.chapter_title} ${m.tipe_rumus} ${m.kata_kunci} ${m.is_active}`);
        $("#ea-materi").innerHTML = `<div class="ea-actions ea-top-actions"><button type="button" class="ea-btn good" onclick="EnglishEditor.syncLatInggris()"><i class="fa-solid fa-arrows-rotate"></i> Sync dari Lat-Inggris</button></div>${filterBox("materi")}<div class="ea-status"></div><div class="ea-grid">
            <form class="ea-form" id="materi-form">
                <input type="hidden" name="id" value="${esc(item.id || "")}">
                ${field("BAB", `<select name="chapter_id">${chapterOptions(item.chapter_id)}</select>`)}
                ${field("Materi Key", `<input name="materi_key" readonly value="${esc(item.materi_key || "")}" placeholder="pilih materi dari tabel">`)}
                ${field("Judul Materi", `<input name="title" required value="${esc(item.title || "")}">`)}
                ${field("Tipe Rumus", `<input name="tipe_rumus" value="${esc(item.tipe_rumus || "")}">`)}
                ${field("Rumus", `<textarea name="rumus">${esc(item.rumus || "")}</textarea>`, "full")}
                ${field("Pembahasan", `<textarea name="pembahasan">${esc(item.pembahasan || "")}</textarea>`, "full")}
                ${field("Arti", `<textarea name="arti">${esc(item.arti || "")}</textarea>`)}
                ${field("Link Visual", `<textarea name="link_visual">${esc(item.link_visual || "")}</textarea>`)}
                ${field("Kata Kunci", `<textarea name="kata_kunci">${esc(item.kata_kunci || "")}</textarea>`)}
                ${field("Penjelasan", `<textarea name="penjelasan">${esc(item.penjelasan || "")}</textarea>`)}
                ${field("Description", `<textarea name="description">${esc(item.description || "")}</textarea>`, "full")}
                ${field("Notes JSON", `<textarea name="notes_json" placeholder='["Catatan 1"]'>${esc(item.notes_json || "")}</textarea>`)}
                ${field("Patterns JSON", `<textarea name="patterns_json">${esc(item.patterns_json || "")}</textarea>`)}
                ${field("Quiz JSON", `<textarea name="quiz_json">${esc(item.quiz_json || "")}</textarea>`, "full")}
                ${field("Video Type", videoSelect(item.video_type))}
                ${field("Video URL", `<input name="video_url" value="${esc(item.video_url || "")}">`)}
                ${field("Upload Video", `<input type="file" id="ea-video-upload" accept=".mp4,.webm,.mov,video/mp4,video/webm,video/quicktime"><button type="button" class="ea-btn secondary ea-upload-btn" onclick="EnglishEditor.uploadAsset('video')"><i class="fa-solid fa-upload"></i> Upload Video</button>`)}
                ${field("Upload Gambar", `<input type="file" id="ea-image-upload" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"><button type="button" class="ea-btn secondary ea-upload-btn" onclick="EnglishEditor.uploadAsset('image')"><i class="fa-solid fa-image"></i> Upload Gambar</button>`)}
                ${field("Urutan", `<input type="number" name="sort_order" value="${esc(item.sort_order || 0)}">`)}
                ${field("Aktif", `<input type="checkbox" name="is_active" ${String(item.is_active ?? 1) === "1" ? "checked" : ""}>`)}
                <div class="ea-actions full"><button class="ea-btn good"><i class="fa-solid fa-floppy-disk"></i> Simpan Materi</button><button type="button" class="ea-btn secondary" onclick="EnglishEditor.renderMateri()"><i class="fa-solid fa-plus"></i> Baru</button></div>
            </form>
            <div><div class="ea-preview"><strong>Preview:</strong><br>${esc(item.title || "Pilih materi untuk melihat preview.")}<br><span class="ea-badge">${esc(item.materi_key || "")}</span>${previewAsset(item)}</div>${rows(list, [["Judul", m => `<strong>${esc(m.title)}</strong><br><span class="ea-badge">${esc(m.materi_key)}</span>`], ["Materi Key", m => esc(m.materi_key)], ["BAB", m => esc(m.chapter_title || "-")], ["Video Type", m => esc(m.video_type || "none")], ["Video URL", m => esc(m.video_url || "")], ["Status", m => m.is_active == 1 ? "Aktif" : "Nonaktif"]], "materi", "english_materi_delete.php")}</div>
        </div>`;
        bindForm("materi-form", "english_materi_save.php", loadAll);
    }

    function renderVideo() {
        const noVideo = state.materi.filter(m => !m.video_url);
        const withVideo = state.materi.filter(m => m.video_url);
        $("#ea-video").innerHTML = `<div class="ea-status"></div><div class="ea-grid">
            <form class="ea-form" id="video-form">
                ${field("Pilih Materi", `<select name="id" required>${state.materi.map(m => `<option value="${m.id}">${esc(m.title)}</option>`).join("")}</select>`, "full")}
                ${field("Video Type", videoSelect("youtube"))}
                ${field("Video URL", `<input name="video_url" required placeholder="https://youtu.be/...">`)}
                <div class="ea-actions full"><button class="ea-btn good"><i class="fa-solid fa-bolt"></i> Simpan Cepat</button></div>
            </form>
            <div class="ea-preview"><strong>Validasi YouTube:</strong><br>URL YouTube biasa akan dikonversi otomatis ke embed sebelum disimpan.</div>
        </div>
        <h3>Belum Punya Video (${noVideo.length})</h3>${rows(noVideo, [["Materi", m => esc(m.title)], ["Key", m => esc(m.materi_key)]], "materi", "english_materi_delete.php")}
        <h3>Sudah Punya Video (${withVideo.length})</h3>${rows(withVideo, [["Materi", m => esc(m.title)], ["Type", m => esc(m.video_type)], ["URL", m => esc(m.video_url)]], "materi", "english_materi_delete.php")}`;
        $("#video-form").addEventListener("submit", async e => {
            e.preventDefault();
            const fd = formData(e.target);
            const nextVideoType = fd.get("video_type");
            const nextVideoUrl = fd.get("video_url");
            const current = state.materi.find(m => String(m.id) === String(fd.get("id")));
            Object.entries(current || {}).forEach(([k, v]) => fd.set(k, v ?? ""));
            fd.set("video_type", nextVideoType);
            fd.set("video_url", normalizeYoutube(nextVideoUrl));
            await api("english_materi_save.php", { method: "POST", body: fd });
            await loadAll();
        });
    }

    function renderVocabulary(edit = {}) {
    const item = edit.id ? edit : {};
    const list = applyLocalFilter("vocabulary", state.vocabulary, v => `${v.abjad} ${v.indonesia} ${v.inggris} ${v.pengucapan} ${v.kategori} ${v.level} ${v.is_active}`);

    $("#ea-vocabulary").innerHTML = `${filterBox("vocabulary")}<div class="ea-status"></div><div class="ea-grid">${simpleForm("vocabulary-form", item, [
        ["abjad","Abjad"],["indonesia","Indonesia"],["inggris","Inggris"],["pengucapan","Pengucapan"],["kategori","Kategori"],["level","Level"],["sort_order","Urutan","number"],["is_active","Aktif","checkbox"]
    ], "english_vocabulary_save.php")}${rows(list, [["Indonesia", v => esc(v.indonesia)], ["Inggris", v => `<strong>${esc(v.inggris)}</strong>`], ["Kategori", v => esc(v.kategori)], ["Level", v => esc(v.level)]], "vocabulary", "english_vocabulary_delete.php")}</div>`;

    bindForm("vocabulary-form", "english_vocabulary_save.php", loadAll);
}

    function renderVerbs(edit = {}) {
        const item = edit.id ? edit : {};
        const list = applyLocalFilter("verbs", state.verbs, v => `${v.v1} ${v.v2} ${v.v3} ${v.v_ing} ${v.arti} ${v.tipe} ${v.level} ${v.is_active}`);
        $("#ea-verbs").innerHTML = `${filterBox("verbs")}<div class="ea-status"></div><div class="ea-grid">${simpleForm("verbs-form", item, [
            ["v1","V1"],["v2","V2"],["v3","V3"],["v_ing","V-ing"],["arti","Arti"],["tipe","Tipe"],["level","Level"],["sort_order","Urutan","number"],["is_active","Aktif","checkbox"]
        ], "english_verb_save.php")}${rows(list, [["V1", v => `<strong>${esc(v.v1)}</strong>`], ["V2", v => esc(v.v2)], ["V3", v => esc(v.v3)], ["Arti", v => esc(v.arti)]], "verbs", "english_verb_delete.php")}</div>`;
        bindForm("verbs-form", "english_verb_save.php", loadAll);
    }

    function renderExercises(edit = {}) {
        const item = edit.id ? edit : {};
        const list = applyLocalFilter("exercises", state.exercises, s => `${s.level} ${s.kategori} ${s.pertanyaan} ${s.jawaban_benar} ${s.is_active}`);
        $("#ea-exercises").innerHTML = `${filterBox("exercises")}<div class="ea-status"></div><div class="ea-grid">
            <form id="exercises-form" class="ea-form">
                <input type="hidden" name="id" value="${esc(item.id || "")}">
                ${field("Level", `<select name="level"><option>Basic</option><option ${item.level === "Intermediate" ? "selected" : ""}>Intermediate</option><option ${item.level === "Expert" ? "selected" : ""}>Expert</option></select>`)}
                ${field("Kategori", `<input name="kategori" value="${esc(item.kategori || "")}">`)}
                ${field("Pertanyaan", `<textarea name="pertanyaan" required>${esc(item.pertanyaan || "")}</textarea>`, "full")}
                ${["a","b","c","d"].map(x => field(`Pilihan ${x.toUpperCase()}`, `<textarea name="pilihan_${x}">${esc(item[`pilihan_${x}`] || "")}</textarea>`)).join("")}
                ${field("Jawaban Benar", `<select name="jawaban_benar">${["A","B","C","D"].map(x => `<option ${item.jawaban_benar === x ? "selected" : ""}>${x}</option>`).join("")}</select>`)}
                ${field("Pembahasan", `<textarea name="pembahasan">${esc(item.pembahasan || "")}</textarea>`)}
                ${field("Media Type", `<input name="media_type" value="${esc(item.media_type || "")}">`)}
                ${field("Media URL", `<input name="media_url" value="${esc(item.media_url || "")}">`)}
                ${field("Urutan", `<input type="number" name="sort_order" value="${esc(item.sort_order || 0)}">`)}
                ${field("Aktif", `<input type="checkbox" name="is_active" ${String(item.is_active ?? 1) === "1" ? "checked" : ""}>`)}
                <div class="ea-actions full"><button class="ea-btn good"><i class="fa-solid fa-floppy-disk"></i> Simpan Soal</button><button type="button" class="ea-btn secondary" onclick="EnglishEditor.renderExercises()">Baru</button></div>
            </form>
            <div>${rows(list, [["Level", s => esc(s.level)], ["Kategori", s => esc(s.kategori)], ["Pertanyaan", s => esc(String(s.pertanyaan).slice(0, 90))], ["Kunci", s => esc(s.jawaban_benar)]], "exercises", "english_exercise_delete.php")}</div>
        </div>`;
        bindForm("exercises-form", "english_exercise_save.php", loadAll);
    }

    function renderImport() {
        $("#ea-import").innerHTML = `<div class="ea-status"></div><div class="ea-actions">
            <button class="ea-btn" onclick="EnglishEditor.ping()"><i class="fa-solid fa-plug"></i> Cek API</button>
            <button class="ea-btn good" onclick="EnglishEditor.runImport()"><i class="fa-solid fa-file-import"></i> Jalankan Import TSV</button>
            <button class="ea-btn secondary" onclick="EnglishEditor.exportJson()"><i class="fa-solid fa-file-code"></i> Export JSON</button>
            <button class="ea-btn secondary" onclick="EnglishEditor.backupSql()"><i class="fa-solid fa-database"></i> Backup SQL</button>
        </div><pre id="ea-import-output" class="ea-preview" style="white-space:pre-wrap;margin-top:12px;"></pre>`;
    }

    function field(label, input, cls = "") { return `<div class="ea-field ${cls}"><label>${label}</label>${input}</div>`; }
    function videoSelect(val = "none") { return `<select name="video_type">${["none","local","youtube","embed","url","upload"].map(x => `<option value="${x}" ${val === x ? "selected" : ""}>${x}</option>`).join("")}</select>`; }
    function previewAsset(item) {
        const videoUrl = item.video_url || "";
        const visualUrl = item.link_visual || "";
        const video = videoUrl ? `<video class="ea-preview-media" controls src="${esc(videoUrl)}"></video>` : "";
        const image = visualUrl ? `<img class="ea-preview-media" src="${esc(visualUrl)}" alt="">` : "";
        return `<div class="ea-preview-assets">${video}${image}</div>`;
    }
    function simpleForm(id, item, defs) {
        return `<form class="ea-form" id="${id}"><input type="hidden" name="id" value="${esc(item.id || "")}">${defs.map(([name,label,type]) => field(label, type === "checkbox" ? `<input type="checkbox" name="${name}" ${String(item[name] ?? 1) === "1" ? "checked" : ""}>` : `<input type="${type || "text"}" name="${name}" value="${esc(item[name] || "")}">`)).join("")}<div class="ea-actions full"><button class="ea-btn good">Simpan</button><button type="button" class="ea-btn secondary" onclick="EnglishEditor.render()">Baru</button></div></form>`;
    }
    function bindForm(id, endpoint, done) {
        const form = $("#" + id);
        if (!form) return;
        form.addEventListener("submit", async e => {
            e.preventDefault();
            status("Menyimpan...");
            await api(endpoint, { method: "POST", body: formData(form) });
            await done();
        });
    }
    function normalizeYoutube(url) {
        url = String(url || "").trim();
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/);
        return match ? `https://www.youtube.com/embed/${match[1]}` : url;
    }

    function editMateri(key) {
        const item = state.materi.find(m => String(m.materi_key) === String(key));
        if (!item) {
            status("Materi tidak ditemukan: " + key);
            return;
        }
        renderMateri(item);
        document.getElementById("materi-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    async function uploadAsset(type) {
        const input = document.getElementById(type === "video" ? "ea-video-upload" : "ea-image-upload");
        const file = input?.files?.[0];
        const form = document.getElementById("materi-form");
        if (!file || !form) {
            status("Pilih file " + type + " dulu.");
            return;
        }
        const fd = new FormData();
        fd.set("asset_type", type);
        fd.set("file", file);
        status("Mengupload " + type + "...");
        const result = await api("english_upload_asset.php", { method: "POST", body: fd });
        if (type === "video") {
            form.elements.video_type.value = "local";
            form.elements.video_url.value = result.url;
        } else {
            form.elements.link_visual.value = result.url;
        }
        status("Upload berhasil: " + result.filename);
    }

    async function deleteItem(endpoint, id) {
        if (!confirm("Nonaktifkan data ini?")) return;
        const fd = new FormData();
        fd.set("id", id);
        await api(endpoint, { method: "POST", body: fd });
        await loadAll();
    }

    function render() {
        if (state.tab === "materi") renderMateri();
        if (state.tab === "video") renderVideo();
        if (state.tab === "vocabulary") renderVocabulary();
        if (state.tab === "verbs") renderVerbs();
        if (state.tab === "exercises") renderExercises();
        if (state.tab === "import") renderImport();
    }

    document.addEventListener("click", e => {
        const tab = e.target.closest(".ea-tab");
        if (tab) {
            state.tab = tab.dataset.tab;
            document.querySelectorAll(".ea-tab").forEach(x => x.classList.toggle("active", x === tab));
            document.querySelectorAll(".ea-panel").forEach(x => x.classList.toggle("active", x.dataset.panel === state.tab));
            render();
        }
        const editMateriBtn = e.target.closest("[data-action='edit-materi']");
        if (editMateriBtn) {
            editMateri(editMateriBtn.dataset.key);
            return;
        }

        const edit = e.target.closest("[data-edit]");
        if (edit) {
            const map = { materi: state.materi, vocabulary: state.vocabulary, verbs: state.verbs, exercises: state.exercises };
            const item = map[edit.dataset.edit].find(x => String(x.id) === String(edit.dataset.id));
            if (edit.dataset.edit === "materi") renderMateri(item);
            if (edit.dataset.edit === "vocabulary") renderVocabulary(item);
            if (edit.dataset.edit === "verbs") renderVerbs(item);
            if (edit.dataset.edit === "exercises") renderExercises(item);
        }
        const del = e.target.closest("[data-del]");
        if (del) deleteItem(del.dataset.del, del.dataset.id);
    });

    window.EnglishEditor = {
        render, renderMateri, renderExercises, uploadAsset,
        editMateri,
        clearFilters(type) { [`${type}-q`, `${type}-active`, `${type}-filter`].forEach(id => { const el = $("#" + id); if (el) el.value = ""; }); render(); },
        async syncLatInggris() {
            status("Sync dari Lat-Inggris...");
            const result = await api("english_sync_lat_inggris.php");
            status(`${result.message}. BAB ${result.chapters}, materi ${result.materi}.`);
            await loadAll();
        },
        async ping() { $("#ea-import-output").textContent = JSON.stringify(await api("english_ping.php"), null, 2); },
        async runImport() { $("#ea-import-output").textContent = JSON.stringify(await (await fetch(IMPORT_URL)).json(), null, 2); await loadAll(); },
        async exportJson() { $("#ea-import-output").textContent = JSON.stringify(await api("english_export_json.php"), null, 2); },
        async backupSql() { $("#ea-import-output").textContent = (await api("english_backup_sql.php")).sql; },
    };

    $("#ea-refresh").addEventListener("click", loadAll);
    loadAll().catch(err => status(err.message));
})();
