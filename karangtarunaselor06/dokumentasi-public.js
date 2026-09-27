let dokumentasiDbData = [];
let dokumentasiDbFiltered = [];
let dokumentasiDbPage = 1;
const dokumentasiDbPageSize = 5;
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

function dokExtractDriveId(url) {
    const value = String(url || '');
    const fileMatch = value.match(/\/file\/d\/([^/]+)/);
    if (fileMatch) return fileMatch[1];
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
    if (!value) return { tahun: '', bulan: '', label: '-' };
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return { tahun: '', bulan: '', label: value };
    const bulan = namaBulanDokumentasi[date.getMonth()];
    return { tahun: String(date.getFullYear()), bulan, label: `${String(date.getDate()).padStart(2, '0')} ${bulan} ${date.getFullYear()}` };
}

function dokIsiDropdown(id, values) {
    const select = document.getElementById(id);
    if (!select) return;
    const current = select.value || 'Semua';
    select.innerHTML = '<option value="Semua">Semua</option>' + values.map(value => `<option value="${dokEscape(value)}">${dokEscape(value)}</option>`).join('');
    select.value = values.includes(current) ? current : 'Semua';
}

window.loadDokumentasiDariDrive = async function loadDokumentasiDariDrive() {
    const tbody = document.getElementById('data-tabel-dokumentasi');
    if (!tbody) return;
    try {
        const response = await fetch(`/common/api/documentation_list.php?cache=${Date.now()}`);
        const result = await response.json();
        if (!result.success) throw new Error(result.message || 'Gagal memuat dokumentasi.');

        const tahunSet = new Set();
        const bulanSet = new Set();
        dokumentasiDbData = (result.data || []).map(item => {
            const dateParts = dokDateParts(item.event_date);
            if (dateParts.tahun) tahunSet.add(dateParts.tahun);
            if (dateParts.bulan) bulanSet.add(dateParts.bulan);
            return { ...item, tahun: dateParts.tahun, bulan: dateParts.bulan, tanggal_label: dateParts.label };
        });

        dokIsiDropdown('filter-dok-tahun', Array.from(tahunSet).sort().reverse());
        dokIsiDropdown('filter-dok-bulan', Array.from(bulanSet).sort((a, b) => namaBulanDokumentasi.indexOf(a) - namaBulanDokumentasi.indexOf(b)));
        window.terapkanFilterDokumentasi();
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:30px;color:#991b1b;">${dokEscape(error.message)}</td></tr>`;
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

function renderDokumentasiDb() {
    const tbody = document.getElementById('data-tabel-dokumentasi');
    if (!tbody) return;
    if (!dokumentasiDbFiltered.length) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:30px;color:#666;">Belum ada dokumentasi yang cocok.</td></tr>';
        return;
    }

    const start = (dokumentasiDbPage - 1) * dokumentasiDbPageSize;
    const pageData = dokumentasiDbFiltered.slice(start, start + dokumentasiDbPageSize);
    const rows = pageData.map(item => {
        const thumb = dokThumbnail(item);
        return `<tr>
            <td style="white-space:nowrap;">${dokEscape(item.tanggal_label)}</td>
            <td style="text-align:center;">
                <a href="${dokEscape(item.media_url)}" target="_blank" rel="noopener" style="display:inline-block;position:relative;">
                    <img src="${dokEscape(thumb)}" alt="${dokEscape(item.title)}" style="width:180px;height:112px;object-fit:cover;border-radius:12px;border:1px solid #dbe7f3;background:#f8fafc;">
                </a>
                <br><a href="${dokEscape(item.media_url)}" target="_blank" rel="noopener" style="font-size:12px;font-weight:800;color:#0f5ea8;">Lihat Dokumentasi</a>
            </td>
            <td>${dokEscape(item.category || '-')}</td>
            <td>${dokEscape(item.location || '-')}</td>
            <td><strong>${dokEscape(item.title)}</strong><br><span style="color:#64748b;font-size:12px;line-height:1.5;">${dokEscape(item.description || '')}</span></td>
        </tr>`;
    }).join('');

    const totalHal = Math.ceil(dokumentasiDbFiltered.length / dokumentasiDbPageSize);
    const nav = totalHal > 1 ? `<tr><td colspan="5" style="text-align:center;padding:18px;">
        <button onclick="navDok(-1)" ${dokumentasiDbPage <= 1 ? 'disabled' : ''} style="padding:8px 14px;margin:0 4px;border:0;border-radius:8px;background:#0f5ea8;color:#fff;font-weight:800;">Prev</button>
        <strong>Halaman ${dokumentasiDbPage} / ${totalHal}</strong>
        <button onclick="navDok(1)" ${dokumentasiDbPage >= totalHal ? 'disabled' : ''} style="padding:8px 14px;margin:0 4px;border:0;border-radius:8px;background:#0f5ea8;color:#fff;font-weight:800;">Next</button>
    </td></tr>` : '';

    tbody.innerHTML = rows + nav;
}

window.navDok = function navDok(dir) {
    const totalHal = Math.ceil(dokumentasiDbFiltered.length / dokumentasiDbPageSize);
    dokumentasiDbPage = Math.max(1, Math.min(totalHal, dokumentasiDbPage + dir));
    renderDokumentasiDb();
};