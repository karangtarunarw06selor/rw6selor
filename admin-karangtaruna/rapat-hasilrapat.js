(function () {
    const HASIL_RAPAT_PUBLIC_API_BASES = getHasilRapatPublicApiBases();
    const PRIMARY_HASIL_RAPAT_PUBLIC_API_BASE = HASIL_RAPAT_PUBLIC_API_BASES[0];

    function getHasilRapatPublicApiBases() {
        const publicApiBase = '/common/api';
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const normalizedOrigin = /^https?:\/\/(?:mudamudiselor\.web\.id|mudamudiselor\.biz\.id)$/i.test(origin)
            ? `${origin.replace(/\/+$/, '')}/common/api`
            : '';

        return [...new Set([normalizedOrigin, publicApiBase].filter(Boolean))];
    }

    const PUBLIC_BASE = PRIMARY_HASIL_RAPAT_PUBLIC_API_BASE.replace(/\/common\/api\/?$/, '');
    const BULAN = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember'
    ];
    const RAPAT_ITEMS_PER_PAGE = 5;

    let hasilRapatData = [];
    let rapatCurrentPage = 1;
    let rapatFilteredData = [];

    const escapeHtml = (value) => String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    function renderInlineMarkdown(text) {
        return escapeHtml(text)
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
    }

    function formatRapatText(text) {
        const lines = String(text ?? '')
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .split('\n');

        function renderLines(blockLines) {
            const html = [];

            for (let index = 0; index < blockLines.length; index += 1) {
                const rawLine = blockLines[index];
                const line = rawLine.trim();

                if (!line) continue;

                if (line === ':::columns') {
                    const columns = [];
                    let currentColumn = null;

                    index += 1;
                    for (; index < blockLines.length; index += 1) {
                        const columnLine = blockLines[index].trim();
                        if (columnLine === ':::end') break;
                        if (columnLine === ':::col') {
                            currentColumn = [];
                            columns.push(currentColumn);
                            continue;
                        }
                        if (currentColumn) currentColumn.push(blockLines[index]);
                    }

                    if (columns.length) {
                        html.push(`<div class="rapat-columns">${columns.map((column) => (
                            `<div class="rapat-column">${renderLines(column)}</div>`
                        )).join('')}</div>`);
                    }
                    continue;
                }

                if (/^##\s+/.test(line)) {
                    html.push(`<h4 class="rapat-md-heading">${renderInlineMarkdown(line.replace(/^##\s+/, ''))}</h4>`);
                    continue;
                }

                if (line === '---') {
                    html.push('<hr>');
                    continue;
                }

                if (/^>\s*/.test(line)) {
                    html.push(`<blockquote>${renderInlineMarkdown(line.replace(/^>\s*/, ''))}</blockquote>`);
                    continue;
                }

                if (/^[-•*]\s+/.test(line)) {
                    const items = [];
                    for (; index < blockLines.length; index += 1) {
                        const itemLine = blockLines[index].trim();
                        if (!/^[-•*]\s+/.test(itemLine)) break;
                        items.push(`<li>${renderInlineMarkdown(itemLine.replace(/^[-•*]\s+/, ''))}</li>`);
                    }
                    index -= 1;
                    html.push(`<ul class="rapat-md-list">${items.join('')}</ul>`);
                    continue;
                }

                if (/^\d+\.\s+/.test(line)) {
                    const items = [];
                    for (; index < blockLines.length; index += 1) {
                        const itemLine = blockLines[index].trim();
                        if (!/^\d+\.\s+/.test(itemLine)) break;
                        items.push(`<li>${renderInlineMarkdown(itemLine.replace(/^\d+\.\s+/, ''))}</li>`);
                    }
                    index -= 1;
                    html.push(`<ol class="rapat-md-list">${items.join('')}</ol>`);
                    continue;
                }

                if (/:$/.test(line)) {
                    html.push(`<p class="rapat-subheading">${renderInlineMarkdown(line)}</p>`);
                    continue;
                }

                html.push(`<p>${renderInlineMarkdown(line)}</p>`);
            }

            return html.join('');
        }

        return renderLines(lines) || '<p>-</p>';
    }

    function lampiranUrl(path) {
        if (!path) return '';
        if (/^https?:\/\//i.test(path)) return path;
        return `${PUBLIC_BASE}/${String(path).replace(/^\/+/, '')}`;
    }

    function isJsonLikeResponse(response) {
        const contentType = response.headers.get('content-type') || '';
        return contentType.toLowerCase().includes('application/json');
    }

    async function fetchHasilRapatFromApi() {
        let lastError = new Error('Gagal memuat arsip hasil rapat.');

        for (const baseUrl of HASIL_RAPAT_PUBLIC_API_BASES) {
            try {
                const requestUrl = `${baseUrl}/hasil_rapat_list.php?status_publikasi=publish&cache=${Date.now()}`;
                const response = await fetch(requestUrl, {
                    headers: {
                        Accept: 'application/json'
                    }
                });
                const responseText = await response.text();

                if (!response.ok) {
                    throw new Error(response.status === 404
                        ? 'Endpoint hasil rapat tidak ditemukan di hosting.'
                        : 'Server hasil rapat sedang tidak bisa diakses.');
                }

                if (!isJsonLikeResponse(response)) {
                    throw new Error('Respons hosting hasil rapat bukan JSON.');
                }

                let result;
                try {
                    result = JSON.parse(responseText);
                } catch (parseError) {
                    throw new Error('Respons hosting hasil rapat tidak valid.');
                }

                if (!result.success) {
                    throw new Error(result.message || 'Gagal memuat arsip hasil rapat.');
                }

                return Array.isArray(result.data) ? result.data : [];
            } catch (error) {
                lastError = error;
            }
        }

        throw lastError;
    }

    function stripMarkdownForPreview(text, maxLength = 120) {
        let value = String(text || '');

        value = value
            .replace(/:::columns|:::col|:::end/g, ' ')
            .replace(/^#{1,6}\s*/gm, '')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/__(.*?)__/g, '$1')
            .replace(/_(.*?)_/g, '$1')
            .replace(/^[-*•]\s+/gm, '')
            .replace(/^\d+\.\s+/gm, '')
            .replace(/^>\s*/gm, '')
            .replace(/^---+$/gm, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        if (!value) return 'Belum ada ringkasan hasil rapat.';
        if (value.length > maxLength) {
            return `${value.slice(0, maxLength).trim()}...`;
        }

        return value;
    }

    function getDateParts(row) {
        const tanggal = row.tanggal_rapat || '';
        const match = String(tanggal).match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (!match) return { tahun: '', bulan: '' };
        return {
            tahun: match[1],
            bulan: String(Number(match[2]))
        };
    }

    function sortRapatTerbaruDulu(rows) {
        return [...rows].sort((a, b) => {
            const dateA = String(a.tanggal_rapat || '');
            const dateB = String(b.tanggal_rapat || '');
            if (dateA !== dateB) return dateB.localeCompare(dateA);
            return Number(b.id || 0) - Number(a.id || 0);
        });
    }

    function populateFilterTahun() {
        const select = document.getElementById('filter-rapat-tahun');
        if (!select) return;

        const tahunList = [...new Set(hasilRapatData.map((row) => getDateParts(row).tahun).filter(Boolean))]
            .sort((a, b) => Number(b) - Number(a));

        select.innerHTML = '<option value="Semua">Semua Tahun</option>' + tahunList.map((tahun) => (
            `<option value="${escapeHtml(tahun)}">${escapeHtml(tahun)}</option>`
        )).join('');
    }

    function populateFilterBulan() {
        const select = document.getElementById('filter-rapat-bulan');
        if (!select) return;

        select.innerHTML = '<option value="Semua">Semua Bulan</option>' + BULAN.map((bulan, index) => (
            `<option value="${index + 1}">${escapeHtml(bulan)}</option>`
        )).join('');
    }

    function renderRows(rows) {
        const container = document.getElementById('data-tabel-rapat');
        if (!container) return;

        if (!rows.length) {
            container.innerHTML = '<div class="rapat-empty-state">Belum ada hasil rapat.</div>';
            return;
        }

        container.innerHTML = rows.map((row, index) => {
            const id = row.id || `rapat-${index}`;
            const tanggal = row.tanggal_rapat_format || row.tanggal_rapat || '-';
            const agenda = row.agenda || '-';
            const lokasi = row.lokasi_rapat || '-';
            const preview = stripMarkdownForPreview(row.hasil_musyawarah);
            const peserta = String(row.peserta_rapat ?? '').trim();
            const catatan = String(row.catatan ?? '').trim();
            const lampiran = row.lampiran_file ? `
                <div class="rapat-card-footer">
                    <a class="rapat-attachment-btn" href="${escapeHtml(lampiranUrl(row.lampiran_file))}" target="_blank" rel="noopener">
                        <i class="fa-solid fa-paperclip"></i> Lihat Lampiran
                    </a>
                </div>
            ` : '';

            return `
                <article class="rapat-card" data-rapat-id="${escapeHtml(id)}">
                    <div class="rapat-card-header">
                        <div>
                            <h3 class="rapat-card-title">${escapeHtml(agenda)}</h3>
                            <p class="rapat-card-subtitle">
                                <i class="fa-solid fa-calendar-days"></i> ${escapeHtml(tanggal)}
                                <span>&bull;</span>
                                <i class="fa-solid fa-location-dot"></i> ${escapeHtml(lokasi)}
                            </p>
                        </div>
                        <span class="rapat-card-badge">NOTULEN</span>
                    </div>

                    <div class="rapat-card-preview">${escapeHtml(preview)}</div>

                    <div class="rapat-card-detail" hidden>
                        <div class="rapat-section">
                            <h4><i class="fa-solid fa-list-check"></i> Hasil Musyawarah / Keputusan</h4>
                            <div class="rapat-content">
                                ${formatRapatText(row.hasil_musyawarah)}
                            </div>
                        </div>

                        ${peserta ? `
                            <div class="rapat-section">
                                <h4><i class="fa-solid fa-users"></i> Peserta Rapat</h4>
                                <div class="rapat-content">${formatRapatText(peserta)}</div>
                            </div>
                        ` : ''}

                        ${catatan ? `
                            <div class="rapat-section">
                                <h4><i class="fa-solid fa-note-sticky"></i> Catatan Tambahan</h4>
                                <div class="rapat-content">${formatRapatText(catatan)}</div>
                            </div>
                        ` : ''}

                        ${lampiran}
                    </div>

                    <button type="button" class="rapat-toggle-detail" aria-expanded="false">
                        <span>Lihat Detail</span>
                        <i class="fa-solid fa-chevron-down"></i>
                    </button>
                </article>
            `;
        }).join('');
    }

    function getPaginatedRapatData() {
        const start = (rapatCurrentPage - 1) * RAPAT_ITEMS_PER_PAGE;
        const end = start + RAPAT_ITEMS_PER_PAGE;
        return rapatFilteredData.slice(start, end);
    }

    function renderRapatPagination() {
        const container = document.getElementById('rapatPagination');
        if (!container) return;

        const totalPages = Math.ceil(rapatFilteredData.length / RAPAT_ITEMS_PER_PAGE);
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        const isFirst = rapatCurrentPage === 1;
        const isLast = rapatCurrentPage === totalPages;
        const classes = ['rapat-pagination'];
        if (isFirst) classes.push('is-first');
        if (isLast) classes.push('is-last');

        container.innerHTML = `
            <div class="${classes.join(' ')}">
                ${!isFirst ? `
                    <button type="button" class="rapat-page-btn rapat-page-newer">
                        <i class="fa-solid fa-chevron-left"></i>
                        <span>Terbaru</span>
                    </button>
                ` : ''}

                <div class="rapat-page-info">
                    Halaman ${rapatCurrentPage} dari ${totalPages}
                </div>

                ${!isLast ? `
                    <button type="button" class="rapat-page-btn rapat-page-older">
                        <span>Sebelumnya</span>
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                ` : ''}
            </div>
        `;
    }

    function renderRapatPage() {
        renderRows(getPaginatedRapatData());
        renderRapatPagination();
    }

    function scrollToRapatList() {
        document.getElementById('data-tabel-rapat')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    function setCardExpanded(card, shouldExpand) {
        const detail = card.querySelector('.rapat-card-detail');
        const button = card.querySelector('.rapat-toggle-detail');
        const label = button?.querySelector('span');
        const icon = button?.querySelector('i');

        if (!detail || !button || !label || !icon) return;

        detail.hidden = !shouldExpand;
        card.classList.toggle('is-expanded', shouldExpand);
        button.setAttribute('aria-expanded', String(shouldExpand));
        label.textContent = shouldExpand ? 'Sembunyikan' : 'Lihat Detail';
        icon.classList.toggle('fa-chevron-down', !shouldExpand);
        icon.classList.toggle('fa-chevron-up', shouldExpand);
    }

    document.addEventListener('click', (event) => {
        const olderButton = event.target.closest('.rapat-page-older');
        if (olderButton) {
            const totalPages = Math.ceil(rapatFilteredData.length / RAPAT_ITEMS_PER_PAGE);
            if (rapatCurrentPage < totalPages) {
                rapatCurrentPage += 1;
                renderRapatPage();
                scrollToRapatList();
            }
            return;
        }

        const newerButton = event.target.closest('.rapat-page-newer');
        if (newerButton) {
            if (rapatCurrentPage > 1) {
                rapatCurrentPage -= 1;
                renderRapatPage();
                scrollToRapatList();
            }
            return;
        }

        const button = event.target.closest('.rapat-toggle-detail');
        if (!button) return;

        const card = button.closest('.rapat-card');
        if (!card) return;

        const shouldExpand = button.getAttribute('aria-expanded') !== 'true';

        if (shouldExpand) {
            document.querySelectorAll('.rapat-card.is-expanded').forEach((openCard) => {
                if (openCard !== card) setCardExpanded(openCard, false);
            });
        }

        setCardExpanded(card, shouldExpand);
    });

    window.terapkanFilterRapat = function terapkanFilterRapat() {
        const tahun = document.getElementById('filter-rapat-tahun')?.value || 'Semua';
        const bulan = document.getElementById('filter-rapat-bulan')?.value || 'Semua';
        const keyword = (document.getElementById('input-cari-rapat')?.value || '').trim().toLowerCase();

        rapatFilteredData = hasilRapatData.filter((row) => {
            const parts = getDateParts(row);
            const matchesTahun = tahun === 'Semua' || parts.tahun === tahun;
            const matchesBulan = bulan === 'Semua' || parts.bulan === bulan;
            const searchable = [
                row.agenda,
                row.hasil_musyawarah,
                row.lokasi_rapat,
                row.peserta_rapat,
                row.catatan
            ].join(' ').toLowerCase();
            const matchesKeyword = !keyword || searchable.includes(keyword);

            return matchesTahun && matchesBulan && matchesKeyword;
        });

        rapatCurrentPage = 1;
        renderRapatPage();
    };

    async function loadHasilRapat() {
        const container = document.getElementById('data-tabel-rapat');
        if (!container) return;

        try {
            hasilRapatData = sortRapatTerbaruDulu(await fetchHasilRapatFromApi());
            populateFilterTahun();
            populateFilterBulan();
            window.terapkanFilterRapat();
        } catch (error) {
            const message = error instanceof Error && error.message
                ? error.message
                : 'Arsip hasil rapat belum bisa dimuat dari hosting.';
            container.innerHTML = `<div class="rapat-empty-state">${escapeHtml(message)}</div>`;
            document.getElementById('rapatPagination')?.replaceChildren();
        }
    }

    document.addEventListener('DOMContentLoaded', loadHasilRapat);
})();
