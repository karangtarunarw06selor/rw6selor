<?php
declare(strict_types=1);

require_once __DIR__ . '/warga-chat.php';
require_once __DIR__ . '/db.php';

handle_cors_preflight();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['ok' => false, 'message' => 'Method tidak diizinkan.'], 405);
}

$search = trim((string)($_GET['search'] ?? ''));
$memberFilter = trim((string)($_GET['member_filter'] ?? ''));

try {
    $pdo = db();
    ensure_chat_tables($pdo);

    $where = ['u.is_archived = 0'];
    $params = [];

    if ($search !== '') {
        $where[] = '(u.display_name LIKE :search OR u.device_id LIKE :search2)';
        $params[':search'] = '%' . $search . '%';
        $params[':search2'] = '%' . $search . '%';
    }

    if ($memberFilter === 'member') {
        $where[] = 'u.is_member = 1';
    } elseif ($memberFilter === 'guest') {
        $where[] = 'u.is_member = 0';
    }

    $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';

    // Hitung jumlah pesan per user
    $stmt = $pdo->prepare("
        SELECT
            u.id,
            u.device_id,
            u.display_name,
            u.is_member,
            u.member_id,
            u.created_at,
            u.updated_at,
            m.full_name AS member_full_name,
            m.member_code,
            COUNT(c.id) AS message_count,
            MAX(c.created_at) AS last_message_at
        FROM warga_chat_users u
        LEFT JOIN warga_chats c ON c.user_id = u.id
        LEFT JOIN members m ON m.id = u.member_id
        {$whereClause}
        GROUP BY u.id
        ORDER BY last_message_at DESC, u.display_name ASC
    ");
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    json_response(['ok' => true, 'data' => $rows]);
} catch (Throwable $error) {
    json_response([
        'ok' => false,
        'message' => $error->getMessage(),
    ], 500);
}
