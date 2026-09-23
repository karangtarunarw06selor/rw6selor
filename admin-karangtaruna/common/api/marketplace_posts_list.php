<?php
declare(strict_types=1);

require_once __DIR__ . '/marketplace_helpers.php';

function marketplace_sisa_hari(?string $expiredAt): int {
    if (!$expiredAt) {
        return 0;
    }

    $today = new DateTimeImmutable('today');
    $expired = new DateTimeImmutable($expiredAt);
    return max(0, (int) $today->diff($expired)->format('%r%a'));
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        json_response(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
    }

    $postsStmt = $pdo->query("
        SELECT
            p.id,
            p.user_id,
            p.nama_barang,
            p.harga,
            p.stok,
            p.kondisi,
            p.metode_pengiriman,
            p.deskripsi,
            p.foto_file,
            p.status,
            p.expired_at,
            p.created_at,
            u.nama AS nama_penjual,
            u.nama_toko,
            u.foto_profil,
            u.alamat,
            u.email,
            u.no_hp
        FROM marketplace_posts p
        INNER JOIN marketplace_users u ON u.id = p.user_id
        WHERE p.status IN ('Aktif', 'Terjual')
        ORDER BY p.created_at DESC, p.id DESC
    ");
    $posts = $postsStmt->fetchAll(PDO::FETCH_ASSOC);

    $produk = array_map(function (array $row): array {
        return [
            'id' => (string) $row['id'],
            'user_id' => (int) $row['user_id'],
            'nama' => $row['nama_barang'],
            'nama_barang' => $row['nama_barang'],
            'harga' => (float) $row['harga'],
            'stok' => (int) $row['stok'],
            'kondisi' => $row['kondisi'],
            'foto' => $row['foto_file'],
            'foto_file' => $row['foto_file'],
            'metode' => $row['metode_pengiriman'],
            'metode_pengiriman' => $row['metode_pengiriman'],
            'status' => $row['status'],
            'sisaHari' => marketplace_sisa_hari($row['expired_at']),
            'email' => $row['email'],
            'nama_penjual' => $row['nama_penjual'],
            'nama_toko' => $row['nama_toko'],
            'foto_profil' => $row['foto_profil'],
            'no_hp' => $row['no_hp'],
            'alamat' => $row['alamat'],
            'deskripsi' => $row['deskripsi'],
            'created_at' => $row['created_at']
        ];
    }, $posts);

    $interaksiStmt = $pdo->query("
        SELECT
            i.id,
            i.post_id,
            i.nama_pengunjung,
            i.jenis,
            i.nilai,
            i.isi,
            i.created_at
        FROM marketplace_interactions i
        INNER JOIN marketplace_posts p ON p.id = i.post_id
        WHERE p.status IN ('Aktif', 'Terjual')
        ORDER BY i.created_at ASC, i.id ASC
    ");
    $interaksi = array_map(function (array $row): array {
        return [
            'id' => (string) $row['id'],
            'post_id' => (string) $row['post_id'],
            'idProduk' => (string) $row['post_id'],
            'namaPengunjung' => $row['nama_pengunjung'],
            'nama_pengunjung' => $row['nama_pengunjung'],
            'jenis' => $row['jenis'],
            'nilai' => (float) $row['nilai'],
            'isi' => $row['isi'],
            'waktu' => date('d/m/Y H:i', strtotime($row['created_at'])),
            'created_at' => $row['created_at']
        ];
    }, $interaksiStmt->fetchAll(PDO::FETCH_ASSOC));

    json_response([
        'success' => true,
        'produk' => $produk,
        'interaksi' => $interaksi
    ]);
} catch (Throwable $e) {
    json_response(['success' => false, 'message' => $e->getMessage()], 500);
}
