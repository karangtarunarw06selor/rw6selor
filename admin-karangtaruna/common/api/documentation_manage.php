<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/documentation_helpers.php';

handle_cors_preflight();

try {
    $pdo = db();
    documentation_ensure_table($pdo);
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method === 'GET') {
        $stmt = $pdo->query('SELECT * FROM documentation_items ORDER BY COALESCE(event_date, created_at) DESC, sort_order ASC, id DESC');
        json_response(['success' => true, 'ok' => true, 'data' => array_map('documentation_row_payload', $stmt->fetchAll(PDO::FETCH_ASSOC))]);
    }

    if ($method === 'POST' || $method === 'PUT') {
        $data = json_input();
        $id = $method === 'PUT' ? (int)($_GET['id'] ?? 0) : 0;
        if ($method === 'PUT' && $id <= 0) json_response(['success' => false, 'ok' => false, 'message' => 'ID tidak valid.'], 422);

        $title = require_field($data, 'title');
        $mediaUrl = documentation_normalize_url((string)($data['media_url'] ?? ''));
        if ($mediaUrl === '') json_response(['success' => false, 'ok' => false, 'message' => 'Link dokumentasi wajib berupa URL http/https.'], 422);

        $payload = [
            ':title' => $title,
            ':event_date' => documentation_normalize_date((string)($data['event_date'] ?? '')),
            ':location' => trim((string)($data['location'] ?? '')) ?: null,
            ':category' => trim((string)($data['category'] ?? '')) ?: null,
            ':description' => trim((string)($data['description'] ?? '')) ?: null,
            ':media_type' => trim((string)($data['media_type'] ?? 'link')) ?: 'link',
            ':media_url' => $mediaUrl,
            ':thumbnail_url' => documentation_normalize_url((string)($data['thumbnail_url'] ?? '')) ?: null,
            ':sort_order' => (int)($data['sort_order'] ?? 0),
            ':is_active' => !empty($data['is_active']) ? 1 : 0,
        ];

        if ($method === 'POST') {
            $stmt = $pdo->prepare('
                INSERT INTO documentation_items
                    (title, event_date, location, category, description, media_type, media_url, thumbnail_url, sort_order, is_active)
                VALUES
                    (:title, :event_date, :location, :category, :description, :media_type, :media_url, :thumbnail_url, :sort_order, :is_active)
            ');
            $stmt->execute($payload);
            json_response(['success' => true, 'ok' => true, 'id' => (int)$pdo->lastInsertId()], 201);
        }

        $payload[':id'] = $id;
        $stmt = $pdo->prepare('
            UPDATE documentation_items
            SET title = :title,
                event_date = :event_date,
                location = :location,
                category = :category,
                description = :description,
                media_type = :media_type,
                media_url = :media_url,
                thumbnail_url = :thumbnail_url,
                sort_order = :sort_order,
                is_active = :is_active
            WHERE id = :id
        ');
        $stmt->execute($payload);
        json_response(['success' => true, 'ok' => true]);
    }

    if ($method === 'DELETE') {
        $id = (int)($_GET['id'] ?? 0);
        if ($id <= 0) json_response(['success' => false, 'ok' => false, 'message' => 'ID tidak valid.'], 422);
        $stmt = $pdo->prepare('DELETE FROM documentation_items WHERE id = :id');
        $stmt->execute([':id' => $id]);
        json_response(['success' => true, 'ok' => true]);
    }

    json_response(['success' => false, 'ok' => false, 'message' => 'Method tidak didukung.'], 405);
} catch (Throwable $error) {
    json_response(['success' => false, 'ok' => false, 'message' => $error->getMessage()], 500);
}
