<?php
declare(strict_types=1);

require_once __DIR__ . '/archives_helpers.php';
require_once __DIR__ . '/../db.php';

try {
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        json_response(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
    }

    $input = json_input();
    $type = strtolower(trim((string)($input['type'] ?? $_POST['type'] ?? '')));
    $id = (int)($input['id'] ?? $_POST['id'] ?? 0);
    $confirmation = strtolower(trim((string)($input['confirmation'] ?? $_POST['confirmation'] ?? '')));
    if ($id <= 0) {
        json_response(['success' => false, 'message' => 'ID arsip tidak valid.'], 422);
    }
    if ($confirmation !== 'hapus') {
        json_response(['success' => false, 'message' => 'Konfirmasi hapus tidak valid.'], 422);
    }

    archives_ensure_tables($pdo);
    $config = archive_type_config($type);
    $table = $config['table'];

    $stmt = $pdo->prepare("DELETE FROM {$table} WHERE id = :id");
    $stmt->execute([':id' => $id]);

    json_response(['success' => true, 'message' => 'Data arsip berhasil dihapus.']);
} catch (Throwable $e) {
    json_response(['success' => false, 'message' => $e->getMessage()], 500);
}
