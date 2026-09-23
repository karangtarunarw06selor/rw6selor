<?php
declare(strict_types=1);

require_once __DIR__ . '/marketplace_helpers.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_response(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
    }

    $user = require_login();
    $id = (int) ($_POST['id'] ?? 0);
    $status = sanitize_string($_POST['status'] ?? '');

    if ($id <= 0) {
        throw new Exception('ID postingan tidak valid.');
    }

    if (!in_array($status, ['Terjual', 'Dihapus'], true)) {
        throw new Exception('Status tidak valid.');
    }

    $checkStmt = $pdo->prepare("SELECT user_id FROM marketplace_posts WHERE id = :id LIMIT 1");
    $checkStmt->execute([':id' => $id]);
    $post = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if (!$post) {
        throw new Exception('Postingan tidak ditemukan.');
    }

    if ((int) $post['user_id'] !== (int) $user['id']) {
        throw new Exception('Anda bukan pemilik postingan ini.');
    }

    $stmt = $pdo->prepare("UPDATE marketplace_posts SET status = :status WHERE id = :id");
    $stmt->execute([
        ':status' => $status,
        ':id' => $id
    ]);

    json_response([
        'success' => true,
        'message' => 'Status lapak berhasil diperbarui.'
    ]);
} catch (Throwable $e) {
    json_response(['success' => false, 'message' => $e->getMessage()], 400);
}
