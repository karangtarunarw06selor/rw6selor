<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

try {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $pdo = db();

    if ($method === 'GET') {
        $id = (int)($_GET['id'] ?? 0);
        if ($id > 0) {
            $stmt = $pdo->prepare('SELECT id, name, bracket_json, podium_json, status, is_published, created_at, updated_at FROM brackets WHERE id = ? LIMIT 1');
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            if (!$row) {
                json_response(['ok' => false, 'message' => 'Bracket tidak ditemukan.'], 404);
            }
            $row['bracket'] = json_decode((string)$row['bracket_json'], true);
            $row['podium'] = json_decode((string)$row['podium_json'], true);
            unset($row['bracket_json'], $row['podium_json']);
            json_response(['ok' => true, 'data' => $row]);
        }

        $status = (string)($_GET['status'] ?? 'draft');
        $search = trim((string)($_GET['search'] ?? ''));

        if ($status === 'completed') {
            $sql = "SELECT id, name, bracket_json, podium_json, status, is_published, created_at, updated_at FROM brackets WHERE status = 'completed'";
            $params = [];
            if ($search !== '') {
                $sql .= ' AND name LIKE ?';
                $params[] = '%' . $search . '%';
            }
            $sql .= ' ORDER BY updated_at DESC';
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $rows = array_map(static function (array $row): array {
                $row['bracket'] = json_decode((string)$row['bracket_json'], true);
                $row['podium'] = json_decode((string)$row['podium_json'], true);
                unset($row['bracket_json'], $row['podium_json']);
                return $row;
            }, $stmt->fetchAll());
            json_response(['ok' => true, 'data' => $rows]);
        }

        $stmt = $pdo->query("SELECT id, name, bracket_json, podium_json, status, is_published, created_at, updated_at FROM brackets WHERE status = 'draft' ORDER BY updated_at DESC LIMIT 1");
        $row = $stmt->fetch();
        if (!$row) {
            json_response(['ok' => true, 'data' => null]);
        }
        $row['bracket'] = json_decode((string)$row['bracket_json'], true);
        $row['podium'] = json_decode((string)$row['podium_json'], true);
        unset($row['bracket_json'], $row['podium_json']);
        json_response(['ok' => true, 'data' => $row]);
    }

    if ($method === 'POST') {
        $data = json_input();
        $name = trim((string)($data['name'] ?? 'Draft Lomba'));
        $status = in_array(($data['status'] ?? 'draft'), ['draft', 'completed'], true) ? (string)$data['status'] : 'draft';
        $bracket = $data['bracket'] ?? null;
        $settings = is_array($data['settings'] ?? null) ? $data['settings'] : null;
        if (is_array($bracket)) {
            if ($settings !== null) {
                $bracket['settings'] = $settings;
            }
            if (empty($bracket['competitionName'])) {
                $bracket['competitionName'] = trim((string)($settings['competitionName'] ?? $name));
            }
        }
        $bracketJson = json_encode($bracket, JSON_UNESCAPED_UNICODE);
        $podiumJson = json_encode($data['podium'] ?? null, JSON_UNESCAPED_UNICODE);

        if ($bracketJson === 'null') {
            json_response(['ok' => false, 'message' => 'Bracket belum dibuat.'], 422);
        }

        $pdo->beginTransaction();
        if ($status === 'draft') {
            $pdo->exec("UPDATE brackets SET status = 'archived', updated_at = CURRENT_TIMESTAMP WHERE status = 'draft'");
        }
        $stmt = $pdo->prepare("INSERT INTO brackets (name, bracket_json, podium_json, status, is_published) VALUES (?, ?, ?, ?, 0)");
        $stmt->execute([$name, $bracketJson, $podiumJson, $status]);
        $id = (int)$pdo->lastInsertId();
        $pdo->commit();

        json_response(['ok' => true, 'id' => $id], 201);
    }

    json_response(['ok' => false, 'message' => 'Method tidak didukung.'], 405);
} catch (Throwable $error) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    json_response(['ok' => false, 'message' => $error->getMessage()], 500);
}
