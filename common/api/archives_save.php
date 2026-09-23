<?php
declare(strict_types=1);

require_once __DIR__ . '/archives_helpers.php';
require_once __DIR__ . '/../db.php';

try {
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        json_response(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
    }

    archives_ensure_tables($pdo);

    $type = strtolower(trim((string)($_POST['type'] ?? '')));
    $config = archive_type_config($type);
    $table = $config['table'];

    $id = (int)($_POST['id'] ?? 0);
    $archiveDate = archive_mysql_date($_POST['archive_date'] ?? $_POST['tanggal'] ?? '');
    $title = trim((string)($_POST['title'] ?? $_POST['keterangan'] ?? ''));
    $category = trim((string)($_POST['category'] ?? $_POST['kategori'] ?? ''));
    $personName = trim((string)($_POST['person_name'] ?? $_POST['nama_ketua'] ?? ''));
    $externalUrl = trim((string)($_POST['external_url'] ?? $_POST['link_file'] ?? ''));

    if (!$archiveDate) {
        throw new RuntimeException('Tanggal arsip wajib diisi dengan format yang valid.');
    }
    if ($title === '') {
        throw new RuntimeException('Nama/keterangan arsip wajib diisi.');
    }
    if ($externalUrl !== '' && !filter_var($externalUrl, FILTER_VALIDATE_URL)) {
        throw new RuntimeException('Link file eksternal tidak valid.');
    }

    $localFile = null;
    if (isset($_FILES['archive_file'])) {
        $localFile = archive_save_upload($_FILES['archive_file'], $type);
    }

    $rawSource = json_encode([
        'post' => $_POST,
        'uploaded_file' => $localFile,
    ], JSON_UNESCAPED_UNICODE);

    if ($id > 0) {
        $setLocalFile = '';
        $params = [
            ':id' => $id,
            ':archive_date' => $archiveDate,
            ':title' => $title,
            ':category' => $category !== '' ? $category : null,
            ':person_name' => $personName !== '' ? $personName : null,
            ':external_url' => $externalUrl !== '' ? $externalUrl : null,
            ':raw_source' => $rawSource,
        ];

        if ($localFile !== null) {
            $setLocalFile = ', local_file = :local_file';
            $params[':local_file'] = $localFile;
        }

        $stmt = $pdo->prepare("
            UPDATE {$table}
            SET
                archive_date = :archive_date,
                title = :title,
                category = :category,
                person_name = :person_name,
                external_url = :external_url,
                source_data = 'input_html',
                raw_source = :raw_source
                {$setLocalFile}
            WHERE id = :id
        ");
        $stmt->execute($params);

        json_response([
            'success' => true,
            'ok' => true,
            'message' => 'Data arsip berhasil diperbarui.',
            'id' => $id,
            'local_file' => $localFile,
        ]);
    }

    $stmt = $pdo->prepare("
        INSERT INTO {$table}
            (archive_date, title, category, person_name, external_url, local_file, source_data, raw_source)
        VALUES
            (:archive_date, :title, :category, :person_name, :external_url, :local_file, 'input_html', :raw_source)
    ");
    $stmt->execute([
        ':archive_date' => $archiveDate,
        ':title' => $title,
        ':category' => $category !== '' ? $category : null,
        ':person_name' => $personName !== '' ? $personName : null,
        ':external_url' => $externalUrl !== '' ? $externalUrl : null,
        ':local_file' => $localFile,
        ':raw_source' => $rawSource,
    ]);

    json_response([
        'success' => true,
        'ok' => true,
        'message' => 'Data arsip berhasil disimpan.',
        'id' => (int)$pdo->lastInsertId(),
        'local_file' => $localFile,
    ]);
} catch (Throwable $e) {
    json_response(['success' => false, 'ok' => false, 'message' => $e->getMessage()], 400);
}
