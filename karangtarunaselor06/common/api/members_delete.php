<?php
declare(strict_types=1);

require_once __DIR__ . '/members_helpers.php';
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
}

$id = (int)($_POST['id'] ?? 0);
$mode = (string)($_POST['mode'] ?? 'toggle');
$confirm = strtolower(trim((string)($_POST['confirm'] ?? '')));
$is_active_input = isset($_POST['is_active']) ? (int)$_POST['is_active'] : null;

if ($id <= 0) {
    json_response(['success' => false, 'message' => 'ID tidak valid.'], 400);
}

if ($mode === 'delete') {
    if ($confirm !== 'hapus') {
        json_response(['success' => false, 'message' => 'Konfirmasi hapus tidak valid.'], 400);
    }

    $stmt = $pdo->prepare("SELECT id, full_name, photo_file FROM members WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $row = $stmt->fetch();

    if (!$row) {
        json_response(['success' => false, 'message' => 'Anggota tidak ditemukan.'], 404);
    }

    $stmt = $pdo->prepare("DELETE FROM members WHERE id = :id");
    $stmt->execute([':id' => $id]);

    $photoFile = normalize_member_photo_path($row['photo_file'] ?? '');
    if ($photoFile !== '' && str_starts_with($photoFile, 'uploads/')) {
        $photoPath = __DIR__ . '/../../' . $photoFile;
        if (is_file($photoPath)) {
            @unlink($photoPath);
        }
    }

    json_response([
        'success' => true,
        'message' => 'Data anggota berhasil dihapus.',
        'id' => $id,
    ]);
}

// Ambil data dulu untuk cek is_active saat ini (jika mode toggle)
if ($mode === 'toggle' && $is_active_input === null) {
    $stmt = $pdo->prepare("SELECT is_active FROM members WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $row = $stmt->fetch();
    if (!$row) {
        json_response(['success' => false, 'message' => 'Anggota tidak ditemukan.'], 404);
    }
    $is_active = $row['is_active'] ? 0 : 1;
} else {
    $is_active = $is_active_input ?? 0;
}

// Soft delete / toggle active
$stmt = $pdo->prepare("UPDATE members SET is_active = :is_active, updated_at = NOW() WHERE id = :id");
$stmt->execute([
    ':is_active' => $is_active,
    ':id' => $id,
]);

$statusText = $is_active ? 'diaktifkan' : 'dinonaktifkan';

json_response([
    'success' => true,
    'message' => "Status anggota berhasil {$statusText}.",
    'is_active' => $is_active,
]);
