(function () {
    const hostname = location.hostname;
    const IS_LOCAL = hostname === 'localhost' || hostname === '127.0.0.1';
    const HASIL_RAPAT_API_BASE = IS_LOCAL
        ? 'http://localhost:8000/public_html/common/api'
        : 'https://mudamudiselor.web.id/common/api';

    const HASIL_RAPAT_PUBLIC_BASE = HASIL_RAPAT_API_BASE.replace(/\/common\/api\/?$/, '');
    let hasilRapatData = [];

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

    function renderRapatMarkdown(text) {
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

                if (/^-\s+/.test(line)) {
                    const items = [];
                    for (; index < blockLines.length; index += 1) {
                        const itemLine = blockLines[index].trim();
                        if (!/^-\s+/.test(itemLine)) break;
                        items.push(`<li>${renderInlineMarkdown(itemLine.replace(/^-\s+/, ''))}</li>`);
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

    function insertAtCursor(textarea, before, after = '') {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        const selected = value.slice(start, end);
        const insertText = selected ? `${before}${selected}${after}` : before;

        textarea.value = `${value.slice(0, start)}${insertText}${value.slice(end)}`;
        textarea.focus();

        const cursorPosition = selected
            ? start + insertText.length
            : start + before.length;
        textarea.setSelectionRange(cursorPosition, cursorPosition);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function initRapatEditor() {
        const textarea = document.getElementById('hasil_musyawarah');
        const toolbar = document.querySelector('.rapat-editor-toolbar');
        const preview = document.getElementById('hasilRapatEditorPreview');

        if (!textarea || !toolbar || !preview) return;

        const updatePreview = () => {
            if (preview.hidden) return;
            preview.innerHTML = `<div class="rapat-content">${renderRapatMarkdown(textarea.value)}</div>`;
        };

        toolbar.addEventListener('click', (event) => {
            const button = event.target.closest('[data-format]');
            if (!button) return;

            const format = button.dataset.format;

            if (format === 'preview') {
                preview.hidden = !preview.hidden;
                updatePreview();
                return;
            }

            const templates = {
                bold: ['**', '**'],
                italic: ['*', '*'],
                heading: ['\n## Judul\n'],
                bullet: ['\n- item\n'],
                number: ['\n1. item\n'],
                paragraph: ['\n\n'],
                quote: ['\n> Catatan penting\n'],
                divider: ['\n---\n'],
                columns: ['\n:::columns\n:::col\nIsi kolom kiri\n:::col\nIsi kolom kanan\n:::end\n']
            };

            const template = templates[format];
            if (!template) return;
            insertAtCursor(textarea, template[0], template[1] || '');
        });

        textarea.addEventListener('input', updatePreview);
    }

    function lampiranUrl(path) {
        if (!path) return '';
        if (/^https?:\/\//i.test(path)) return path;
        return `${HASIL_RAPAT_PUBLIC_BASE}/${String(path).replace(/^\/+/, '')}`;
    }

    function setAlert(type, message) {
        const el = document.getElementById('hasilRapatAlert');
        if (!el) return;
        el.className = 'hasil-rapat-alert ' + (type === 'ok' ? 'ok' : 'err');
        el.textContent = message;
    }

    function setSubmitLoading(isLoading) {
        const button = document.getElementById('hasilRapatSubmitBtn');
        if (!button) return;
        button.disabled = isLoading;
        if (isLoading) {
            button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';
            return;
        }
        setSubmitIdleLabel();
    }

    function isEditMode() {
        return Number(document.getElementById('hasilRapatId')?.value || 0) > 0;
    }

    function setSubmitIdleLabel() {
        const button = document.getElementById('hasilRapatSubmitBtn');
        if (!button) return;
        button.innerHTML = isEditMode()
            ? '<i class="fa-solid fa-floppy-disk"></i> Update Hasil Rapat'
            : '<i class="fa-solid fa-floppy-disk"></i> Simpan Hasil Rapat';
    }

    function setCurrentLampiran(row) {
        const info = document.getElementById('hasilRapatCurrentLampiran');
        if (!info) return;

        if (!row?.lampiran_file) {
            info.hidden = true;
            info.innerHTML = '';
            return;
        }

        info.hidden = false;
        info.innerHTML = `Lampiran saat ini: <a href="${escapeHtml(lampiranUrl(row.lampiran_file))}" target="_blank" rel="noopener">Lihat Lampiran</a>`;
    }

    function resetEditMode(options = {}) {
        const { resetForm = true } = options;
        const form = document.getElementById('formHasilRapat');
        const idInput = document.getElementById('hasilRapatId');
        const cancelButton = document.getElementById('hasilRapatCancelEditBtn');
        const currentLampiran = document.getElementById('hasilRapatCurrentLampiran');

        if (resetForm && form) {
            form.reset();
        }

        if (idInput) idInput.value = '';
        if (cancelButton) cancelButton.hidden = true;
        if (currentLampiran) {
            currentLampiran.hidden = true;
            currentLampiran.innerHTML = '';
        }

        const status = document.getElementById('statusPublikasiRapat');
        if (status) status.value = 'publish';

        const tanggal = document.getElementById('tanggalRapat');
        if (tanggal && !tanggal.value) {
            tanggal.value = new Date().toISOString().slice(0, 10);
        }

        document.getElementById('hasil_musyawarah')?.dispatchEvent(new Event('input', { bubbles: true }));
        setSubmitIdleLabel();
    }

    function enterEditMode(row) {
        const form = document.getElementById('formHasilRapat');
        if (!form || !row) return;

        document.getElementById('hasilRapatId').value = row.id || '';
        document.getElementById('tanggalRapat').value = row.tanggal_rapat || '';
        document.getElementById('agendaRapat').value = row.agenda || '';
        document.getElementById('hasil_musyawarah').value = row.hasil_musyawarah || '';
        document.getElementById('lokasiRapat').value = row.lokasi_rapat || '';
        document.getElementById('pesertaRapat').value = row.peserta_rapat || '';
        document.getElementById('catatanRapat').value = row.catatan || '';
        document.getElementById('statusPublikasiRapat').value = row.status_publikasi || 'publish';

        const lampiranInput = document.getElementById('lampiranRapat');
        if (lampiranInput) lampiranInput.value = '';

        setCurrentLampiran(row);
        const cancelButton = document.getElementById('hasilRapatCancelEditBtn');
        if (cancelButton) cancelButton.hidden = false;

        document.getElementById('hasil_musyawarah')?.dispatchEvent(new Event('input', { bubbles: true }));
        setSubmitIdleLabel();
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    async function loadPreview() {
        const tbody = document.getElementById('hasilRapatPreviewBody');
        if (!tbody) return;

        try {
            const response = await fetch(`${HASIL_RAPAT_API_BASE}/hasil_rapat_list.php?cache=${Date.now()}`);
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Gagal memuat data hasil rapat.');
            }

            hasilRapatData = Array.isArray(result.data) ? result.data : [];
            const rows = hasilRapatData.slice(0, 20);
            if (!rows.length) {
                tbody.innerHTML = '<tr><td colspan="6">Belum ada hasil rapat.</td></tr>';
                return;
            }

            tbody.innerHTML = rows.map((row) => {
                const lampiran = row.lampiran_file
                    ? `<a href="${escapeHtml(lampiranUrl(row.lampiran_file))}" target="_blank" rel="noopener">Lihat Lampiran</a>`
                    : '-';

                return `
                    <tr>
                        <td>${escapeHtml(row.tanggal_rapat_format || row.tanggal_rapat || '-')}</td>
                        <td>${escapeHtml(row.agenda || '-')}</td>
                        <td>${escapeHtml(row.lokasi_rapat || '-')}</td>
                        <td>${escapeHtml(row.status_publikasi || '-')}</td>
                        <td>${lampiran}</td>
                        <td>
                            <button type="button" class="rapat-edit-btn" data-id="${escapeHtml(row.id)}" title="Edit hasil rapat">
                                Edit
                            </button>
                            <button type="button" class="rapat-delete-btn hasil-rapat-delete-btn" data-id="${escapeHtml(row.id)}" title="Hapus hasil rapat">
                                Hapus
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="6">${escapeHtml(error.message)}</td></tr>`;
        }
    }

    async function submitHasilRapat(event) {
        event.preventDefault();
        const form = event.currentTarget;
        setSubmitLoading(true);

        try {
            const response = await fetch(`${HASIL_RAPAT_API_BASE}/hasil_rapat_save.php`, {
                method: 'POST',
                body: new FormData(form)
            });
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Gagal menyimpan hasil rapat.');
            }

            setAlert('ok', result.message || 'Hasil rapat berhasil disimpan.');
            resetEditMode();
            await loadPreview();
        } catch (error) {
            setAlert('err', error.message);
        } finally {
            setSubmitLoading(false);
        }
    }

    async function deleteHasilRapat(button) {
        const id = button.dataset.id || '';
        if (!id) return;
        if (!confirm('Hapus hasil rapat ini?')) return;

        const body = new FormData();
        body.append('id', id);

        try {
            const response = await fetch(`${HASIL_RAPAT_API_BASE}/hasil_rapat_delete.php`, {
                method: 'POST',
                body
            });
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Gagal menghapus hasil rapat.');
            }

            setAlert('ok', result.message || 'Hasil rapat berhasil dihapus.');
            if (document.getElementById('hasilRapatId')?.value === id) {
                resetEditMode();
            }
            await loadPreview();
        } catch (error) {
            setAlert('err', error.message);
        }
    }

    function editHasilRapat(button) {
        const id = button.dataset.id || '';
        if (!id) return;

        const row = hasilRapatData.find((item) => String(item.id) === String(id));
        if (!row) {
            setAlert('err', 'Data hasil rapat tidak ditemukan di preview. Muat ulang data lalu coba lagi.');
            return;
        }

        enterEditMode(row);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('formHasilRapat');
        if (!form) return;

        const tanggal = document.getElementById('tanggalRapat');
        if (tanggal && !tanggal.value) {
            tanggal.value = new Date().toISOString().slice(0, 10);
        }

        form.addEventListener('submit', submitHasilRapat);
        document.getElementById('hasilRapatCancelEditBtn')?.addEventListener('click', () => {
            resetEditMode();
        });
        initRapatEditor();
        document.getElementById('hasilRapatPreviewBody')?.addEventListener('click', (event) => {
            const editButton = event.target.closest('.rapat-edit-btn');
            if (editButton) {
                editHasilRapat(editButton);
                return;
            }

            const deleteButton = event.target.closest('.hasil-rapat-delete-btn');
            if (deleteButton) deleteHasilRapat(deleteButton);
        });

        setSubmitIdleLabel();
        loadPreview();
    });
})();
