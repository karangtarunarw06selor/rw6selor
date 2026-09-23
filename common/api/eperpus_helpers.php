<?php
/**
 * E-Perpus Helpers - RW06 Selor
 * Menggantikan fungsi Google Apps Script untuk e-perpustakaan
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/**
 * Kirim response JSON dan exit
 */
function eperpus_json_response(array $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Baca input JSON dari request body
 */
function eperpus_json_input(): array {
    $raw = (string)file_get_contents('php://input');
    if ($raw === '') return [];
    $json = json_decode($raw, true);
    return is_array($json) ? $json : [];
}

/**
 * Ensure eperpus tables exist
 */
function eperpus_ensure_schema(PDO $pdo): void {
    $schemaCandidates = [
        __DIR__ . '/../../public_html/sql/eperpus_schema.sql',
        __DIR__ . '/../public_html/sql/eperpus_schema.sql',
        dirname(__DIR__, 2) . '/public_html/sql/eperpus_schema.sql',
        dirname(__DIR__, 3) . '/public_html/sql/eperpus_schema.sql',
        getcwd() . '/public_html/sql/eperpus_schema.sql',
        getcwd() . '/sql/eperpus_schema.sql',
    ];

    $schemaPath = null;
    foreach ($schemaCandidates as $candidate) {
        if (is_string($candidate) && $candidate !== '' && file_exists($candidate)) {
            $schemaPath = $candidate;
            break;
        }
    }

    if ($schemaPath === null) {
        throw new RuntimeException('File schema eperpus tidak ditemukan.');
    }

    $sql = file_get_contents($schemaPath);
    if ($sql === false) {
        throw new RuntimeException('Gagal membaca file schema.');
    }
    $pdo->exec($sql);

    $requiredColumns = [
        'source_data' => "ALTER TABLE eperpus_buku ADD COLUMN source_data VARCHAR(50) DEFAULT 'admin_upload'",
        'local_file' => "ALTER TABLE eperpus_buku ADD COLUMN local_file VARCHAR(255) DEFAULT NULL",
        'drive_file_id' => "ALTER TABLE eperpus_buku ADD COLUMN drive_file_id VARCHAR(255) DEFAULT NULL",
        'created_by' => "ALTER TABLE eperpus_buku ADD COLUMN created_by VARCHAR(120) DEFAULT NULL",
    ];

    $stmt = $pdo->query("SHOW COLUMNS FROM eperpus_buku");
    $existing = [];
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $existing[strtolower((string)$row['Field'])] = true;
    }

    foreach ($requiredColumns as $column => $ddl) {
        if (!isset($existing[strtolower($column)])) {
            $pdo->exec($ddl);
        }
    }
}

/**
 * Validasi anggota via tabel members
 */
function eperpus_verify_member(PDO $pdo, string $email): array {
    $stmt = $pdo->prepare("
        SELECT id, full_name, member_code
        FROM members
        WHERE LOWER(email) = LOWER(:email)
          AND is_active = 1
        LIMIT 1
    ");
    $stmt->execute([':email' => $email]);
    $member = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$member) {
        return [];
    }
    
    return [
        'id' => (int)$member['id'],
        'nama' => $member['full_name'],
        'nim' => $member['member_code'],
    ];
}

/**
 * Ambil daftar buku
 */
function eperpus_fetch_tsv_rows(string $url): array {
    $raw = '';

    if (function_exists('shell_exec')) {
        $cmd = 'curl -L --max-time 30 --silent ' . escapeshellarg($url) . ' 2>/dev/null';
        $output = shell_exec($cmd);
        if (is_string($output) && trim($output) !== '') {
            $raw = $output;
        }
    }

    if ($raw === '') {
        $context = stream_context_create([
            'http' => [
                'timeout' => 20,
                'header' => "User-Agent: Hermes-EPerpus/1.0\r\n",
            ],
            'ssl' => [
                'verify_peer' => true,
                'verify_peer_name' => true,
            ],
        ]);
        $fetched = @file_get_contents($url, false, $context);
        if (is_string($fetched)) {
            $raw = $fetched;
        }
    }

    if (trim($raw) === '') {
        return [];
    }

    $lines = preg_split('/\r\n|\n|\r/', trim($raw));
    if (!$lines || count($lines) < 2) {
        return [];
    }

    $rows = [];
    foreach ($lines as $index => $line) {
        if ($index === 0 || trim($line) === '') {
            continue;
        }
        $cols = str_getcsv($line, "\t", '"', '\\');
        $judul = trim((string)($cols[1] ?? ''));
        $penulis = trim((string)($cols[2] ?? ''));
        $kategori = trim((string)($cols[3] ?? ''));
        $linkDrive = trim((string)($cols[4] ?? ''));
        if ($judul === '' || $linkDrive === '') {
            continue;
        }
        $rows[] = [
            'judul' => $judul,
            'penulis' => $penulis !== '' ? $penulis : 'Anonim',
            'linkDrive' => $linkDrive,
            'kategori' => $kategori !== '' ? $kategori : 'Umum',
            'source_data' => 'tsv_legacy',
        ];
    }

    return $rows;
}

function eperpus_merge_books(array $primary, array $secondary): array {
    $merged = [];

    $buildKey = static function (array $row): string {
        $link = strtolower(trim((string)($row['linkDrive'] ?? '')));
        if ($link !== '') {
            return 'link:' . $link;
        }
        $judul = strtolower(trim((string)($row['judul'] ?? '')));
        $penulis = strtolower(trim((string)($row['penulis'] ?? '')));
        return 'meta:' . $judul . '|' . $penulis;
    };

    foreach (array_merge($secondary, $primary) as $row) {
        $key = $buildKey($row);
        if ($key === 'meta:|') {
            continue;
        }
        $merged[$key] = [
            'judul' => $row['judul'] ?? 'Judul Kosong',
            'penulis' => $row['penulis'] ?? 'Anonim',
            'linkDrive' => $row['linkDrive'] ?? '',
            'kategori' => $row['kategori'] ?? 'Umum',
            'source_data' => $row['source_data'] ?? 'db',
        ];
    }

    usort($merged, static function (array $a, array $b): int {
        return strcasecmp((string)$a['judul'], (string)$b['judul']);
    });

    return array_values($merged);
}

function eperpus_get_books(PDO $pdo): array {
    $stmt = $pdo->query("
        SELECT id, judul, penulis, link_drive, kategori, source_data
        FROM eperpus_buku
        WHERE is_active = 1
        ORDER BY judul ASC
    ");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $dbBooks = [];
    foreach ($rows as $row) {
        if (trim((string)$row['judul']) === '' || trim((string)$row['link_drive']) === '') {
            continue;
        }
        $dbBooks[] = [
            'judul' => $row['judul'],
            'penulis' => $row['penulis'] ?: 'Anonim',
            'linkDrive' => $row['link_drive'],
            'kategori' => $row['kategori'] ?: 'Umum',
            'source_data' => $row['source_data'] ?: 'db',
        ];
    }

    $tsvBooks = eperpus_fetch_tsv_rows('https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1tOYakhK7oLqDVDa2r0aq8P76NATzvYOVNgO30IHFah3QY1g_g6Mh6uG_XsXa55-bCjaG2Y_4Lad8/pub?gid=31550332&single=true&output=tsv');

    return eperpus_merge_books($dbBooks, $tsvBooks);
}

/**
 * Ambil daftar request buku
 */
function eperpus_get_requests(PDO $pdo): array {
    $stmt = $pdo->query("
        SELECT id, judul, penulis, pengusul, status, created_at
        FROM eperpus_requests
        ORDER BY created_at DESC
        LIMIT 50
    ");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $requests = [];
    foreach ($rows as $row) {
        $requests[] = [
            'judul' => $row['judul'],
            'penulis' => $row['penulis'] ?: '',
            'pengusul' => $row['pengusul'] ?: '-',
            'status' => $row['status'] ?: 'Pending',
        ];
    }
    return $requests;
}

/**
 * Ping / update status online anggota
 */
function eperpus_ping_online(PDO $pdo, string $nama, ?string $email = null): array {
    // Insert or update online user
    $stmt = $pdo->prepare("
        INSERT INTO eperpus_online (nama, email, last_ping)
        VALUES (:nama, :email, NOW())
        ON DUPLICATE KEY UPDATE
            email = VALUES(email),
            last_ping = NOW()
    ");
    $stmt->execute([':nama' => $nama, ':email' => $email]);
    
    // Cleanup stale entries (lebih dari 2 menit)
    $pdo->exec("DELETE FROM eperpus_online WHERE last_ping < NOW() - INTERVAL 2 MINUTE");
    
    // Ambil daftar online
    $stmt = $pdo->query("SELECT nama FROM eperpus_online ORDER BY nama ASC");
    $onlineUsers = [];
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $onlineUsers[] = ['nama' => $row['nama']];
    }
    
    return $onlineUsers;
}

/**
 * Simpan request buku baru
 */
function eperpus_submit_request(PDO $pdo, string $judul, string $penulis, string $pengusul): array {
    $stmt = $pdo->prepare("
        INSERT INTO eperpus_requests (judul, penulis, pengusul, status)
        VALUES (:judul, :penulis, :pengusul, 'Pending')
    ");
    $stmt->execute([
        ':judul' => $judul,
        ':penulis' => $penulis,
        ':pengusul' => $pengusul,
    ]);
    
    return eperpus_get_requests($pdo);
}