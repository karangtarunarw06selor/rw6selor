<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/structure_helpers.php';

handle_cors_preflight();

try {
    $pdo = db();

    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
        json_response(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
    }

    structure_ensure_table($pdo);

    $includeInactive = (string)($_GET['include_inactive'] ?? '') === '1';
    $where = $includeInactive ? '' : 'WHERE is_active = 1';
    $stmt = $pdo->query("SELECT * FROM struktur_pengurus {$where} ORDER BY urutan ASC, id ASC");
    $rows = array_map('structure_row_payload', $stmt->fetchAll(PDO::FETCH_ASSOC));

    json_response([
        'success' => true,
        'ok' => true,
        'total' => count($rows),
        'data' => $rows,
    ]);
} catch (Throwable $error) {
    json_response([
        'success' => false,
        'ok' => false,
        'message' => $error->getMessage(),
    ], 500);
}
