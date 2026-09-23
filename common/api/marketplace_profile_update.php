<?php
declare(strict_types=1);

require_once __DIR__ . '/marketplace_helpers.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_response(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
    }

    $user = require_login();
    $nama = sanitize_string($_POST['nama'] ?? '');
    $namaToko = sanitize_string($_POST['nama_toko'] ?? '');
    $noHp = sanitize_string($_POST['no_hp'] ?? '');
    $alamat = sanitize_string($_POST['alamat'] ?? '');
    $bio = sanitize_string($_POST['bio'] ?? '');

    if ($nama === '') {
        throw new Exception('Nama wajib diisi.');
    }

    if ($noHp === '') {
        throw new Exception('Nomor HP wajib diisi.');
    }

    $stmt = $pdo->prepare("SELECT foto_profil FROM marketplace_users WHERE id = :id LIMIT 1");
    $stmt->execute([':id' => $user['id']]);
    $existing = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$existing) {
        throw new Exception('User tidak ditemukan.');
    }

    $newPhoto = upload_marketplace_profile_photo('foto_profil');
    $oldPhoto = $existing['foto_profil'] ?? null;
    $fotoProfil = $newPhoto ?: $oldPhoto;

    $update = $pdo->prepare("
        UPDATE marketplace_users
        SET
            nama = :nama,
            nama_toko = :nama_toko,
            no_hp = :no_hp,
            alamat = :alamat,
            bio = :bio,
            foto_profil = :foto_profil
        WHERE id = :id
    ");
    $update->execute([
        ':nama' => $nama,
        ':nama_toko' => $namaToko !== '' ? $namaToko : null,
        ':no_hp' => $noHp,
        ':alamat' => $alamat !== '' ? $alamat : null,
        ':bio' => $bio !== '' ? $bio : null,
        ':foto_profil' => $fotoProfil,
        ':id' => $user['id']
    ]);

    if ($newPhoto && $oldPhoto && $newPhoto !== $oldPhoto) {
        delete_marketplace_asset($oldPhoto);
    }

    $updatedUser = current_user();

    json_response([
        'success' => true,
        'message' => 'Profil berhasil diperbarui.',
        'user' => $updatedUser
    ]);
} catch (Throwable $e) {
    json_response(['success' => false, 'message' => $e->getMessage()], 400);
}
