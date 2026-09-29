<?php

declare(strict_types=1);

require_once __DIR__ . '/api/english_helpers.php';
require_once __DIR__ . '/db.php';

const ENGLISH_SHEET_BASE = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTZdYtu7UisJXOIJIuQm8HzN1j-4aRCBzJ2BqTmRkXvzg42QV4jLVpj0tQkQIZmv5l7BsLl4QtXGJKr/pub?single=true&output=tsv&gid=';
const ENGLISH_SHEET_GIDS = [
    'materi' => '976866681',
    'kamus' => '1105081437',
    'verb' => '2080922932',
    'bank_soal' => '993978169',
    'latihan' => '398816166',
];

function import_json(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function import_clean(string $value): string
{
    $value = preg_replace('/^\xEF\xBB\xBF/', '', $value) ?? '';
    return trim($value);
}

function import_fetch_tsv(string $gid): array
{
    $url = ENGLISH_SHEET_BASE . rawurlencode($gid) . '&cache=' . time();
    $context = stream_context_create([
        'http' => [
            'timeout' => 30,
            'header' => "User-Agent: rw06-english-importer/1.0\r\n",
        ],
    ]);
    $text = @file_get_contents($url, false, $context);
    if ($text === false || trim($text) === '') {
        throw new RuntimeException('Gagal mengambil TSV Google Sheet gid ' . $gid);
    }

    $handle = fopen('php://temp', 'r+');
    fwrite($handle, $text);
    rewind($handle);

    $headers = null;
    $rows = [];
    while (($cols = fgetcsv($handle, 0, "\t", '"', '\\')) !== false) {
        if ($headers === null) {
            $headers = array_map(static fn($header) => import_clean((string)$header), $cols);
            continue;
        }
        $row = [];
        foreach ($headers as $index => $header) {
            if ($header === '') continue;
            $row[$header] = import_clean((string)($cols[$index] ?? ''));
        }
        if (implode('', $row) !== '') {
            $rows[] = $row;
        }
    }
    fclose($handle);

    return $rows;
}

function import_pick(array $row, array $keys, string $default = ''): string
{
    foreach ($keys as $key) {
        if (array_key_exists($key, $row) && trim((string)$row[$key]) !== '') {
            return import_clean((string)$row[$key]);
        }
    }
    return $default;
}

function import_hash(array $values): string
{
    $normalized = array_map(static function ($value): string {
        $value = trim((string)$value);
        return function_exists('mb_strtolower') ? mb_strtolower($value, 'UTF-8') : strtolower($value);
    }, $values);

    return md5(implode('|', $normalized));
}

function import_counted_execute(PDOStatement $stmt, array $params, int &$count): void
{
    $stmt->execute($params);
    $count++;
}

try {
    english_ensure_schema($pdo);

    $summary = [
        'materi' => 0,
        'kamus' => 0,
        'verb' => 0,
        'soal' => 0,
        'sources' => ENGLISH_SHEET_GIDS,
    ];

    $pdo->beginTransaction();

    $materiRows = import_fetch_tsv(ENGLISH_SHEET_GIDS['materi']);
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
            is_active = 1,
            updated_at = CURRENT_TIMESTAMP
    ");
    foreach ($materiRows as $index => $row) {
        $title = import_pick($row, ['Nama_Materi', 'Nama Materi', 'Materi']);
        $tipe = import_pick($row, ['Tipe_Rumus', 'Tipe Rumus']);
        $key = english_slug($tipe !== '' ? $tipe : $title);
        if ($title === '' && $key === '') continue;
        import_counted_execute($stmtMateri, [
            ':materi_key' => $key,
            ':title' => $title !== '' ? $title : $key,
            ':tipe_rumus' => $tipe,
            ':rumus' => import_pick($row, ['Rumus']),
            ':pembahasan' => import_pick($row, ['Pembahasan']),
            ':arti' => import_pick($row, ['Arti']),
            ':link_visual' => import_pick($row, ['Link_Visual', 'Link Visual']),
            ':kata_kunci' => import_pick($row, ['Kata kunci', 'Kata Kunci', 'Keyword']),
            ':penjelasan' => import_pick($row, ['Penjelasan']),
            ':description' => import_pick($row, ['Penjelasan', 'Pembahasan']),
            ':sort_order' => $index + 1,
        ], $summary['materi']);
    }

    $kamusRows = import_fetch_tsv(ENGLISH_SHEET_GIDS['kamus']);
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
        $indonesia = import_pick($row, ['Indonesia']);
        $inggris = import_pick($row, ['Inggris', 'English']);
        if ($indonesia === '' && $inggris === '') continue;
        $abjad = import_pick($row, ['Abjad']);
        $pengucapan = import_pick($row, ['Pengucapan']);
        $kategori = import_pick($row, ['Kategori']);
        $level = english_normalize_level(import_pick($row, ['Level']));
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

    $verbRows = import_fetch_tsv(ENGLISH_SHEET_GIDS['verb']);
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
        $v1 = import_pick($row, ['V1']);
        if ($v1 === '') continue;
        $v2 = import_pick($row, ['V2']);
        $v3 = import_pick($row, ['V3']);
        $vIng = import_pick($row, ['V-ing', 'V Ing', 'Ving']);
        $arti = import_pick($row, ['Arti']);
        $tipe = import_pick($row, ['Tipe']);
        $level = english_normalize_level(import_pick($row, ['Level']));
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

    $exerciseSources = [
        ['gid' => ENGLISH_SHEET_GIDS['bank_soal'], 'default_level' => 'Basic', 'default_kategori' => 'Vocabulary'],
        ['gid' => ENGLISH_SHEET_GIDS['latihan'], 'default_level' => 'Basic', 'default_kategori' => 'Grammar'],
    ];
    $soalOrder = 0;
    foreach ($exerciseSources as $source) {
        foreach (import_fetch_tsv($source['gid']) as $row) {
            $pertanyaan = import_pick($row, ['Pertanyaan']);
            if ($pertanyaan === '') continue;
            $level = english_normalize_level(import_pick($row, ['Level'], $source['default_level']));
            $kategori = import_pick($row, ['Kategori'], $source['default_kategori']);
            $pilihanA = import_pick($row, ['Pilihan A', 'Opsi_A', 'Opsi A']);
            $pilihanB = import_pick($row, ['Pilihan B', 'Opsi_B', 'Opsi B']);
            $pilihanC = import_pick($row, ['Pilihan C', 'Opsi_C', 'Opsi C']);
            $pilihanD = import_pick($row, ['Pilihan D', 'Opsi_D', 'Opsi D']);
            $jawabanRaw = import_pick($row, ['Jawaban benar', 'Jawaban Benar', 'Jawaban']);
            $jawabanBenar = strtoupper(substr($jawabanRaw, 0, 1));
            if (!in_array($jawabanBenar, ['A', 'B', 'C', 'D'], true)) {
                $opsiMap = ['A' => $pilihanA, 'B' => $pilihanB, 'C' => $pilihanC, 'D' => $pilihanD];
                foreach ($opsiMap as $letter => $text) {
                    if ($text !== '' && strcasecmp($text, $jawabanRaw) === 0) {
                        $jawabanBenar = $letter;
                        break;
                    }
                }
            }
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
                ':pembahasan' => import_pick($row, ['Pembahasan']),
                ':media_type' => import_pick($row, ['Media Type']),
                ':media_url' => import_pick($row, ['Media URL', 'Link_Visual', 'Link Visual']),
                ':sort_order' => ++$soalOrder,
            ], $summary['soal']);
        }
    }

    $pdo->commit();
    import_json(['success' => true, 'message' => 'Import English Academy dari Google Sheet selesai.', 'summary' => $summary]);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    import_json(['success' => false, 'message' => $e->getMessage()], 500);
}
