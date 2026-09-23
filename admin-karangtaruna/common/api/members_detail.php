<?php
declare(strict_types=1);

require_once __DIR__ . '/members_helpers.php';
require_once __DIR__ . '/../db.php';

$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) {
    json_response(['success' => false, 'message' => 'ID tidak valid.'], 400);
}

$stmt = $pdo->prepare("
    SELECT 
        id,
        member_code,
        full_name,
        email,
        whatsapp,
        birth_place,
        birth_date,
        TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) AS age_years,
        parent_name,
        current_status,
        hobby,
        organization_experience,
        photo_url,
        photo_file,
        form_submitted_at,
        is_active,
        created_at,
        updated_at
    FROM members
    WHERE id = :id
");
$stmt->execute([':id' => $id]);
$row = $stmt->fetch();

if (!$row) {
    json_response(['success' => false, 'message' => 'Anggota tidak ditemukan.'], 404);
}

$row['photo_file'] = normalize_member_photo_path($row['photo_file'] ?? '');
$row['resolved_photo'] = resolve_member_photo($row['photo_file'] ?? '', $row['photo_url'] ?? '');

json_response([
    'success' => true,
    'data' => $row,
]);
