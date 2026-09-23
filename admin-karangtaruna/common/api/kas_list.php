<?php
require_once __DIR__ . '/kas_helpers.php';
require_once __DIR__ . '/../db.php';

try {
    kas_ensure_tables($pdo);

    $tahun = $_GET['tahun'] ?? '';
    $nama = trim($_GET['nama'] ?? '');

    $where = [];
    $params = [];

    if ($tahun !== '') {
        $where[] = 'tahun = :tahun';
        $params[':tahun'] = (int)$tahun;
    }
    if ($nama !== '') {
        $where[] = 'nama LIKE :nama';
        $params[':nama'] = '%' . $nama . '%';
    }

    $sqlWhere = $where ? 'WHERE ' . implode(' AND ', $where) : '';

    $sql = "SELECT id, tanggal, nama, bulan, tahun, jumlah, metode_pembayaran, keterangan, sumber_data, created_at
            FROM kas_pembayaran
            {$sqlWhere}
            ORDER BY tanggal DESC, id DESC
            LIMIT 300";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $data = $stmt->fetchAll();

    $totalStmt = $pdo->prepare("SELECT COALESCE(SUM(jumlah),0) AS total FROM kas_pembayaran {$sqlWhere}");
    $totalStmt->execute($params);
    $total = $totalStmt->fetch()['total'];

    kas_json(['success' => true, 'total' => (float)$total, 'data' => $data]);
} catch (Throwable $e) {
    kas_json(['success' => false, 'message' => $e->getMessage()], 500);
}
