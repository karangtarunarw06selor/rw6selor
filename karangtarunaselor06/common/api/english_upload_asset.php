<?php
declare(strict_types=1);

require_once __DIR__ . '/english_helpers.php';

try {
    english_require_post();

    $assetType = trim((string)($_POST['asset_type'] ?? ''));
    if (!in_array($assetType, ['video', 'image'], true)) {
        throw new InvalidArgumentException('asset_type harus video atau image.');
    }
    if (empty($_FILES['file']) || ($_FILES['file']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        throw new InvalidArgumentException('File upload tidak valid.');
    }

    $originalName = (string)($_FILES['file']['name'] ?? '');
    $tmpName = (string)($_FILES['file']['tmp_name'] ?? '');
    $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    $allowed = $assetType === 'video'
        ? ['mp4' => ['video/mp4'], 'webm' => ['video/webm'], 'mov' => ['video/quicktime', 'video/mp4']]
        : ['jpg' => ['image/jpeg'], 'jpeg' => ['image/jpeg'], 'png' => ['image/png'], 'webp' => ['image/webp']];

    if (!isset($allowed[$extension])) {
        throw new InvalidArgumentException('Ekstensi file tidak diizinkan.');
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = (string)$finfo->file($tmpName);
    if (!in_array($mime, $allowed[$extension], true)) {
        throw new InvalidArgumentException('MIME file tidak sesuai.');
    }

    $targetSubdir = $assetType === 'video' ? 'videos' : 'images';
    $targetDir = __DIR__ . '/../../lat-inggris/assets/' . $targetSubdir . '/';
    if (!is_dir($targetDir) && !mkdir($targetDir, 0755, true)) {
        throw new RuntimeException('Folder upload tidak bisa dibuat.');
    }

    $baseName = pathinfo($originalName, PATHINFO_FILENAME);
    $safeBase = english_slug($baseName);
    $filename = $safeBase . '-' . date('Ymd-His') . '.' . $extension;
    $targetPath = $targetDir . $filename;
    if (!move_uploaded_file($tmpName, $targetPath)) {
        throw new RuntimeException('Gagal menyimpan file upload.');
    }

    english_json([
        'success' => true,
        'type' => $assetType,
        'url' => 'lat-inggris/assets/' . $targetSubdir . '/' . $filename,
        'filename' => $filename,
    ]);
} catch (Throwable $e) {
    english_json(['success' => false, 'message' => $e->getMessage()], 400);
}
