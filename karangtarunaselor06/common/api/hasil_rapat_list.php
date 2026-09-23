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

function formatTanggalIndonesia($dateValue) {
    if (!$dateValue) {
        return '';
    }

    return date('d/m/Y', strtotime($dateValue));
}

try {
    $tahun = isset($_GET['tahun']) && $_GET['tahun'] !== '' ? (int) $_GET['tahun'] : null;
    $bulan = isset($_GET['bulan']) && $_GET['bulan'] !== '' ? (int) $_GET['bulan'] : null;
    $status = isset($_GET['status_publikasi']) && $_GET['status_publikasi'] !== '' ? trim($_GET['status_publikasi']) : null;

    $where = [];
    $params = [];

    if ($tahun) {
        $where[] = "YEAR(tanggal_rapat) = :tahun";
        $params[':tahun'] = $tahun;
    }

    if ($bulan) {
        $where[] = "MONTH(tanggal_rapat) = :bulan";
        $params[':bulan'] = $bulan;
    }

    if ($status && in_array($status, ['draft', 'publish'], true)) {
        $where[] = "status_publikasi = :status_publikasi";
        $params[':status_publikasi'] = $status;
    }

    $whereSql = count($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    $sql = "
        SELECT
            id,
            tanggal_rapat,
            agenda,
            hasil_musyawarah,
            lokasi_rapat,
            peserta_rapat,
            catatan,
            lampiran_file,
            status_publikasi,
            sumber_data,
            created_at,
            updated_at
        FROM hasil_rapat
        $whereSql
        ORDER BY tanggal_rapat DESC, id DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $data = array_map(function ($row) {
        return [
            'id' => (int) $row['id'],
            'tanggal_rapat' => $row['tanggal_rapat'],
            'tanggal_rapat_format' => formatTanggalIndonesia($row['tanggal_rapat']),
            'agenda' => $row['agenda'],
            'hasil_musyawarah' => $row['hasil_musyawarah'],
            'lokasi_rapat' => $row['lokasi_rapat'],
            'peserta_rapat' => $row['peserta_rapat'],
            'catatan' => $row['catatan'],
            'lampiran_file' => $row['lampiran_file'],
            'status_publikasi' => $row['status_publikasi'],
            'sumber_data' => $row['sumber_data'],
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at']
        ];
    }, $rows);

    echo json_encode([
        'success' => true,
        'total' => count($data),
        'data' => $data
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
