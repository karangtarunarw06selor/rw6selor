<?php
declare(strict_types=1);

const ARCHIVE_TABLES = [
    'lpj' => [
        'table' => 'archive_lpj',
        'upload_dir' => 'uploads/arsip/LPJ',
    ],
    'surat' => [
        'table' => 'archive_surat',
        'upload_dir' => 'uploads/arsip/surat-pengantar',
    ],
    'proposal' => [
        'table' => 'archive_proposal',
        'upload_dir' => 'uploads/arsip/proposal',
    ],
    'lomba' => [
        'table' => 'archive_lomba',
        'upload_dir' => 'uploads/arsip/lomba',
    ],
];

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (!function_exists('json_response')) {
    function json_response(array $payload, int $status = 200): void
    {
        http_response_code($status);
        echo json_encode($payload, JSON_UNESCAPED_UNICODE);
        exit;
    }
}

if (!function_exists('json_input')) {
    function json_input(): array
    {
        $raw = file_get_contents('php://input');
        if (!$raw) {
            return [];
        }
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }
}

function archive_type_config(string $type): array
{
    $type = strtolower(trim($type));
    if (!isset(ARCHIVE_TABLES[$type])) {
        json_response(['success' => false, 'message' => 'Jenis arsip tidak valid.'], 422);
    }

    return ARCHIVE_TABLES[$type] + ['type' => $type];
}

function archives_ensure_tables(PDO $pdo): void
{
    foreach (ARCHIVE_TABLES as $config) {
        $table = $config['table'];
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS {$table} (
                id INT AUTO_INCREMENT PRIMARY KEY,
                archive_date DATE NOT NULL,
                title VARCHAR(255) NOT NULL,
                category VARCHAR(120) DEFAULT NULL,
                person_name VARCHAR(180) DEFAULT NULL,
                external_url TEXT DEFAULT NULL,
                local_file VARCHAR(255) DEFAULT NULL,
                source_data VARCHAR(50) DEFAULT 'input_html',
                raw_source JSON DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_archive_date (archive_date),
                INDEX idx_title (title),
                INDEX idx_category (category)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");
    }
}

function archive_normalize_local_path(?string $path): string
{
    $path = trim((string)$path);
    if ($path === '' || preg_match('/^https?:\/\//i', $path)) {
        return $path;
    }

    $path = ltrim($path, '/');
    if (str_starts_with($path, 'public_html/')) {
        $path = substr($path, strlen('public_html/'));
    }

    return $path;
}

function archive_local_file_exists(?string $path): bool
{
    $path = archive_normalize_local_path($path);
    if ($path === '' || preg_match('/^https?:\/\//i', $path)) {
        return false;
    }

    return is_file(__DIR__ . '/../../' . $path);
}

function archive_resolve_file_url(?string $localFile, ?string $externalUrl): string
{
    $localFile = archive_normalize_local_path($localFile);
    $externalUrl = trim((string)$externalUrl);

    if ($localFile !== '' && archive_local_file_exists($localFile)) {
        return $localFile;
    }

    return $externalUrl;
}

function archive_format_date(?string $date): string
{
    $timestamp = $date ? strtotime($date) : false;
    return $timestamp ? date('d/m/Y', $timestamp) : (string)$date;
}

function archive_mysql_date(?string $value): ?string
{
    $value = trim((string)$value);
    if ($value === '') {
        return null;
    }

    foreach (['Y-m-d', 'd/m/Y', 'd-m-Y', 'm/d/Y'] as $format) {
        $date = DateTime::createFromFormat($format, $value);
        if ($date instanceof DateTime) {
            return $date->format('Y-m-d');
        }
    }

    $timestamp = strtotime($value);
    return $timestamp ? date('Y-m-d', $timestamp) : null;
}

function archive_save_upload(array $file, string $type): ?string
{
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
        return null;
    }
    if (($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
        throw new RuntimeException('Upload file arsip gagal.');
    }

    $allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'webp'];
    $extension = strtolower(pathinfo((string)$file['name'], PATHINFO_EXTENSION));
    $size = (int)($file['size'] ?? 0);

    if (!in_array($extension, $allowedExtensions, true)) {
        throw new RuntimeException('Format file tidak diizinkan. Gunakan PDF, DOC, XLS, JPG, PNG, atau WEBP.');
    }
    if ($size > 100 * 1024 * 1024) {
        throw new RuntimeException('Ukuran file maksimal 100 MB.');
    }

    $config = archive_type_config($type);
    $uploadDir = __DIR__ . '/../../' . $config['upload_dir'] . '/';
    if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true)) {
        throw new RuntimeException('Folder upload arsip tidak bisa dibuat.');
    }

    $safeBase = preg_replace('/[^a-z0-9]+/i', '-', pathinfo((string)$file['name'], PATHINFO_FILENAME));
    $safeBase = trim((string)$safeBase, '-');
    if ($safeBase === '') {
        $safeBase = 'arsip';
    }

    $safeName = strtolower($type) . '-' . date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '-' . $safeBase . '.' . $extension;
    $targetPath = $uploadDir . $safeName;

    if (!move_uploaded_file((string)$file['tmp_name'], $targetPath)) {
        throw new RuntimeException('Gagal menyimpan file arsip.');
    }

    return $config['upload_dir'] . '/' . $safeName;
}
