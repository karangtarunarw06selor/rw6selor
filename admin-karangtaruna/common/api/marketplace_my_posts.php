<?php
declare(strict_types=1);

require_once __DIR__ . '/marketplace_helpers.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        json_response(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
    }

    $user = require_login();
    $includeDeleted = ($_GET['include_deleted'] ?? '') === '1';
    $statusSql = $includeDeleted
        ? "status IN ('Aktif', 'Terjual', 'Dihapus')"
        : "status IN ('Aktif', 'Terjual')";

    $stmt = $pdo->prepare("
        SELECT
            id,
            nama_barang,
            harga,
            stok,
            kondisi,
            metode_pengiriman,
            deskripsi,
            foto_file,
            status,
            expired_at,
            created_at,
            updated_at
        FROM marketplace_posts
        WHERE user_id = :user_id AND $statusSql
        ORDER BY created_at DESC, id DESC
    ");
    $stmt->execute([':user_id' => $user['id']]);

    json_response([
        'success' => true,
        'posts' => $stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);
} catch (Throwable $e) {
    json_response(['success' => false, 'message' => $e->getMessage()], 400);
}
