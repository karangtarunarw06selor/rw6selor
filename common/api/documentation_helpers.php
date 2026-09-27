<?php
declare(strict_types=1);

function documentation_ensure_table(PDO $pdo): void
{
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS documentation_items (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(180) NOT NULL,
            event_date DATE NULL,
            location VARCHAR(160) NULL,
            category VARCHAR(120) NULL,
            description TEXT NULL,
            media_type VARCHAR(40) NOT NULL DEFAULT 'link',
            media_url TEXT NOT NULL,
            thumbnail_url TEXT NULL,
            sort_order INT NOT NULL DEFAULT 0,
            is_active TINYINT(1) NOT NULL DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_documentation_active (is_active),
            INDEX idx_documentation_date (event_date),
            INDEX idx_documentation_sort (sort_order)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
}

function documentation_normalize_url(string $value): string
{
    $value = trim($value);
    if ($value === '') return '';
    if (!preg_match('#^https?://#i', $value)) return '';
    return $value;
}

function documentation_normalize_date(string $value): ?string
{
    $value = trim($value);
    if ($value === '') return null;

    $formats = ['Y-m-d', 'd/m/Y', 'd-m-Y', 'm/d/Y', 'd M Y', 'd F Y'];
    foreach ($formats as $format) {
        $date = DateTime::createFromFormat($format, $value);
        if ($date instanceof DateTime) return $date->format('Y-m-d');
    }

    $timestamp = strtotime($value);
    return $timestamp ? date('Y-m-d', $timestamp) : null;
}

function documentation_row_payload(array $row): array
{
    return [
        'id' => (int)$row['id'],
        'title' => (string)$row['title'],
        'event_date' => $row['event_date'] ?? '',
        'location' => (string)($row['location'] ?? ''),
        'category' => (string)($row['category'] ?? ''),
        'description' => (string)($row['description'] ?? ''),
        'media_type' => (string)($row['media_type'] ?? 'link'),
        'media_url' => (string)$row['media_url'],
        'thumbnail_url' => (string)($row['thumbnail_url'] ?? ''),
        'sort_order' => (int)($row['sort_order'] ?? 0),
        'is_active' => (int)($row['is_active'] ?? 0),
        'created_at' => (string)($row['created_at'] ?? ''),
        'updated_at' => (string)($row['updated_at'] ?? ''),
    ];
}
