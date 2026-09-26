<?php
declare(strict_types=1);

function structure_ensure_table(PDO $pdo): void
{
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS struktur_pengurus (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nama VARCHAR(180) NOT NULL,
            jabatan VARCHAR(120) NOT NULL,
            nim VARCHAR(80) NULL,
            foto_url TEXT NULL,
            instagram_url TEXT NULL,
            tiktok_url TEXT NULL,
            urutan INT NOT NULL DEFAULT 0,
            is_active TINYINT(1) NOT NULL DEFAULT 1,
            created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_struktur_active_order (is_active, urutan, id)
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    ");
}

function structure_normalize_url(?string $value): ?string
{
    $url = trim((string)$value);
    if ($url === '') return null;
    if (!filter_var($url, FILTER_VALIDATE_URL)) {
        throw new RuntimeException('URL tidak valid.');
    }
    return $url;
}

function structure_row_payload(array $row): array
{
    return [
        'id' => (int)$row['id'],
        'nama' => (string)$row['nama'],
        'jabatan' => (string)$row['jabatan'],
        'nim' => (string)($row['nim'] ?? ''),
        'foto_url' => (string)($row['foto_url'] ?? ''),
        'instagram_url' => (string)($row['instagram_url'] ?? ''),
        'tiktok_url' => (string)($row['tiktok_url'] ?? ''),
        'urutan' => (int)($row['urutan'] ?? 0),
        'is_active' => (int)($row['is_active'] ?? 1),
        'created_at' => (string)($row['created_at'] ?? ''),
        'updated_at' => (string)($row['updated_at'] ?? ''),
    ];
}
