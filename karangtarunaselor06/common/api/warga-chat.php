<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

function chat_input(): array
{
    $input = json_input();
    if (!$input) {
        $input = $_POST;
    }
    return is_array($input) ? $input : [];
}

function clean_chat_string(array $input, string $field, int $maxLength): string
{
    $value = trim((string)($input[$field] ?? ''));
    if ($value === '') {
        json_response(['ok' => false, 'message' => "Field {$field} wajib diisi."], 422);
    }
    $length = function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
    if ($length > $maxLength) {
        json_response(['ok' => false, 'message' => "Field {$field} maksimal {$maxLength} karakter."], 422);
    }
    return $value;
}

function ensure_chat_tables(PDO $pdo): void
{
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS warga_chat_users (
          id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          device_id VARCHAR(120) NOT NULL UNIQUE,
          display_name VARCHAR(120) NOT NULL,
          is_member TINYINT(1) DEFAULT 0,
          member_id INT UNSIGNED NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          CONSTRAINT fk_warga_chat_members FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS warga_chats (
          id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          user_id INT UNSIGNED NOT NULL,
          message TEXT NOT NULL,
          chat_date DATE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          INDEX(user_id),
          INDEX(chat_date),
          CONSTRAINT fk_warga_chats_user
            FOREIGN KEY (user_id) REFERENCES warga_chat_users(id)
            ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    $stmt = $pdo->prepare("
        SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = :table_name
          AND COLUMN_NAME = :column_name
    ");

    $stmt->execute(['table_name' => 'warga_chats', 'column_name' => 'chat_date']);
    if ((int)$stmt->fetchColumn() === 0) {
        $pdo->exec("ALTER TABLE warga_chats ADD COLUMN chat_date DATE NULL AFTER message");
        $pdo->exec("UPDATE warga_chats SET chat_date = DATE(created_at) WHERE chat_date IS NULL");
        $pdo->exec("ALTER TABLE warga_chats MODIFY chat_date DATE NOT NULL");
        $pdo->exec("ALTER TABLE warga_chats ADD INDEX chat_date (chat_date)");
    }

    $stmt->execute(['table_name' => 'warga_chat_users', 'column_name' => 'is_member']);
    if ((int)$stmt->fetchColumn() === 0) {
        $pdo->exec("ALTER TABLE warga_chat_users ADD COLUMN is_member TINYINT(1) DEFAULT 0");
        $pdo->exec("ALTER TABLE warga_chat_users ADD COLUMN member_id INT UNSIGNED NULL");
        $pdo->exec("ALTER TABLE warga_chat_users ADD CONSTRAINT fk_warga_chat_members FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL");
    }

    $stmt->execute(['table_name' => 'warga_chat_users', 'column_name' => 'is_archived']);
    if ((int)$stmt->fetchColumn() === 0) {
        $pdo->exec("ALTER TABLE warga_chat_users ADD COLUMN is_archived TINYINT(1) DEFAULT 0 AFTER member_id");
    }

    $stmt->execute(['table_name' => 'warga_chats', 'column_name' => 'is_edited']);
    if ((int)$stmt->fetchColumn() === 0) {
        $pdo->exec("ALTER TABLE warga_chats ADD COLUMN is_edited TINYINT(1) DEFAULT 0 AFTER message");
    }

    $pdo->exec("ALTER TABLE warga_chats MODIFY created_at DATETIME DEFAULT CURRENT_TIMESTAMP");
}

function fetch_user_by_device(PDO $pdo, string $deviceId): ?array
{
    $stmt = $pdo->prepare("
        SELECT id, device_id, display_name, is_member, member_id, is_archived, created_at, updated_at
        FROM warga_chat_users
        WHERE device_id = :device_id
        LIMIT 1
    ");
    $stmt->execute(['device_id' => $deviceId]);
    $user = $stmt->fetch();
    return $user ?: null;
}

function find_member_by_chat_name(PDO $pdo, string $displayName): ?array
{
    $normalized = strtolower(preg_replace('/\s+/', ' ', trim($displayName)));
    if ($normalized === '') {
        return null;
    }

    $sql = "
        SELECT id, full_name, member_code, email, whatsapp, current_status
        FROM members
        WHERE is_active = 1
        ORDER BY full_name ASC
    ";

    $stmt = $pdo->query($sql);
    while ($member = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $memberNormalized = strtolower(preg_replace('/\s+/', ' ', trim((string)$member['full_name'])));
        if ($memberNormalized === $normalized) {
            return $member;
        }
    }

    return null;
}

// ---- Routing: hanya jalan jika file ini dipanggil langsung ----
if (basename(__FILE__) === basename($_SERVER['SCRIPT_FILENAME'])) {
    handle_warga_chat_routing();
}

function handle_warga_chat_routing(): void
{
    try {
        $pdo = db();
        ensure_chat_tables($pdo);

        $input = $_SERVER['REQUEST_METHOD'] === 'GET' ? $_GET : chat_input();
        $action = (string)($input['action'] ?? '');

        if ($action === 'register') {
            $deviceId = clean_chat_string($input, 'device_id', 120);
            $displayName = clean_chat_string($input, 'display_name', 120);

            $user = fetch_user_by_device($pdo, $deviceId);
            if (!$user) {
                $resolvedName = $displayName;
                $member = find_member_by_chat_name($pdo, $resolvedName);
                $isMember = $member ? 1 : 0;
                $memberId = $member ? (int)$member['id'] : null;

                $stmt = $pdo->prepare("
                    INSERT INTO warga_chat_users (device_id, display_name, is_member, member_id, is_archived)
                    VALUES (:device_id, :display_name, :is_member, :member_id, 0)
                ");
                $stmt->execute([
                    'device_id' => $deviceId,
                    'display_name' => $resolvedName,
                    'is_member' => $isMember,
                    'member_id' => $memberId,
                ]);
            } else {
                $resolvedName = trim((string)($user['display_name'] ?? ''));
                if ($resolvedName === '') {
                    $resolvedName = $displayName;
                }

                $member = find_member_by_chat_name($pdo, $resolvedName);
                $isMember = $member ? 1 : 0;
                $memberId = $member ? (int)$member['id'] : null;

                $stmt = $pdo->prepare("
                    UPDATE warga_chat_users
                    SET display_name = :display_name,
                        is_member = :is_member,
                        member_id = :member_id
                        , is_archived = 0
                    WHERE device_id = :device_id
                ");
                $stmt->execute([
                    'display_name' => $resolvedName,
                    'is_member' => $isMember,
                    'member_id' => $memberId,
                    'device_id' => $deviceId,
                ]);
            }

            $user = fetch_user_by_device($pdo, $deviceId);
            // Ensure is_member is int (PDO returns string), not truthy in JS
            $user['is_member'] = (int)$user['is_member'];
            $user['member_id'] = $user['member_id'] ? (int)$user['member_id'] : null;
            $user['id'] = (int)$user['id'];

            json_response([
                'ok' => true,
                'data' => $user,
                'is_member' => (bool)$user['is_member'],
                'member' => $member,
            ]);
        }

        if ($action === 'send') {
            $deviceId = clean_chat_string($input, 'device_id', 120);
            $message = clean_chat_string($input, 'message', 1000);
            $user = fetch_user_by_device($pdo, $deviceId);

            if (!$user) {
                json_response(['ok' => false, 'message' => 'Device belum terdaftar.'], 403);
            }

            $stmt = $pdo->prepare("
                INSERT INTO warga_chats (user_id, message, chat_date, created_at)
                VALUES (:user_id, :message, CURDATE(), NOW())
            ");
            $stmt->execute([
                'user_id' => (int)$user['id'],
                'message' => $message,
            ]);

            json_response([
                'ok' => true,
                'data' => [
                    'id' => (int)$pdo->lastInsertId(),
                ],
            ], 201);
        }

        if ($action === 'admin_delete_message') {
            $messageId = (int)($input['message_id'] ?? 0);
            $stmt = $pdo->prepare("SELECT id FROM warga_chats WHERE id = :id LIMIT 1");
            $stmt->execute(['id' => $messageId]);
            if (!$stmt->fetch()) {
                json_response(['ok' => false, 'message' => 'Pesan tidak ditemukan.'], 404);
            }
            $stmt = $pdo->prepare("DELETE FROM warga_chats WHERE id = :id");
            $stmt->execute(['id' => $messageId]);
            json_response(['ok' => true, 'message' => 'Pesan berhasil dihapus.']);
        }

        if ($action === 'admin_edit_message') {
            $messageId = (int)($input['message_id'] ?? 0);
            $newMessage = clean_chat_string($input, 'message', 1000);
            $stmt = $pdo->prepare("SELECT id FROM warga_chats WHERE id = :id LIMIT 1");
            $stmt->execute(['id' => $messageId]);
            if (!$stmt->fetch()) {
                json_response(['ok' => false, 'message' => 'Pesan tidak ditemukan.'], 404);
            }
            $stmt = $pdo->prepare("UPDATE warga_chats SET message = :message, is_edited = 1 WHERE id = :id");
            $stmt->execute(['message' => $newMessage, 'id' => $messageId]);
            json_response(['ok' => true, 'message' => 'Pesan berhasil diperbarui.']);
        }

        if ($action === 'all_messages') {
            $limit = (int)($input['limit'] ?? 100);
            if ($limit < 1 || $limit > 200) $limit = 100;
            $stmt = $pdo->prepare("
                SELECT c.id, c.message, c.is_edited, c.created_at,
                       u.display_name, u.device_id, u.is_member
                FROM warga_chats c
                INNER JOIN warga_chat_users u ON u.id = c.user_id
                ORDER BY c.id DESC
                LIMIT :limit
            ");
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();
            $rows = array_reverse($stmt->fetchAll());
            foreach ($rows as &$row) {
                $row['is_member'] = (int)$row['is_member'];
                $row['id'] = (int)$row['id'];
            }
            unset($row);
            json_response(['ok' => true, 'data' => $rows]);
        }

        if ($action === 'edit') {
            $deviceId = clean_chat_string($input, 'device_id', 120);
            $messageId = (int)($input['message_id'] ?? 0);
            $newMessage = clean_chat_string($input, 'message', 1000);
            $user = fetch_user_by_device($pdo, $deviceId);

            if (!$user) {
                json_response(['ok' => false, 'message' => 'Device belum terdaftar.'], 403);
            }

            // Only allow editing own messages
            $stmt = $pdo->prepare("
                SELECT id, user_id FROM warga_chats WHERE id = :id LIMIT 1
            ");
            $stmt->execute(['id' => $messageId]);
            $msg = $stmt->fetch();

            if (!$msg) {
                json_response(['ok' => false, 'message' => 'Pesan tidak ditemukan.'], 404);
            }

            if ((int)$msg['user_id'] !== (int)$user['id']) {
                json_response(['ok' => false, 'message' => 'Anda hanya bisa mengedit pesan sendiri.'], 403);
            }

            $stmt = $pdo->prepare("
                UPDATE warga_chats SET message = :message, is_edited = 1 WHERE id = :id
            ");
            $stmt->execute(['message' => $newMessage, 'id' => $messageId]);

            json_response(['ok' => true, 'message' => 'Pesan berhasil diperbarui.']);
        }

        if ($action === 'delete') {
            $deviceId = clean_chat_string($input, 'device_id', 120);
            $messageId = (int)($input['message_id'] ?? 0);
            $user = fetch_user_by_device($pdo, $deviceId);

            if (!$user) {
                json_response(['ok' => false, 'message' => 'Device belum terdaftar.'], 403);
            }

            // Allow deleting own messages
            $stmt = $pdo->prepare("
                SELECT id, user_id FROM warga_chats WHERE id = :id LIMIT 1
            ");
            $stmt->execute(['id' => $messageId]);
            $msg = $stmt->fetch();

            if (!$msg) {
                json_response(['ok' => false, 'message' => 'Pesan tidak ditemukan.'], 404);
            }

            if ((int)$msg['user_id'] !== (int)$user['id']) {
                json_response(['ok' => false, 'message' => 'Anda hanya bisa menghapus pesan sendiri.'], 403);
            }

            $stmt = $pdo->prepare("DELETE FROM warga_chats WHERE id = :id");
            $stmt->execute(['id' => $messageId]);

            json_response(['ok' => true, 'message' => 'Pesan berhasil dihapus.']);
        }

        if ($action === 'list') {
            $limit = (int)($input['limit'] ?? 80);
            if ($limit < 1 || $limit > 100) {
                $limit = 80;
            }

            $stmt = $pdo->prepare("
                SELECT
                    c.id,
                    c.message,
                    c.is_edited,
                    c.created_at,
                    DATE_FORMAT(c.created_at, '%H:%i') AS time_label,
                    u.display_name,
                    u.device_id,
                    u.is_member,
                    u.member_id,
                    m.member_code,
                    m.full_name AS member_full_name
                FROM warga_chats c
                INNER JOIN warga_chat_users u ON u.id = c.user_id
                LEFT JOIN members m ON m.id = u.member_id
                WHERE c.chat_date = CURDATE()
                ORDER BY c.id DESC
                LIMIT :limit
            ");
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();
            $rows = array_reverse($stmt->fetchAll());

            // Cast is_member to int for JS truthiness
            foreach ($rows as &$row) {
                $row['is_member'] = (int)$row['is_member'];
                $row['id'] = (int)$row['id'];
            }
            unset($row);

            json_response(['ok' => true, 'data' => $rows]);
        }

        if ($action === 'history') {
            $date = (string)($input['date'] ?? '');
            if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
                json_response(['ok' => false, 'message' => 'Format date wajib YYYY-MM-DD.'], 422);
            }

            $stmt = $pdo->prepare("
                SELECT
                    c.id,
                    c.message,
                    c.is_edited,
                    c.chat_date,
                    c.created_at,
                    DATE_FORMAT(c.created_at, '%H:%i') AS time_label,
                    u.display_name,
                    u.device_id,
                    u.is_member,
                    u.member_id,
                    m.member_code,
                    m.full_name AS member_full_name
                FROM warga_chats c
                INNER JOIN warga_chat_users u ON u.id = c.user_id
                LEFT JOIN members m ON m.id = u.member_id
                WHERE c.chat_date = :chat_date
                ORDER BY c.id ASC
            ");
            $stmt->execute(['chat_date' => $date]);
            $rows = $stmt->fetchAll();

            foreach ($rows as &$row) {
                $row['is_member'] = (int)$row['is_member'];
                $row['id'] = (int)$row['id'];
            }
            unset($row);

            json_response(['ok' => true, 'data' => $rows]);
        }

        json_response(['ok' => false, 'message' => 'Action tidak dikenal.'], 400);
    } catch (Throwable $error) {
        json_response([
            'ok' => false,
            'message' => $error->getMessage(),
        ], 500);
    }
}
