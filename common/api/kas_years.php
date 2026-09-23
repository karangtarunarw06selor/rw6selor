<?php
require_once __DIR__ . '/kas_helpers.php';
require_once __DIR__ . '/../db.php';

if (function_exists('kas_send_cors_headers')) {
    kas_send_cors_headers();
} elseif (function_exists('send_cors_headers')) {
    send_cors_headers();
} else {
    header('Content-Type: application/json; charset=utf-8');
}

try {
    $stmt = $pdo->query("
        SELECT DISTINCT tahun
        FROM kas_pembayaran
        WHERE tahun IS NOT NULL
        ORDER BY tahun DESC
    ");

    $years = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $years = array_map('intval', $years);

    $currentYear = (int) date('Y');

    if (!in_array($currentYear, $years, true)) {
        $years[] = $currentYear;
    }

    $years = array_values(array_unique($years));
    rsort($years);

    echo json_encode([
        'success' => true,
        'data' => $years
    ]);
} catch (Throwable $e) {
    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}