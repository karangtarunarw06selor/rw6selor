<?php
require_once __DIR__ . '/kas_helpers.php';
require_once __DIR__ . '/../db.php';

$bulanValid = array_keys(KAS_BULAN_MAP);

$nama = trim($_POST['nama'] ?? '');
$tahun = (int)($_POST['tahun'] ?? date('Y'));
$tanggal = trim($_POST['tanggal'] ?? date('Y-m-d'));
$jumlahPerBulan = (int)($_POST['jumlah'] ?? 5000);
$metode = trim($_POST['metode_pembayaran'] ?? 'Tunai');
$keterangan = trim($_POST['keterangan'] ?? '');
$bulanInput = $_POST['bulan'] ?? [];

if (!is_array($bulanInput)) {
    $bulanInput = [$bulanInput];
}

$bulanDipilih = array_values(array_unique(array_filter($bulanInput, fn($b) => in_array($b, $bulanValid, true))));

if ($nama === '' || $tahun < 2000 || $jumlahPerBulan <= 0 || empty($bulanDipilih)) {
    kas_json(['success' => false, 'message' => 'Nama, tahun, jumlah, dan minimal satu bulan wajib diisi.'], 422);
}

try {
    kas_ensure_tables($pdo);
    $pdo->beginTransaction();

    $findStmt = $pdo->prepare("
        SELECT id
        FROM kas_pembayaran
        WHERE nama = :nama
          AND bulan = :bulan
          AND tahun = :tahun
        LIMIT 1
    ");

    $updateStmt = $pdo->prepare("
        UPDATE kas_pembayaran
        SET tanggal = :tanggal,
            jumlah = :jumlah,
            metode_pembayaran = :metode,
            keterangan = :keterangan,
            sumber_data = 'input_html',
            created_at = CURRENT_TIMESTAMP
        WHERE nama = :nama
          AND bulan = :bulan
          AND tahun = :tahun
    ");

    $insertStmt = $pdo->prepare("
        INSERT INTO kas_pembayaran
            (tanggal, nama, bulan, tahun, jumlah, metode_pembayaran, keterangan, sumber_data)
        VALUES
            (:tanggal, :nama, :bulan, :tahun, :jumlah, :metode, :keterangan, 'input_html')
    ");

    $tersimpan = 0;

    foreach ($bulanDipilih as $bulan) {
        $params = [
            ':tanggal' => $tanggal,
            ':nama' => $nama,
            ':bulan' => $bulan,
            ':tahun' => $tahun,
            ':jumlah' => $jumlahPerBulan,
            ':metode' => $metode,
            ':keterangan' => $keterangan,
        ];

        $findStmt->execute([
            ':nama' => $nama,
            ':bulan' => $bulan,
            ':tahun' => $tahun,
        ]);

        if ($findStmt->fetch()) {
            $updateStmt->execute($params);
        } else {
            $insertStmt->execute($params);
        }
        $tersimpan++;
    }

    $pdo->commit();
    kas_json(['success' => true, 'message' => "Berhasil menyimpan {$tersimpan} bulan pembayaran kas."]);
} catch (Throwable $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    kas_json(['success' => false, 'message' => $e->getMessage()], 500);
}
