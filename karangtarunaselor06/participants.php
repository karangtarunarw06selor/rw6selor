<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

function normalize_age_category(string $category): string
{
    $aliases = [
        'adult_all' => 'umum_dewasa',
        '3sd_5sd' => 'sd_3_5',
        '6sd_smp' => 'sd6_smp',
        '4sd_smp' => 'sd4_smp',
        'ibu2' => 'ibu_ibu',
        'bapak2' => 'bapak_bapak',
    ];
    return $aliases[$category] ?? $category;
}

try {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $pdo = db();

    if ($method === 'GET') {
        $stmt = $pdo->query('SELECT id, name, gender, age_category, created_at, updated_at FROM participants ORDER BY name ASC');
        $rows = array_map(static function (array $row): array {
            $row['age_category'] = normalize_age_category((string)$row['age_category']);
            return $row;
        }, $stmt->fetchAll());
        json_response(['ok' => true, 'data' => $rows]);
    }

    if ($method === 'POST') {
        $data = json_input();
        $name = require_field($data, 'name');
        $gender = require_field($data, 'gender');
        $ageCategory = normalize_age_category(require_field($data, 'age_category'));

        $stmt = $pdo->prepare('INSERT INTO participants (name, gender, age_category) VALUES (?, ?, ?)');
        $stmt->execute([$name, $gender, $ageCategory]);
        json_response(['ok' => true, 'id' => (int)$pdo->lastInsertId()], 201);
    }

    if ($method === 'PUT') {
        $id = (int)($_GET['id'] ?? 0);
        if ($id <= 0) {
            json_response(['ok' => false, 'message' => 'ID peserta tidak valid.'], 422);
        }

        $data = json_input();
        $name = require_field($data, 'name');
        $gender = require_field($data, 'gender');
        $ageCategory = normalize_age_category(require_field($data, 'age_category'));

        $stmt = $pdo->prepare('UPDATE participants SET name = ?, gender = ?, age_category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
        $stmt->execute([$name, $gender, $ageCategory, $id]);
        json_response(['ok' => true]);
    }

    if ($method === 'DELETE') {
        if (($_GET['all'] ?? '') === '1') {
            $pdo->exec('DELETE FROM participants');
            json_response(['ok' => true]);
        }

        $id = (int)($_GET['id'] ?? 0);
        if ($id <= 0) {
            json_response(['ok' => false, 'message' => 'ID peserta tidak valid.'], 422);
        }
        $stmt = $pdo->prepare('DELETE FROM participants WHERE id = ?');
        $stmt->execute([$id]);
        json_response(['ok' => true]);
    }

    json_response(['ok' => false, 'message' => 'Method tidak didukung.'], 405);
} catch (Throwable $error) {
    json_response(['ok' => false, 'message' => $error->getMessage()], 500);
}
