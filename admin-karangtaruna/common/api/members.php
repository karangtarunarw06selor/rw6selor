<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

handle_cors_preflight();

function public_member_ensure_profile_columns(PDO $pdo): void
{
    $pdo->exec("ALTER TABLE members ADD COLUMN IF NOT EXISTS rt VARCHAR(10) DEFAULT '' AFTER whatsapp");
}

function public_member_generation_label(?int $birthYear, ?int $ageYears = null): string
{
    if ($birthYear !== null && $birthYear > 0) {
        if ($birthYear >= 2013) return 'Gen Alpha';
        if ($birthYear >= 1997) return 'Gen Z';
        if ($birthYear >= 1981) return 'Milenial';
        return 'Gen X / Senior';
    }
    if ($ageYears !== null && $ageYears >= 0) {
        return public_member_generation_label((int)date('Y') - $ageYears, null);
    }
    return 'Umum';
}

function public_member_normalize_photo(?string $photoFile): string
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

function public_member_photo_exists(string $photoFile): bool
{
    $photoFile = public_member_normalize_photo($photoFile);
    if ($photoFile === '') {
        return false;
    }
    if (preg_match('/^https?:\/\//i', $photoFile)) {
        return true;
    }
    if (!str_starts_with($photoFile, 'uploads/')) {
        return true;
    }
    return is_file(__DIR__ . '/../../' . $photoFile);
}

function public_member_resolve_photo(?string $photoFile, ?string $photoUrl): string
{
    $photoFile = public_member_normalize_photo($photoFile);
    $photoUrl = trim((string)$photoUrl);

    if ($photoFile !== '' && public_member_photo_exists($photoFile)) {
        return $photoFile;
    }
    if ($photoUrl !== '') {
        return $photoUrl;
    }
    return 'assets/images/default-avatar.png';
}

try {
    $pdo = db();
    public_member_ensure_profile_columns($pdo);
    $action = (string)($_GET['action'] ?? $_POST['action'] ?? '');
    $input = $_GET;

    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
        $input = json_input();
        $action = (string)($input['action'] ?? $action);
    }

    if ($action === 'verify') {
        $email = strtolower(trim((string)($input['email'] ?? '')));
        if ($email === '' || strlen($email) > 190 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            json_response(['ok' => false, 'message' => 'Email tidak valid.'], 422);
        }

        $stmt = $pdo->prepare("SELECT id, full_name FROM members WHERE LOWER(email) = :email AND is_active = 1 LIMIT 1");
        $stmt->execute([':email' => $email]);
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
            rt,
            is_active
        FROM members
        WHERE is_active = 1
        ORDER BY full_name ASC
    ");
    $rows = $stmt->fetchAll();

    foreach ($rows as &$row) {
        $row['photo_file'] = public_member_normalize_photo($row['photo_file'] ?? '');
        $row['resolved_photo'] = public_member_resolve_photo($row['photo_file'] ?? '', $row['photo_url'] ?? '');
        $row['generation_label'] = public_member_generation_label((int)($row['birth_year'] ?? 0), (int)($row['age_years'] ?? 0));
    }
    unset($row);

    json_response([
        'ok' => true,
        'data' => $rows,
    ]);
} catch (Throwable $error) {
    json_response([
        'ok' => false,
        'message' => $error->getMessage(),
    ], 500);
}
