<?php
declare(strict_types=1);

function english_apply_cors(): void
{
    $allowedOrigins = [
        'http://localhost:8001',
        'http://127.0.0.1:8001',
        'https://rw6selor.org',
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $allowedOrigins, true)) {
        header("Access-Control-Allow-Origin: {$origin}");
        header('Vary: Origin');
    }

    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

english_apply_cors();

require_once __DIR__ . '/kas_helpers.php';

const ENGLISH_TABLES = [
    'english_materi_chapters',
    'english_materi',
    'english_vocabulary',
    'english_verbs',
    'english_exercises',
];

function english_json(array $payload, int $status = 200): void
{
    kas_json($payload, $status);
}

function english_ensure_schema(PDO $pdo): void
{
    $sql = file_get_contents(__DIR__ . '/../../sql/english_academy_schema.sql');
    if ($sql === false) {
        throw new RuntimeException('File schema English Academy tidak ditemukan.');
    }
    $pdo->exec($sql);
    english_ensure_hash_schema($pdo);
    english_ensure_materi_video_schema($pdo);
}

function english_hash(array $values): string
{
    $normalized = array_map(static function ($value): string {
        $value = trim((string)$value);
        return function_exists('mb_strtolower') ? mb_strtolower($value, 'UTF-8') : strtolower($value);
    }, $values);

    return md5(implode('|', $normalized));
}

function english_ensure_materi_video_schema(PDO $pdo): void
{
    if (english_column_exists($pdo, 'english_materi', 'video_type')) {
        $pdo->exec("ALTER TABLE english_materi MODIFY video_type ENUM('none','youtube','embed','upload','url','local') NOT NULL DEFAULT 'none'");
    }
}

function english_index_exists(PDO $pdo, string $table, string $index): bool
{
    $stmt = $pdo->prepare("
        SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.STATISTICS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = :table
          AND INDEX_NAME = :index_name
    ");
    $stmt->execute([':table' => $table, ':index_name' => $index]);
    return (int)$stmt->fetchColumn() > 0;
}

function english_column_exists(PDO $pdo, string $table, string $column): bool
{
    $stmt = $pdo->prepare("
        SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = :table
          AND COLUMN_NAME = :column_name
    ");
    $stmt->execute([':table' => $table, ':column_name' => $column]);
    return (int)$stmt->fetchColumn() > 0;
}

function english_column_is_nullable(PDO $pdo, string $table, string $column): bool
{
    $stmt = $pdo->prepare("
        SELECT IS_NULLABLE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = :table
          AND COLUMN_NAME = :column_name
        LIMIT 1
    ");
    $stmt->execute([':table' => $table, ':column_name' => $column]);
    return strtoupper((string)$stmt->fetchColumn()) === 'YES';
}

function english_drop_index_if_exists(PDO $pdo, string $table, string $index): void
{
    if (english_index_exists($pdo, $table, $index)) {
        $pdo->exec("ALTER TABLE {$table} DROP INDEX {$index}");
    }
}

function english_add_index_if_missing(PDO $pdo, string $table, string $index, string $definition): void
{
    if (!english_index_exists($pdo, $table, $index)) {
        $pdo->exec("ALTER TABLE {$table} ADD {$definition}");
    }
}

function english_add_hash_column_if_missing(PDO $pdo, string $table, string $column): void
{
    if (!english_column_exists($pdo, $table, $column)) {
        $pdo->exec("ALTER TABLE {$table} ADD {$column} CHAR(32) NULL");
    }
}

function english_backfill_hashes(PDO $pdo): void
{
    $stmt = $pdo->query("
        SELECT id, abjad, indonesia, inggris, pengucapan, kategori, level
        FROM english_vocabulary
        WHERE vocab_hash IS NULL OR vocab_hash = ''
    ");
    $update = $pdo->prepare("UPDATE english_vocabulary SET vocab_hash = :hash WHERE id = :id");
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $update->execute([
            ':hash' => english_hash([
                $row['abjad'] ?? '',
                $row['indonesia'] ?? '',
                $row['inggris'] ?? '',
                $row['pengucapan'] ?? '',
                $row['kategori'] ?? '',
                $row['level'] ?? '',
            ]),
            ':id' => (int)$row['id'],
        ]);
    }

    $stmt = $pdo->query("
        SELECT id, v1, v2, v3, v_ing, arti, tipe, level
        FROM english_verbs
        WHERE verb_hash IS NULL OR verb_hash = ''
    ");
    $update = $pdo->prepare("UPDATE english_verbs SET verb_hash = :hash WHERE id = :id");
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $update->execute([
            ':hash' => english_hash([
                $row['v1'] ?? '',
                $row['v2'] ?? '',
                $row['v3'] ?? '',
                $row['v_ing'] ?? '',
                $row['arti'] ?? '',
                $row['tipe'] ?? '',
                $row['level'] ?? '',
            ]),
            ':id' => (int)$row['id'],
        ]);
    }

    $stmt = $pdo->query("
        SELECT id, level, kategori, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar
        FROM english_exercises
        WHERE exercise_hash IS NULL OR exercise_hash = ''
    ");
    $update = $pdo->prepare("UPDATE english_exercises SET exercise_hash = :hash WHERE id = :id");
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $update->execute([
            ':hash' => english_hash([
                $row['level'] ?? '',
                $row['kategori'] ?? '',
                $row['pertanyaan'] ?? '',
                $row['pilihan_a'] ?? '',
                $row['pilihan_b'] ?? '',
                $row['pilihan_c'] ?? '',
                $row['pilihan_d'] ?? '',
                $row['jawaban_benar'] ?? '',
            ]),
            ':id' => (int)$row['id'],
        ]);
    }
}

function english_ensure_hash_schema(PDO $pdo): void
{
    english_drop_index_if_exists($pdo, 'english_vocabulary', 'uq_english_vocab_entry');
    english_drop_index_if_exists($pdo, 'english_verbs', 'uq_english_verb_entry');
    english_drop_index_if_exists($pdo, 'english_exercises', 'uq_english_exercise_entry');
    english_drop_index_if_exists($pdo, 'english_vocabulary', 'idx_english_vocab_filters');
    english_drop_index_if_exists($pdo, 'english_verbs', 'idx_english_verb_filters');
    english_drop_index_if_exists($pdo, 'english_exercises', 'idx_english_exercise_filters');

    english_add_hash_column_if_missing($pdo, 'english_vocabulary', 'vocab_hash');
    english_add_hash_column_if_missing($pdo, 'english_verbs', 'verb_hash');
    english_add_hash_column_if_missing($pdo, 'english_exercises', 'exercise_hash');

    english_backfill_hashes($pdo);

    if (english_column_is_nullable($pdo, 'english_vocabulary', 'vocab_hash')) {
        $pdo->exec("ALTER TABLE english_vocabulary MODIFY vocab_hash CHAR(32) NOT NULL");
    }
    if (english_column_is_nullable($pdo, 'english_verbs', 'verb_hash')) {
        $pdo->exec("ALTER TABLE english_verbs MODIFY verb_hash CHAR(32) NOT NULL");
    }
    if (english_column_is_nullable($pdo, 'english_exercises', 'exercise_hash')) {
        $pdo->exec("ALTER TABLE english_exercises MODIFY exercise_hash CHAR(32) NOT NULL");
    }

    english_add_index_if_missing($pdo, 'english_vocabulary', 'uq_english_vocab_hash', 'UNIQUE KEY uq_english_vocab_hash (vocab_hash)');
    english_add_index_if_missing($pdo, 'english_verbs', 'uq_english_verb_hash', 'UNIQUE KEY uq_english_verb_hash (verb_hash)');
    english_add_index_if_missing($pdo, 'english_exercises', 'uq_english_exercise_hash', 'UNIQUE KEY uq_english_exercise_hash (exercise_hash)');

    english_add_index_if_missing($pdo, 'english_vocabulary', 'idx_english_vocab_abjad', 'KEY idx_english_vocab_abjad (abjad)');
    english_add_index_if_missing($pdo, 'english_vocabulary', 'idx_english_vocab_kategori', 'KEY idx_english_vocab_kategori (kategori)');
    english_add_index_if_missing($pdo, 'english_vocabulary', 'idx_english_vocab_level', 'KEY idx_english_vocab_level (level)');
    english_add_index_if_missing($pdo, 'english_vocabulary', 'idx_english_vocab_active', 'KEY idx_english_vocab_active (is_active)');
    english_add_index_if_missing($pdo, 'english_verbs', 'idx_english_verb_tipe', 'KEY idx_english_verb_tipe (tipe)');
    english_add_index_if_missing($pdo, 'english_verbs', 'idx_english_verb_level', 'KEY idx_english_verb_level (level)');
    english_add_index_if_missing($pdo, 'english_verbs', 'idx_english_verb_active', 'KEY idx_english_verb_active (is_active)');
    english_add_index_if_missing($pdo, 'english_exercises', 'idx_english_exercise_level', 'KEY idx_english_exercise_level (level)');
    english_add_index_if_missing($pdo, 'english_exercises', 'idx_english_exercise_kategori', 'KEY idx_english_exercise_kategori (kategori)');
    english_add_index_if_missing($pdo, 'english_exercises', 'idx_english_exercise_active', 'KEY idx_english_exercise_active (is_active)');
}

function english_int_param(string $key, int $default, int $min = 1, int $max = 500): int
{
    $value = isset($_GET[$key]) ? (int)$_GET[$key] : $default;
    return max($min, min($max, $value));
}

function english_bool_value($value): int
{
    return in_array((string)$value, ['1', 'true', 'on', 'yes', 'aktif'], true) ? 1 : 0;
}

function english_normalize_level(string $level): string
{
    $level = trim($level);
    if (strcasecmp($level, 'advanced') === 0 || strcasecmp($level, 'expert') === 0) {
        return 'Expert';
    }
    if (strcasecmp($level, 'intermediate') === 0) {
        return 'Intermediate';
    }
    return 'Basic';
}

function english_slug(string $value): string
{
    $value = strtolower(trim($value));
    $value = preg_replace('/[^a-z0-9]+/i', '-', $value) ?? '';
    $value = trim($value, '-');
    return $value !== '' ? $value : 'materi-' . substr(sha1((string)microtime(true)), 0, 8);
}

function english_read_lat_inggris_bab_config(): array
{
    $path = __DIR__ . '/../../lat-inggris/menu/materiBabConfig.js';
    $source = file_get_contents($path);
    if ($source === false) {
        throw new RuntimeException('File materiBabConfig.js tidak ditemukan.');
    }

    if (!preg_match('/export\s+const\s+MATERI_BAB_CONFIG\s*=\s*(\[.*?\]);/s', $source, $match)) {
        throw new RuntimeException('Struktur MATERI_BAB_CONFIG tidak bisa dibaca.');
    }

    $config = json_decode($match[1], true);
    if (!is_array($config)) {
        throw new RuntimeException('MATERI_BAB_CONFIG bukan JSON literal valid: ' . json_last_error_msg());
    }

    return $config;
}

function english_sync_lat_inggris(PDO $pdo): void
{
    english_ensure_schema($pdo);
    $config = english_read_lat_inggris_bab_config();
    $chapterStmt = $pdo->prepare("
        INSERT INTO english_materi_chapters (chapter_key, title, icon, level, color, sort_order, is_active)
        VALUES (:chapter_key, :title, :icon, :level, :color, :sort_order, 1)
        ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            icon = VALUES(icon),
            level = VALUES(level),
            color = VALUES(color),
            sort_order = VALUES(sort_order),
            is_active = 1,
            updated_at = CURRENT_TIMESTAMP
    ");
    $chapterIdStmt = $pdo->prepare("SELECT id FROM english_materi_chapters WHERE chapter_key = :chapter_key LIMIT 1");
    $materiStmt = $pdo->prepare("
        INSERT INTO english_materi
            (chapter_id, materi_key, title, description, video_type, video_url, sort_order, is_active)
        VALUES
            (:chapter_id, :materi_key, :title, :description, :video_type, :video_url, :sort_order, 1)
        ON DUPLICATE KEY UPDATE
            chapter_id = VALUES(chapter_id),
            title = VALUES(title),
            video_type = VALUES(video_type),
            video_url = VALUES(video_url),
            sort_order = VALUES(sort_order),
            is_active = 1,
            updated_at = CURRENT_TIMESTAMP
    ");

    $validKeys = [];
    $chapterCount = 0;
    $materiCount = 0;

    foreach ($config as $chapterIndex => $chapter) {
        $chapterKey = (string)($chapter['id'] ?? '');
        if ($chapterKey === '') {
            continue;
        }
        $chapterStmt->execute([
            ':chapter_key' => $chapterKey,
            ':title' => (string)($chapter['title'] ?? $chapterKey),
            ':icon' => (string)($chapter['icon'] ?? 'fa-book-open'),
            ':level' => (string)($chapter['level'] ?? ''),
            ':color' => (string)($chapter['color'] ?? '#2563eb'),
            ':sort_order' => $chapterIndex + 1,
        ]);
        $chapterIdStmt->execute([':chapter_key' => $chapterKey]);
        $chapterId = (int)$chapterIdStmt->fetchColumn();
        $chapterCount++;

        foreach (($chapter['items'] ?? []) as $itemIndex => $item) {
            $materiKey = (string)($item['id'] ?? '');
            if ($materiKey === '') {
                continue;
            }
            $video = is_array($item['video'] ?? null) ? $item['video'] : [];
            $videoType = (string)($video['type'] ?? 'none');
            if (!in_array($videoType, ['none', 'youtube', 'embed', 'upload', 'url', 'local'], true)) {
                $videoType = 'none';
            }
            $videoUrl = (string)($video['url'] ?? '');
            $validKeys[] = $materiKey;
            $materiStmt->execute([
                ':chapter_id' => $chapterId ?: null,
                ':materi_key' => $materiKey,
                ':title' => (string)($item['label'] ?? $materiKey),
                ':description' => '',
                ':video_type' => $videoUrl !== '' ? $videoType : 'none',
                ':video_url' => $videoUrl,
                ':sort_order' => $itemIndex + 1,
            ]);
            $materiCount++;
        }
    }

    if ($validKeys) {
        $params = [];
        $placeholders = [];
        foreach (array_values(array_unique($validKeys)) as $index => $key) {
            $param = ':key' . $index;
            $params[$param] = $key;
            $placeholders[] = $param;
        }
        $stmt = $pdo->prepare('UPDATE english_materi SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE materi_key NOT IN (' . implode(',', $placeholders) . ')');
        $stmt->execute($params);
    }

    english_json([
        'success' => true,
        'chapters' => $chapterCount,
        'materi' => $materiCount,
        'message' => 'Sync lat-inggris selesai',
    ]);
}

function english_decode_json(?string $value, $fallback)
{
    if ($value === null || trim($value) === '') {
        return $fallback;
    }
    $decoded = json_decode($value, true);
    return json_last_error() === JSON_ERROR_NONE ? $decoded : $fallback;
}

function english_read_input(): array
{
    $type = $_SERVER['CONTENT_TYPE'] ?? '';
    if (stripos($type, 'application/json') !== false) {
        $raw = file_get_contents('php://input');
        $json = json_decode((string)$raw, true);
        return is_array($json) ? $json : [];
    }
    return $_POST;
}

function english_require_post(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        english_json(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
    }
}

function english_where_like(array &$where, array &$params, string $q, array $columns): void
{
    if ($q === '') {
        return;
    }
    $parts = [];
    foreach ($columns as $idx => $column) {
        $param = ':q' . $idx;
        $parts[] = "{$column} LIKE {$param}";
        $params[$param] = '%' . $q . '%';
    }
    $where[] = '(' . implode(' OR ', $parts) . ')';
}

function english_table_counts(PDO $pdo): array
{
    $counts = [];
    foreach (ENGLISH_TABLES as $table) {
        $counts[$table] = (int)$pdo->query("SELECT COUNT(*) FROM {$table}")->fetchColumn();
    }
    return $counts;
}

function english_safe_public_url(?string $url): string
{
    $url = trim((string)$url);
    if ($url === '') {
        return '';
    }
    if (preg_match('#^https?://#i', $url) || str_starts_with($url, '/') || str_starts_with($url, 'lat-inggris/')) {
        return $url;
    }
    return '';
}

function english_list_chapters(PDO $pdo): void
{
    english_ensure_schema($pdo);
    $where = [];
    $params = [];
    english_where_like($where, $params, trim((string)($_GET['q'] ?? '')), ['chapter_key', 'title', 'level']);
    if (isset($_GET['is_active']) && $_GET['is_active'] !== '') {
        $where[] = 'is_active = :is_active';
        $params[':is_active'] = (int)$_GET['is_active'];
    }
    $sqlWhere = $where ? 'WHERE ' . implode(' AND ', $where) : '';
    $stmt = $pdo->prepare("SELECT * FROM english_materi_chapters {$sqlWhere} ORDER BY sort_order ASC, id ASC");
    $stmt->execute($params);
    english_json(['success' => true, 'data' => $stmt->fetchAll()]);
}

function english_save_chapter(PDO $pdo): void
{
    english_require_post();
    english_ensure_schema($pdo);
    $in = english_read_input();
    $id = (int)($in['id'] ?? 0);
    $title = trim((string)($in['title'] ?? ''));
    if ($title === '') {
        throw new InvalidArgumentException('Judul BAB wajib diisi.');
    }
    $data = [
        ':chapter_key' => english_slug((string)($in['chapter_key'] ?? $title)),
        ':title' => $title,
        ':icon' => trim((string)($in['icon'] ?? 'fa-book-open')),
        ':level' => trim((string)($in['level'] ?? '')),
        ':color' => trim((string)($in['color'] ?? '#2563eb')),
        ':sort_order' => (int)($in['sort_order'] ?? 0),
        ':is_active' => english_bool_value($in['is_active'] ?? 1),
    ];
    if ($id > 0) {
        $data[':id'] = $id;
        $sql = "UPDATE english_materi_chapters SET chapter_key=:chapter_key,title=:title,icon=:icon,level=:level,color=:color,sort_order=:sort_order,is_active=:is_active,updated_at=CURRENT_TIMESTAMP WHERE id=:id";
    } else {
        $sql = "INSERT INTO english_materi_chapters (chapter_key,title,icon,level,color,sort_order,is_active) VALUES (:chapter_key,:title,:icon,:level,:color,:sort_order,:is_active)";
    }
    $pdo->prepare($sql)->execute($data);
    english_json(['success' => true, 'message' => 'BAB berhasil disimpan.']);
}

function english_delete_row(PDO $pdo, string $table): void
{
    english_require_post();
    english_ensure_schema($pdo);
    $in = english_read_input();
    $id = (int)($in['id'] ?? $_GET['id'] ?? 0);
    if ($id <= 0) {
        throw new InvalidArgumentException('ID tidak valid.');
    }
    $stmt = $pdo->prepare("UPDATE {$table} SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = :id");
    $stmt->execute([':id' => $id]);
    english_json(['success' => true, 'message' => 'Data berhasil dinonaktifkan.']);
}

function english_list_materi(PDO $pdo, bool $public = false): void
{
    english_ensure_schema($pdo);
    $where = [];
    $params = [];
    if ($public) {
        $where[] = 'm.is_active = 1';
    } elseif (isset($_GET['is_active']) && $_GET['is_active'] !== '') {
        $where[] = 'm.is_active = :is_active';
        $params[':is_active'] = (int)$_GET['is_active'];
    }
    english_where_like($where, $params, trim((string)($_GET['q'] ?? '')), ['m.materi_key', 'm.title', 'm.tipe_rumus', 'm.kata_kunci', 'm.penjelasan']);
    if (isset($_GET['chapter_id']) && $_GET['chapter_id'] !== '') {
        $where[] = 'm.chapter_id = :chapter_id';
        $params[':chapter_id'] = (int)$_GET['chapter_id'];
    }
    $page = english_int_param('page', 1);
    $limit = english_int_param('limit', $public ? 500 : 100);
    $offset = ($page - 1) * $limit;
    $sqlWhere = $where ? 'WHERE ' . implode(' AND ', $where) : '';
    $stmt = $pdo->prepare("
        SELECT m.*, c.chapter_key, c.title AS chapter_title, c.icon AS chapter_icon, c.level AS chapter_level, c.color AS chapter_color
        FROM english_materi m
        LEFT JOIN english_materi_chapters c ON c.id = m.chapter_id
        {$sqlWhere}
        ORDER BY COALESCE(c.sort_order, 9999), m.sort_order, m.id
        LIMIT {$limit} OFFSET {$offset}
    ");
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
    foreach ($rows as &$row) {
        $row['notes'] = english_decode_json($row['notes_json'] ?? null, []);
        $row['patterns'] = english_decode_json($row['patterns_json'] ?? null, []);
        $row['quiz'] = english_decode_json($row['quiz_json'] ?? null, []);
        $row['video_url'] = english_safe_public_url($row['video_url'] ?? '');
    }
    english_json(['success' => true, 'page' => $page, 'limit' => $limit, 'data' => $rows]);
}

function english_get_materi(PDO $pdo): void
{
    english_ensure_schema($pdo);
    $id = (int)($_GET['id'] ?? 0);
    $stmt = $pdo->prepare("SELECT * FROM english_materi WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $row = $stmt->fetch();
    if (!$row) {
        english_json(['success' => false, 'message' => 'Materi tidak ditemukan.'], 404);
    }
    english_json(['success' => true, 'data' => $row]);
}

function english_save_materi(PDO $pdo): void
{
    english_require_post();
    english_ensure_schema($pdo);
    $in = english_read_input();
    $id = (int)($in['id'] ?? 0);
    $title = trim((string)($in['title'] ?? ''));
    if ($title === '') {
        throw new InvalidArgumentException('Judul materi wajib diisi.');
    }
    $videoType = (string)($in['video_type'] ?? 'none');
    if (!in_array($videoType, ['none', 'youtube', 'embed', 'upload', 'url', 'local'], true)) {
        $videoType = 'none';
    }
    $data = [
        ':chapter_id' => ($in['chapter_id'] ?? '') === '' ? null : (int)$in['chapter_id'],
        ':materi_key' => english_slug((string)($in['materi_key'] ?? $title)),
        ':title' => $title,
        ':tipe_rumus' => trim((string)($in['tipe_rumus'] ?? '')),
        ':rumus' => (string)($in['rumus'] ?? ''),
        ':pembahasan' => (string)($in['pembahasan'] ?? ''),
        ':arti' => (string)($in['arti'] ?? ''),
        ':link_visual' => (string)($in['link_visual'] ?? ''),
        ':kata_kunci' => (string)($in['kata_kunci'] ?? ''),
        ':penjelasan' => (string)($in['penjelasan'] ?? ''),
        ':description' => (string)($in['description'] ?? ''),
        ':notes_json' => (string)($in['notes_json'] ?? ''),
        ':patterns_json' => (string)($in['patterns_json'] ?? ''),
        ':quiz_json' => (string)($in['quiz_json'] ?? ''),
        ':video_type' => $videoType,
        ':video_url' => (string)($in['video_url'] ?? ''),
        ':sort_order' => (int)($in['sort_order'] ?? 0),
        ':is_active' => english_bool_value($in['is_active'] ?? 1),
    ];
    if ($id > 0) {
        $data[':id'] = $id;
        $sql = "UPDATE english_materi SET chapter_id=:chapter_id,materi_key=:materi_key,title=:title,tipe_rumus=:tipe_rumus,rumus=:rumus,pembahasan=:pembahasan,arti=:arti,link_visual=:link_visual,kata_kunci=:kata_kunci,penjelasan=:penjelasan,description=:description,notes_json=:notes_json,patterns_json=:patterns_json,quiz_json=:quiz_json,video_type=:video_type,video_url=:video_url,sort_order=:sort_order,is_active=:is_active,updated_at=CURRENT_TIMESTAMP WHERE id=:id";
    } else {
        $sql = "INSERT INTO english_materi (chapter_id,materi_key,title,tipe_rumus,rumus,pembahasan,arti,link_visual,kata_kunci,penjelasan,description,notes_json,patterns_json,quiz_json,video_type,video_url,sort_order,is_active) VALUES (:chapter_id,:materi_key,:title,:tipe_rumus,:rumus,:pembahasan,:arti,:link_visual,:kata_kunci,:penjelasan,:description,:notes_json,:patterns_json,:quiz_json,:video_type,:video_url,:sort_order,:is_active)";
    }
    $pdo->prepare($sql)->execute($data);
    english_json(['success' => true, 'message' => 'Materi berhasil disimpan.']);
}

function english_list_vocabulary(PDO $pdo, bool $public = false): void
{
    english_ensure_schema($pdo);
    $where = $public ? ['is_active = 1'] : [];
    $params = [];
    if (!$public && isset($_GET['is_active']) && $_GET['is_active'] !== '') {
        $where[] = 'is_active = :is_active';
        $params[':is_active'] = (int)$_GET['is_active'];
    }
    english_where_like($where, $params, trim((string)($_GET['q'] ?? '')), ['abjad', 'indonesia', 'inggris', 'pengucapan', 'kategori', 'level']);
    foreach (['level', 'kategori', 'abjad'] as $filter) {
        if (isset($_GET[$filter]) && $_GET[$filter] !== '') {
            $where[] = "{$filter} = :{$filter}";
            $params[":{$filter}"] = (string)$_GET[$filter];
        }
    }
    $sqlWhere = $where ? 'WHERE ' . implode(' AND ', $where) : '';
    $stmt = $pdo->prepare("SELECT * FROM english_vocabulary {$sqlWhere} ORDER BY sort_order, abjad, indonesia, id LIMIT 1000");
    $stmt->execute($params);
    english_json(['success' => true, 'data' => $stmt->fetchAll()]);
}

function english_save_vocabulary(PDO $pdo): void
{
    english_require_post();
    english_ensure_schema($pdo);
    $in = english_read_input();
    $id = (int)($in['id'] ?? 0);
    $data = [
        ':abjad' => trim((string)($in['abjad'] ?? '')),
        ':indonesia' => trim((string)($in['indonesia'] ?? '')),
        ':inggris' => trim((string)($in['inggris'] ?? '')),
        ':pengucapan' => trim((string)($in['pengucapan'] ?? '')),
        ':kategori' => trim((string)($in['kategori'] ?? '')),
        ':level' => trim((string)($in['level'] ?? '')),
        ':sort_order' => (int)($in['sort_order'] ?? 0),
        ':is_active' => english_bool_value($in['is_active'] ?? 1),
    ];
    if ($data[':indonesia'] === '' && $data[':inggris'] === '') {
        throw new InvalidArgumentException('Indonesia atau Inggris wajib diisi.');
    }
    $data[':vocab_hash'] = english_hash([
        $data[':abjad'],
        $data[':indonesia'],
        $data[':inggris'],
        $data[':pengucapan'],
        $data[':kategori'],
        $data[':level'],
    ]);
    if ($id > 0) {
        $data[':id'] = $id;
        $sql = "UPDATE english_vocabulary SET abjad=:abjad,indonesia=:indonesia,inggris=:inggris,pengucapan=:pengucapan,kategori=:kategori,level=:level,vocab_hash=:vocab_hash,sort_order=:sort_order,is_active=:is_active,updated_at=CURRENT_TIMESTAMP WHERE id=:id";
    } else {
        $sql = "INSERT INTO english_vocabulary (abjad,indonesia,inggris,pengucapan,kategori,level,vocab_hash,sort_order,is_active) VALUES (:abjad,:indonesia,:inggris,:pengucapan,:kategori,:level,:vocab_hash,:sort_order,:is_active)";
    }
    $pdo->prepare($sql)->execute($data);
    english_json(['success' => true, 'message' => 'Kamus berhasil disimpan.']);
}

function english_list_verbs(PDO $pdo, bool $public = false): void
{
    english_ensure_schema($pdo);
    $where = $public ? ['is_active = 1'] : [];
    $params = [];
    if (!$public && isset($_GET['is_active']) && $_GET['is_active'] !== '') {
        $where[] = 'is_active = :is_active';
        $params[':is_active'] = (int)$_GET['is_active'];
    }
    english_where_like($where, $params, trim((string)($_GET['q'] ?? '')), ['v1', 'v2', 'v3', 'v_ing', 'arti', 'tipe', 'level']);
    foreach (['level', 'tipe'] as $filter) {
        if (isset($_GET[$filter]) && $_GET[$filter] !== '') {
            $where[] = "{$filter} = :{$filter}";
            $params[":{$filter}"] = (string)$_GET[$filter];
        }
    }
    $sqlWhere = $where ? 'WHERE ' . implode(' AND ', $where) : '';
    $stmt = $pdo->prepare("SELECT * FROM english_verbs {$sqlWhere} ORDER BY sort_order, v1, id LIMIT 1000");
    $stmt->execute($params);
    english_json(['success' => true, 'data' => $stmt->fetchAll()]);
}

function english_save_verb(PDO $pdo): void
{
    english_require_post();
    english_ensure_schema($pdo);
    $in = english_read_input();
    $id = (int)($in['id'] ?? 0);
    $data = [
        ':v1' => trim((string)($in['v1'] ?? '')),
        ':v2' => trim((string)($in['v2'] ?? '')),
        ':v3' => trim((string)($in['v3'] ?? '')),
        ':v_ing' => trim((string)($in['v_ing'] ?? '')),
        ':arti' => trim((string)($in['arti'] ?? '')),
        ':tipe' => trim((string)($in['tipe'] ?? '')),
        ':level' => trim((string)($in['level'] ?? '')),
        ':sort_order' => (int)($in['sort_order'] ?? 0),
        ':is_active' => english_bool_value($in['is_active'] ?? 1),
    ];
    if ($data[':v1'] === '') {
        throw new InvalidArgumentException('V1 wajib diisi.');
    }
    $data[':verb_hash'] = english_hash([
        $data[':v1'],
        $data[':v2'],
        $data[':v3'],
        $data[':v_ing'],
        $data[':arti'],
        $data[':tipe'],
        $data[':level'],
    ]);
    if ($id > 0) {
        $data[':id'] = $id;
        $sql = "UPDATE english_verbs SET v1=:v1,v2=:v2,v3=:v3,v_ing=:v_ing,arti=:arti,tipe=:tipe,level=:level,verb_hash=:verb_hash,sort_order=:sort_order,is_active=:is_active,updated_at=CURRENT_TIMESTAMP WHERE id=:id";
    } else {
        $sql = "INSERT INTO english_verbs (v1,v2,v3,v_ing,arti,tipe,level,verb_hash,sort_order,is_active) VALUES (:v1,:v2,:v3,:v_ing,:arti,:tipe,:level,:verb_hash,:sort_order,:is_active)";
    }
    $pdo->prepare($sql)->execute($data);
    english_json(['success' => true, 'message' => 'Verb berhasil disimpan.']);
}

function english_list_exercises(PDO $pdo, bool $public = false): void
{
    english_ensure_schema($pdo);
    $where = $public ? ['is_active = 1'] : [];
    $params = [];
    if (!$public && isset($_GET['is_active']) && $_GET['is_active'] !== '') {
        $where[] = 'is_active = :is_active';
        $params[':is_active'] = (int)$_GET['is_active'];
    }
    english_where_like($where, $params, trim((string)($_GET['q'] ?? '')), ['kategori', 'pertanyaan', 'pilihan_a', 'pilihan_b', 'pilihan_c', 'pilihan_d', 'pembahasan']);
    foreach (['level', 'kategori'] as $filter) {
        if (isset($_GET[$filter]) && $_GET[$filter] !== '') {
            $where[] = "{$filter} = :{$filter}";
            $params[":{$filter}"] = $filter === 'level' ? english_normalize_level((string)$_GET[$filter]) : (string)$_GET[$filter];
        }
    }
    $sqlWhere = $where ? 'WHERE ' . implode(' AND ', $where) : '';
    $stmt = $pdo->prepare("SELECT * FROM english_exercises {$sqlWhere} ORDER BY FIELD(level,'Basic','Intermediate','Expert','Advanced'), sort_order, id LIMIT 1000");
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
    foreach ($rows as &$row) {
        $row['level'] = english_normalize_level((string)$row['level']);
    }
    english_json(['success' => true, 'data' => $rows]);
}

function english_save_exercise(PDO $pdo): void
{
    english_require_post();
    english_ensure_schema($pdo);
    $in = english_read_input();
    $id = (int)($in['id'] ?? 0);
    $jawaban = strtoupper(substr(trim((string)($in['jawaban_benar'] ?? '')), 0, 1));
    if (!in_array($jawaban, ['A', 'B', 'C', 'D'], true)) {
        throw new InvalidArgumentException('Jawaban benar harus A, B, C, atau D.');
    }
    $data = [
        ':level' => english_normalize_level((string)($in['level'] ?? 'Basic')),
        ':kategori' => trim((string)($in['kategori'] ?? '')),
        ':pertanyaan' => trim((string)($in['pertanyaan'] ?? '')),
        ':pilihan_a' => (string)($in['pilihan_a'] ?? ''),
        ':pilihan_b' => (string)($in['pilihan_b'] ?? ''),
        ':pilihan_c' => (string)($in['pilihan_c'] ?? ''),
        ':pilihan_d' => (string)($in['pilihan_d'] ?? ''),
        ':jawaban_benar' => $jawaban,
        ':pembahasan' => (string)($in['pembahasan'] ?? ''),
        ':media_type' => trim((string)($in['media_type'] ?? '')),
        ':media_url' => (string)($in['media_url'] ?? ''),
        ':sort_order' => (int)($in['sort_order'] ?? 0),
        ':is_active' => english_bool_value($in['is_active'] ?? 1),
    ];
    if ($data[':pertanyaan'] === '') {
        throw new InvalidArgumentException('Pertanyaan wajib diisi.');
    }
    $data[':exercise_hash'] = english_hash([
        $data[':level'],
        $data[':kategori'],
        $data[':pertanyaan'],
        $data[':pilihan_a'],
        $data[':pilihan_b'],
        $data[':pilihan_c'],
        $data[':pilihan_d'],
        $data[':jawaban_benar'],
    ]);
    if ($id > 0) {
        $data[':id'] = $id;
        $sql = "UPDATE english_exercises SET level=:level,kategori=:kategori,pertanyaan=:pertanyaan,pilihan_a=:pilihan_a,pilihan_b=:pilihan_b,pilihan_c=:pilihan_c,pilihan_d=:pilihan_d,jawaban_benar=:jawaban_benar,pembahasan=:pembahasan,media_type=:media_type,media_url=:media_url,exercise_hash=:exercise_hash,sort_order=:sort_order,is_active=:is_active,updated_at=CURRENT_TIMESTAMP WHERE id=:id";
    } else {
        $sql = "INSERT INTO english_exercises (level,kategori,pertanyaan,pilihan_a,pilihan_b,pilihan_c,pilihan_d,jawaban_benar,pembahasan,media_type,media_url,exercise_hash,sort_order,is_active) VALUES (:level,:kategori,:pertanyaan,:pilihan_a,:pilihan_b,:pilihan_c,:pilihan_d,:jawaban_benar,:pembahasan,:media_type,:media_url,:exercise_hash,:sort_order,:is_active)";
    }
    $pdo->prepare($sql)->execute($data);
    english_json(['success' => true, 'message' => 'Soal berhasil disimpan.']);
}

function english_export_all(PDO $pdo): void
{
    english_ensure_schema($pdo);
    $payload = ['success' => true, 'exported_at' => date('c'), 'data' => []];
    foreach (ENGLISH_TABLES as $table) {
        $payload['data'][$table] = $pdo->query("SELECT * FROM {$table} ORDER BY id")->fetchAll();
    }
    english_json($payload);
}

function english_backup_sql(PDO $pdo): void
{
    english_ensure_schema($pdo);
    $chunks = ['-- English Academy lightweight backup ' . date('c')];
    foreach (ENGLISH_TABLES as $table) {
        $rows = $pdo->query("SELECT * FROM {$table} ORDER BY id")->fetchAll(PDO::FETCH_ASSOC);
        foreach ($rows as $row) {
            $cols = array_map(fn($col) => "`{$col}`", array_keys($row));
            $vals = array_map(fn($val) => $val === null ? 'NULL' : $pdo->quote((string)$val), array_values($row));
            $chunks[] = "REPLACE INTO `{$table}` (" . implode(',', $cols) . ") VALUES (" . implode(',', $vals) . ");";
        }
    }
    english_json(['success' => true, 'sql' => implode("\n", $chunks)]);
}
