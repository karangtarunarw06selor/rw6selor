<?php
ob_start();

ini_set('display_errors', 0);
error_reporting(E_ALL);

function json_out($payload) {
    while (ob_get_level() > 0) {
        ob_end_clean();
    }

    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

try {
    require_once __DIR__ . '/../../db.php';

    if (!isset($pdo) || !$pdo instanceof PDO) {
        json_out(['success' => false, 'message' => 'Koneksi PDO tidak ditemukan.']);
    }

    $key = trim((string)($_GET['key'] ?? 'active_bracket'));

    if ($key === '' || $key === 'active_bracket') {
        $stmt = $pdo->query('SELECT id, bracket_json, is_active, published_at, updated_at FROM published_bracket ORDER BY id DESC LIMIT 1');
        $row = $stmt ? $stmt->fetch(PDO::FETCH_ASSOC) : false;

        if (!$row || empty($row['is_active'])) {
            json_out([
                'success' => true,
                'message' => 'Belum ada lomba aktif.',
                'bracket' => null,
                'state_key' => 'active_bracket'
            ]);
        }

        $bracket = json_decode((string)$row['bracket_json'], true);
        if (!is_array($bracket)) {
            json_out([
                'success' => false,
                'message' => 'JSON bracket publish tidak valid.',
                'state_key' => 'active_bracket'
            ]);
        }

        json_out([
            'success' => true,
            'message' => 'OK',
            'bracket' => $bracket,
            'state_key' => 'active_bracket',
            'updated_at' => $row['updated_at'] ?? $row['published_at'] ?? null,
            'is_history' => false
        ]);
    }

    if (preg_match('/^completed_(\d+)$/', $key, $m)) {
        $id = (int)$m[1];
        $stmt = $pdo->prepare("SELECT id, name, bracket_json, updated_at, created_at, status FROM brackets WHERE id = ? AND status = 'completed' LIMIT 1");
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            json_out([
                'success' => true,
                'message' => 'Riwayat lomba tidak ditemukan.',
                'bracket' => null,
                'state_key' => $key
            ]);
        }

        $bracket = json_decode((string)$row['bracket_json'], true);
        if (!is_array($bracket)) {
            json_out([
                'success' => false,
                'message' => 'JSON bracket arsip tidak valid.',
                'state_key' => $key
            ]);
        }

        json_out([
            'success' => true,
            'message' => 'OK',
            'bracket' => $bracket,
            'state_key' => $key,
            'updated_at' => $row['updated_at'] ?? $row['created_at'] ?? null,
            'is_history' => true
        ]);
    }

    json_out([
        'success' => true,
        'message' => 'Riwayat lomba tidak ditemukan.',
        'bracket' => null,
        'state_key' => $key
    ]);
} catch (Throwable $e) {
    json_out([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
