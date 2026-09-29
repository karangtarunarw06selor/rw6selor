<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

handle_cors_preflight();

try {
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        json_response(['ok' => false, 'message' => 'Method tidak diizinkan.'], 405);
    }

    $input = json_input();
    if (!$input && !empty($_POST)) {
        $input = $_POST;
    }

    $email = strtolower(trim((string)($input['email'] ?? '')));

    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_response(['ok' => false, 'message' => 'Email tidak valid.'], 422);
    }

    $pdo = db();
    $stmt = $pdo->prepare("SELECT id, member_code, full_name, email, rt FROM members WHERE LOWER(email) = :email AND is_active = 1 LIMIT 1");
    $stmt->execute([
        ':email' => $email,
    ]);
    $member = $stmt->fetch();

    if (!$member) {
        json_response(['ok' => false, 'message' => 'Email belum terdaftar sebagai anggota aktif.'], 401);
    }

    json_response([
        'ok' => true,
        'message' => 'Login anggota berhasil.',
        'member' => [
            'id' => (int)$member['id'],
            'member_code' => (string)$member['member_code'],
            'full_name' => (string)$member['full_name'],
            'email' => (string)$member['email'],
            'rt' => (string)($member['rt'] ?? ''),
        ],
    ]);
} catch (Throwable $error) {
    json_response(['ok' => false, 'message' => 'Login gagal: ' . $error->getMessage()], 500);
}
