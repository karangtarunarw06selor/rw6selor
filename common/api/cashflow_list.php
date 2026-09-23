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

function cashflow_format_date(?string $tanggal): string
{
    if (!$tanggal) {
        return '-';
    }
    $time = strtotime($tanggal);
    return $time ? date('d/m/Y', $time) : $tanggal;
}

try {
    cashflow_ensure_table($pdo);
    kas_ensure_tables($pdo);

    $tahun = isset($_GET['tahun']) && $_GET['tahun'] !== '' && $_GET['tahun'] !== 'Semua' ? (int)$_GET['tahun'] : null;
    $bulan = isset($_GET['bulan']) && $_GET['bulan'] !== '' && $_GET['bulan'] !== 'Semua' ? (int)$_GET['bulan'] : null;
    $jenis = isset($_GET['jenis']) && $_GET['jenis'] !== '' && $_GET['jenis'] !== 'Semua' ? trim((string)$_GET['jenis']) : null;

    if ($jenis === 'masuk') {
        $jenis = 'pemasukan';
    } elseif ($jenis === 'keluar') {
        $jenis = 'pengeluaran';
    }
    if ($jenis !== null && !in_array($jenis, ['pemasukan', 'pengeluaran'], true)) {
        $jenis = null;
    }

    $cashWhere = [];
    $kasWhere = [];
    $params = [];

    if ($tahun !== null && $tahun > 0) {
        $cashWhere[] = 'YEAR(tanggal) = :cash_tahun';
        $kasWhere[] = '(tahun = :kas_tahun OR YEAR(tanggal) = :kas_tahun_tanggal)';
        $params[':cash_tahun'] = $tahun;
        $params[':kas_tahun'] = $tahun;
        $params[':kas_tahun_tanggal'] = $tahun;
    }
    if ($bulan !== null && $bulan >= 1 && $bulan <= 12) {
        $cashWhere[] = 'MONTH(tanggal) = :cash_bulan';
        $kasWhere[] = 'MONTH(tanggal) = :kas_bulan';
        $params[':cash_bulan'] = $bulan;
        $params[':kas_bulan'] = $bulan;
    }
    if ($jenis !== null) {
        $cashWhere[] = 'jenis = :jenis';
        $params[':jenis'] = $jenis;
        if ($jenis === 'pengeluaran') {
            $kasWhere[] = '1 = 0';
        }
    }

    $cashWhereSql = $cashWhere ? 'WHERE ' . implode(' AND ', $cashWhere) : '';
    $kasWhereSql = $kasWhere ? 'WHERE ' . implode(' AND ', $kasWhere) : '';

    $sql = "
        SELECT
            CONCAT('cashflow-', id) AS id,
            'cashflow_transaksi' AS source_table,
            id AS source_id,
            tanggal,
            jenis,
            keterangan,
            jumlah,
            bukti_file,
            sumber_data,
            created_at
        FROM cashflow_transaksi
        {$cashWhereSql}

        UNION ALL

        SELECT
            CONCAT('kas-', id) AS id,
            'kas_pembayaran' AS source_table,
            id AS source_id,
            tanggal,
            'pemasukan' AS jenis,
            CONCAT('Iuran Kas Bulanan - ', nama, ' - ', bulan, ' ', tahun) AS keterangan,
            jumlah,
            NULL AS bukti_file,
            'kas_bulanan' AS sumber_data,
            created_at
        FROM kas_pembayaran
        {$kasWhereSql}

        ORDER BY tanggal DESC, source_id DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $totalPemasukan = 0.0;
    $totalPengeluaran = 0.0;
    $data = [];

    foreach ($rows as $row) {
        $jumlah = (float)($row['jumlah'] ?? 0);
        $rowJenis = (string)($row['jenis'] ?? '');

        if ($rowJenis === 'pemasukan') {
            $totalPemasukan += $jumlah;
        } elseif ($rowJenis === 'pengeluaran') {
            $totalPengeluaran += $jumlah;
        }

        $data[] = [
            'id' => (string)$row['id'],
            'source_table' => (string)$row['source_table'],
            'source_id' => (int)$row['source_id'],
            'tanggal' => (string)$row['tanggal'],
            'tanggal_format' => cashflow_format_date((string)$row['tanggal']),
            'jenis' => $rowJenis,
            'keterangan' => (string)$row['keterangan'],
            'jumlah' => $jumlah,
            'jumlah_format' => kas_format_rupiah($jumlah),
            'bukti_file' => $row['bukti_file'],
            'sumber_data' => (string)$row['sumber_data'],
            'created_at' => $row['created_at'],
        ];
    }

    $saldo = $totalPemasukan - $totalPengeluaran;

    kas_json([
        'success' => true,
        'summary' => [
            'total_pemasukan' => kas_format_rupiah($totalPemasukan),
            'total_pengeluaran' => kas_format_rupiah($totalPengeluaran),
            'saldo' => kas_format_rupiah($saldo),
            'total_pemasukan_raw' => $totalPemasukan,
            'total_pengeluaran_raw' => $totalPengeluaran,
            'saldo_raw' => $saldo,
        ],
        'data' => $data,
    ]);
} catch (Throwable $e) {
    kas_json(['success' => false, 'message' => $e->getMessage()], 500);
}
