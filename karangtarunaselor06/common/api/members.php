<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

handle_cors_preflight();

const PUBLIC_MEMBERS_TSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR45-ysPdK4uVibwJQbXKvaGGA2zlX3m2GnAS2392fiSDwENSz9ABffImneI-u4ZGmErvHbdM5RJoDi/pub?gid=992968433&single=true&output=tsv';

function fetch_public_members_tsv(): string
{
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 12,
            'header' => "User-Agent: Mozilla/5.0\r\nAccept: text/tab-separated-values,text/plain,*/*\r\n",
        ],
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
        ],
    ]);

    $data = @file_get_contents(PUBLIC_MEMBERS_TSV_URL, false, $context);
    return is_string($data) ? $data : '';
}

function parse_public_members_tsv(string $tsv): array
{
    $tsv = trim($tsv);
    if ($tsv === '') {
        return [];
    }

    $lines = preg_split('/\r\n|\n|\r/', $tsv) ?: [];
    if (count($lines) < 2) {
        return [];
    }

    $headers = str_getcsv((string)array_shift($lines), "\t");
    $rows = [];

    foreach ($lines as $line) {
        if (trim((string)$line) === '') {
            continue;
        }

        $values = str_getcsv($line, "\t");
        $row = [];
        foreach ($headers as $index => $header) {
            $row[trim((string)$header)] = trim((string)($values[$index] ?? ''));
        }
        $rows[] = $row;
    }

    return $rows;
}

function normalize_public_members_birth_date(string $value): ?string
{
    $value = trim($value);
    if ($value === '') {
        return null;
    }

    $indoMonths = [
        'jan' => 'Jan', 'januari' => 'Jan',
        'feb' => 'Feb', 'februari' => 'Feb',
        'mar' => 'Mar', 'maret' => 'Mar',
        'apr' => 'Apr', 'april' => 'Apr',
        'mei' => 'May',
        'jun' => 'Jun', 'juni' => 'Jun',
        'jul' => 'Jul', 'juli' => 'Jul',
        'agu' => 'Aug', 'agustus' => 'Aug',
        'sep' => 'Sep', 'september' => 'Sep',
        'okt' => 'Oct', 'oktober' => 'Oct',
        'nov' => 'Nov', 'november' => 'Nov',
        'des' => 'Dec', 'desember' => 'Dec',
    ];

    $normalizedText = preg_replace_callback('/[A-Za-zÀ-ÿ]+/u', static function (array $match) use ($indoMonths) {
        $key = strtolower($match[0]);
        return $indoMonths[$key] ?? $match[0];
    }, $value);

    $formats = ['d/m/Y', 'j/n/Y', 'Y-m-d', 'd M Y', 'j M Y'];
    foreach ($formats as $format) {
        $date = DateTime::createFromFormat($format, (string)$normalizedText);
        if ($date instanceof DateTime && $date->format($format) === (string)$normalizedText) {
            return $date->format('Y-m-d');
        }
    }

    $timestamp = strtotime((string)$normalizedText);
    if ($timestamp !== false) {
        return date('Y-m-d', $timestamp);
    }

    return null;
}

function calculate_public_members_age(?string $birthDate): ?int
{
    if (!$birthDate) {
        return null;
    }

    try {
        return (new DateTime())->diff(new DateTime($birthDate))->y;
    } catch (Throwable $error) {
        return null;
    }
}

function find_existing_public_member_id(PDO $pdo, string $memberCode, string $fullName, string $email, ?string $birthDate): ?int
{
    if ($memberCode !== '') {
        $stmt = $pdo->prepare('SELECT id FROM members WHERE member_code = :member_code LIMIT 1');
        $stmt->execute([':member_code' => $memberCode]);
        $row = $stmt->fetch();
        if ($row) {
            return (int)$row['id'];
        }
    }

    if ($fullName === '' || $email === '' || !$birthDate) {
        return null;
    }

    $stmt = $pdo->prepare('SELECT id FROM members WHERE LOWER(full_name) = LOWER(:full_name) AND LOWER(email) = LOWER(:email) AND birth_date = :birth_date LIMIT 1');
    $stmt->execute([
        ':full_name' => $fullName,
        ':email' => $email,
        ':birth_date' => $birthDate,
    ]);
    $row = $stmt->fetch();

    return $row ? (int)$row['id'] : null;
}

function is_valid_public_member_photo_url(string $url): bool
{
    $url = trim($url);
    if ($url === '' || !preg_match('/^https?:\/\//i', $url)) {
        return false;
    }

    return (bool)preg_match('/drive\.google\.com|docs\.google\.com/i', $url);
}

function sync_public_members_from_tsv(PDO $pdo): void
{
    $tsv = fetch_public_members_tsv();
    if ($tsv === '') {
        return;
    }

    foreach (parse_public_members_tsv($tsv) as $row) {
        $memberCode = trim((string)($row['NIM'] ?? ''));
        $fullName = trim((string)($row['Nama Lengkap'] ?? ''));
        $email = strtolower(trim((string)($row['Email Address'] ?? '')));
        $birthDate = normalize_public_members_birth_date((string)($row['Tanggal Lahir'] ?? ''));

        if ($fullName === '') {
            continue;
        }

        $rawPhotoUrl = trim((string)($row['Upload Foto (Profil)'] ?? $row['Upload Foto Terbaikmu'] ?? ''));
        $photoUrl = is_valid_public_member_photo_url($rawPhotoUrl) ? $rawPhotoUrl : '';
        $ageYears = calculate_public_members_age($birthDate);
        $rawSource = json_encode($row, JSON_UNESCAPED_UNICODE);
        $existingId = find_existing_public_member_id($pdo, $memberCode, $fullName, $email, $birthDate);

        if ($existingId) {
            $sql = "
                UPDATE members SET
                    member_code = COALESCE(NULLIF(:member_code, ''), member_code),
                    full_name = COALESCE(NULLIF(:full_name, ''), full_name),
                    email = COALESCE(NULLIF(:email, ''), email),
                    whatsapp = COALESCE(NULLIF(:whatsapp, ''), whatsapp),
                    birth_place = COALESCE(NULLIF(:birth_place, ''), birth_place),
                    birth_date = COALESCE(:birth_date, birth_date),
                    age_years = COALESCE(:age_years, age_years),
                    parent_name = COALESCE(NULLIF(:parent_name, ''), parent_name),
                    current_status = COALESCE(NULLIF(:current_status, ''), current_status),
                    hobby = COALESCE(NULLIF(:hobby, ''), hobby),
                    organization_experience = COALESCE(NULLIF(:organization_experience, ''), organization_experience),
                    photo_url = CASE
                        WHEN NULLIF(:photo_url, '') IS NOT NULL THEN :photo_url
                        ELSE photo_url
                    END,
                    form_submitted_at = COALESCE(:form_submitted_at, form_submitted_at),
                    raw_source = COALESCE(:raw_source, raw_source),
                    is_active = 1,
                    updated_at = NOW()
                WHERE id = :id
            ";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':id' => $existingId,
                ':member_code' => $memberCode,
                ':full_name' => $fullName,
                ':email' => $email,
                ':whatsapp' => preg_replace('/\\D+/', '', (string)($row['Nomer Whatsapp'] ?? '')),
                ':birth_place' => trim((string)($row['Tempat Lahir'] ?? '')),
                ':birth_date' => $birthDate,
                ':age_years' => $ageYears,
                ':parent_name' => trim((string)($row['Nama Orang Tua'] ?? '')),
                ':current_status' => trim((string)($row['Status Sekarang'] ?? '')),
                ':hobby' => trim((string)($row['Hobby / Kebiasaan (Paling Disukai)'] ?? '')),
                ':organization_experience' => trim((string)($row['Pernah Ikut Organisasi / Komunitas?'] ?? '')),
                ':photo_url' => $photoUrl,
                ':form_submitted_at' => trim((string)($row['Timestamp'] ?? '')) !== '' ? date('Y-m-d H:i:s', strtotime((string)$row['Timestamp'])) : null,
                ':raw_source' => $rawSource,
            ]);
            continue;
        }

        $stmt = $pdo->prepare("SELECT MAX(CAST(member_code AS UNSIGNED)) AS max_code FROM members WHERE member_code REGEXP '^[0-9]+$' AND CAST(member_code AS UNSIGNED) >= 23690501");
        $stmt->execute();
        $maxRow = $stmt->fetch();
        if ($memberCode === '') {
            $memberCode = (string)(max((int)($maxRow['max_code'] ?? 23690500), 23690500) + 1);
        }

        $stmt = $pdo->prepare(" 
            INSERT INTO members (
                member_code, full_name, email, whatsapp,
                birth_place, birth_date, age_years,
                parent_name, current_status, hobby,
                organization_experience, photo_url, form_submitted_at,
                raw_source, is_active
            ) VALUES (
                :member_code, :full_name, :email, :whatsapp,
                :birth_place, :birth_date, :age_years,
                :parent_name, :current_status, :hobby,
                :organization_experience, :photo_url, :form_submitted_at,
                :raw_source, 1
            )
        ");
        $stmt->execute([
            ':member_code' => $memberCode,
            ':full_name' => $fullName,
            ':email' => $email !== '' ? $email : null,
            ':whatsapp' => preg_replace('/\D+/', '', (string)($row['Nomer Whatsapp'] ?? '')) ?: null,
            ':birth_place' => trim((string)($row['Tempat Lahir'] ?? '')) ?: null,
            ':birth_date' => $birthDate,
            ':age_years' => $ageYears,
            ':parent_name' => trim((string)($row['Nama Orang Tua'] ?? '')) ?: null,
            ':current_status' => trim((string)($row['Status Sekarang'] ?? '')) ?: null,
            ':hobby' => trim((string)($row['Hobby / Kebiasaan (Paling Disukai)'] ?? '')) ?: null,
            ':organization_experience' => trim((string)($row['Pernah Ikut Organisasi / Komunitas?'] ?? '')) ?: null,
            ':photo_url' => $photoUrl !== '' ? $photoUrl : null,
            ':form_submitted_at' => trim((string)($row['Timestamp'] ?? '')) !== '' ? date('Y-m-d H:i:s', strtotime((string)$row['Timestamp'])) : null,
            ':raw_source' => $rawSource,
        ]);
    }
}

function normalize_public_member_photo_path(?string $photoFile): string
{
    $photoFile = trim((string)$photoFile);
    if ($photoFile === '') {
        return '';
    }

    if (preg_match('/^https?:\/\//i', $photoFile)) {
        return $photoFile;
    }

    $photoFile = ltrim($photoFile, '/');
    if (str_starts_with($photoFile, 'public_html/')) {
        $photoFile = substr($photoFile, strlen('public_html/'));
    }

    return $photoFile;
}

function public_member_local_photo_exists(string $photoFile): bool
{
    $photoFile = normalize_public_member_photo_path($photoFile);
    if ($photoFile === '' || preg_match('/^https?:\/\//i', $photoFile)) {
        return $photoFile !== '';
    }

    if (!str_starts_with($photoFile, 'uploads/')) {
        return true;
    }

    return is_file(__DIR__ . '/../../' . $photoFile);
}

function extract_public_member_photo_url_from_raw_source($rawSource): string
{
    if (is_array($rawSource)) {
        $data = $rawSource;
    } else {
        $decoded = json_decode((string)$rawSource, true);
        $data = is_array($decoded) ? $decoded : [];
    }

    $candidates = [
        $data['Upload Foto (Profil)'] ?? '',
        $data['Upload Foto Terbaikmu'] ?? '',
        $data['photo_url'] ?? '',
        $data['photoUrl'] ?? '',
    ];

    foreach ($candidates as $candidate) {
        $candidate = trim((string)$candidate);
        if ($candidate !== '') {
            return $candidate;
        }
    }

    return '';
}

function resolve_public_member_photo(?string $photoFile, ?string $photoUrl, $rawSource = null): string
{
    $photoFile = normalize_public_member_photo_path($photoFile);
    $photoUrl = trim((string)$photoUrl);
    $rawPhotoUrl = extract_public_member_photo_url_from_raw_source($rawSource);

    if ($rawPhotoUrl !== '') {
        return $rawPhotoUrl;
    }

    if ($photoUrl !== '') {
        return $photoUrl;
    }

    if ($photoFile !== '' && public_member_local_photo_exists($photoFile)) {
        return $photoFile;
    }

    return 'assets/images/default-avatar.png';
}

try {
    $pdo = db();
    $action = (string)($_GET['action'] ?? $_POST['action'] ?? '');

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_input();
        $action = (string)($input['action'] ?? $action);
    } else {
        $input = $_GET;
    }

    try {
        sync_public_members_from_tsv($pdo);
    } catch (Throwable $error) {
        // Tetap lanjutkan response anggota walau sinkronisasi Google Form gagal.
    }

    if ($action === 'verify') {
        $email = strtolower(trim((string)($input['email'] ?? '')));
        if ($email === '' || strlen($email) > 190 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            json_response(['ok' => false, 'message' => 'Email tidak valid.'], 422);
        }

        $stmt = $pdo->prepare("
            SELECT id, full_name
            FROM members
            WHERE LOWER(email) = :email
              AND is_active = 1
            LIMIT 1
        ");
        $stmt->execute(['email' => $email]);
        $member = $stmt->fetch();

        if (!$member) {
            json_response(['ok' => false, 'message' => 'Email Anda tidak terdaftar di database Anggota!'], 404);
        }

        json_response([
            'ok' => true,
            'data' => [
                'id' => (int)$member['id'],
                'full_name' => $member['full_name'],
            ],
        ]);
    }

    $stmt = $pdo->query("
        SELECT
            id,
            member_code,
            full_name,
            TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) AS age_years,
            YEAR(birth_date) AS birth_year,
            current_status,
            hobby,
            organization_experience,
            photo_url,
            photo_file,
            raw_source,
            is_active
        FROM members
        WHERE is_active = 1
        ORDER BY full_name ASC
    ");

    $rows = $stmt->fetchAll();

    foreach ($rows as &$row) {
        $row['photo_file'] = normalize_public_member_photo_path($row['photo_file'] ?? '');
        $row['resolved_photo'] = resolve_public_member_photo(
            $row['photo_file'] ?? '',
            $row['photo_url'] ?? '',
            $row['raw_source'] ?? null
        );
        unset($row['raw_source']);
    }
    unset($row);

    json_response([
        'ok' => true,
        'data' => $rows
    ]);
} catch (Throwable $error) {
    json_response([
        'ok' => false,
        'message' => $error->getMessage()
    ], 500);
}