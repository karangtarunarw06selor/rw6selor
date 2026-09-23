<?php
declare(strict_types=1);

require_once __DIR__ . '/marketplace_helpers.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_response(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
    }

    $postId = (int) ($_POST['post_id'] ?? 0);
    $nama = sanitize_string($_POST['nama_pengunjung'] ?? '');
    $jenis = sanitize_string($_POST['jenis'] ?? 'Komentar');
    $nilai = (float) ($_POST['nilai'] ?? 0);
    $isi = sanitize_string($_POST['isi'] ?? '');

    if ($postId <= 0) {
        throw new Exception('Postingan tidak valid.');
    }

    if ($nama === '') {
        throw new Exception('Nama wajib diisi.');
    }

    if (!in_array($jenis, ['Komentar', 'Nego', 'Rating'], true)) {
        throw new Exception('Jenis interaksi tidak valid.');
    }

    if ($isi === '') {
        throw new Exception('Isi pesan wajib diisi.');
    }

    if ($jenis === 'Rating') {
        $nilai = min(5, max(1, $nilai));
    }

    if ($jenis === 'Komentar') {
        $nilai = 0;
    }

    $checkStmt = $pdo->prepare("SELECT id FROM marketplace_posts WHERE id = :id AND status IN ('Aktif', 'Terjual') LIMIT 1");
    $checkStmt->execute([':id' => $postId]);
    if (!$checkStmt->fetch()) {
        throw new Exception('Postingan tidak ditemukan.');
    }

    $stmt = $pdo->prepare("
        INSERT INTO marketplace_interactions (post_id, nama_pengunjung, jenis, nilai, isi)
        VALUES (:post_id, :nama_pengunjung, :jenis, :nilai, :isi)
    ");
    $stmt->execute([
        ':post_id' => $postId,
        ':nama_pengunjung' => $nama,
        ':jenis' => $jenis,
        ':nilai' => $nilai,
        ':isi' => $isi
    ]);

    json_response([
        'success' => true,
        'message' => 'Interaksi berhasil dikirim.'
    ]);
} catch (Throwable $e) {
    json_response(['success' => false, 'message' => $e->getMessage()], 400);
}
