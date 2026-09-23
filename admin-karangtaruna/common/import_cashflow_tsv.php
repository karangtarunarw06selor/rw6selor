<?php
require_once __DIR__ . '/db.php';

$tsvPath = __DIR__ . '/../sql/Laporan Keuangan (Total) - Laporan Keuangan.tsv';

if (!file_exists($tsvPath)) {
    die("File TSV tidak ditemukan: {$tsvPath}\n");
}

function clean_money($value) {
    $value = trim((string) $value);

    if ($value === '') {
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

    // Format umum Google Sheet Indonesia: dd/mm/yyyy
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

$inserted = 0;
$skipped = 0;

$sql = "
    INSERT INTO cashflow_transaksi
    (tanggal, jenis, keterangan, jumlah, bukti_file, sumber_data)
    VALUES
    (:tanggal, :jenis, :keterangan, :jumlah, :bukti_file, 'import_tsv')
";

$stmt = $pdo->prepare($sql);

while (($row = fgetcsv($handle, 0, "\t")) !== false) {
    if (count($row) < 2) {
        $skipped++;
        continue;
    }

    $data = array_combine($header, array_pad($row, count($header), ''));

    if (!$data) {
        $skipped++;
        continue;
    }

    $tanggalRaw = $data['tanggal'] ?? '';
    $keterangan = trim($data['keterangan'] ?? '');
    $pemasukan = clean_money($data['pemasukan'] ?? '');
    $pengeluaran = clean_money($data['pengeluaran'] ?? '');
    $buktiNota = trim($data['bukti nota'] ?? '');

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

    try {
        $stmt->execute([
            ':tanggal' => $tanggal,
            ':jenis' => $jenis,
            ':keterangan' => $keterangan,
            ':jumlah' => $jumlah,
            ':bukti_file' => $buktiNota ?: null
        ]);

        $inserted++;
    } catch (Throwable $e) {
        $skipped++;
        echo "Gagal import baris: {$keterangan} | Error: {$e->getMessage()}\n";
    }
}

fclose($handle);

echo "Import cashflow selesai.\n";
echo "Berhasil masuk: {$inserted} data\n";
echo "Dilewati/gagal: {$skipped} data\n";