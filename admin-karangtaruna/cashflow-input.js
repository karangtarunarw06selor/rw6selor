(function () {
    const hostname = location.hostname;
    const IS_LOCAL = hostname === 'localhost' || hostname === '127.0.0.1';
    const CASHFLOW_API_BASE = IS_LOCAL
        ? 'http://localhost:8000/public_html/common/api'
        : '/common/api';

    const rupiah = (angka) => new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(Number(angka || 0));

    const escapeHtml = (value) => String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    function buktiUrl(path) {
        if (!path) return '';
        if (/^https?:\/\//i.test(path)) return path;
        const publicBase = CASHFLOW_API_BASE.replace(/\/common\/api\/?$/, '');
        return `${publicBase}/${String(path).replace(/^\/+/, '')}`;
    }

    function setAlert(type, message) {
        const el = document.getElementById('cashflowAlert');
        if (!el) return;
        el.className = 'cashflow-alert ' + (type === 'ok' ? 'ok' : 'err');
        el.textContent = message;
    }

    function initToggle(wrapperId, toggleId) {
        const wrapper = document.getElementById(wrapperId);
        const toggle = document.getElementById(toggleId);
        if (!wrapper || !toggle) return;

        toggle.addEventListener('click', () => {
            const open = wrapper.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    async function loadPreview() {
        const tbody = document.getElementById('cashflowPreviewTable');
        if (!tbody) return;

        try {
            const response = await fetch(`${CASHFLOW_API_BASE}/cashflow_list.php?cache=${Date.now()}`);
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Gagal memuat data cashflow.');
            }

            document.getElementById('cashflowPreviewMasuk').textContent = result.summary?.total_pemasukan || 'Rp 0';
            document.getElementById('cashflowPreviewKeluar').textContent = result.summary?.total_pengeluaran || 'Rp 0';
            document.getElementById('cashflowPreviewSaldo').textContent = result.summary?.saldo || 'Rp 0';

            const rows = Array.isArray(result.data) ? result.data.slice(0, 50) : [];
            if (!rows.length) {
                tbody.innerHTML = '<tr><td colspan="7">Belum ada data cashflow.</td></tr>';
                return;
            }

            tbody.innerHTML = rows.map((row) => {
                const isKas = row.source_table === 'kas_pembayaran';
                const bukti = row.bukti_file
                    ? `<a href="${escapeHtml(buktiUrl(row.bukti_file))}" target="_blank" rel="noopener">Lihat Bukti</a>`
                    : '-';
                const deleteButton = isKas
                    ? '<span style="color:#777; font-size:12px;">Menu kas</span>'
                    : `<button type="button" class="cashflow-delete-btn" data-source-table="${escapeHtml(row.source_table)}" data-source-id="${escapeHtml(row.source_id)}"><i class="fa-solid fa-trash"></i></button>`;

                return `
                    <tr>
                        <td>${escapeHtml(row.tanggal_format || row.tanggal || '-')}</td>
                        <td><span class="cashflow-badge ${escapeHtml(row.jenis)}">${escapeHtml(row.jenis)}</span></td>
                        <td>${escapeHtml(row.keterangan || '-')}</td>
                        <td><strong>${escapeHtml(row.jumlah_format || rupiah(row.jumlah))}</strong></td>
                        <td>${bukti}</td>
                        <td>${escapeHtml(row.sumber_data || '-')}</td>
                        <td>${deleteButton}</td>
                    </tr>
                `;
            }).join('');
        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="7">${escapeHtml(error.message)}</td></tr>`;
        }
    }

    async function submitCashflow(event) {
        event.preventDefault();
        const form = event.currentTarget;

        try {
            const response = await fetch(`${CASHFLOW_API_BASE}/cashflow_save.php`, {
                method: 'POST',
                body: new FormData(form)
            });
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Gagal menyimpan transaksi.');
            }

            setAlert('ok', result.message || 'Transaksi berhasil disimpan.');
            const tanggal = document.getElementById('tanggalCashflow')?.value;
            form.reset();
            if (tanggal) document.getElementById('tanggalCashflow').value = tanggal;
            await loadPreview();
        } catch (error) {
            setAlert('err', error.message);
        }
    }

    async function deleteCashflow(button) {
        const sourceTable = button.dataset.sourceTable || '';
        const sourceId = button.dataset.sourceId || '';

        if (!confirm('Hapus transaksi ini?')) return;

        const body = new FormData();
        body.append('source_table', sourceTable);
        body.append('source_id', sourceId);

        try {
            const response = await fetch(`${CASHFLOW_API_BASE}/cashflow_delete.php`, {
                method: 'POST',
                body
            });
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Gagal menghapus transaksi.');
            }

            setAlert('ok', result.message || 'Transaksi berhasil dihapus.');
            await loadPreview();
        } catch (error) {
            setAlert('err', error.message);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('formCashflow');
        if (!form) return;

        const today = new Date().toISOString().slice(0, 10);
        const tanggal = document.getElementById('tanggalCashflow');
        if (tanggal && !tanggal.value) tanggal.value = today;

        initToggle('buktiNotaWrap', 'buktiNotaToggle');
        initToggle('cashflowAccordion', 'cashflowAccordionToggle');

        form.addEventListener('submit', submitCashflow);
        document.getElementById('cashflowPreviewTable')?.addEventListener('click', (event) => {
            const button = event.target.closest('.cashflow-delete-btn');
            if (button) deleteCashflow(button);
        });

        loadPreview();
    });
})();
