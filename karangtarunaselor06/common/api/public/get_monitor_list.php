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

function build_bracket_label(array $bracket, array $settings, string $fallback = 'Lomba'): string {
    $rawName = trim((string)($settings['competitionName'] ?? ($bracket['competitionName'] ?? '')));
    if ($rawName !== '' && strtolower($rawName) !== 'lomba tanpa nama') {
        return $rawName;
    }

    $mode = (string)($settings['competitionMode'] ?? ($bracket['mode'] ?? ''));
    $age = (string)($settings['ageCategoryFilter'] ?? ($bracket['age_category'] ?? ''));

    $modeLabel = [
        'individual' => 'Individu',
        'auto_group' => 'Campuran',
        'group' => 'Kelompok'
    ][$mode] ?? $mode;

    $ageLabel = [
        'all' => 'Semua Kategori',
        'anak_all' => 'Semua Anak',
        'adult_all' => 'Dewasa/Umum',
        'dewasa_all' => 'Dewasa/Umum',
        'tk_2sd' => 'TK - SD Kecil',
        'sd_3_5' => 'SD 3-5',
        'sd6_smp' => 'SD 6 - SMP'
    ][$age] ?? $age;

    $label = trim($modeLabel . ($ageLabel !== '' ? ' - ' . $ageLabel : ''));
    return $label !== '' ? $label : $fallback;
}

function decode_bracket_row(array $row): ?array {
    $bracket = json_decode((string)($row['bracket_json'] ?? ''), true);
    if (!is_array($bracket)) {
        return null;
    }

    $settings = is_array($bracket['settings'] ?? null) ? $bracket['settings'] : [];
    $name = build_bracket_label($bracket, $settings, 'Lomba belum diberi nama');

    return [
        'name' => $name,
        'detail' => $name,
        'bracket' => $bracket,
        'updated_at' => $row['updated_at'] ?? $row['published_at'] ?? $row['created_at'] ?? null,
    ];
}

try {
    require_once __DIR__ . '/../../db.php';

    if (!isset($pdo) || !$pdo instanceof PDO) {
        json_out(['success' => false, 'message' => 'Koneksi PDO tidak ditemukan.']);
    }

    $items = [];

    $liveStmt = $pdo->query('SELECT id, bracket_json, is_active, published_at, updated_at FROM published_bracket ORDER BY id DESC LIMIT 1');
    $liveRow = $liveStmt ? $liveStmt->fetch(PDO::FETCH_ASSOC) : false;
    if ($liveRow && !empty($liveRow['is_active'])) {
        $live = decode_bracket_row($liveRow);
        if ($live) {
            $items[] = [
                'key' => 'active_bracket',
                'type' => 'active',
                'title' => 'Lomba Aktif',
                'detail' => $live['detail'],
                'updated_at' => $live['updated_at']
            ];
        }
    }

    $historyStmt = $pdo->query("SELECT id, name, bracket_json, updated_at, created_at, status FROM brackets WHERE status = 'completed' ORDER BY updated_at DESC, id DESC");
    while ($row = $historyStmt ? $historyStmt->fetch(PDO::FETCH_ASSOC) : false) {
        $decoded = decode_bracket_row($row);
        if (!$decoded) continue;
        $items[] = [
            'key' => 'completed_' . $row['id'],
            'type' => 'history',
            'title' => $decoded['name'],
            'detail' => $decoded['detail'],
            'updated_at' => $decoded['updated_at']
        ];
    }

    json_out([
        'success' => true,
        'items' => $items,
        'retention_days' => null
    ]);
} catch (Throwable $e) {
    json_out([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
