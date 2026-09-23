<?php
declare(strict_types=1);

require_once __DIR__ . '/kas_helpers.php';
require_once __DIR__ . '/../db.php';

try {
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        kas_json(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
    }

    $sourceTable = trim((string)($_POST['source_table'] ?? ''));
    $sourceId = (int)($_POST['source_id'] ?? ($_POST['id'] ?? 0));

    if ($sourceTable === 'kas_pembayaran' || strpos((string)($_POST['id'] ?? ''), 'kas-') === 0) {
        kas_json([
            'success' => false,
            'message' => 'Data kas bulanan tidak bisa dihapus dari halaman cashflow. Hapus melalui menu input kas.',
        ], 400);
    }

    if ($sourceTable !== '' && $sourceTable !== 'cashflow_transaksi') {
        throw new Exception('Sumber data tidak valid.');
    }

    if ($sourceId <= 0) {
        $rawId = (string)($_POST['id'] ?? '');
        if (preg_match('/^cashflow-(\d+)$/', $rawId, $matches)) {
            $sourceId = (int)$matches[1];
        }
    }

    if ($sourceId <= 0) {
        throw new Exception('ID transaksi tidak valid.');
    }

    $stmt = $pdo->prepare("DELETE FROM cashflow_transaksi WHERE id = :id");
    $stmt->execute([':id' => $sourceId]);

    kas_json(['success' => true, 'message' => 'Transaksi berhasil dihapus.']);
} catch (Throwable $e) {
    kas_json(['success' => false, 'message' => $e->getMessage()], 400);
}
