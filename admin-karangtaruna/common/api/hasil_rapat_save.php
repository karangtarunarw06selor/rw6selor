<?php
require_once __DIR__ . '/kas_helpers.php';
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');

if (function_exists('kas_send_cors_headers')) {
    kas_send_cors_headers();
} elseif (function_exists('send_cors_headers')) {
    send_cors_headers();
} else {
    header('Content-Type: application/json; charset=utf-8');
}

function uploadHasilRapatLampiran(): ?string {
    if (empty($_FILES['lampiran_file']['name'])) {
        return null;
    }

    if ($_FILES['lampiran_file']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Gagal mengupload lampiran.');
    }

    $allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'doc', 'docx'];
    $originalName = $_FILES['lampiran_file']['name'];
    $tmpName = $_FILES['lampiran_file']['tmp_name'];
    $size = (int) $_FILES['lampiran_file']['size'];

    $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

    if (!in_array($extension, $allowedExtensions, true)) {
        throw new Exception('Format lampiran tidak diizinkan. Gunakan PDF, JPG, PNG, WEBP, DOC, atau DOCX.');
    }

    if ($size > 20 * 1024 * 1024) {
        throw new Exception('Ukuran lampiran maksimal 20 MB.');
    }

    $uploadDir = __DIR__ . '/../../uploads/hasil-rapat/lampiran/';

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $safeName = 'notulen-' . date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '.' . $extension;
    $targetPath = $uploadDir . $safeName;

    if (!move_uploaded_file($tmpName, $targetPath)) {
        throw new Exception('Gagal mengupload lampiran.');
    }

    return 'uploads/hasil-rapat/lampiran/' . $safeName;
}

function deleteHasilRapatLampiran(?string $path): void {
    if (!$path) {
        return;
    }

    $relativePath = ltrim($path, '/');
    $filePath = __DIR__ . '/../../' . $relativePath;

    if (is_file($filePath)) {
        @unlink($filePath);
    }
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Method tidak diizinkan.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $id = (int) ($_POST['id'] ?? 0);
    $tanggalRapat = trim($_POST['tanggal_rapat'] ?? '');
    $agenda = trim($_POST['agenda'] ?? '');
    $hasilMusyawarah = trim($_POST['hasil_musyawarah'] ?? '');
    $lokasiRapat = trim($_POST['lokasi_rapat'] ?? '');
    $pesertaRapat = trim($_POST['peserta_rapat'] ?? '');
    $catatan = trim($_POST['catatan'] ?? '');
    $statusPublikasi = trim($_POST['status_publikasi'] ?? 'publish');

    if ($tanggalRapat === '') {
        throw new Exception('Tanggal rapat wajib diisi.');
    }

    if ($agenda === '') {
        throw new Exception('Agenda/topik pembahasan wajib diisi.');
    }

    if ($hasilMusyawarah === '') {
        throw new Exception('Hasil musyawarah/keputusan wajib diisi.');
    }

    if ($lokasiRapat === '') {
        throw new Exception('Lokasi rapat wajib diisi.');
    }

    if (!in_array($statusPublikasi, ['draft', 'publish'], true)) {
        throw new Exception('Status publikasi tidak valid.');
    }

    $uploadedLampiran = uploadHasilRapatLampiran();
    $commonParams = [
        ':tanggal_rapat' => $tanggalRapat,
        ':agenda' => $agenda,
        ':hasil_musyawarah' => $hasilMusyawarah,
        ':lokasi_rapat' => $lokasiRapat,
        ':peserta_rapat' => $pesertaRapat !== '' ? $pesertaRapat : null,
        ':catatan' => $catatan !== '' ? $catatan : null,
        ':status_publikasi' => $statusPublikasi
    ];

    if ($id > 0) {
        $checkStmt = $pdo->prepare("SELECT lampiran_file FROM hasil_rapat WHERE id = :id LIMIT 1");
        $checkStmt->execute([':id' => $id]);
        $existing = $checkStmt->fetch(PDO::FETCH_ASSOC);

        if (!$existing) {
            if ($uploadedLampiran) {
                deleteHasilRapatLampiran($uploadedLampiran);
            }
            throw new Exception('Data hasil rapat tidak ditemukan.');
        }

        $oldLampiran = $existing['lampiran_file'] ?? null;
        $lampiranFile = $uploadedLampiran ?: $oldLampiran;

        $sql = "
            UPDATE hasil_rapat
            SET
                tanggal_rapat = :tanggal_rapat,
                agenda = :agenda,
                hasil_musyawarah = :hasil_musyawarah,
                lokasi_rapat = :lokasi_rapat,
                peserta_rapat = :peserta_rapat,
                catatan = :catatan,
                lampiran_file = :lampiran_file,
                status_publikasi = :status_publikasi
            WHERE id = :id
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($commonParams + [
            ':lampiran_file' => $lampiranFile,
            ':id' => $id
        ]);

        if ($uploadedLampiran && $oldLampiran && $uploadedLampiran !== $oldLampiran) {
            deleteHasilRapatLampiran($oldLampiran);
        }

        echo json_encode([
            'success' => true,
            'message' => 'Hasil rapat berhasil diperbarui.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $sql = "
        INSERT INTO hasil_rapat
        (
            tanggal_rapat,
            agenda,
            hasil_musyawarah,
            lokasi_rapat,
            peserta_rapat,
            catatan,
            lampiran_file,
            status_publikasi,
            sumber_data
        )
        VALUES
        (
            :tanggal_rapat,
            :agenda,
            :hasil_musyawarah,
            :lokasi_rapat,
            :peserta_rapat,
            :catatan,
            :lampiran_file,
            :status_publikasi,
            'input_html'
        )
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($commonParams + [
        ':lampiran_file' => $uploadedLampiran
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Hasil rapat berhasil disimpan.'
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
