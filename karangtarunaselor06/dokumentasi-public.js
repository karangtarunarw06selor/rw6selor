const DOKUMENTASI_TSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR6rvpMrucgfgZ2o1AD5FmACm9Gu324J2zZF_hb1Q_J7rJpfZtDvZ0cyPYcWcZUo3uZyFdKvCu4e6OK/pub?gid=1848626837&single=true&output=tsv';
const DOKUMENTASI_FORM_URL = 'https://forms.gle/QEVYBHkxVyEPFreA6';
let dokumentasiDbData = [];
let dokumentasiDbFiltered = [];
let dokumentasiDbPage = 1;
const dokumentasiDbPageSize = 9;
const dokumentasiPagerGroupSize = 3;
const namaBulanDokumentasi = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

function dokEscape(value) {
    return String(value ?? '').replace(/[&<>'"]/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
    }[char]));
}

function dokParseTsv(text) {
    const rows = [];
    let row = [];
    let cell = '';
    let quoted = false;
    for (let i = 0; i < text.length; i += 1) {
        const char = text[i];
        const next = text[i + 1];
        if (char === '"') {
            if (quoted && next === '"') {
                cell += '"';
                i += 1;
            } else {
                quoted = !quoted;
            }
        } else if (char === '\t' && !quoted) {
            row.push(cell.trim());
            cell = '';
        } else if ((char === '\n' || char === '\r') && !quoted) {
            if (char === '\r' && next === '\n') i += 1;
            row.push(cell.trim());
            if (row.some(Boolean)) rows.push(row);
            row = [];
            cell = '';
        } else {
            cell += char;
        }
    }
    row.push(cell.trim());
    if (row.some(Boolean)) rows.push(row);
    return rows;
}

function dokKey(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function dokPick(row, headers, candidates) {
    const wanted = candidates.map(dokKey);
    for (let i = 0; i < headers.length; i += 1) {
        if (wanted.includes(dokKey(headers[i]))) return row[i] || '';
    }
    return '';
}

function dokSplitMediaUrls(value) {
    const text = String(value || '').trim();
    if (!text) return [];
    const matches = text.match(/https?:\/\/[^\s,]+/gi);
    if (matches?.length) return matches.map(item => item.trim()).filter(Boolean);
    return text.split(/[\n,]+/).map(item => item.trim()).filter(Boolean);
}

function dokExtractDriveId(url) {
    const value = String(url || '');
    const fileMatch = value.match(/\/file\/d\/([^/]+)/);
    if (fileMatch) return fileMatch[1];
    const folderMatch = value.match(/\/folders\/([^/?]+)/);
    if (folderMatch) return folderMatch[1];
    const idMatch = value.match(/[?&]id=([^&]+)/);
    if (idMatch) return idMatch[1];
    return '';
}

function dokExtractYouTubeId(url) {
    const value = String(url || '');
    const match = value.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/);
    return match ? match[1] : '';
}

function dokThumbnail(item) {
    if (item.thumbnail_url) return item.thumbnail_url;
    const driveId = dokExtractDriveId(item.media_url);
    if (driveId) return `https://drive.google.com/thumbnail?id=${encodeURIComponent(driveId)}&sz=w1000`;
    const youtubeId = dokExtractYouTubeId(item.media_url);
    if (youtubeId) return `https://img.youtube.com/vi/${encodeURIComponent(youtubeId)}/hqdefault.jpg`;
    return 'images/karangtaruna.avif';
}

function dokDateParts(value) {
    if (!value) return { tahun: '', bulan: '', label: '-', sortValue: 0 };
    let date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
        const parts = String(value).split(/[/-]/).map((item) => item.trim());
        if (parts.length >= 3) {
            const [d, m, y] = parts[0].length === 4 ? [parts[2], parts[1], parts[0]] : parts;
            date = new Date(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T00:00:00`);
        }
    }
    if (Number.isNaN(date.getTime())) return { tahun: '', bulan: '', label: value, sortValue: 0 };
    const bulan = namaBulanDokumentasi[date.getMonth()];
    return { tahun: String(date.getFullYear()), bulan, label: `${String(date.getDate()).padStart(2, '0')} ${bulan} ${date.getFullYear()}`, sortValue: date.getTime() };
}

function dokIsiDropdown(id, values) {
    const select = document.getElementById(id);
    if (!select) return;
    const current = select.value || 'Semua';
    select.innerHTML = '<option value="Semua">Semua</option>' + values.map(value => `<option value="${dokEscape(value)}">${dokEscape(value)}</option>`).join('');
    select.value = values.includes(current) ? current : 'Semua';
}

function dokMapRows(rows) {
    if (!rows.length) return [];
    const headers = rows[0];
    return rows.slice(1).flatMap((row, index) => {
        const rawUrl = dokPick(row, headers, ['media_url', 'link', 'link dokumentasi', 'upload foto', 'file', 'google drive', 'drive', 'foto', 'dokumentasi']) || row.find((cell) => /^https?:\/\//i.test(cell || '')) || '';
        const urls = dokSplitMediaUrls(rawUrl);
        const title = dokPick(row, headers, ['title', 'judul', 'nama kegiatan', 'kegiatan', 'agenda']) || `Dokumentasi ${index + 1}`;
        const eventDate = dokPick(row, headers, ['tanggal kegiatan', 'event_date', 'tanggal']);
        const location = dokPick(row, headers, ['location', 'lokasi', 'tempat']);
        const category = dokPick(row, headers, ['subject', 'category', 'kategori', 'jenis kegiatan']) || 'Kegiatan';
        const description = dokPick(row, headers, ['keterangan kegiatan', 'description', 'deskripsi', 'keterangan', 'catatan']);
        const thumbnail = dokPick(row, headers, ['thumbnail_url', 'thumbnail', 'cover', 'preview']);
        const sourceUrls = urls.length ? urls : [''];
        return sourceUrls.map((mediaUrl, mediaIndex) => ({
            id: `${index + 1}-${mediaIndex + 1}`,
            title: urls.length > 1 ? `${title} #${mediaIndex + 1}` : title,
            event_date: eventDate,
            location,
            category,
            description,
            media_url: mediaUrl,
            thumbnail_url: thumbnail,
        }));
    }).filter((item) => item.media_url || item.title);
}

window.loadDokumentasiDariDrive = async function loadDokumentasiDariDrive() {
    const container = document.getElementById('dokumentasi-grid');
    if (!container) return;
    try {
        const response = await fetch(`${DOKUMENTASI_TSV_URL}&cache=${Date.now()}`);
        if (!response.ok) throw new Error('Gagal memuat TSV dokumentasi.');
        const rows = dokParseTsv(await response.text());
        const tahunSet = new Set();
        const bulanSet = new Set();
        dokumentasiDbData = dokMapRows(rows).map((item, sourceIndex) => {
            const dateParts = dokDateParts(item.event_date);
            if (dateParts.tahun) tahunSet.add(dateParts.tahun);
            if (dateParts.bulan) bulanSet.add(dateParts.bulan);
            return { ...item, tahun: dateParts.tahun, bulan: dateParts.bulan, tanggal_label: dateParts.label, tanggal_sort: dateParts.sortValue, source_index: sourceIndex };
        }).sort((a, b) => (b.tanggal_sort - a.tanggal_sort) || (a.source_index - b.source_index));
        dokIsiDropdown('filter-dok-tahun', Array.from(tahunSet).sort().reverse());
        dokIsiDropdown('filter-dok-bulan', Array.from(bulanSet).sort((a, b) => namaBulanDokumentasi.indexOf(a) - namaBulanDokumentasi.indexOf(b)));
        window.terapkanFilterDokumentasi();
    } catch (error) {
        container.innerHTML = `<div class="dok-empty">${dokEscape(error.message)}</div>`;
    }
};

window.terapkanFilterDokumentasi = function terapkanFilterDokumentasi() {
    const thn = document.getElementById('filter-dok-tahun')?.value || 'Semua';
    const bln = document.getElementById('filter-dok-bulan')?.value || 'Semua';
    const cari = (document.getElementById('input-cari-dok')?.value || '').toLowerCase();
    dokumentasiDbFiltered = dokumentasiDbData.filter(item => {
        const haystack = `${item.title} ${item.category} ${item.description} ${item.location}`.toLowerCase();
        return (thn === 'Semua' || item.tahun === thn) && (bln === 'Semua' || item.bulan === bln) && haystack.includes(cari);
    });
    dokumentasiDbPage = 1;
    renderDokumentasiDb();
};

function dokPageNumbers(totalHal) {
    const currentGroup = Math.floor((dokumentasiDbPage - 1) / dokumentasiPagerGroupSize);
    const startPage = currentGroup * dokumentasiPagerGroupSize + 1;
    const endPage = Math.min(totalHal, startPage + dokumentasiPagerGroupSize - 1);
    const pages = [];
    for (let page = startPage; page <= endPage; page += 1) pages.push(page);
    return pages;
}

function renderDokumentasiPager(totalHal) {
    const pager = document.getElementById('dokumentasi-pager');
    if (!pager) return;
    if (totalHal <= 1) {
        pager.innerHTML = '';
        return;
    }
    const pages = dokPageNumbers(totalHal).map(page => (
        `<button class="dok-page-number ${page === dokumentasiDbPage ? 'active' : ''}" onclick="gotoDokPage(${page})" aria-label="Halaman ${page}">${page}</button>`
    )).join('');
    const previous = dokumentasiDbPage > 1
        ? `<button class="dok-nav-btn dok-prev" onclick="navDok(-1)"><i class="fa-solid fa-chevron-left"></i> Sebelumnya</button>`
        : '<span></span>';
    const next = dokumentasiDbPage < totalHal
        ? `<button class="dok-nav-btn dok-next" onclick="navDok(1)">Selanjutnya <i class="fa-solid fa-chevron-right"></i></button>`
        : '<span></span>';
    pager.innerHTML = `<div class="dok-pager-left">${previous}</div><div class="dok-pager-center">${pages}</div><div class="dok-pager-right">${next}</div>`;
}

function renderDokumentasiDb() {
    const container = document.getElementById('dokumentasi-grid');
    if (!container) return;
    if (!dokumentasiDbFiltered.length) {
        container.innerHTML = '<div class="dok-empty">Belum ada dokumentasi yang cocok.</div>';
        renderDokumentasiPager(0);
        return;
    }
    const totalHal = Math.ceil(dokumentasiDbFiltered.length / dokumentasiDbPageSize);
    dokumentasiDbPage = Math.max(1, Math.min(totalHal, dokumentasiDbPage));
    const start = (dokumentasiDbPage - 1) * dokumentasiDbPageSize;
    const pageData = dokumentasiDbFiltered.slice(start, start + dokumentasiDbPageSize);
    container.innerHTML = pageData.map(item => {
        const thumb = dokThumbnail(item);
        return `<article class="dok-card">
            <a class="dok-thumb" href="${dokEscape(item.media_url || '#')}" target="_blank" rel="noopener">
                <img src="${dokEscape(thumb)}" alt="${dokEscape(item.title)}" loading="lazy" onerror="this.src='images/karangtaruna.avif'">
                <span><i class="fa-solid fa-arrow-up-right-from-square"></i> Buka</span>
            </a>
            <div class="dok-card-body">
                <div class="dok-meta"><span>${dokEscape(item.tanggal_label)}</span><span>${dokEscape(item.category || 'Kegiatan')}</span></div>
                <h3>${dokEscape(item.title)}</h3>
                <p>${dokEscape(item.description || item.location || 'Dokumentasi kegiatan RW06 Selor.')}</p>
            </div>
        </article>`;
    }).join('');
    renderDokumentasiPager(totalHal);
}

window.navDok = function navDok(dir) {
    const totalHal = Math.ceil(dokumentasiDbFiltered.length / dokumentasiDbPageSize);
    dokumentasiDbPage = Math.max(1, Math.min(totalHal, dokumentasiDbPage + dir));
    renderDokumentasiDb();
};

window.gotoDokPage = function gotoDokPage(page) {
    const totalHal = Math.ceil(dokumentasiDbFiltered.length / dokumentasiDbPageSize);
    dokumentasiDbPage = Math.max(1, Math.min(totalHal, Number(page) || 1));
    renderDokumentasiDb();
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-dokumentasi-form]').forEach((link) => {
        link.href = DOKUMENTASI_FORM_URL;
        link.target = '_blank';
        link.rel = 'noopener';
    });
});
