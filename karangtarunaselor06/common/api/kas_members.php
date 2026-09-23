<?php
require_once __DIR__ . '/kas_helpers.php';
require_once __DIR__ . '/../db.php';

try {
    kas_ensure_tables($pdo);
    $memberParts = kas_member_query_parts($pdo);
    $stmt = $pdo->query("
        SELECT {$memberParts['id_select']} AS id, {$memberParts['select']} AS nama
        FROM members
        WHERE {$memberParts['where']}
        ORDER BY nama ASC
    ");

    $data = array_map(static function (array $row): array {
        $nama = trim((string)($row['nama'] ?? ''));
        return [
            'id' => (int)($row['id'] ?? 0),
            'nama' => $nama,
            'full_name' => $nama,
        ];
    }, $stmt->fetchAll());

    kas_json(['success' => true, 'data' => $data]);
} catch (Throwable $e) {
    kas_json(['success' => false, 'message' => $e->getMessage()], 500);
}
