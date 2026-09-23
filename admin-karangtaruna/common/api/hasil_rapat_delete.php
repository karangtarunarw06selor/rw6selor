<?php
require_once __DIR__ . '/kas_helpers.php';
require_once __DIR__ . '/../db.php';

if (function_exists('kas_send_cors_headers')) {
    kas_send_cors_headers();
} elseif (function_exists('send_cors_headers')) {
    send_cors_headers();
} else {
    header('Content-Type: application/json; charset=utf-8');
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Method tidak diizinkan.'
        ]);
        exit;
    }

    $id = (int) ($_POST['id'] ?? 0);

    if ($id <= 0) {
        throw new Exception('ID hasil rapat tidak valid.');
    }

    $checkStmt = $pdo->prepare("SELECT lampiran_file FROM hasil_rapat WHERE id = :id LIMIT 1");
    $checkStmt->execute([':id' => $id]);
    $row = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        throw new Exception('Data hasil rapat tidak ditemukan.');
    }

    $stmt = $pdo->prepare("DELETE FROM hasil_rapat WHERE id = :id");
    $stmt->execute([':id' => $id]);

    if (!empty($row['lampiran_file'])) {
        $relativePath = ltrim($row['lampiran_file'], '/');
        $filePath = __DIR__ . '/../../' . $relativePath;

        if (is_file($filePath)) {
            @unlink($filePath);
        }
    }

    echo json_encode([
        'success' => true,
        'message' => 'Hasil rapat berhasil dihapus.'
    ]);
} catch (Throwable $e) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
