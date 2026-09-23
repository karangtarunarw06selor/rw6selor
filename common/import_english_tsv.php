<?php
declare(strict_types=1);

require_once __DIR__ . '/api/english_helpers.php';
require_once __DIR__ . '/db.php';

function import_json(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function import_clean(string $value): string
{
    return trim(preg_replace('/^\xEF\xBB\xBF/', '', $value) ?? '');
}

function import_tsv(string $path): array
{
    if (!is_file($path)) {
        throw new RuntimeException("File tidak ditemukan: {$path}");
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES);
    if (!$lines) {
        return [];
    }

    $headers = array_map('import_clean', str_getcsv((string)array_shift($lines), "\t", '"', '\\'));
    $rows = [];

    foreach ($lines as $line) {
        if (trim((string)$line) === '') {
            continue;
        }
        $cols = str_getcsv((string)$line, "\t", '"', '\\');
        $row = [];
        foreach ($headers as $index => $header) {
            $row[$header] = import_clean((string)($cols[$index] ?? ''));
        }
        if (implode('', $row) !== '') {
            $rows[] = $row;
        }
    }

    return $rows;
}

function import_counted_execute(PDOStatement $stmt, array $params, int &$count): void
{
    $stmt->execute($params);
    $count++;
}

function import_hash(array $values): string
{
    $normalized = array_map(static function ($value): string {
        $value = trim((string)$value);
        return function_exists('mb_strtolower') ? mb_strtolower($value, 'UTF-8') : strtolower($value);
    }, $values);

    return md5(implode('|', $normalized));
}

try {
    english_ensure_schema($pdo);
    $root = dirname(__DIR__, 2);

    $summary = [
        'materi' => 0,
        'kamus' => 0,
        'verb' => 0,
        'soal' => 0,
    ];

    $materiRows = import_tsv($root . '/Latihan Bahasa Inggris - Bank_Materi.tsv');
    $stmtMateri = $pdo->prepare("
        INSERT INTO english_materi
            (materi_key, title, tipe_rumus, rumus, pembahasan, arti, link_visual, kata_kunci, penjelasan, description, sort_order, is_active)
        VALUES
            (:materi_key, :title, :tipe_rumus, :rumus, :pembahasan, :arti, :link_visual, :kata_kunci, :penjelasan, :description, :sort_order, 1)
        ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            tipe_rumus = VALUES(tipe_rumus),
            rumus = VALUES(rumus),
            pembahasan = VALUES(pembahasan),
            arti = VALUES(arti),
            link_visual = VALUES(link_visual),
            kata_kunci = VALUES(kata_kunci),
            penjelasan = VALUES(penjelasan),
            description = VALUES(description),
            sort_order = VALUES(sort_order),
            updated_at = CURRENT_TIMESTAMP
    ");

    foreach ($materiRows as $index => $row) {
        $title = $row['Nama_Materi'] ?? '';
        $key = english_slug($row['Tipe_Rumus'] ?: $title);
        if ($title === '' && $key === '') {
            continue;
        }
        import_counted_execute($stmtMateri, [
            ':materi_key' => $key,
            ':title' => $title ?: $key,
            ':tipe_rumus' => $row['Tipe_Rumus'] ?? '',
            ':rumus' => $row['Rumus'] ?? '',
            ':pembahasan' => $row['Pembahasan'] ?? '',
            ':arti' => $row['Arti'] ?? '',
            ':link_visual' => $row['Link_Visual'] ?? '',
            ':kata_kunci' => $row['Kata kunci'] ?? '',
            ':penjelasan' => $row['Penjelasan'] ?? '',
            ':description' => $row['Penjelasan'] ?: ($row['Pembahasan'] ?? ''),
            ':sort_order' => $index + 1,
        ], $summary['materi']);
    }

    $kamusRows = import_tsv($root . '/Latihan Bahasa Inggris - Kamus.tsv');
    $stmtKamus = $pdo->prepare("
        INSERT INTO english_vocabulary
            (vocab_hash, abjad, indonesia, inggris, pengucapan, kategori, level, sort_order, is_active)
        VALUES
            (:vocab_hash, :abjad, :indonesia, :inggris, :pengucapan, :kategori, :level, :sort_order, 1)
        ON DUPLICATE KEY UPDATE
            abjad = VALUES(abjad),
            indonesia = VALUES(indonesia),
            inggris = VALUES(inggris),
            pengucapan = VALUES(pengucapan),
            kategori = VALUES(kategori),
            level = VALUES(level),
            sort_order = VALUES(sort_order),
            is_active = 1,
            updated_at = CURRENT_TIMESTAMP
    ");
    foreach ($kamusRows as $index => $row) {
        if (($row['Indonesia'] ?? '') === '' && ($row['Inggris'] ?? '') === '') {
            continue;
        }
        $indonesia = $row['Indonesia'] ?? '';
        $inggris = $row['Inggris'] ?? '';
        $pengucapan = $row['Pengucapan'] ?? '';
        $kategori = $row['Kategori'] ?? '';
        $level = $row['Level'] ?? '';
        $abjad = $row['Abjad'] ?? '';
        $vocabHash = import_hash([$abjad, $indonesia, $inggris, $pengucapan, $kategori, $level]);
        import_counted_execute($stmtKamus, [
            ':vocab_hash' => $vocabHash,
            ':abjad' => $abjad,
            ':indonesia' => $indonesia,
            ':inggris' => $inggris,
            ':pengucapan' => $pengucapan,
            ':kategori' => $kategori,
            ':level' => $level,
            ':sort_order' => $index + 1,
        ], $summary['kamus']);
    }

    $verbRows = import_tsv($root . '/Latihan Bahasa Inggris - Bentuk Verb.tsv');
    $stmtVerb = $pdo->prepare("
        INSERT INTO english_verbs
            (verb_hash, v1, v2, v3, v_ing, arti, tipe, level, sort_order, is_active)
        VALUES
            (:verb_hash, :v1, :v2, :v3, :v_ing, :arti, :tipe, :level, :sort_order, 1)
        ON DUPLICATE KEY UPDATE
            v1 = VALUES(v1),
            v2 = VALUES(v2),
            v3 = VALUES(v3),
            v_ing = VALUES(v_ing),
            arti = VALUES(arti),
            tipe = VALUES(tipe),
            level = VALUES(level),
            sort_order = VALUES(sort_order),
            is_active = 1,
            updated_at = CURRENT_TIMESTAMP
    ");
    foreach ($verbRows as $index => $row) {
        if (($row['V1'] ?? '') === '') {
            continue;
        }
        $v1 = $row['V1'] ?? '';
        $v2 = $row['V2'] ?? '';
        $v3 = $row['V3'] ?? '';
        $vIng = $row['V-ing'] ?? '';
        $arti = $row['Arti'] ?? '';
        $tipe = $row['Tipe'] ?? '';
        $level = $row['Level'] ?? '';
        $verbHash = import_hash([$v1, $v2, $v3, $vIng, $arti, $tipe, $level]);
        import_counted_execute($stmtVerb, [
            ':verb_hash' => $verbHash,
            ':v1' => $v1,
            ':v2' => $v2,
            ':v3' => $v3,
            ':v_ing' => $vIng,
            ':arti' => $arti,
            ':tipe' => $tipe,
            ':level' => $level,
            ':sort_order' => $index + 1,
        ], $summary['verb']);
    }

    $latihanRows = import_tsv($root . '/Latihan Bahasa Inggris - Latihan.tsv');
    $stmtSoal = $pdo->prepare("
        INSERT INTO english_exercises
            (exercise_hash, level, kategori, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, pembahasan, media_type, media_url, sort_order, is_active)
        VALUES
            (:exercise_hash, :level, :kategori, :pertanyaan, :pilihan_a, :pilihan_b, :pilihan_c, :pilihan_d, :jawaban_benar, :pembahasan, :media_type, :media_url, :sort_order, 1)
        ON DUPLICATE KEY UPDATE
            level = VALUES(level),
            kategori = VALUES(kategori),
            pertanyaan = VALUES(pertanyaan),
            pilihan_a = VALUES(pilihan_a),
            pilihan_b = VALUES(pilihan_b),
            pilihan_c = VALUES(pilihan_c),
            pilihan_d = VALUES(pilihan_d),
            jawaban_benar = VALUES(jawaban_benar),
            pembahasan = VALUES(pembahasan),
            media_type = VALUES(media_type),
            media_url = VALUES(media_url),
            sort_order = VALUES(sort_order),
            is_active = 1,
            updated_at = CURRENT_TIMESTAMP
    ");
    foreach ($latihanRows as $index => $row) {
        if (($row['Pertanyaan'] ?? '') === '') {
            continue;
        }
        $level = english_normalize_level($row['Level'] ?? '');
        $kategori = $row['Kategori'] ?? '';
        $pertanyaan = $row['Pertanyaan'] ?? '';
        $pilihanA = $row['Pilihan A'] ?? '';
        $pilihanB = $row['Pilihan B'] ?? '';
        $pilihanC = $row['Pilihan C'] ?? '';
        $pilihanD = $row['Pilihan D'] ?? '';
        $jawabanBenar = strtoupper(substr($row['Jawaban benar'] ?? '', 0, 1));
        $exerciseHash = import_hash([$level, $kategori, $pertanyaan, $pilihanA, $pilihanB, $pilihanC, $pilihanD, $jawabanBenar]);
        import_counted_execute($stmtSoal, [
            ':exercise_hash' => $exerciseHash,
            ':level' => $level,
            ':kategori' => $kategori,
            ':pertanyaan' => $pertanyaan,
            ':pilihan_a' => $pilihanA,
            ':pilihan_b' => $pilihanB,
            ':pilihan_c' => $pilihanC,
            ':pilihan_d' => $pilihanD,
            ':jawaban_benar' => $jawabanBenar,
            ':pembahasan' => $row['Pembahasan'] ?? '',
            ':media_type' => $row['Media Type'] ?? '',
            ':media_url' => $row['Media URL'] ?? '',
            ':sort_order' => $index + 1,
        ], $summary['soal']);
    }

    import_json(['success' => true, 'message' => 'Import English Academy selesai.', 'summary' => $summary]);
} catch (Throwable $e) {
    import_json(['success' => false, 'message' => $e->getMessage()], 500);
}
