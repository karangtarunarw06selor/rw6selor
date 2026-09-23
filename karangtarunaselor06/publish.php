<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

try {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $pdo = db();

    if ($method === 'GET') {
        $stmt = $pdo->query('SELECT id, bracket_json, podium_json, is_active, published_at, updated_at FROM published_bracket ORDER BY id DESC LIMIT 1');
        $row = $stmt->fetch();
        if (!$row) {
            json_response(['ok' => true, 'data' => ['is_active' => false, 'bracket' => null, 'podium' => null]]);
        }
        $bracket = json_decode((string)$row['bracket_json'], true);
        $settings = is_array($bracket) ? ($bracket['settings'] ?? null) : null;
        $name = is_array($settings) ? ($settings['competitionName'] ?? '') : '';
        if ($name === '' && is_array($bracket)) {
            $name = (string)($bracket['competitionName'] ?? '');
        }
        json_response(['ok' => true, 'data' => [
            'id' => (int)$row['id'],
            'is_active' => (bool)$row['is_active'],
            'name' => $name !== '' ? $name : 'Lomba belum diberi nama',
            'settings' => $settings,
            'bracket' => $bracket,
            'podium' => json_decode((string)$row['podium_json'], true),
            'published_at' => $row['published_at'],
            'updated_at' => $row['updated_at'],
        ]]);
    }

    if ($method === 'POST') {
        $data = json_input();
        $isActive = !empty($data['is_active']) ? 1 : 0;
        $bracket = $data['bracket'] ?? null;
        $settings = is_array($data['settings'] ?? null) ? $data['settings'] : null;
        if (is_array($bracket)) {
            if ($settings !== null) {
                $bracket['settings'] = $settings;
            }
            if (empty($bracket['competitionName'])) {
                $bracket['competitionName'] = trim((string)($settings['competitionName'] ?? ''));
            }
        }
        $bracketJson = json_encode($bracket, JSON_UNESCAPED_UNICODE);
        $podiumJson = json_encode($data['podium'] ?? null, JSON_UNESCAPED_UNICODE);

        if ($isActive === 1 && $bracketJson === 'null') {
            json_response(['ok' => false, 'message' => 'Bracket belum dibuat.'], 422);
        }

        $pdo->beginTransaction();
        $pdo->exec('DELETE FROM published_bracket');
        $stmt = $pdo->prepare('INSERT INTO published_bracket (bracket_json, podium_json, is_active, published_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)');
        $stmt->execute([$bracketJson, $podiumJson, $isActive]);
        $pdo->commit();

        $name = is_array($settings) ? trim((string)($settings['competitionName'] ?? '')) : '';
        if ($name === '' && is_array($bracket)) {
            $name = trim((string)($bracket['competitionName'] ?? ''));
        }
        json_response([
            'ok' => true,
            'is_active' => (bool)$isActive,
            'name' => $name !== '' ? $name : 'Lomba belum diberi nama',
            'settings' => $settings
        ]);
    }

    json_response(['ok' => false, 'message' => 'Method tidak didukung.'], 405);
} catch (Throwable $error) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    json_response(['ok' => false, 'message' => $error->getMessage()], 500);
}
