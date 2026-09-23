<?php
declare(strict_types=1);

require_once __DIR__ . '/kas_helpers.php';
require_once __DIR__ . '/../db.php';

function cashflow_ensure_table(PDO $pdo): void
{
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS cashflow_transaksi (
            id INT AUTO_INCREMENT PRIMARY KEY,
            tanggal DATE NOT NULL,
            jenis ENUM('pemasukan','pengeluaran') NOT NULL,
            keterangan VARCHAR(255) NOT NULL,
            jumlah DECIMAL(12,2) NOT NULL DEFAULT 0,
            bukti_file VARCHAR(255) DEFAULT NULL,
            sumber_data VARCHAR(50) DEFAULT 'input_html',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
}

try {
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        kas_json(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
    }

    cashflow_ensure_table($pdo);

    $tanggal = trim((string)($_POST['tanggal'] ?? ''));
    $jenis = trim((string)($_POST['jenis'] ?? ''));
    $keterangan = trim((string)($_POST['keterangan'] ?? ''));
    $jumlah = (float)($_POST['jumlah'] ?? 0);

    if ($tanggal === '') {
        throw new Exception('Tanggal wajib diisi.');
    }
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $tanggal)) {
        throw new Exception('Format tanggal tidak valid.');
    }
    if (!in_array($jenis, ['pemasukan', 'pengeluaran'], true)) {
        throw new Exception('Jenis transaksi tidak valid.');
    }
    if ($keterangan === '') {
        throw new Exception('Keterangan transaksi wajib diisi.');
    }
    if ($jumlah <= 0) {
        throw new Exception('Jumlah harus lebih dari 0.');
    }

    $buktiFile = null;
    if (!empty($_FILES['bukti_file']['name'])) {
        if (($_FILES['bukti_file']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            throw new Exception('Upload bukti transaksi gagal.');
        }

        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
        $extension = strtolower(pathinfo((string)$_FILES['bukti_file']['name'], PATHINFO_EXTENSION));
        $size = (int)($_FILES['bukti_file']['size'] ?? 0);

        if (!in_array($extension, $allowedExtensions, true)) {
            throw new Exception('Format bukti tidak diizinkan. Gunakan JPG, PNG, WEBP, atau PDF.');
        }
        if ($size > 100 * 1024 * 1024) {
            throw new Exception('Ukuran file maksimal 100 MB.');
        }

        $uploadDir = __DIR__ . '/../../uploads/cashflow/bukti-nota/';
        if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true)) {
            throw new Exception('Folder upload bukti transaksi tidak bisa dibuat.');
        }

        $safeName = 'nota-' . date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '.' . $extension;
        $targetPath = $uploadDir . $safeName;

        if (!move_uploaded_file((string)$_FILES['bukti_file']['tmp_name'], $targetPath)) {
            throw new Exception('Gagal mengupload bukti transaksi.');
        }

        $buktiFile = 'uploads/cashflow/bukti-nota/' . $safeName;
    }

    $stmt = $pdo->prepare("
        INSERT INTO cashflow_transaksi
            (tanggal, jenis, keterangan, jumlah, bukti_file, sumber_data)
        VALUES
            (:tanggal, :jenis, :keterangan, :jumlah, :bukti_file, 'input_html')
    ");
    $stmt->execute([
        ':tanggal' => $tanggal,
        ':jenis' => $jenis,
        ':keterangan' => $keterangan,
        ':jumlah' => $jumlah,
        ':bukti_file' => $buktiFile,
    ]);

    kas_json(['success' => true, 'message' => 'Transaksi berhasil disimpan.']);
} catch (Throwable $e) {
    kas_json(['success' => false, 'message' => $e->getMessage()], 400);
}
