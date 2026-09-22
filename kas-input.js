(function () {
    // Ubah DOMAIN-UTAMA sesuai domain utama yang mengarah ke public_html.
    const API_BASE = 'https://mudamudiselor.web.id/common/api';
    const bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

    const rupiah = (angka) => new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', maximumFractionDigits: 0
    }).format(Number(angka || 0));

    const escapeHtml = (value) => String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    function setAlert(type, message) {
        const el = document.getElementById('kasAlert');
        if (!el) return;
        el.className = 'kas-alert ' + (type === 'ok' ? 'ok' : 'err');
        el.textContent = message;
    }

    function renderBulanCheckbox() {
        const wrap = document.getElementById('bulanKasWrap');
        if (!wrap) return;
        wrap.innerHTML = bulan.map((b) => `
            <label>
                <input type="checkbox" name="bulan[]" value="${b}">
                ${b}
            </label>
        `).join('');
    }

    function isiDropdownTahun() {
        const selects = [
            document.getElementById('tahunKas'),
            document.getElementById('filterTahunKas')
        ].filter(Boolean);
        const tahunSekarang = new Date().getFullYear();
        const tahunAwal = 2024;
        const tahunAkhir = tahunSekarang + 5;

        selects.forEach((select) => {
            select.innerHTML = '';
            for (let tahun = tahunAkhir; tahun >= tahunAwal; tahun--) {
                const option = document.createElement('option');
                option.value = tahun;
                option.textContent = tahun;
                option.selected = tahun === tahunSekarang;
                select.appendChild(option);
            }
        });
    }

    async function loadAnggota() {
        const select = document.getElementById('namaKas');
        if (!select) return;
        try {
            const res = await fetch(`${API_BASE}/kas_members.php`);
            const json = await res.json();
            if (!json.success) throw new Error(json.message || 'Gagal memuat anggota');
            select.innerHTML = '<option value="">Pilih nama anggota</option>' + json.data.map((item) => {
                const name = item.nama || item.full_name || '';
                return `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`;
            }).join('');
        } catch (err) {
            select.innerHTML = '<option value="">Gagal memuat anggota</option>';
            setAlert('err', err.message);
        }
    }

    async function loadPreview() {
        const tbody = document.getElementById('tabelKasPreview');
        const totalEl = document.getElementById('totalKasPreview');
        const tahun = document.getElementById('filterTahunKas')?.value || '';
        if (!tbody) return;

        try {
            const res = await fetch(`${API_BASE}/kas_list.php?tahun=${encodeURIComponent(tahun)}`);
            const json = await res.json();
            if (!json.success) throw new Error(json.message || 'Gagal memuat data kas');

            if (totalEl) totalEl.textContent = rupiah(json.total);

            if (!json.data.length) {
                tbody.innerHTML = '<tr><td colspan="6">Belum ada data kas.</td></tr>';
                return;
            }

            tbody.innerHTML = json.data.slice(0, 50).map((row) => `
                <tr>
                    <td>${escapeHtml(row.tanggal || '-')}</td>
                    <td>${escapeHtml(row.nama || '-')}</td>
                    <td>${escapeHtml(row.bulan || '-')}</td>
                    <td>${escapeHtml(row.tahun || '-')}</td>
                    <td><strong>${rupiah(row.jumlah)}</strong></td>
                    <td>${escapeHtml(row.sumber_data || '-')}</td>
                </tr>
            `).join('');
        } catch (err) {
            tbody.innerHTML = `<tr><td colspan="6">${escapeHtml(err.message)}</td></tr>`;
        }
    }


    function initKasAccordion() {
        const accordion = document.getElementById('kasAccordion');
        const toggle = document.getElementById('kasAccordionToggle');
        if (!accordion || !toggle) return;

        toggle.addEventListener('click', function () {
            const isOpen = accordion.classList.toggle('open');
            toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            
        });
        
    }

    async function submitKas(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const checked = form.querySelectorAll('input[name="bulan[]"]:checked');
        if (!checked.length) {
            setAlert('err', 'Pilih minimal satu bulan yang dibayar.');
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/kas_save.php`, { method: 'POST', body: new FormData(form) });
            const json = await res.json();
            if (!json.success) throw new Error(json.message || 'Gagal menyimpan data');
            setAlert('ok', json.message);
            form.querySelectorAll('input[name="bulan[]"]').forEach(cb => cb.checked = false);
            document.getElementById('keteranganKas').value = '';
            await loadPreview();
        } catch (err) {
            setAlert('err', err.message);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (!document.getElementById('formKasBulanan')) return;
        const today = new Date().toISOString().slice(0, 10);
        document.getElementById('tanggalKas').value = today;
        isiDropdownTahun();
        renderBulanCheckbox();
        initKasAccordion();
        loadAnggota();
        loadPreview();
        document.getElementById('formKasBulanan').addEventListener('submit', submitKas);
        document.getElementById('filterTahunKas').addEventListener('change', loadPreview);
    });
})();
