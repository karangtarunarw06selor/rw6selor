<?php
/**
 * Check if member already exists (by name, email AND birth_date)
 * Used by public form-anggota.html to detect duplicates
 * Now uses strict matching: full_name + birth_date + email (ketiga field dicek bersama)
 */
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/members_helpers.php';

// Allow GET requests for checking
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$full_name = trim((string)($_GET['full_name'] ?? ''));
$email = trim((string)($_GET['email'] ?? ''));
$birth_date = trim((string)($_GET['birth_date'] ?? ''));

if ($full_name === '' || $birth_date === '') {
    json_response(['success' => false, 'message' => 'full_name and birth_date are required.'], 400);
}

try {
    // Cari dengan AND: full_name AND birth_date harus cocok
    // Jika email diisi, cocokkan juga email
    // Jika email kosong, cocokkan dengan record yang emailnya juga kosong/null
    $conditions = ['full_name = :full_name', 'birth_date = :birth_date'];
    $params = [
        ':full_name' => $full_name,
        ':birth_date' => $birth_date,
    ];

    if ($email !== '') {
        $conditions[] = 'email = :email';
        $params[':email'] = $email;
    } else {
        $conditions[] = '(email IS NULL OR email = \'\')';
    }

    $sql = "SELECT id, full_name, email, whatsapp, birth_place, birth_date,
                   parent_name, current_status, hobby, organization_experience
            FROM members
            WHERE " . implode(' AND ', $conditions) . "
            LIMIT 1";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $existing = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existing) {
        json_response([
            'success' => true,
            'exists' => true,
            'message' => 'Nama lengkap, email, dan tanggal lahir ini sudah terdaftar di sistem.',
            'data' => $existing
        ]);
    } else {
        json_response([
            'success' => true,
            'exists' => false,
            'data' => null
        ]);
    }
} catch (Exception $e) {
    json_response(['success' => false, 'message' => 'Server error: ' . $e->getMessage()], 500);
}
