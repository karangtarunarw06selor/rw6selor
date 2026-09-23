<?php
declare(strict_types=1);

require_once __DIR__ . '/marketplace_helpers.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        json_response(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
    }

    $userId = (int) ($_GET['user_id'] ?? 0);
    $seller = get_marketplace_user_public($userId);

    if (!$seller) {
        throw new Exception('Profil penjual tidak ditemukan.');
    }

    $stmt = $pdo->prepare("
        SELECT
            id,
            user_id,
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
        WHERE user_id = :user_id AND status IN ('Aktif', 'Terjual')
        ORDER BY created_at DESC, id DESC
    ");
    $stmt->execute([':user_id' => $userId]);

    json_response([
        'success' => true,
        'seller' => $seller,
        'posts' => $stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);
} catch (Throwable $e) {
    json_response(['success' => false, 'message' => $e->getMessage()], 400);
}
