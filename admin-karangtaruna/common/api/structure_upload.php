<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

handle_cors_preflight();

try {
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        json_response(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
    }

    $file = $_FILES['file'] ?? null;
    if (!$file || ($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
        json_response(['success' => false, 'message' => 'File foto wajib dipilih.'], 422);
    }
    if (($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
        throw new RuntimeException('Upload foto gagal.');
    }

    $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
    $extension = strtolower(pathinfo((string)$file['name'], PATHINFO_EXTENSION));
    $size = (int)($file['size'] ?? 0);

    if (!in_array($extension, $allowedExtensions, true)) {
        throw new RuntimeException('Format foto tidak diizinkan. Gunakan JPG, PNG, WEBP, atau AVIF.');
    }
    if ($size > 5 * 1024 * 1024) {
        throw new RuntimeException('Ukuran foto maksimal 5 MB.');
    }

    $uploadDir = __DIR__ . '/../../uploads/struktur/';
    if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true)) {
        throw new RuntimeException('Folder upload struktur tidak bisa dibuat.');
    }

    $safeBase = preg_replace('/[^a-z0-9]+/i', '-', pathinfo((string)$file['name'], PATHINFO_FILENAME));
    $safeBase = trim((string)$safeBase, '-');
    if ($safeBase === '') $safeBase = 'pengurus';

    $safeName = 'struktur-' . date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '-' . $safeBase . '.' . $extension;
    $targetPath = $uploadDir . $safeName;

    if (!move_uploaded_file((string)$file['tmp_name'], $targetPath)) {
        throw new RuntimeException('Gagal menyimpan foto struktur.');
    }

    json_response([
        'success' => true,
        'ok' => true,
        'path' => 'uploads/struktur/' . $safeName,
    ]);
} catch (Throwable $error) {
    json_response([
        'success' => false,
        'ok' => false,
        'message' => $error->getMessage(),
    ], 500);
}
