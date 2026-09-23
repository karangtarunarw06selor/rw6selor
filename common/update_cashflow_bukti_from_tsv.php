<?php
require_once __DIR__ . '/db.php';

$tsvPath = __DIR__ . '/../sql/Laporan Keuangan (Total) - Laporan Keuangan.tsv';

if (!file_exists($tsvPath)) {
    die("File TSV tidak ditemukan: {$tsvPath}\n");
}

function clean_money($value) {
    $value = trim((string) $value);

    if ($value === '' || $value === '-') {
        return 0;
    }

    $value = str_replace(['Rp', 'rp', 'IDR', 'idr', ' ', '.', ','], '', $value);
    $value = preg_replace('/[^0-9]/', '', $value);

    return $value === '' ? 0 : (int) $value;
}

function clean_date_to_mysql($value) {
    $value = trim((string) $value);

    if ($value === '') {
        return null;
    }

    $formats = ['d/m/Y', 'd-m-Y', 'Y-m-d', 'm/d/Y'];

    foreach ($formats as $format) {
        $date = DateTime::createFromFormat($format, $value);
        if ($date instanceof DateTime) {
            return $date->format('Y-m-d');
        }
    }

    $timestamp = strtotime($value);
    if ($timestamp !== false) {
        return date('Y-m-d', $timestamp);
    }

    return null;
}

function normalize_bukti($value) {
    $value = trim((string) $value);

    if ($value === '' || $value === '-') {
        return null;
    }

    return $value;
}

$handle = fopen($tsvPath, 'r');

if (!$handle) {
    die("Gagal membuka file TSV.\n");
}

$header = fgetcsv($handle, 0, "\t");

if (!$header) {
    die("Header TSV tidak ditemukan.\n");
}

$header = array_map(function ($col) {
    return strtolower(trim($col));
}, $header);

$updated = 0;
$skipped = 0;
$notFound = 0;

$sql = "
    UPDATE cashflow_transaksi
    SET bukti_file = :bukti_file
    WHERE tanggal = :tanggal
      AND jenis = :jenis
      AND keterangan = :keterangan
      AND jumlah = :jumlah
    LIMIT 1
";

$stmt = $pdo->prepare($sql);

$checkSql = "
    SELECT id
    FROM cashflow_transaksi
    WHERE tanggal = :tanggal
      AND jenis = :jenis
      AND keterangan = :keterangan
      AND jumlah = :jumlah
    LIMIT 1
";

$checkStmt = $pdo->prepare($checkSql);

while (($row = fgetcsv($handle, 0, "\t")) !== false) {
    $data = array_combine($header, array_pad($row, count($header), ''));

    if (!$data) {
        $skipped++;
        continue;
    }

    $tanggalRaw = $data['tanggal'] ?? '';
    $keterangan = trim($data['keterangan'] ?? '');
    $pemasukan = clean_money($data['pemasukan'] ?? '');
    $pengeluaran = clean_money($data['pengeluaran'] ?? '');
    $buktiNota = normalize_bukti($data['bukti nota'] ?? '');

    $tanggal = clean_date_to_mysql($tanggalRaw);

    if (!$tanggal || $keterangan === '') {
        $skipped++;
        continue;
    }

    if ($pemasukan > 0) {
        $jenis = 'pemasukan';
        $jumlah = $pemasukan;
    } elseif ($pengeluaran > 0) {
        $jenis = 'pengeluaran';
        $jumlah = $pengeluaran;
    } else {
        $skipped++;
        continue;
    }

    $params = [
        ':tanggal' => $tanggal,
        ':jenis' => $jenis,
        ':keterangan' => $keterangan,
        ':jumlah' => $jumlah
    ];

    $checkStmt->execute($params);
    $existing = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if (!$existing) {
        $notFound++;
        echo "Tidak ditemukan: {$tanggal} | {$jenis} | {$keterangan} | {$jumlah}\n";
        continue;
    }

    $stmt->execute([
        ':bukti_file' => $buktiNota,
        ':tanggal' => $tanggal,
        ':jenis' => $jenis,
        ':keterangan' => $keterangan,
        ':jumlah' => $jumlah
    ]);

    $updated++;
}

fclose($handle);

echo "Update bukti nota selesai.\n";
echo "Berhasil update: {$updated} data\n";
echo "Dilewati: {$skipped} data\n";
echo "Tidak ditemukan di database: {$notFound} data\n";