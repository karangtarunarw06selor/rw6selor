<?php
declare(strict_types=1);

require_once __DIR__ . '/members_pending_helpers.php';
require_once __DIR__ . '/../db.php';

member_pending_ensure_table($pdo);
member_ensure_profile_columns($pdo);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $status = trim((string)($_GET['status'] ?? 'pending'));
    $allowed = ['pending', 'approved', 'rejected', 'all'];
    if (!in_array($status, $allowed, true)) $status = 'pending';

    $where = $status === 'all' ? '1=1' : 'status = :status';
    $stmt = $pdo->prepare("SELECT * FROM member_pending_submissions WHERE {$where} ORDER BY COALESCE(submitted_at, created_at) DESC, id DESC");
    $stmt->execute($status === 'all' ? [] : [':status' => $status]);
    json_response(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
}

if ($method !== 'POST') {
    json_response(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
}

$input = array_merge($_POST, member_pending_json_input());
$action = trim((string)($input['action'] ?? ''));

if ($action === 'sync') {
    $sourceUrl = trim((string)($input['source_url'] ?? ''));
    if ($sourceUrl === '') {
        json_response(['success' => false, 'message' => 'URL Google Sheet wajib diisi.'], 400);
    }

    $rows = member_pending_fetch_tsv($sourceUrl);
    $imported = 0;
    $skipped = 0;
    foreach ($rows as $row) {
        $item = member_pending_from_sheet_row($row);
        if ($item['full_name'] === '') {
            $skipped++;
            continue;
        }
        if (member_pending_insert($pdo, $item)) $imported++;
    }

    json_response([
        'success' => true,
        'message' => "Sinkronisasi selesai. {$imported} data masuk/diperbarui, {$skipped} dilewati.",
        'imported' => $imported,
        'skipped' => $skipped,
    ]);
}

$id = (int)($input['id'] ?? 0);
if ($id < 1) {
    json_response(['success' => false, 'message' => 'ID pengajuan tidak valid.'], 400);
}

$stmt = $pdo->prepare("SELECT * FROM member_pending_submissions WHERE id = :id LIMIT 1");
$stmt->execute([':id' => $id]);
$pending = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$pending) {
    json_response(['success' => false, 'message' => 'Pengajuan tidak ditemukan.'], 404);
}

if ($action === 'reject') {
    $stmt = $pdo->prepare("UPDATE member_pending_submissions SET status = 'rejected', notes = :notes, reviewed_at = NOW() WHERE id = :id");
    $stmt->execute([':notes' => trim((string)($input['notes'] ?? '')), ':id' => $id]);
    json_response(['success' => true, 'message' => 'Pengajuan ditolak.']);
}

if ($action !== 'approve') {
    json_response(['success' => false, 'message' => 'Action tidak valid.'], 400);
}

$fullName = trim((string)($input['full_name'] ?? $pending['full_name']));
$email = trim((string)($input['email'] ?? $pending['email']));
$whatsapp = normalize_whatsapp(trim((string)($input['whatsapp'] ?? $pending['whatsapp'])));
$rt = preg_replace('/[^0-9A-Za-z]/', '', trim((string)($input['rt'] ?? $pending['rt'] ?? ''))) ?? '';
$birthPlace = trim((string)($input['birth_place'] ?? $pending['birth_place']));
$birthDate = trim((string)($input['birth_date'] ?? $pending['birth_date']));
$parentName = trim((string)($input['parent_name'] ?? $pending['parent_name']));
$currentStatus = trim((string)($input['current_status'] ?? $pending['current_status']));
$hobby = trim((string)($input['hobby'] ?? $pending['hobby']));
$organizationExperience = trim((string)($input['organization_experience'] ?? $pending['organization_experience']));
$photoUrl = trim((string)($input['photo_url'] ?? $pending['photo_url']));

if ($fullName === '' || $whatsapp === '' || $birthDate === '') {
    json_response(['success' => false, 'message' => 'Nama, WhatsApp, dan tanggal lahir wajib lengkap sebelum approve.'], 400);
}
if (!DateTime::createFromFormat('Y-m-d', $birthDate)) {
    json_response(['success' => false, 'message' => 'Tanggal lahir harus format YYYY-MM-DD.'], 400);
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['success' => false, 'message' => 'Format email tidak valid.'], 400);
}

$existingId = find_existing_member($pdo, $fullName, $email, $birthDate);
if ($existingId) {
    json_response(['success' => false, 'message' => 'Anggota dengan nama, email, dan tanggal lahir yang sama sudah ada.'], 409);
}

try {
    $pdo->beginTransaction();
    $memberCode = generate_member_code($pdo);
    $ageYears = calculate_age($birthDate);
    $rawSource = json_encode([
        'source' => 'google_form_pending_approved',
        'pending_id' => $id,
        'sheet_row' => json_decode((string)$pending['raw_source'], true),
    ], JSON_UNESCAPED_UNICODE);

    $stmt = $pdo->prepare("
        INSERT INTO members (
            member_code, full_name, email, whatsapp, rt, birth_place, birth_date, age_years,
            parent_name, current_status, hobby, organization_experience, photo_url,
            form_submitted_at, raw_source, is_active
        ) VALUES (
            :member_code, :full_name, :email, :whatsapp, :rt, :birth_place, :birth_date, :age_years,
            :parent_name, :current_status, :hobby, :organization_experience, :photo_url,
            COALESCE(:submitted_at, NOW()), :raw_source, 0
        )
    ");
    $stmt->execute([
        ':member_code' => $memberCode,
        ':full_name' => $fullName,
        ':email' => $email,
        ':whatsapp' => $whatsapp,
        ':rt' => $rt,
        ':birth_place' => $birthPlace,
        ':birth_date' => $birthDate,
        ':age_years' => $ageYears,
        ':parent_name' => $parentName,
        ':current_status' => $currentStatus,
        ':hobby' => $hobby,
        ':organization_experience' => $organizationExperience,
        ':photo_url' => $photoUrl,
        ':submitted_at' => $pending['submitted_at'] ?: null,
        ':raw_source' => $rawSource,
    ]);
    $memberId = (int)$pdo->lastInsertId();

    $stmt = $pdo->prepare("UPDATE member_pending_submissions SET status = 'approved', member_id = :member_id, reviewed_at = NOW() WHERE id = :id");
    $stmt->execute([':member_id' => $memberId, ':id' => $id]);
    $pdo->commit();

    json_response([
        'success' => true,
        'message' => 'Pengajuan disetujui sebagai anggota nonaktif. Periksa datanya lalu aktifkan dengan toggle.',
        'member_id' => $memberId,
    ]);
} catch (Throwable $error) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    json_response(['success' => false, 'message' => 'Gagal menyetujui pengajuan.'], 500);
}
