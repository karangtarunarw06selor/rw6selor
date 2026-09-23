<?php
declare(strict_types=1);

require_once __DIR__ . '/api/archives_helpers.php';
require_once __DIR__ . '/db.php';

archives_ensure_tables($pdo);

$imports = [
    'lpj' => [
        'path' => '/Users/ardyan.prasetya/Downloads/Lembar Pertanggungjawaban.tsv',
        'table' => 'archive_lpj',
        'date' => 'tanggal',
        'title' => 'keterangan',
        'person' => 'nama ketua pelaksana',
        'url' => 'link file (pdf)',
    ],
    'surat' => [
        'path' => '/Users/ardyan.prasetya/Downloads/Form Input Surat.tsv',
        'table' => 'archive_surat',
        'date' => 'tanggal',
        'title' => 'keterangan',
        'category' => 'kategori',
        'url' => 'upload file surat',
    ],
    'proposal' => [
        'path' => '/Users/ardyan.prasetya/Downloads/Form Input Proposal.tsv',
        'table' => 'archive_proposal',
        'date' => 'tanggal',
        'title' => 'keterangan',
        'category' => 'kategori',
        'url' => 'upload file proposal',
    ],
    'lomba' => [
        'path' => '/Users/ardyan.prasetya/Downloads/Arsip Data Lomba.tsv',
        'table' => 'archive_lomba',
        'date' => 'tanggal',
        'title' => 'nama file',
        'category' => 'kategori',
        'url' => 'link file (pdf)',
    ],
];

function archive_import_header_key(string $value): string
{
    return strtolower(trim($value));
}

function archive_import_get(array $data, string $key): string
{
    return trim((string)($data[archive_import_header_key($key)] ?? ''));
}

$summary = [];

foreach ($imports as $type => $config) {
    $path = $config['path'];
    $inserted = 0;
    $skipped = 0;

    if (!is_file($path)) {
        $summary[$type] = "File TSV tidak ditemukan: {$path}";
        continue;
    }

    $handle = fopen($path, 'r');
    if (!$handle) {
        $summary[$type] = "Gagal membuka TSV: {$path}";
        continue;
    }

    $header = fgetcsv($handle, 0, "\t", '"', "\\");
    if (!$header) {
        fclose($handle);
        $summary[$type] = 'Header TSV tidak ditemukan.';
        continue;
    }

    $header = array_map('archive_import_header_key', $header);
    $table = $config['table'];
    $stmtExists = $pdo->prepare("
        SELECT id
        FROM {$table}
        WHERE archive_date = :archive_date
          AND title = :title
          AND COALESCE(external_url, '') = :external_url
        LIMIT 1
    ");
    $stmtInsert = $pdo->prepare("
        INSERT INTO {$table}
            (archive_date, title, category, person_name, external_url, local_file, source_data, raw_source)
        VALUES
            (:archive_date, :title, :category, :person_name, :external_url, NULL, 'import_tsv', :raw_source)
    ");

    while (($row = fgetcsv($handle, 0, "\t", '"', "\\")) !== false) {
        $data = array_combine($header, array_pad($row, count($header), ''));
        if (!$data) {
            $skipped++;
            continue;
        }

        $archiveDate = archive_mysql_date(archive_import_get($data, $config['date']));
        $title = archive_import_get($data, $config['title']);
        $category = isset($config['category']) ? archive_import_get($data, $config['category']) : '';
        $person = isset($config['person']) ? archive_import_get($data, $config['person']) : '';
        $externalUrl = archive_import_get($data, $config['url']);

        if (!$archiveDate || $title === '') {
            $skipped++;
            continue;
        }

        $stmtExists->execute([
            ':archive_date' => $archiveDate,
            ':title' => $title,
            ':external_url' => $externalUrl,
        ]);

        if ($stmtExists->fetch()) {
            $skipped++;
            continue;
        }

        $stmtInsert->execute([
            ':archive_date' => $archiveDate,
            ':title' => $title,
            ':category' => $category !== '' ? $category : null,
            ':person_name' => $person !== '' ? $person : null,
            ':external_url' => $externalUrl !== '' ? $externalUrl : null,
            ':raw_source' => json_encode($data, JSON_UNESCAPED_UNICODE),
        ]);
        $inserted++;
    }

    fclose($handle);
    $summary[$type] = "Berhasil masuk: {$inserted}, dilewati/gagal/duplikat: {$skipped}";
}

header('Content-Type: text/plain; charset=utf-8');
echo "Import arsip TSV selesai.\n";
foreach ($summary as $type => $line) {
    echo strtoupper($type) . ": {$line}\n";
}
