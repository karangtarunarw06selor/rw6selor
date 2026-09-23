<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

function json_response(array $payload, int $statusCode = 200): void {
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function sanitize_string(?string $value): string {
    return trim((string) $value);
}

function marketplace_user_payload(array $row): array {
    return [
        'id' => (int) $row['id'],
        'nama' => $row['nama'],
        'email' => $row['email'],
        'no_hp' => $row['no_hp'],
        'alamat' => $row['alamat'],
        'foto_profil' => $row['foto_profil'] ?? null,
        'bio' => $row['bio'] ?? null,
        'nama_toko' => $row['nama_toko'] ?? null,
        'status' => $row['status']
    ];
}

function current_user(): ?array {
    global $pdo;

    $id = (int) ($_SESSION['marketplace_user_id'] ?? 0);
    if ($id <= 0) {
        return null;
    }

    $stmt = $pdo->prepare("
        SELECT id, nama, email, no_hp, alamat, foto_profil, bio, nama_toko, status
        FROM marketplace_users
        WHERE id = :id AND status = 'active'
        LIMIT 1
    ");
    $stmt->execute([':id' => $id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        unset($_SESSION['marketplace_user_id']);
        return null;
    }

    return marketplace_user_payload($user);
}

function get_marketplace_user_public(int $userId): ?array {
    global $pdo;

    if ($userId <= 0) {
        return null;
    }

    $stmt = $pdo->prepare("
        SELECT id, nama, nama_toko, no_hp, alamat, bio, foto_profil, created_at
        FROM marketplace_users
        WHERE id = :id AND status = 'active'
        LIMIT 1
    ");
    $stmt->execute([':id' => $userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        return null;
    }

    return [
        'id' => (int) $user['id'],
        'nama' => $user['nama'],
        'nama_toko' => $user['nama_toko'],
        'no_hp' => $user['no_hp'],
        'alamat' => $user['alamat'],
        'bio' => $user['bio'],
        'foto_profil' => $user['foto_profil'],
        'created_at' => $user['created_at']
    ];
}

function normalize_phone_for_whatsapp(?string $noHp): string {
    $digits = preg_replace('/\D+/', '', (string) $noHp);
    if ($digits === '') {
        return '';
    }
    if (str_starts_with($digits, '62')) {
        return $digits;
    }
    if (str_starts_with($digits, '0')) {
        return '62' . substr($digits, 1);
    }
    return $digits;
}

function public_asset_url(?string $path): string {
    if (!$path) {
        return '';
    }
    if (preg_match('/^https?:\/\//i', $path)) {
        return $path;
    }
    return '/' . ltrim($path, '/');
}

function require_login(): array {
    $user = current_user();
    if (!$user) {
        json_response([
            'success' => false,
            'message' => 'Silakan login terlebih dahulu.'
        ], 401);
    }

    return $user;
}

function upload_marketplace_image(string $fieldName = 'foto_file'): ?string {
    if (empty($_FILES[$fieldName]['name'])) {
        return null;
    }

    if ($_FILES[$fieldName]['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Gagal mengupload foto produk.');
    }

    $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
    $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    $originalName = $_FILES[$fieldName]['name'];
    $tmpName = $_FILES[$fieldName]['tmp_name'];
    $size = (int) $_FILES[$fieldName]['size'];
    $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

    if (!in_array($extension, $allowedExtensions, true)) {
        throw new Exception('Format foto tidak diizinkan. Gunakan JPG, PNG, WEBP, atau AVIF.');
    }

    if ($size > 5 * 1024 * 1024) {
        throw new Exception('Foto masih terlalu besar setelah dikompres. Coba pilih foto lain atau crop terlebih dahulu.');
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = $finfo ? finfo_file($finfo, $tmpName) : '';
    if ($finfo) {
        finfo_close($finfo);
    }

    if (!in_array($mimeType, $allowedMimeTypes, true)) {
        throw new Exception('Format foto tidak diizinkan. Gunakan JPG, PNG, WEBP, atau AVIF.');
    }

    $uploadDir = __DIR__ . '/../../uploads/marketplace/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $safeName = 'marketplace-' . date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '.' . $extension;
    $targetPath = $uploadDir . $safeName;

    if (!move_uploaded_file($tmpName, $targetPath)) {
        throw new Exception('Gagal menyimpan foto produk.');
    }

    return 'uploads/marketplace/' . $safeName;
}

function upload_marketplace_profile_photo(string $fieldName = 'foto_profil'): ?string {
    if (empty($_FILES[$fieldName]['name'])) {
        return null;
    }

    if ($_FILES[$fieldName]['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Gagal mengupload foto profil.');
    }

    $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
    $originalName = $_FILES[$fieldName]['name'];
    $tmpName = $_FILES[$fieldName]['tmp_name'];
    $size = (int) $_FILES[$fieldName]['size'];
    $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

    if (!in_array($extension, $allowedExtensions, true)) {
        throw new Exception('Format foto profil tidak diizinkan. Gunakan JPG, PNG, WEBP, atau AVIF.');
    }

    if ($size > 3 * 1024 * 1024) {
        throw new Exception('Ukuran foto profil maksimal 3 MB.');
    }

    $uploadDir = __DIR__ . '/../../uploads/marketplace/profiles/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $safeName = 'profile-' . date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '.' . $extension;
    $targetPath = $uploadDir . $safeName;

    if (!move_uploaded_file($tmpName, $targetPath)) {
        throw new Exception('Gagal menyimpan foto profil.');
    }

    return 'uploads/marketplace/profiles/' . $safeName;
}

function delete_marketplace_asset(?string $path): void {
    if (!$path || preg_match('/^https?:\/\//i', $path)) {
        return;
    }

    $filePath = __DIR__ . '/../../' . ltrim($path, '/');
    if (is_file($filePath)) {
        @unlink($filePath);
    }
}
