<?php
declare(strict_types=1);

require_once __DIR__ . '/members_helpers.php';
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
}

// Ambil data POST
$id = (int)($_POST['id'] ?? 0);
$member_code = trim((string)($_POST['member_code'] ?? ''));
$full_name = trim((string)($_POST['full_name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$whatsapp = trim((string)($_POST['whatsapp'] ?? ''));
$birth_place = trim((string)($_POST['birth_place'] ?? ''));
$birth_date = trim((string)($_POST['birth_date'] ?? ''));
$parent_name = trim((string)($_POST['parent_name'] ?? ''));
$current_status = trim((string)($_POST['current_status'] ?? ''));
$hobby = trim((string)($_POST['hobby'] ?? ''));
$organization_experience = trim((string)($_POST['organization_experience'] ?? ''));
$photo_url = trim((string)($_POST['photo_url'] ?? ''));
$source = trim((string)($_POST['source'] ?? ''));
$is_active = isset($_POST['is_active']) ? (int)$_POST['is_active'] : 1;

// --- Handle photo_file upload ---
$photo_file = '';
if (isset($_FILES['photo_file']) && $_FILES['photo_file']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['photo_file'];
    $allowed = ['image/jpeg', 'image/png', 'image/webp'];
    $maxSize = 10 * 1024 * 1024; // 10 MB

    if (!in_array($file['type'], $allowed)) {
        json_response(['success' => false, 'message' => 'Format foto harus JPG, PNG, atau WEBP.'], 400);
    }
    if ($file['size'] > $maxSize) {
        json_response(['success' => false, 'message' => 'Ukuran foto maksimal 10 MB.'], 400);
    }

    $uploadDir = __DIR__ . '/../../uploads/foto-anggota/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $safeName = 'member_' . time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
    $destPath = $uploadDir . $safeName;

    if (move_uploaded_file($file['tmp_name'], $destPath)) {
        $photo_file = 'uploads/foto-anggota/' . $safeName;
    } else {
        json_response(['success' => false, 'message' => 'Gagal menyimpan file foto.'], 500);
    }
} elseif (isset($_FILES['photo_file']) && $_FILES['photo_file']['error'] !== UPLOAD_ERR_NO_FILE) {
    // Upload error other than "no file"
    json_response(['success' => false, 'message' => 'Error upload foto: ' . $_FILES['photo_file']['error']], 400);
}

// --- Validasi ---
if ($full_name === '') {
    json_response(['success' => false, 'message' => 'Nama lengkap wajib diisi.'], 400);
}
if ($whatsapp === '') {
    json_response(['success' => false, 'message' => 'Nomor WhatsApp wajib diisi.'], 400);
}
if ($birth_date === '') {
    json_response(['success' => false, 'message' => 'Tanggal lahir wajib diisi.'], 400);
}
// Validasi tanggal lahir
$d = \DateTime::createFromFormat('Y-m-d', $birth_date);
if (!$d || $d->format('Y-m-d') !== $birth_date) {
    json_response(['success' => false, 'message' => 'Format tanggal lahir tidak valid (YYYY-MM-DD).'], 400);
}
// Validasi email jika ada
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['success' => false, 'message' => 'Format email tidak valid.'], 400);
}

// Normalize WhatsApp
$whatsapp = normalize_whatsapp($whatsapp);

// Hitung usia
$age_years = calculate_age($birth_date);

$raw_source = json_encode($_POST, JSON_UNESCAPED_UNICODE);

// Jika id > 0: update eksplisit (dari admin/editor)
if ($id > 0) {
    upsert_member($pdo, $id, $member_code, $full_name, $email, $whatsapp,
        $birth_place, $birth_date, $age_years, $parent_name, $current_status,
        $hobby, $organization_experience, $photo_url, $photo_file,
        $raw_source, $is_active);
    json_response([
        'success' => true,
        'message' => 'Data anggota berhasil diperbarui.',
        'id' => $id,
    ]);
}

// --- Cek duplikat untuk semua INSERT baru ---
// Saat update (id > 0), duplikat tidak dicek karena admin/edit sengaja update data existing
if ($id === 0) {
    $existingId = find_existing_member($pdo, $full_name, $email, $birth_date);
    if ($existingId) {
        json_response([
            'success' => false,
            'message' => 'Data sudah terdaftar. Anggota dengan nama, email, dan tanggal lahir yang sama sudah ada di sistem.',
        ], 409);
    }
}

// --- INSERT baru ---
if ($member_code === '') {
    $member_code = generate_member_code($pdo);
}

$sql = "
    INSERT INTO members (
        member_code, full_name, email, whatsapp,
        birth_place, birth_date, age_years,
        parent_name, current_status, hobby,
        organization_experience, photo_url, photo_file,
        form_submitted_at, raw_source, is_active
    ) VALUES (
        :member_code, :full_name, :email, :whatsapp,
        :birth_place, :birth_date, :age_years,
        :parent_name, :current_status, :hobby,
        :organization_experience, :photo_url, :photo_file,
        NOW(), :raw_source, :is_active
    )
";
$stmt = $pdo->prepare($sql);
$stmt->execute([
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
    ':photo_url' => $photo_url,
    ':photo_file' => $photo_file,
    ':raw_source' => $raw_source,
    ':is_active' => $is_active,
]);

$newId = (int)$pdo->lastInsertId();

json_response([
    'success' => true,
    'message' => 'Data anggota berhasil disimpan.',
    'id' => $newId,
]);
