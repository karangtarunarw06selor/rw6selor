<?php
declare(strict_types=1);

require_once __DIR__ . '/archives_helpers.php';
require_once __DIR__ . '/../db.php';

try {
    archives_ensure_tables($pdo);

    $type = strtolower(trim((string)($_GET['type'] ?? '')));
    $config = archive_type_config($type);
    $table = $config['table'];

    $stmt = $pdo->query("
        SELECT
            id,
            archive_date,
            title,
            category,
            person_name,
            external_url,
            local_file,
            source_data,
            created_at,
            updated_at
        FROM {$table}
        ORDER BY archive_date DESC, id DESC
    ");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $data = [];
    $years = [];
    foreach ($rows as $row) {
        $localFile = archive_normalize_local_path($row['local_file'] ?? '');
        $fileUrl = archive_resolve_file_url($localFile, $row['external_url'] ?? '');
        $year = $row['archive_date'] ? date('Y', strtotime((string)$row['archive_date'])) : 'Umum';
        if ($year !== 'Umum') {
            $years[$year] = true;
        }

        $data[] = [
            'id' => (int)$row['id'],
            'type' => $type,
            'tanggal' => archive_format_date((string)$row['archive_date']),
            'archive_date' => (string)$row['archive_date'],
            'tahun' => $year,
            'nama' => (string)$row['title'],
            'title' => (string)$row['title'],
            'kategori' => (string)($row['category'] ?? ''),
            'category' => (string)($row['category'] ?? ''),
            'person_name' => (string)($row['person_name'] ?? ''),
            'external_url' => (string)($row['external_url'] ?? ''),
            'local_file' => $localFile,
            'local_exists' => archive_local_file_exists($localFile),
            'file_url' => $fileUrl,
            'urlDrive' => $fileUrl,
            'source_data' => (string)($row['source_data'] ?? ''),
        ];
    }

    krsort($years, SORT_NATURAL);

    json_response([
        'success' => true,
        'ok' => true,
        'type' => $type,
        'years' => array_keys($years),
        'data' => $data,
    ]);
} catch (Throwable $e) {
    json_response(['success' => false, 'ok' => false, 'message' => $e->getMessage()], 500);
}
