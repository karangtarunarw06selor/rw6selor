<?php
declare(strict_types=1);

require_once __DIR__ . '/marketplace_helpers.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_response(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
    }

    $email = strtolower(sanitize_string($_POST['email'] ?? ''));
    $password = (string) ($_POST['password'] ?? '');

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
        throw new Exception('Email atau password tidak valid.');
    }

    $stmt = $pdo->prepare("
        SELECT id, nama, email, no_hp, alamat, foto_profil, bio, nama_toko, status, password_hash
        FROM marketplace_users
        WHERE email = :email AND status = 'active'
        LIMIT 1
    ");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password_hash'])) {
        throw new Exception('Email atau password salah.');
    }

    $_SESSION['marketplace_user_id'] = (int) $user['id'];

    json_response([
        'success' => true,
        'message' => 'Login berhasil.',
        'user' => marketplace_user_payload($user)
    ]);
} catch (Throwable $e) {
    json_response(['success' => false, 'message' => $e->getMessage()], 400);
}
