(function () {
  const MARKETPLACE_API_BASE = 'https://mudamudiselor.web.id/common/api';
  const MARKETPLACE_PUBLIC_BASE = MARKETPLACE_API_BASE.replace(/\/common\/api\/?$/, '');

  let databaseMaster = { produk: [], interaksi: [] };
  let kategoriAktif = 'Semua';
  let modalJual;
  let modalDetail;
  let modalAuth;
  let modalDashboard;
  let modalSellerProfile;
  let currentUser = null;

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

  function apiUrl(path) {
    return `${MARKETPLACE_API_BASE}/${path}`;
  }

  function getAssetUrl(path) {
    if (!path) return 'https://via.placeholder.com/300x300?text=No+Image';
    if (/^https?:\/\//i.test(path)) return path;
    return `${MARKETPLACE_PUBLIC_BASE}/${String(path).replace(/^\/+/, '')}`;
  }

  function getAvatarUrl(path) {
    if (!path) return 'https://via.placeholder.com/160?text=User';
    return getAssetUrl(path);
  }

  async function requestJson(path, options = {}) {
    const response = await fetch(apiUrl(path), {
      credentials: 'include',
      ...options
    });
    const result = await response.json();
    if (!response.ok || result.success === false) {
      throw new Error(result.message || 'Permintaan gagal.');
    }
    return result;
  }

  function showAlert(id, message, type = 'danger') {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = `alert alert-${type} market-alert`;
    el.textContent = message;
  }

  function hideAlert(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = 'alert alert-danger market-alert hidden';
    el.textContent = '';
  }

  function renderUserStatus() {
    const greeting = document.getElementById('marketUserGreeting');
    const loginBtn = document.getElementById('marketLoginBtn');
    const profileBtn = document.getElementById('marketProfileBtn');
    const logoutBtn = document.getElementById('marketLogoutBtn');

    if (!greeting || !loginBtn || !profileBtn || !logoutBtn) return;

    if (currentUser) {
      greeting.textContent = `Halo, ${currentUser.nama}`;
      greeting.classList.remove('hidden');
      loginBtn.classList.add('hidden');
      profileBtn.classList.remove('hidden');
      logoutBtn.classList.remove('hidden');
      return;
    }

    greeting.textContent = '';
    greeting.classList.add('hidden');
    loginBtn.classList.remove('hidden');
    profileBtn.classList.add('hidden');
    logoutBtn.classList.add('hidden');
  }

  async function loadCurrentUser() {
    try {
      const result = await requestJson('marketplace_me.php');
      currentUser = result.logged_in ? result.user : null;
    } catch (error) {
      currentUser = null;
    }
    renderUserStatus();
  }

  async function muatDataAwal() {
    $('#mainLoader').removeClass('hidden');
    $('#katalogContainer').addClass('hidden');
    $('#emptyMsg').addClass('hidden');

    try {
      const result = await requestJson(`marketplace_posts_list.php?cache=${Date.now()}`);
      databaseMaster = {
        produk: Array.isArray(result.produk) ? result.produk : [],
        interaksi: Array.isArray(result.interaksi) ? result.interaksi : []
      };
      renderKatalog(databaseMaster.produk);
    } catch (error) {
      $('#emptyMsg').removeClass('hidden').html(`<h5>${escapeHtml(error.message)}</h5>`);
    } finally {
      $('#mainLoader').addClass('hidden');
    }
  }

  function renderKatalog(listProduk) {
    const container = document.getElementById('katalogContainer');
    container.innerHTML = '';

    const keyword = ($('#inputCari').val() || '').toLowerCase().trim();
    const filtered = (kategoriAktif === 'Semua' ? listProduk : listProduk.filter((p) => p.kondisi === kategoriAktif))
      .filter((p) => !keyword || [
        p.nama,
        p.nama_barang,
        p.nama_penjual,
        p.deskripsi,
        p.metode
      ].join(' ').toLowerCase().includes(keyword));

    if (!filtered.length) {
      $(container).addClass('hidden');
      $('#emptyMsg').removeClass('hidden');
      return;
    }

    $('#emptyMsg').addClass('hidden');
    $(container).removeClass('hidden');

    filtered.forEach((p) => {
      const isTerjual = p.status === 'Terjual';
      const badgeKondisi = isTerjual ? 'TERJUAL' : p.kondisi;
      const badgeColor = isTerjual ? 'bg-danger text-white' : (p.kondisi === '2nd Good Condition' ? 'bg-warning text-dark' : 'bg-success text-white');
      const displaySisaWaktu = isTerjual ? '<b class="text-danger">Sudah Laku</b>' : `Aktif: <b>${escapeHtml(p.sisaHari)}</b> Hari (${escapeHtml(p.stok)} Stk)`;
      const sellerName = p.nama_toko || p.nama_penjual || 'Penjual MMS';

      container.insertAdjacentHTML('beforeend', `
        <div class="product-card" onclick="bukaDetailBarang('${escapeHtml(p.id)}')" style="${isTerjual ? 'opacity: 0.65;' : ''}">
          <div class="img-wrapper">
            <span class="badge ${badgeColor} badge-kondisi">${escapeHtml(badgeKondisi)}</span>
            <img src="${escapeHtml(getAssetUrl(p.foto_file || p.foto))}" class="img-product" alt="${escapeHtml(p.nama)}" onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'">
          </div>
          <div class="product-info">
            <div>
              <div class="product-title fw-bold ${isTerjual ? 'text-decoration-line-through text-muted' : ''}">${escapeHtml(p.nama)}</div>
              <div class="product-price text-danger fw-bold">${formatRupiah(p.harga)}</div>
              <div class="meta-text mt-1"><i class="fa-solid fa-hourglass-half text-danger"></i> ${displaySisaWaktu}</div>
              <div class="meta-text text-truncate"><i class="fa-solid fa-truck"></i> ${escapeHtml(p.metode || 'Hubungi Penjual')}</div>
              <div class="seller-mini mt-2" onclick="event.stopPropagation(); openSellerProfile('${escapeHtml(p.user_id)}')">
                <img src="${escapeHtml(getAvatarUrl(p.foto_profil))}" alt="${escapeHtml(sellerName)}">
                <span>${escapeHtml(sellerName)}</span>
              </div>
            </div>
            <button class="btn btn-sm btn-outline-danger w-100 mt-2" type="button">Detail / Nego</button>
          </div>
        </div>
      `);
    });
  }

  function filterKategori(kat, btn) {
    $('.category-btn').removeClass('active');
    $(btn).addClass('active');
    kategoriAktif = kat;
    renderKatalog(databaseMaster.produk);
  }

  function filterCariBarang() {
    renderKatalog(databaseMaster.produk);
  }

  function resetUploadPreview() {
    const fileInput = document.getElementById('fileGambarUpload');
    const preview = document.getElementById('previewGambarLapak');
    const prompt = document.getElementById('textUploadPrompt');
    if (fileInput) fileInput.value = '';
    if (preview) {
      preview.removeAttribute('src');
      preview.style.display = 'none';
    }
    if (prompt) prompt.style.display = 'block';
  }

  function bukaModalJual() {
    if (!currentUser) {
      bukaModalAuth('login');
      return;
    }

    $('#formLapak')[0].reset();
    hideAlert('jualAlert');
    resetUploadPreview();
    modalJual.show();
  }

  function bacaDanPreviewFoto(input) {
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];
    if (file.size > 10 * 1024 * 1024) {
      showAlert('jualAlert', 'Ukuran foto terlalu besar. Maksimal foto dari kamera 10 MB.');
      input.value = '';
      resetUploadPreview();
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      document.getElementById('textUploadPrompt').style.display = 'none';
      const preview = document.getElementById('previewGambarLapak');
      preview.src = event.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }

  function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), type, quality);
    });
  }

  async function loadImageForCompression(file) {
    if ('createImageBitmap' in window) {
      try {
        return await createImageBitmap(file);
      } catch (error) {
      }
    }

    return new Promise((resolve, reject) => {
      const image = new Image();
      const url = URL.createObjectURL(file);
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Foto tidak bisa dibaca oleh browser.'));
      };
      image.src = url;
    });
  }

  async function supportsWebpCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const blob = await canvasToBlob(canvas, 'image/webp', 0.8);
    return Boolean(blob && blob.type === 'image/webp');
  }

  async function compressMarketplaceImage(file) {
    if (!file || !file.type.startsWith('image/')) {
      throw new Error('File harus berupa gambar.');
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Ukuran foto terlalu besar. Maksimal foto dari kamera 10 MB.');
    }

    const source = await loadImageForCompression(file);
    const width = source.width || source.videoWidth;
    const height = source.height || source.videoHeight;

    if (!width || !height) {
      throw new Error('Ukuran foto tidak bisa dibaca.');
    }

    const maxDimension = 1280;
    const scale = Math.min(1, maxDimension / Math.max(width, height));
    const targetWidth = Math.round(width * scale);
    const targetHeight = Math.round(height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.drawImage(source, 0, 0, targetWidth, targetHeight);
    if (typeof source.close === 'function') source.close();

    const outputType = await supportsWebpCanvas() ? 'image/webp' : 'image/jpeg';
    const extension = outputType === 'image/webp' ? 'webp' : 'jpg';
    const qualitySteps = [0.78, 0.7, 0.65];
    let compressedBlob = null;

    for (const quality of qualitySteps) {
      compressedBlob = await canvasToBlob(canvas, outputType, quality);
      if (compressedBlob && compressedBlob.size <= 2 * 1024 * 1024) break;
    }

    if (!compressedBlob) {
      compressedBlob = await canvasToBlob(canvas, 'image/jpeg', 0.78);
    }

    if (!compressedBlob) {
      throw new Error('Browser gagal mengompres foto. Coba gunakan foto lain.');
    }

    const safeName = `marketplace-${Date.now()}.${extension}`;
    return new File([compressedBlob], safeName, {
      type: compressedBlob.type || outputType,
      lastModified: Date.now()
    });
  }

  async function prosesSimpanBarang() {
    if (!currentUser) {
      bukaModalAuth('login');
      return;
    }

    const file = document.getElementById('fileGambarUpload')?.files?.[0];
    if (!file) {
      showAlert('jualAlert', 'Wajib memilih foto produk terlebih dahulu.');
      return;
    }

    const btn = $('#btnSubmitLapak');
    btn.prop('disabled', true).text('Mengompres foto...');

    const metode = [];
    if ($('#chkCod').is(':checked')) metode.push('COD');
    if ($('#chkAmbil').is(':checked')) metode.push('Ambil');

    try {
      const compressedFile = await compressMarketplaceImage(file);
      btn.text('Mengupload...');

      const formData = new FormData();
      formData.append('nama_barang', $('#jualNama').val());
      formData.append('harga', $('#jualHarga').val());
      formData.append('stok', $('#jualStok').val());
      formData.append('kondisi', $('#jualKondisi').val());
      formData.append('metode_pengiriman', metode.join(' / ') || 'Hubungi Penjual');
      formData.append('deskripsi', $('#jualDeskripsi').val());
      formData.append('foto_file', compressedFile);

      const result = await requestJson('marketplace_posts_save.php', {
        method: 'POST',
        body: formData
      });
      alert(result.message || 'Lapak dagangan kamu sukses ditayangkan!');
      modalJual.hide();
      await muatDataAwal();
    } catch (error) {
      showAlert('jualAlert', error.message);
    } finally {
      btn.prop('disabled', false).text('Tayangkan Dagangan Sekarang');
    }
  }

  function normalizePhone(noHp) {
    const digits = String(noHp || '').replace(/\D/g, '');
    if (!digits) return '';
    if (digits.startsWith('62')) return digits;
    if (digits.startsWith('0')) return `62${digits.slice(1)}`;
    return digits;
  }

  function bukaDetailBarang(id) {
    const p = databaseMaster.produk.find((item) => String(item.id) === String(id));
    if (!p) return;

    $('#intIdProduk').val(p.id);
    $('#formInteraksi')[0].reset();
    aturFormJenis();
    $('#lblDetailTitle').text(`Katalog: ${p.nama}`);

    const waNumber = normalizePhone(p.no_hp);
    const waUrl = waNumber ? `https://wa.me/${waNumber}` : '';
    const isOwner = currentUser && Number(currentUser.id) === Number(p.user_id);
    const sellerName = p.nama_toko || p.nama_penjual || 'Penjual MMS';

    $('#panelDetailBarang').html(`
      <div class="text-center mb-3 bg-light p-2 rounded">
         <img src="${escapeHtml(getAssetUrl(p.foto_file || p.foto))}" style="max-height:220px; max-width:100%; object-fit:contain;" alt="${escapeHtml(p.nama)}" onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'">
      </div>
      <h6><b>${escapeHtml(p.nama)}</b></h6>
      <p class="text-danger fw-bold fs-5 m-0">${formatRupiah(p.harga)}</p>
      <div class="small text-muted">No HP: ${escapeHtml(p.no_hp || '-')}</div>
      <div class="small text-muted">Kondisi: ${escapeHtml(p.kondisi || '-')}</div>
      <div class="small text-muted">Metode Kirim: ${escapeHtml(p.metode || '-')}</div>
      ${p.deskripsi ? `<div class="small mt-2 detail-description">${escapeHtml(p.deskripsi)}</div>` : ''}
      <div class="seller-profile-header mt-3">
        <img class="mp-avatar" src="${escapeHtml(getAvatarUrl(p.foto_profil))}" alt="${escapeHtml(sellerName)}">
        <div>
          <div class="fw-bold">${escapeHtml(sellerName)}</div>
          <div class="small text-muted">${escapeHtml(p.nama_penjual || '-')}</div>
        </div>
      </div>
      <div class="d-flex gap-2 flex-wrap mt-3">
        <button type="button" class="btn btn-outline-danger btn-sm flex-fill" onclick="openSellerProfile('${escapeHtml(p.user_id)}')">Lihat Profil Penjual</button>
        ${waUrl ? `<a href="${escapeHtml(waUrl)}" target="_blank" rel="noopener" class="btn btn-success btn-sm flex-fill"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>` : ''}
      </div>
    `);

    $('#ownerPanel').toggleClass('is-visible', Boolean(isOwner));
    renderInteraksi(p.id);
    modalDetail.show();
  }

  async function updatePostStatus(idProduk, status) {
    const formData = new FormData();
    formData.append('id', idProduk);
    formData.append('status', status);

    const result = await requestJson('marketplace_posts_update_status.php', {
      method: 'POST',
      body: formData
    });
    return result;
  }

  async function eksekusiAksiLapak(jenisAksi) {
    const idProduk = $('#intIdProduk').val();
    const status = jenisAksi === 'setTerjual' ? 'Terjual' : 'Dihapus';
    const konfirmasiTeks = status === 'Terjual' ? 'Tandai produk ini sudah laku?' : 'Hapus iklan lapak ini?';
    if (!confirm(konfirmasiTeks)) return;

    try {
      const result = await updatePostStatus(idProduk, status);
      alert(result.message || 'Status lapak berhasil diperbarui.');
      modalDetail.hide();
      await muatDataAwal();
      if (modalDashboard?._isShown) await loadMyPosts();
    } catch (error) {
      alert(error.message);
    }
  }

  function renderInteraksi(idProduk) {
    const box = $('#boxInteraksi').html('');
    const filtered = databaseMaster.interaksi.filter((x) => String(x.idProduk || x.post_id) === String(idProduk));
    if (!filtered.length) {
      box.html('<div class="text-center text-muted small py-2">Belum ada diskusi tawar menawar.</div>');
      return;
    }

    filtered.forEach((i) => {
      const nilai = Number(i.nilai || 0);
      const badge = i.jenis === 'Nego'
        ? `<span class="badge bg-danger">NEGO: ${formatRupiah(nilai)}</span>`
        : (i.jenis === 'Rating' ? `<span class="badge bg-warning text-dark">RATING: ${'⭐'.repeat(Math.max(1, Math.min(5, nilai)))}</span>` : '<span class="badge bg-secondary">TANYA</span>');
      box.append(`<div class="chat-item"><small class="fw-bold">${escapeHtml(i.namaPengunjung || i.nama_pengunjung)}</small> (${escapeHtml(i.waktu || '')})<br>${badge} ${escapeHtml(i.isi)}</div>`);
    });
  }

  function aturFormJenis() {
    const jenis = $('#intJenis').val();
    $('#rowNilaiNego,#rowNilaiRating').addClass('hidden');
    if (jenis === 'Nego') $('#rowNilaiNego').removeClass('hidden');
    if (jenis === 'Rating') $('#rowNilaiRating').removeClass('hidden');
  }

  async function prosesKirimInteraksi() {
    const idProduk = $('#intIdProduk').val();
    const jenis = $('#intJenis').val();
    const formData = new FormData();
    formData.append('post_id', idProduk);
    formData.append('nama_pengunjung', $('#intNama').val());
    formData.append('jenis', jenis);
    formData.append('nilai', jenis === 'Nego' ? $('#intNilaiNego').val() : (jenis === 'Rating' ? $('#intNilaiRating').val() : '0'));
    formData.append('isi', $('#intIsiPesan').val());

    const btn = $('#btnSubmitInteraksi');
    btn.prop('disabled', true).text('Mengirim...');

    try {
      await requestJson('marketplace_comments_save.php', {
        method: 'POST',
        body: formData
      });
      $('#intIsiPesan').val('');
      const result = await requestJson(`marketplace_posts_list.php?cache=${Date.now()}`);
      databaseMaster = {
        produk: Array.isArray(result.produk) ? result.produk : [],
        interaksi: Array.isArray(result.interaksi) ? result.interaksi : []
      };
      renderInteraksi(idProduk);
    } catch (error) {
      alert(error.message);
    } finally {
      btn.prop('disabled', false).text('Kirim');
    }
  }

  function bukaModalAuth(mode = 'login') {
    hideAlert('authAlert');
    const tabId = mode === 'register' ? 'register-tab' : 'login-tab';
    const tab = document.getElementById(tabId);
    if (tab) bootstrap.Tab.getOrCreateInstance(tab).show();
    modalAuth.show();
  }

  async function prosesRegister() {
    const btn = $('#btnRegister');
    btn.prop('disabled', true).text('Mendaftarkan...');

    try {
      const result = await requestJson('marketplace_register.php', {
        method: 'POST',
        body: new FormData(document.getElementById('formRegister'))
      });
      currentUser = result.user;
      renderUserStatus();
      modalAuth.hide();
      $('#formRegister')[0].reset();
      await muatDataAwal();
    } catch (error) {
      showAlert('authAlert', error.message);
    } finally {
      btn.prop('disabled', false).text('Daftar & Masuk');
    }
  }

  async function prosesLogin() {
    const btn = $('#btnLogin');
    btn.prop('disabled', true).text('Masuk...');

    try {
      const result = await requestJson('marketplace_login.php', {
        method: 'POST',
        body: new FormData(document.getElementById('formLogin'))
      });
      currentUser = result.user;
      renderUserStatus();
      modalAuth.hide();
      $('#formLogin')[0].reset();
      await muatDataAwal();
    } catch (error) {
      showAlert('authAlert', error.message);
    } finally {
      btn.prop('disabled', false).text('Masuk');
    }
  }

  async function prosesLogout() {
    try {
      await requestJson('marketplace_logout.php', { method: 'POST', body: new FormData() });
    } catch (error) {
    }
    currentUser = null;
    renderUserStatus();
    if (modalDashboard?._isShown) modalDashboard.hide();
    await muatDataAwal();
  }

  function fillProfileForm(user) {
    $('#dashboardAvatar').attr('src', getAvatarUrl(user.foto_profil));
    $('#profilePhotoPreview').attr('src', getAvatarUrl(user.foto_profil));
    $('#dashboardNama').text(user.nama || '-');
    $('#dashboardToko').text(user.nama_toko || 'Belum ada nama toko');
    $('#dashboardEmail').text(user.email || '');
    $('#dashboardPhone').text(user.no_hp || '');
    $('#profileNama').val(user.nama || '');
    $('#profileNamaToko').val(user.nama_toko || '');
    $('#profileNoHp').val(user.no_hp || '');
    $('#profileAlamat').val(user.alamat || '');
    $('#profileBio').val(user.bio || '');
    $('#profileFotoInput').val('');
  }

  async function loadMyPosts() {
    const result = await requestJson(`marketplace_my_posts.php?cache=${Date.now()}`);
    renderMyPosts(Array.isArray(result.posts) ? result.posts : []);
  }

  async function openUserDashboard() {
    if (!currentUser) {
      bukaModalAuth('login');
      return;
    }

    hideAlert('dashboardAlert');
    try {
      const me = await requestJson(`marketplace_me.php?cache=${Date.now()}`);
      currentUser = me.logged_in ? me.user : null;
      if (!currentUser) {
        renderUserStatus();
        bukaModalAuth('login');
        return;
      }
      renderUserStatus();
      fillProfileForm(currentUser);
      await loadMyPosts();
      modalDashboard.show();
    } catch (error) {
      showAlert('dashboardAlert', error.message);
      modalDashboard.show();
    }
  }

  function previewProfilePhoto(input) {
    if (!input.files || !input.files[0]) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      $('#profilePhotoPreview').attr('src', event.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  }

  async function submitProfileUpdate() {
    const btn = $('#btnProfileUpdate');
    btn.prop('disabled', true).text('Menyimpan Profil...');
    hideAlert('dashboardAlert');

    try {
      const result = await requestJson('marketplace_profile_update.php', {
        method: 'POST',
        body: new FormData(document.getElementById('formProfileUpdate'))
      });
      currentUser = result.user;
      renderUserStatus();
      fillProfileForm(currentUser);
      showAlert('dashboardAlert', result.message || 'Profil berhasil diperbarui.', 'success');
      await muatDataAwal();
      await loadMyPosts();
    } catch (error) {
      showAlert('dashboardAlert', error.message);
    } finally {
      btn.prop('disabled', false).text('Simpan Profil');
    }
  }

  function renderMyPosts(posts) {
    const container = document.getElementById('myPostsContainer');
    if (!container) return;

    if (!posts.length) {
      container.innerHTML = '<div class="text-center text-muted py-4">Belum ada barang yang kamu jual.</div>';
      return;
    }

    container.innerHTML = posts.map((post) => {
      const isTerjual = post.status === 'Terjual';
      return `
        <article class="mp-my-post-card">
          <img src="${escapeHtml(getAssetUrl(post.foto_file))}" alt="${escapeHtml(post.nama_barang)}" onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'">
          <div>
            <h6>${escapeHtml(post.nama_barang)}</h6>
            <div class="product-price">${formatRupiah(post.harga)}</div>
            <div class="small text-muted">Status: ${escapeHtml(post.status)} · Stok: ${escapeHtml(post.stok)}</div>
            <div class="mp-my-post-actions">
              ${!isTerjual ? `<button type="button" class="btn btn-sm btn-warning fw-bold" onclick="updateMyPostStatus('${escapeHtml(post.id)}', 'Terjual')">Tandai Terjual</button>` : ''}
              <button type="button" class="btn btn-sm btn-danger fw-bold" onclick="updateMyPostStatus('${escapeHtml(post.id)}', 'Dihapus')">Hapus</button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  async function updateMyPostStatus(id, status) {
    const message = status === 'Terjual' ? 'Tandai barang ini sudah terjual?' : 'Hapus barang ini dari katalog?';
    if (!confirm(message)) return;

    try {
      const result = await updatePostStatus(id, status);
      showAlert('dashboardAlert', result.message || 'Status barang diperbarui.', 'success');
      await loadMyPosts();
      await muatDataAwal();
    } catch (error) {
      showAlert('dashboardAlert', error.message);
    }
  }

  function renderSellerProducts(posts) {
    if (!posts.length) {
      return '<div class="text-center text-muted py-3">Belum ada barang aktif dari penjual ini.</div>';
    }

    return `
      <div class="seller-products-grid">
        ${posts.map((post) => `
          <article class="mp-my-post-card">
            <img src="${escapeHtml(getAssetUrl(post.foto_file))}" alt="${escapeHtml(post.nama_barang)}" onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'">
            <div>
              <h6>${escapeHtml(post.nama_barang)}</h6>
              <div class="product-price">${formatRupiah(post.harga)}</div>
              <div class="small text-muted">${escapeHtml(post.status)} · ${escapeHtml(post.kondisi || '-')}</div>
            </div>
          </article>
        `).join('')}
      </div>
    `;
  }

  async function openSellerProfile(userId) {
    try {
      const result = await requestJson(`marketplace_user_profile.php?user_id=${encodeURIComponent(userId)}&cache=${Date.now()}`);
      const seller = result.seller;
      const sellerName = seller.nama_toko || seller.nama || 'Penjual MMS';
      const waNumber = normalizePhone(seller.no_hp);
      const waUrl = waNumber ? `https://wa.me/${waNumber}` : '';

      $('#sellerProfileContent').html(`
        <div class="seller-profile-header">
          <img class="mp-avatar-lg" src="${escapeHtml(getAvatarUrl(seller.foto_profil))}" alt="${escapeHtml(sellerName)}">
          <div>
            <h5 class="mb-1 fw-bold">${escapeHtml(sellerName)}</h5>
            <div class="small text-muted">${escapeHtml(seller.nama || '')}</div>
            ${seller.bio ? `<div class="small mt-2">${escapeHtml(seller.bio)}</div>` : ''}
            ${seller.alamat ? `<div class="small text-muted mt-2"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(seller.alamat)}</div>` : ''}
            ${waUrl ? `<a href="${escapeHtml(waUrl)}" target="_blank" rel="noopener" class="btn btn-success btn-sm mt-3"><i class="fa-brands fa-whatsapp"></i> WhatsApp Penjual</a>` : ''}
          </div>
        </div>
        <hr>
        <h6 class="fw-bold mb-3">Barang dari penjual ini</h6>
        ${renderSellerProducts(Array.isArray(result.posts) ? result.posts : [])}
      `);
      modalSellerProfile.show();
    } catch (error) {
      alert(error.message);
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    modalJual = new bootstrap.Modal(document.getElementById('formJualModal'));
    modalDetail = new bootstrap.Modal(document.getElementById('detailModal'));
    modalAuth = new bootstrap.Modal(document.getElementById('authModal'));
    modalDashboard = new bootstrap.Modal(document.getElementById('modalUserDashboard'));
    modalSellerProfile = new bootstrap.Modal(document.getElementById('modalSellerProfile'));
    await loadCurrentUser();
    await muatDataAwal();
  });

  window.bacaDanPreviewFoto = bacaDanPreviewFoto;
  window.bukaModalJual = bukaModalJual;
  window.prosesSimpanBarang = prosesSimpanBarang;
  window.filterKategori = filterKategori;
  window.filterCariBarang = filterCariBarang;
  window.bukaDetailBarang = bukaDetailBarang;
  window.eksekusiAksiLapak = eksekusiAksiLapak;
  window.aturFormJenis = aturFormJenis;
  window.prosesKirimInteraksi = prosesKirimInteraksi;
  window.bukaModalAuth = bukaModalAuth;
  window.prosesRegister = prosesRegister;
  window.prosesLogin = prosesLogin;
  window.prosesLogout = prosesLogout;
  window.openUserDashboard = openUserDashboard;
  window.previewProfilePhoto = previewProfilePhoto;
  window.submitProfileUpdate = submitProfileUpdate;
  window.updateMyPostStatus = updateMyPostStatus;
  window.openSellerProfile = openSellerProfile;
})();
