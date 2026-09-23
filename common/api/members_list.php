<?php
declare(strict_types=1);

require_once __DIR__ . '/members_helpers.php';
require_once __DIR__ . '/../db.php';

$where = ['1=1'];
$params = [];

$q = trim((string)($_GET['q'] ?? ''));
if ($q !== '') {
    $where[] = '(full_name LIKE :q OR member_code LIKE :q2 OR whatsapp LIKE :q3 OR email LIKE :q4)';
    $params[':q'] = '%' . $q . '%';
    $params[':q2'] = '%' . $q . '%';
    $params[':q3'] = '%' . $q . '%';
    $params[':q4'] = '%' . $q . '%';
}

if (isset($_GET['status']) && $_GET['status'] !== '') {
    $where[] = 'current_status = :status';
    $params[':status'] = (string)$_GET['status'];
}

if (isset($_GET['is_active']) && $_GET['is_active'] !== '') {
    $where[] = 'is_active = :is_active';
    $params[':is_active'] = (int)$_GET['is_active'];
}

    $sql = "
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
        WHERE " . implode(' AND ', $where) . "
        ORDER BY full_name ASC
    ";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

foreach ($rows as &$row) {
    $row['photo_file'] = normalize_member_photo_path($row['photo_file'] ?? '');
    $row['resolved_photo'] = resolve_member_photo($row['photo_file'] ?? '', $row['photo_url'] ?? '');
}
unset($row);

json_response([
    'success' => true,
    'total' => count($rows),
    'data' => $rows,
]);
