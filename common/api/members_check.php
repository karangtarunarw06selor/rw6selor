<?php
/**
 * Check if member already exists (by name AND email AND birth_date)
 * Used by public form-anggota.html to detect duplicates
 * Strict matching: full_name + email + birth_date must all match
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
    // Cari berdasarkan nama + email + tanggal lahir (strict match, case-insensitive)
    $sql = "SELECT id, full_name, email, whatsapp, birth_place, birth_date,
                   parent_name, current_status, hobby, organization_experience
            FROM members
            WHERE LOWER(full_name) = LOWER(:full_name) 
              AND birth_date = :birth_date
              AND LOWER(email) = LOWER(:email)
            LIMIT 1";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':full_name' => $full_name,
        ':birth_date' => $birth_date,
        ':email' => $email,
    ]);
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