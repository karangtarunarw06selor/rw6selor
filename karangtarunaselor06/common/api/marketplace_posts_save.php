<?php
declare(strict_types=1);

require_once __DIR__ . '/marketplace_helpers.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_response(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
    }

    $user = require_login();
    $namaBarang = sanitize_string($_POST['nama_barang'] ?? '');
    $harga = (float) ($_POST['harga'] ?? 0);
    $stok = (int) ($_POST['stok'] ?? 1);
    $kondisi = sanitize_string($_POST['kondisi'] ?? '2nd Good Condition');
    $metode = sanitize_string($_POST['metode_pengiriman'] ?? 'Hubungi Penjual');
    $deskripsi = sanitize_string($_POST['deskripsi'] ?? '');

    if ($namaBarang === '') {
        throw new Exception('Nama barang wajib diisi.');
    }

    if ($harga < 0) {
        throw new Exception('Harga tidak valid.');
    }

    if ($stok < 1) {
        throw new Exception('Stok minimal 1.');
    }

    if (!in_array($kondisi, ['2nd Good Condition', 'Baru / UMKM'], true)) {
        throw new Exception('Kondisi barang tidak valid.');
    }

    $fotoFile = upload_marketplace_image('foto_file');
    if (!$fotoFile) {
        throw new Exception('Foto produk wajib diupload.');
    }

    $stmt = $pdo->prepare("
        INSERT INTO marketplace_posts
        (
            user_id,
            nama_barang,
            harga,
            stok,
            kondisi,
            metode_pengiriman,
            deskripsi,
            foto_file,
            status,
            expired_at
        )
        VALUES
        (
            :user_id,
            :nama_barang,
            :harga,
            :stok,
            :kondisi,
            :metode_pengiriman,
            :deskripsi,
            :foto_file,
            'Aktif',
            DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        )
    ");
    $stmt->execute([
        ':user_id' => $user['id'],
        ':nama_barang' => $namaBarang,
        ':harga' => $harga,
        ':stok' => $stok,
        ':kondisi' => $kondisi,
        ':metode_pengiriman' => $metode !== '' ? $metode : 'Hubungi Penjual',
        ':deskripsi' => $deskripsi !== '' ? $deskripsi : null,
        ':foto_file' => $fotoFile
    ]);

    json_response([
        'success' => true,
        'message' => 'Lapak dagangan berhasil ditayangkan.'
    ]);
} catch (Throwable $e) {
    json_response(['success' => false, 'message' => $e->getMessage()], 400);
}
