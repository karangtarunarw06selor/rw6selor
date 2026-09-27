const DOCS_API_BASE = '/common/api';
let docsData = [];

function docsEscape(value) {
    return String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

function docsExtractDriveId(url) {
    const value = String(url || '');
    const fileMatch = value.match(/\/file\/d\/([^/]+)/);
    if (fileMatch) return fileMatch[1];
    const idMatch = value.match(/[?&]id=([^&]+)/);
    if (idMatch) return idMatch[1];
    return '';
}

function docsExtractYouTubeId(url) {
    const value = String(url || '');
    const match = value.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/);
    return match ? match[1] : '';
}

function docsThumbnail(item) {
    if (item.thumbnail_url) return item.thumbnail_url;
    const driveId = docsExtractDriveId(item.media_url);
    if (driveId) return `https://drive.google.com/thumbnail?id=${encodeURIComponent(driveId)}&sz=w1000`;
    const youtubeId = docsExtractYouTubeId(item.media_url);
    if (youtubeId) return `https://img.youtube.com/vi/${encodeURIComponent(youtubeId)}/hqdefault.jpg`;
    return '';
}

function docsShowAlert(message, type = 'success') {
    const alert = document.getElementById('docsAdminAlert');
    if (!alert) return;
    alert.className = `docs-alert ${type}`;
    alert.textContent = message;
    window.setTimeout(() => { alert.className = 'docs-alert'; }, 3500);
}

function docsFormPayload() {
    return {
        title: document.getElementById('docs_title').value.trim(),
        event_date: document.getElementById('docs_event_date').value,
        location: document.getElementById('docs_location').value.trim(),
        category: document.getElementById('docs_category').value.trim(),
        description: document.getElementById('docs_description').value.trim(),
        media_type: document.getElementById('docs_media_type').value,
        media_url: document.getElementById('docs_media_url').value.trim(),
        thumbnail_url: document.getElementById('docs_thumbnail_url').value.trim(),
        sort_order: Number(document.getElementById('docs_sort_order').value || 0),
        is_active: document.getElementById('docs_is_active').value === '1',
    };
}

async function docsLoad() {
    const tbody = document.getElementById('docsTableBody');
    try {
        const response = await fetch(`${DOCS_API_BASE}/documentation_manage.php?cache=${Date.now()}`);
        const result = await response.json();
        if (!result.success) throw new Error(result.message || 'Gagal memuat dokumentasi.');
        docsData = result.data || [];
        if (!docsData.length) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:24px;color:#64748b">Belum ada dokumentasi.</td></tr>';
            return;
        }
        tbody.innerHTML = docsData.map(item => {
            const thumb = docsThumbnail(item);
            const image = thumb ? `<img class="docs-thumb" src="${docsEscape(thumb)}" alt="${docsEscape(item.title)}">` : '<div class="docs-thumb"></div>';
            return `<tr>
                <td>${image}</td>
                <td><strong>${docsEscape(item.title)}</strong><br><span class="docs-muted">${docsEscape(item.category || '-')} · ${docsEscape(item.location || '-')}</span><br><span class="docs-muted">${docsEscape(item.description || '')}</span></td>
                <td>${docsEscape(item.event_date || '-')}</td>
                <td><a href="${docsEscape(item.media_url)}" target="_blank" rel="noopener">Buka Link</a><br><span class="docs-muted">${docsEscape(item.media_type)}</span></td>
                <td><span class="docs-chip ${Number(item.is_active) ? '' : 'off'}">${Number(item.is_active) ? 'Tampil' : 'Sembunyi'}</span></td>
                <td><button class="docs-btn docs-secondary" onclick="docsEdit(${item.id})">Edit</button> <button class="docs-btn docs-danger" onclick="docsDelete(${item.id})">Hapus</button></td>
            </tr>`;
        }).join('');
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="6" style="color:#991b1b;padding:24px">${docsEscape(error.message)}</td></tr>`;
    }
}

async function docsSave(event) {
    event.preventDefault();
    const id = document.getElementById('docs_id').value;
    const payload = docsFormPayload();
    const url = id ? `${DOCS_API_BASE}/documentation_manage.php?id=${encodeURIComponent(id)}` : `${DOCS_API_BASE}/documentation_manage.php`;
    const method = id ? 'PUT' : 'POST';
    try {
        const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || 'Gagal menyimpan dokumentasi.');
        docsResetForm();
        await docsLoad();
        docsShowAlert('Dokumentasi tersimpan.');
    } catch (error) {
        docsShowAlert(error.message, 'error');
    }
}

function docsEdit(id) {
    const item = docsData.find(row => Number(row.id) === Number(id));
    if (!item) return;
    document.getElementById('docs_id').value = item.id;
    document.getElementById('docs_title').value = item.title || '';
    document.getElementById('docs_event_date').value = item.event_date || '';
    document.getElementById('docs_location').value = item.location || '';
    document.getElementById('docs_category').value = item.category || '';
    document.getElementById('docs_description').value = item.description || '';
    document.getElementById('docs_media_type').value = item.media_type || 'link';
    document.getElementById('docs_media_url').value = item.media_url || '';
    document.getElementById('docs_thumbnail_url').value = item.thumbnail_url || '';
    document.getElementById('docs_sort_order').value = item.sort_order || 0;
    document.getElementById('docs_is_active').value = Number(item.is_active) ? '1' : '0';
    document.getElementById('docsCancelEditBtn').style.display = 'inline-flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function docsDelete(id) {
    if (!confirm('Hapus dokumentasi ini? File eksternal tidak dihapus, hanya metadata/link di DB.')) return;
    try {
        const response = await fetch(`${DOCS_API_BASE}/documentation_manage.php?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || 'Gagal menghapus dokumentasi.');
        await docsLoad();
        docsShowAlert('Dokumentasi dihapus.');
    } catch (error) {
        docsShowAlert(error.message, 'error');
    }
}

function docsResetForm() {
    document.getElementById('docsAdminForm').reset();
    document.getElementById('docs_id').value = '';
    document.getElementById('docs_sort_order').value = '0';
    document.getElementById('docs_is_active').value = '1';
    document.getElementById('docsCancelEditBtn').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('docsAdminForm').addEventListener('submit', docsSave);
    document.getElementById('docsCancelEditBtn').addEventListener('click', docsResetForm);
    docsLoad();
});
