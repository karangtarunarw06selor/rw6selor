<?php
declare(strict_types=1);

require_once __DIR__ . '/members_helpers.php';

function member_pending_ensure_table(PDO $pdo): void
{
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS member_pending_submissions (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            row_hash CHAR(64) NOT NULL UNIQUE,
            full_name VARCHAR(180) NOT NULL,
            email VARCHAR(180) DEFAULT '',
            whatsapp VARCHAR(40) DEFAULT '',
            birth_place VARCHAR(120) DEFAULT '',
            birth_date DATE DEFAULT NULL,
            parent_name VARCHAR(180) DEFAULT '',
            current_status VARCHAR(80) DEFAULT '',
            hobby VARCHAR(180) DEFAULT '',
            organization_experience VARCHAR(120) DEFAULT '',
            photo_url TEXT DEFAULT NULL,
            raw_source JSON DEFAULT NULL,
            status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
            member_id INT UNSIGNED DEFAULT NULL,
            notes TEXT DEFAULT NULL,
            submitted_at DATETIME DEFAULT NULL,
            reviewed_at DATETIME DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_member_pending_status (status),
            INDEX idx_member_pending_name (full_name),
            INDEX idx_member_pending_member (member_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
}

function member_pending_json_input(): array
{
    $raw = file_get_contents('php://input') ?: '';
    if ($raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function member_pending_fetch_tsv(string $url): array
{
    if (!preg_match('/^https:\/\/docs\.google\.com\/spreadsheets\//i', $url)) {
        json_response(['success' => false, 'message' => 'URL harus Google Sheets publish TSV/CSV.'], 400);
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 20,
            'header' => "User-Agent: RW06-Member-Pending-Sync/1.0\r\n",
        ],
    ]);
    $content = @file_get_contents($url, false, $context);
    if ($content === false || trim($content) === '') {
        json_response(['success' => false, 'message' => 'Gagal mengambil data Google Sheet. Pastikan link sudah Publish to web sebagai TSV/CSV.'], 502);
    }

    $delimiter = str_contains($content, "\t") ? "\t" : ',';
    $lines = preg_split('/\r\n|\n|\r/', trim($content));
    if (!$lines || count($lines) < 2) {
        return [];
    }

    $headers = str_getcsv(array_shift($lines), $delimiter);
    $headers = array_map(static fn($h) => trim((string)$h), $headers);
    $rows = [];

    foreach ($lines as $line) {
        if (trim($line) === '') continue;
        $values = str_getcsv($line, $delimiter);
        $row = [];
        foreach ($headers as $index => $header) {
            if ($header === '') continue;
            $row[$header] = trim((string)($values[$index] ?? ''));
        }
        if ($row) {
            $rows[] = $row;
        }
    }

    return $rows;
}

function member_pending_pick(array $row, array $needles): string
{
    foreach ($row as $key => $value) {
        $normalizedKey = strtolower(preg_replace('/[^a-z0-9]+/i', ' ', (string)$key));
        foreach ($needles as $needle) {
            if (str_contains($normalizedKey, strtolower($needle))) {
                return trim((string)$value);
            }
        }
    }
    return '';
}

function member_pending_normalize_date(string $value): string
{
    $value = trim($value);
    if ($value === '') return '';

    $formats = ['Y-m-d', 'd/m/Y', 'd-m-Y', 'm/d/Y', 'd M Y', 'd F Y'];
    foreach ($formats as $format) {
        $date = DateTime::createFromFormat($format, $value);
        if ($date instanceof DateTime) {
            return $date->format('Y-m-d');
        }
    }

    $timestamp = strtotime($value);
    return $timestamp ? date('Y-m-d', $timestamp) : '';
}

function member_pending_from_sheet_row(array $row): array
{
    $fullName = member_pending_pick($row, ['nama lengkap', 'nama', 'full name', 'name']);
    $email = member_pending_pick($row, ['email', 'mail']);
    $whatsapp = normalize_whatsapp(member_pending_pick($row, ['whatsapp', 'wa', 'nomor hp', 'no hp', 'telepon', 'phone']));
    $birthPlace = member_pending_pick($row, ['tempat lahir', 'birth place']);
    $birthDate = member_pending_normalize_date(member_pending_pick($row, ['tanggal lahir', 'tgl lahir', 'birth date']));
    $parentName = member_pending_pick($row, ['orang tua', 'nama ortu', 'parent']);
    $currentStatus = member_pending_pick($row, ['status sekarang', 'status', 'pekerjaan', 'pendidikan']);
    $hobby = member_pending_pick($row, ['hobby', 'hobi', 'kebiasaan']);
    $organizationExperience = member_pending_pick($row, ['pengalaman organisasi', 'organisasi']);
    $photoUrl = member_pending_pick($row, ['upload foto', 'foto', 'photo', 'gambar']);
    $submittedAt = member_pending_normalize_date(member_pending_pick($row, ['timestamp', 'submitted', 'waktu']));

    $hashBasis = strtolower($fullName) . '|' . strtolower($email) . '|' . $whatsapp . '|' . $birthDate;

    return [
        'row_hash' => hash('sha256', $hashBasis !== '|||' ? $hashBasis : json_encode($row, JSON_UNESCAPED_UNICODE)),
        'full_name' => $fullName,
        'email' => $email,
        'whatsapp' => $whatsapp,
        'birth_place' => $birthPlace,
        'birth_date' => $birthDate,
        'parent_name' => $parentName,
        'current_status' => $currentStatus,
        'hobby' => $hobby,
        'organization_experience' => $organizationExperience,
        'photo_url' => $photoUrl,
        'submitted_at' => $submittedAt,
        'raw_source' => json_encode($row, JSON_UNESCAPED_UNICODE),
    ];
}

function member_pending_insert(PDO $pdo, array $item): bool
{
    if (($item['full_name'] ?? '') === '') {
        return false;
    }

    $stmt = $pdo->prepare("
        INSERT INTO member_pending_submissions (
            row_hash, full_name, email, whatsapp, birth_place, birth_date,
            parent_name, current_status, hobby, organization_experience,
            photo_url, submitted_at, raw_source, status
        ) VALUES (
            :row_hash, :full_name, :email, :whatsapp, :birth_place, NULLIF(:birth_date, ''),
            :parent_name, :current_status, :hobby, :organization_experience,
            :photo_url, NULLIF(:submitted_at, ''), :raw_source, 'pending'
        )
        ON DUPLICATE KEY UPDATE
            full_name = VALUES(full_name),
            email = VALUES(email),
            whatsapp = VALUES(whatsapp),
            birth_place = VALUES(birth_place),
            birth_date = VALUES(birth_date),
            parent_name = VALUES(parent_name),
            current_status = VALUES(current_status),
            hobby = VALUES(hobby),
            organization_experience = VALUES(organization_experience),
            photo_url = VALUES(photo_url),
            raw_source = VALUES(raw_source),
            updated_at = NOW()
    ");
    $stmt->execute([
        ':row_hash' => $item['row_hash'],
        ':full_name' => $item['full_name'],
        ':email' => $item['email'],
        ':whatsapp' => $item['whatsapp'],
        ':birth_place' => $item['birth_place'],
        ':birth_date' => $item['birth_date'],
        ':parent_name' => $item['parent_name'],
        ':current_status' => $item['current_status'],
        ':hobby' => $item['hobby'],
        ':organization_experience' => $item['organization_experience'],
        ':photo_url' => $item['photo_url'],
        ':submitted_at' => $item['submitted_at'],
        ':raw_source' => $item['raw_source'],
    ]);

    return $stmt->rowCount() > 0;
}
