<?php
declare(strict_types=1);

const KAS_BULAN_MAP = [
    'Januari' => 'januari',
    'Februari' => 'februari',
    'Maret' => 'maret',
    'April' => 'april',
    'Mei' => 'mei',
    'Juni' => 'juni',
    'Juli' => 'juli',
    'Agustus' => 'agustus',
    'September' => 'september',
    'Oktober' => 'oktober',
    'November' => 'november',
    'Desember' => 'desember',
];

function kas_api_headers(): void
{
    $allowedOrigins = [
        'http://localhost:8000',
        'http://localhost:8001',
        'https://rw6selor.org',
        'https://www.rw6selor.org',
        'https://rw6selor.org',
        'https://www.rw6selor.org',
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, $allowedOrigins, true)) {
        header("Access-Control-Allow-Origin: {$origin}");
    }

    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json; charset=utf-8');

    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
        exit;
    }
}

function kas_json(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function kas_format_rupiah(float $angka): string
{
    return 'Rp ' . number_format($angka, 0, ',', '.');
}

function kas_table_columns(PDO $pdo, string $table): array
{
    static $cache = [];
    if (isset($cache[$table])) {
        return $cache[$table];
    }

    $stmt = $pdo->prepare("
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = :table
    ");
    $stmt->execute([':table' => $table]);
    $cache[$table] = array_map('strtolower', $stmt->fetchAll(PDO::FETCH_COLUMN));

    return $cache[$table];
}

function kas_member_query_parts(PDO $pdo): array
{
    $columns = kas_table_columns($pdo, 'members');
    $hasId = in_array('id', $columns, true);
    $hasNama = in_array('nama', $columns, true);
    $hasFullName = in_array('full_name', $columns, true);
    $hasStatus = in_array('status', $columns, true);
    $hasIsActive = in_array('is_active', $columns, true);

    if (!$hasNama && !$hasFullName) {
        return [
            'id_select' => '0',
            'select' => "''",
            'where' => '1 = 0',
        ];
    }

    $nameExpr = $hasNama && $hasFullName
        ? "COALESCE(NULLIF(nama, ''), NULLIF(full_name, ''))"
        : ($hasNama ? 'nama' : 'full_name');

    $where = ["{$nameExpr} IS NOT NULL", "{$nameExpr} <> ''"];
    if ($hasIsActive) {
        $where[] = 'is_active = 1';
    } elseif ($hasStatus) {
        $where[] = "(status IS NULL OR LOWER(status) = 'aktif')";
    }

    return [
        'id_select' => $hasId ? 'id' : '0',
        'select' => $nameExpr,
        'where' => implode(' AND ', $where),
    ];
}

kas_api_headers();

function kas_ensure_tables(PDO $pdo): void
{
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS kas_pembayaran (
            id INT AUTO_INCREMENT PRIMARY KEY,
            tanggal DATE NOT NULL,
            nama VARCHAR(150) NOT NULL,
            bulan VARCHAR(50) NOT NULL,
            tahun INT NOT NULL,
            jumlah DECIMAL(12,2) NOT NULL DEFAULT 0,
            metode_pembayaran VARCHAR(50) DEFAULT NULL,
            keterangan TEXT DEFAULT NULL,
            sumber_data VARCHAR(50) DEFAULT 'input_html',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_kas_nama_bulan_tahun (nama, bulan, tahun),
            KEY idx_kas_tahun_bulan (tahun, bulan),
            KEY idx_kas_tanggal (tanggal)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS members (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nama VARCHAR(150) NOT NULL,
            status VARCHAR(50) DEFAULT 'aktif',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    $indexes = $pdo->query("SHOW INDEX FROM kas_pembayaran")->fetchAll(PDO::FETCH_ASSOC);
    $hasUnique = false;
    foreach ($indexes as $index) {
        if (($index['Key_name'] ?? '') === 'unique_kas_nama_bulan_tahun') {
            $hasUnique = true;
            break;
        }
    }

    if (!$hasUnique) {
        try {
            $pdo->exec("
                ALTER TABLE kas_pembayaran
                ADD UNIQUE KEY unique_kas_nama_bulan_tahun (nama, bulan, tahun)
            ");
        } catch (Throwable $error) {
            // Import lama bisa memiliki duplikasi. API tetap memakai ON DUPLICATE KEY jika key sudah tersedia.
        }
    }
}
