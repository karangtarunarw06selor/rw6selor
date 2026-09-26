const STRUKTUR_API_BASE = "/common/api";

function escapeStruktur(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    }[char]));
}

function initialsStruktur(nama) {
    const parts = String(nama || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "RW";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function renderStrukturCard(item) {
    const nama = escapeStruktur(item.nama || "-");
    const jabatan = escapeStruktur(item.jabatan || "Pengurus");
    const nim = String(item.nim || "").trim();
    const foto = String(item.foto_url || "").trim();
    const avatar = foto
        ? `<img src="${escapeStruktur(foto)}" alt="${nama}" onerror="this.replaceWith(Object.assign(document.createElement('div'), {className: 'struktur-avatar-fallback', textContent: '${escapeStruktur(initialsStruktur(item.nama))}'}));">`
        : `<div class="struktur-avatar-fallback">${escapeStruktur(initialsStruktur(item.nama))}</div>`;
    const instagram = String(item.instagram_url || "").trim();
    const tiktok = String(item.tiktok_url || "").trim();

    return `
        <div class="swiper-slide">
            <div class="team-card${/ketua/i.test(jabatan) ? ' ketua-card' : ''}">
                ${avatar}
                <h4>${nama}</h4>
                <p>${jabatan}</p>
                ${nim ? `<p class="nim-text">${escapeStruktur(nim)}</p>` : ''}
                <div class="team-socials">
                    ${instagram ? `<a href="${escapeStruktur(instagram)}" target="_blank" rel="noopener"><i class="fa-brands fa-instagram"></i></a>` : ''}
                    ${tiktok ? `<a href="${escapeStruktur(tiktok)}" target="_blank" rel="noopener"><i class="fa-brands fa-tiktok"></i></a>` : ''}
                </div>
            </div>
        </div>
    `;
}

function renderStrukturEmpty() {
    return `
        <div class="team-card" style="max-width: 560px; margin: 24px auto 0; min-height: auto;">
            <i class="fa-solid fa-users-gear" style="font-size: 52px; color: #0f5ea8; margin-bottom: 16px;"></i>
            <h4>Struktur pengurus belum diisi</h4>
            <p>Data pengurus masih kosong.</p>
            <p class="nim-text">Silakan tambahkan data pengurus baru melalui dashboard admin.</p>
        </div>
    `;
}

async function loadStrukturPublik() {
    const container = document.getElementById("strukturPengurusContainer");
    if (!container) return;

    try {
        const response = await fetch(`${STRUKTUR_API_BASE}/structure_list.php?cache=${Date.now()}`);
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || "Gagal memuat struktur pengurus.");
        }

        const rows = result.data || [];
        if (!rows.length) {
            container.innerHTML = renderStrukturEmpty();
            return;
        }

        container.innerHTML = `
            <p class="swipe-instruction"><i class="fa-solid fa-left-right"></i> Geser untuk melihat detail pengurus</p>
            <div class="swiper mySwiper"><div class="swiper-wrapper">${rows.map(renderStrukturCard).join("")}</div></div>
        `;

        if (window.Swiper) {
            new Swiper(".mySwiper", {
                slidesPerView: 1,
                centeredSlides: true,
                loop: rows.length > 2,
                spaceBetween: 20,
                breakpoints: {
                    768: { slidesPerView: Math.min(rows.length, 3) },
                },
            });
        }
    } catch (error) {
        container.innerHTML = renderStrukturEmpty();
    }
}

document.addEventListener("DOMContentLoaded", loadStrukturPublik);
