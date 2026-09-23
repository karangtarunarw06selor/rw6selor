<?php
declare(strict_types=1);

require_once __DIR__ . '/warga-chat.php';
require_once __DIR__ . '/db.php';

handle_cors_preflight();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'message' => 'Method tidak diizinkan.'], 405);
}

$input = json_input();
if (!$input) {
    $input = $_POST;
}

$id = (int)($input['id'] ?? 0);
$mode = (string)($input['mode'] ?? '');

if ($id <= 0) {
    json_response(['ok' => false, 'message' => 'ID tidak valid.'], 400);
}

try {
    $pdo = db();
    ensure_chat_tables($pdo);

    if ($mode === 'edit_name') {
        $displayName = trim((string)($input['display_name'] ?? ''));
        if ($displayName === '') {
            json_response(['ok' => false, 'message' => 'Nama wajib diisi.'], 422);
        }

        if (function_exists('mb_strlen')) {
            if (mb_strlen($displayName, 'UTF-8') > 120) {
                json_response(['ok' => false, 'message' => 'Nama maksimal 120 karakter.'], 422);
            }
        } elseif (strlen($displayName) > 120) {
            json_response(['ok' => false, 'message' => 'Nama maksimal 120 karakter.'], 422);
        }

        $member = find_member_by_chat_name($pdo, $displayName);
        $isMember = $member ? 1 : 0;
        $memberId = $member ? (int)$member['id'] : null;

        $stmt = $pdo->prepare("SELECT id FROM warga_chat_users WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        if (!$stmt->fetch()) {
            json_response(['ok' => false, 'message' => 'Pengguna tidak ditemukan.'], 404);
        }

        $stmtUpdate = $pdo->prepare("
            UPDATE warga_chat_users
            SET display_name = :display_name,
                is_member = :is_member,
                member_id = :member_id,
                is_archived = 0
            WHERE id = :id
        ");
        $stmtUpdate->execute([
            ':display_name' => $displayName,
            ':is_member' => $isMember,
            ':member_id' => $memberId,
            ':id' => $id,
        ]);

        json_response([
            'ok' => true,
            'message' => 'Nama pengguna berhasil diperbarui.',
        ]);
    }

    if ($mode === 'delete') {
        $stmt = $pdo->prepare("SELECT id, display_name FROM warga_chat_users WHERE id = :id AND is_archived = 0");
        $stmt->execute([':id' => $id]);
        $user = $stmt->fetch();

        if (!$user) {
            json_response(['ok' => false, 'message' => 'Pengguna tidak ditemukan.'], 404);
        }

        $visibleCount = (int)$pdo->query("SELECT COUNT(*) FROM warga_chat_users WHERE is_archived = 0")->fetchColumn();
        if ($visibleCount <= 1) {
            json_response([
                'ok' => false,
                'message' => 'Minimal satu nama harus tetap tersimpan di daftar, jadi baris terakhir tidak bisa dihapus.',
            ], 409);
        }

        $stmt = $pdo->prepare("
            UPDATE warga_chat_users
            SET is_archived = 1
            WHERE id = :id
        ");
        $stmt->execute([':id' => $id]);

        json_response([
            'ok' => true,
            'message' => "Baris pengguna '{$user['display_name']}' berhasil disembunyikan dari daftar. Riwayat chat tetap tersimpan.",
        ]);
    }

    json_response(['ok' => false, 'message' => 'Mode tidak dikenal.'], 400);
} catch (Throwable $error) {
    json_response([
        'ok' => false,
        'message' => $error->getMessage(),
    ], 500);
}
