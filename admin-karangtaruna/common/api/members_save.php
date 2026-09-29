<?php
declare(strict_types=1);

require_once __DIR__ . '/members_helpers.php';
require_once __DIR__ . '/../db.php';

set_exception_handler(function (Throwable $error): void {
    json_response([
        'success' => false,
        'message' => 'Gagal menyimpan data anggota: ' . $error->getMessage(),
    ], 500);
});

member_ensure_profile_columns($pdo);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
}

// Ambil data POST
$id = (int)($_POST['id'] ?? 0);
$member_code = trim((string)($_POST['member_code'] ?? ''));
$full_name = trim((string)($_POST['full_name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$whatsapp = trim((string)($_POST['whatsapp'] ?? ''));
$rt = trim((string)($_POST['rt'] ?? ''));
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
if (isset($_FILES['photo_file'])) {
    $file = $_FILES['photo_file'];
    $uploadError = $file['error'] ?? UPLOAD_ERR_NO_FILE;

    if ($uploadError === UPLOAD_ERR_OK) {
        $allowed = ['image/jpeg', 'image/png', 'image/webp'];
        $maxSize = 10 * 1024 * 1024; // 10 MB

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = $finfo ? finfo_file($finfo, $file['tmp_name']) : ($file['type'] ?? '');
        if ($finfo) {
            finfo_close($finfo);
        }

        if (!in_array($mimeType, $allowed, true)) {
            json_response(['success' => false, 'message' => 'Format foto harus JPG, PNG, atau WEBP.'], 400);
        }
        if (($file['size'] ?? 0) > $maxSize) {
            json_response(['success' => false, 'message' => 'Ukuran foto maksimal 10 MB.'], 400);
        }

        $uploadDir = __DIR__ . '/../../uploads/foto-anggota/';
        if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
            json_response(['success' => false, 'message' => 'Gagal membuat direktori upload.'], 500);
        }
        if (!is_writable($uploadDir)) {
            json_response(['success' => false, 'message' => 'Direktori upload tidak writable.'], 500);
        }

        $extensionMap = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
        ];
        $ext = $extensionMap[$mimeType] ?? strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $safeName = 'member_' . time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
        $destPath = $uploadDir . $safeName;

        if (move_uploaded_file($file['tmp_name'], $destPath)) {
            $photo_file = 'uploads/foto-anggota/' . $safeName;
        } else {
            $lastError = error_get_last();
            $errorMessage = $lastError ? $lastError['message'] : 'Unknown move_uploaded_file failure';
            json_response(['success' => false, 'message' => 'Gagal menyimpan file foto: ' . $errorMessage], 500);
        }
    } elseif ($uploadError !== UPLOAD_ERR_NO_FILE) {
        $errorMessages = [
            UPLOAD_ERR_INI_SIZE => 'File melebihi batas ukuran server (upload_max_filesize).',
            UPLOAD_ERR_FORM_SIZE => 'File melebihi batas ukuran form (MAX_FILE_SIZE).',
            UPLOAD_ERR_PARTIAL => 'Upload file tidak lengkap.',
            UPLOAD_ERR_NO_TMP_DIR => 'Folder temporary server tidak tersedia.',
            UPLOAD_ERR_CANT_WRITE => 'Gagal menulis file ke disk.',
            UPLOAD_ERR_EXTENSION => 'Upload dihentikan oleh ekstensi PHP.',
        ];
        $errorMsg = $errorMessages[$uploadError] ?? "Error upload foto (code: $uploadError)";
        json_response(['success' => false, 'message' => $errorMsg], 400);
    }
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
if ($email === '') {
    json_response(['success' => false, 'message' => 'Email wajib diisi karena dipakai untuk login anggota dan pengiriman NIM.'], 400);
}
// Validasi email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['success' => false, 'message' => 'Format email tidak valid.'], 400);
}

// Normalize WhatsApp
$whatsapp = normalize_whatsapp($whatsapp);
$rt = preg_replace('/[^0-9A-Za-z]/', '', $rt) ?? '';

// Hitung usia
$age_years = calculate_age($birth_date);

$raw_source = json_encode($_POST, JSON_UNESCAPED_UNICODE);

// Jika id > 0: update eksplisit (dari admin/editor)
if ($id > 0) {
    upsert_member($pdo, $id, $member_code, $full_name, $email, $whatsapp, $rt,
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
        member_code, full_name, email, whatsapp, rt,
        birth_place, birth_date, age_years,
        parent_name, current_status, hobby,
        organization_experience, photo_url, photo_file,
        form_submitted_at, raw_source, is_active
    ) VALUES (
        :member_code, :full_name, :email, :whatsapp, :rt,
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
    ':rt' => $rt,
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
    'member_code' => $member_code,
]);
