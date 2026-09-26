<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/structure_helpers.php';

handle_cors_preflight();

try {
    $pdo = db();

    structure_ensure_table($pdo);
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method === 'GET') {
        $stmt = $pdo->query('SELECT * FROM struktur_pengurus ORDER BY urutan ASC, id ASC');
        json_response([
            'success' => true,
            'ok' => true,
            'data' => array_map('structure_row_payload', $stmt->fetchAll(PDO::FETCH_ASSOC)),
        ]);
    }

    if ($method === 'POST') {
        $data = json_input();
        $nama = require_field($data, 'nama');
        $jabatan = require_field($data, 'jabatan');
        $stmt = $pdo->prepare('
            INSERT INTO struktur_pengurus
                (nama, jabatan, nim, foto_url, instagram_url, tiktok_url, urutan, is_active)
            VALUES
                (:nama, :jabatan, :nim, :foto_url, :instagram_url, :tiktok_url, :urutan, :is_active)
        ');
        $stmt->execute([
            ':nama' => $nama,
            ':jabatan' => $jabatan,
            ':nim' => trim((string)($data['nim'] ?? '')) ?: null,
            ':foto_url' => structure_normalize_url($data['foto_url'] ?? ''),
            ':instagram_url' => structure_normalize_url($data['instagram_url'] ?? ''),
            ':tiktok_url' => structure_normalize_url($data['tiktok_url'] ?? ''),
            ':urutan' => (int)($data['urutan'] ?? 0),
            ':is_active' => !empty($data['is_active']) ? 1 : 0,
        ]);
        json_response(['success' => true, 'ok' => true, 'id' => (int)$pdo->lastInsertId()], 201);
    }

    if ($method === 'PUT') {
        $id = (int)($_GET['id'] ?? 0);
        if ($id <= 0) json_response(['success' => false, 'ok' => false, 'message' => 'ID tidak valid.'], 422);
        $data = json_input();
        $nama = require_field($data, 'nama');
        $jabatan = require_field($data, 'jabatan');
        $stmt = $pdo->prepare('
            UPDATE struktur_pengurus
            SET nama = :nama,
                jabatan = :jabatan,
                nim = :nim,
                foto_url = :foto_url,
                instagram_url = :instagram_url,
                tiktok_url = :tiktok_url,
                urutan = :urutan,
                is_active = :is_active
            WHERE id = :id
        ');
        $stmt->execute([
            ':id' => $id,
            ':nama' => $nama,
            ':jabatan' => $jabatan,
            ':nim' => trim((string)($data['nim'] ?? '')) ?: null,
            ':foto_url' => structure_normalize_url($data['foto_url'] ?? ''),
            ':instagram_url' => structure_normalize_url($data['instagram_url'] ?? ''),
            ':tiktok_url' => structure_normalize_url($data['tiktok_url'] ?? ''),
            ':urutan' => (int)($data['urutan'] ?? 0),
            ':is_active' => !empty($data['is_active']) ? 1 : 0,
        ]);
        json_response(['success' => true, 'ok' => true]);
    }

    if ($method === 'DELETE') {
        $id = (int)($_GET['id'] ?? 0);
        if ($id <= 0) json_response(['success' => false, 'ok' => false, 'message' => 'ID tidak valid.'], 422);
        $stmt = $pdo->prepare('DELETE FROM struktur_pengurus WHERE id = :id');
        $stmt->execute([':id' => $id]);
        json_response(['success' => true, 'ok' => true]);
    }

    json_response(['success' => false, 'ok' => false, 'message' => 'Method tidak didukung.'], 405);
} catch (Throwable $error) {
    json_response([
        'success' => false,
        'ok' => false,
        'message' => $error->getMessage(),
    ], 500);
}
