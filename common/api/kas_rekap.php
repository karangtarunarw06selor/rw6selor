<?php
require_once __DIR__ . '/kas_helpers.php';
require_once __DIR__ . '/../db.php';

try {
    kas_ensure_tables($pdo);
    $tahun = isset($_GET['tahun']) ? (int)$_GET['tahun'] : (int)date('Y');
    if ($tahun < 2020 || $tahun > 2100) {
        throw new Exception('Tahun tidak valid.');
    }

    $memberParts = kas_member_query_parts($pdo);
    $namaSql = "
        SELECT {$memberParts['select']} AS nama
        FROM members
        WHERE {$memberParts['where']}
        UNION
        SELECT nama
        FROM kas_pembayaran
        WHERE nama IS NOT NULL AND nama <> ''
        ORDER BY nama ASC
    ";
    $namaStmt = $pdo->query($namaSql);
    $namaRows = $namaStmt->fetchAll(PDO::FETCH_ASSOC);

    $data = [];
    foreach ($namaRows as $index => $row) {
        $nama = trim($row['nama']);
        if ($nama === '') continue;

        $item = [
            'no' => count($data) + 1,
            'nama' => $nama,
            'total_angka' => 0,
            'total' => 'Rp 0',
        ];

        foreach (KAS_BULAN_MAP as $labelBulan => $keyBulan) {
            $item[$keyBulan] = [
                'paid' => false,
            ];
        }

        $data[$nama] = $item;
    }

    $kasSql = "
        SELECT nama, bulan, SUM(jumlah) AS total_bulan
        FROM kas_pembayaran
        WHERE tahun = :tahun
        GROUP BY nama, bulan
        ORDER BY nama ASC
    ";
    $kasStmt = $pdo->prepare($kasSql);
    $kasStmt->execute([':tahun' => $tahun]);
    $kasRows = $kasStmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($kasRows as $row) {
        $nama = trim($row['nama'] ?? '');
        $bulanLabel = trim($row['bulan'] ?? '');
        $jumlah = (float)($row['total_bulan'] ?? 0);

        if ($nama === '' || !isset(KAS_BULAN_MAP[$bulanLabel])) continue;

        if (!isset($data[$nama])) {
            $data[$nama] = [
                'no' => count($data) + 1,
                'nama' => $nama,
                'total_angka' => 0,
                'total' => 'Rp 0',
            ];
            foreach (KAS_BULAN_MAP as $labelBulan => $keyBulan) {
                $data[$nama][$keyBulan] = [
                    'paid' => false,
                ];
            }
        }

        $keyBulan = KAS_BULAN_MAP[$bulanLabel];
        $data[$nama][$keyBulan] = [
            'paid' => $jumlah > 0,
            'jumlah' => $jumlah,
            'jumlah_format' => kas_format_rupiah($jumlah),
        ];
        $data[$nama]['total_angka'] += $jumlah;
    }

    $result = array_values($data);
    usort($result, fn($a, $b) => strcasecmp($a['nama'], $b['nama']));

    $grandTotal = 0;
    foreach ($result as $i => &$row) {
        $row['no'] = $i + 1;
        $row['total'] = kas_format_rupiah((float)$row['total_angka']);
        $grandTotal += $row['total_angka'];
        unset($row['total_angka']);
    }
    unset($row);

    echo json_encode([
        'success' => true,
        'tahun' => $tahun,
        'grand_total_angka' => $grandTotal,
        'grand_total' => kas_format_rupiah((float)$grandTotal),
        'data' => $result,
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    kas_json([
        'success' => false,
        'message' => $e->getMessage(),
    ], 500);
}
