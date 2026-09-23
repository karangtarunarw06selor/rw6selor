<?php
declare(strict_types=1);

require_once __DIR__ . '/marketplace_helpers.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_response(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
    }

    $nama = sanitize_string($_POST['nama'] ?? '');
    $email = strtolower(sanitize_string($_POST['email'] ?? ''));
    $noHp = sanitize_string($_POST['no_hp'] ?? '');
    $alamat = sanitize_string($_POST['alamat'] ?? '');
    $password = (string) ($_POST['password'] ?? '');
    $passwordConfirm = (string) ($_POST['password_confirm'] ?? '');

    if ($nama === '') {
        throw new Exception('Nama wajib diisi.');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email tidak valid.');
    }

    if ($noHp === '') {
        throw new Exception('Nomor HP wajib diisi.');
    }

    if (strlen($password) < 6) {
        throw new Exception('Password minimal 6 karakter.');
    }

    if ($password !== $passwordConfirm) {
        throw new Exception('Konfirmasi password tidak sama.');
    }

    $checkStmt = $pdo->prepare("SELECT id FROM marketplace_users WHERE email = :email LIMIT 1");
    $checkStmt->execute([':email' => $email]);
    if ($checkStmt->fetch()) {
        throw new Exception('Email sudah terdaftar.');
    }

    $stmt = $pdo->prepare("
        INSERT INTO marketplace_users (nama, email, no_hp, alamat, password_hash, status)
        VALUES (:nama, :email, :no_hp, :alamat, :password_hash, 'active')
    ");
    $stmt->execute([
        ':nama' => $nama,
        ':email' => $email,
        ':no_hp' => $noHp,
        ':alamat' => $alamat !== '' ? $alamat : null,
        ':password_hash' => password_hash($password, PASSWORD_DEFAULT)
    ]);

    $_SESSION['marketplace_user_id'] = (int) $pdo->lastInsertId();
    $user = current_user();

    json_response([
        'success' => true,
        'message' => 'Pendaftaran berhasil.',
        'user' => $user
    ]);
} catch (Throwable $e) {
    json_response(['success' => false, 'message' => $e->getMessage()], 400);
}
