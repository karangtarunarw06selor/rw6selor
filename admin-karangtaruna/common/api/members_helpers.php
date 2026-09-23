<?php
/**
 * Members Helpers - Shared functions for Members API
 * RW06 Selor
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/**
 * Send JSON response and exit
 */
function json_response($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Normalize WhatsApp number:
 * - Remove spaces, dashes, plus signs
 * - If starts with 08, replace with 628
 * - If starts with 8, prepend 62
 * - Keep numeric only
 */
function normalize_whatsapp($number) {
    $number = preg_replace('/[\s\-\+]/', '', $number);
    if (substr($number, 0, 2) === '08') {
        $number = '628' . substr($number, 2);
    } elseif (substr($number, 0, 1) === '8') {
        $number = '62' . $number;
    }
    return $number;
}

/**
 * Calculate age from birth date string (YYYY-MM-DD)
 */
function calculate_age($birth_date) {
    if (!$birth_date) return null;
    $birth = new DateTime($birth_date);
    $now = new DateTime();
    return $now->diff($birth)->y;
}

/**
 * Generate member code:
 * Format: 2-digit year + 5-digit sequential number
 * Starting base: 23690501
 */
function generate_member_code($pdo) {
    try {
        $stmt = $pdo->query("
            SELECT MAX(CAST(member_code AS UNSIGNED)) AS max_code
            FROM members
            WHERE member_code REGEXP '^[0-9]+$'
              AND CAST(member_code AS UNSIGNED) >= 23690501
        ");
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $maxCode = (int)($row['max_code'] ?? 0);

        if ($maxCode && $maxCode >= 23690501) {
            return (string)($maxCode + 1);
        }
        return '23690501';
    } catch (Exception $e) {
        return '23690501';
    }
}

function normalize_member_photo_path(?string $photoFile): string
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

function member_local_photo_exists(string $photoFile): bool
{
    $photoFile = normalize_member_photo_path($photoFile);
    if ($photoFile === '' || preg_match('/^https?:\/\//i', $photoFile)) {
        return $photoFile !== '';
    }

    if (!str_starts_with($photoFile, 'uploads/')) {
        return true;
    }

    return is_file(__DIR__ . '/../../' . $photoFile);
}

function resolve_member_photo(?string $photoFile, ?string $photoUrl): string
{
    $photoFile = normalize_member_photo_path($photoFile);
    $photoUrl = trim((string)$photoUrl);

    if ($photoFile !== '' && member_local_photo_exists($photoFile)) {
        return $photoFile;
    }

    if ($photoUrl !== '') {
        return $photoUrl;
    }

    return 'assets/images/default-avatar.png';
}

/**
 * Find existing member by full_name, email, AND birth_date (strict matching).
 * All three fields must match to consider as duplicate.
 * Comparison is case-insensitive (lowercased) to prevent case-variant duplicates.
 * Returns the member ID, or null if not found.
 */
function find_existing_member(PDO $pdo, string $full_name, string $email, string $birth_date = ''): ?int
{
    if ($full_name === '' || $birth_date === '') {
        return null;
    }

    // Cari berdasarkan nama + email + tanggal lahir (strict 3 field, case-insensitive)
    $sql = "SELECT id FROM members WHERE LOWER(full_name) = LOWER(:full_name) AND birth_date = :birth_date AND LOWER(email) = LOWER(:email) LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':full_name' => $full_name,
        ':birth_date' => $birth_date,
        ':email' => $email,
    ]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    return $row ? (int)$row['id'] : null;
}

/**
 * Upsert member: update all columns for a given ID.
 * Only overwrites fields that have a non-empty value from input.
 * Fields that are empty in input but not null in DB will be preserved (if already set).
 * Fields that are empty in input and null/empty in DB will be filled if input is non-empty.
 */
function upsert_member(
    PDO $pdo,
    int $id,
    string $member_code,
    string $full_name,
    string $email,
    string $whatsapp,
    string $birth_place,
    string $birth_date,
    ?int $age_years,
    string $parent_name,
    string $current_status,
    string $hobby,
    string $organization_experience,
    string $photo_url,
    string $photo_file,
    string $raw_source,
    int $is_active
): void {
    // Only update photo_file if a new file was uploaded
    $extraSet = [];
    $extraParams = [];

    if ($photo_file !== '') {
        $extraSet[] = 'photo_file = :photo_file';
        $extraParams[':photo_file'] = $photo_file;
    }

    if ($photo_url !== '') {
        $extraSet[] = 'photo_url = :photo_url';
        $extraParams[':photo_url'] = $photo_url;
    }

    $extraSetSql = $extraSet ? ', ' . implode(', ', $extraSet) : '';

    // Use COALESCE to only overwrite if input is non-empty (preserve existing data)
    $sql = "
        UPDATE members SET
            member_code = :member_code,
            full_name = COALESCE(NULLIF(:full_name, ''), full_name),
            email = COALESCE(NULLIF(:email, ''), email),
            whatsapp = COALESCE(NULLIF(:whatsapp, ''), whatsapp),
            birth_place = COALESCE(NULLIF(:birth_place, ''), birth_place),
            birth_date = COALESCE(NULLIF(:birth_date, ''), birth_date),
            age_years = :age_years,
            parent_name = COALESCE(NULLIF(:parent_name, ''), parent_name),
            current_status = COALESCE(NULLIF(:current_status, ''), current_status),
            hobby = COALESCE(NULLIF(:hobby, ''), hobby),
            organization_experience = COALESCE(NULLIF(:organization_experience, ''), organization_experience),
            is_active = :is_active,
            raw_source = :raw_source,
            updated_at = NOW()
            $extraSetSql
        WHERE id = :id
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array_merge([
        ':id' => $id,
        ':member_code' => $member_code,
        ':full_name' => $full_name,
        ':email' => $email,
        ':whatsapp' => $whatsapp,
        ':birth_place' => $birth_place,
        ':birth_date' => $birth_date,
        ':age_years' => $age_years,
        ':parent_name' => $parent_name,
        ':current_status' => $current_status,
        ':hobby' => $hobby,
        ':organization_experience' => $organization_experience,
        ':is_active' => $is_active,
        ':raw_source' => $raw_source,
    ], $extraParams));
}
