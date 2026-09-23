<?php
require_once "db.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$playerKey = trim($data["player_key"] ?? "");
$mode = trim($data["mode"] ?? "straight_pool");
$maxPlayers = (int)($data["max_players"] ?? 4);
$visibility = trim($data["visibility"] ?? "public");

$allowedModes = ["8ball_classic", "8ball_party", "9ball", "10ball", "straight_pool"];
$allowedVisibility = ["public", "private"];

if ($playerKey === "") {
    echo json_encode([
        "success" => false,
        "message" => "Player key kosong"
    ]);
    exit;
}

if (!in_array($mode, $allowedModes)) {
    echo json_encode([
        "success" => false,
        "message" => "Mode tidak valid"
    ]);
    exit;
}

if (!in_array($visibility, $allowedVisibility)) {
    echo json_encode([
        "success" => false,
        "message" => "Visibility tidak valid"
    ]);
    exit;
}

if (!in_array($mode, $allowedModes)) {
    echo json_encode([
        "success" => false,
        "message" => "Mode tidak valid"
    ]);
    exit;
}

if ($maxPlayers < 2 || $maxPlayers > 4) {
    echo json_encode([
        "success" => false,
        "message" => "Jumlah player harus 2 sampai 4"
    ]);
    exit;
}

if ($mode === "8ball_classic" && !in_array($maxPlayers, [2, 4], true)) {
    echo json_encode([
        "success" => false,
        "message" => "8 Ball Classic hanya untuk 2 atau 4 player"
    ]);
    exit;
}

function generateRoomCode($length = 6) {
    $chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    $code = "";

    for ($i = 0; $i < $length; $i++) {
        $code .= $chars[random_int(0, strlen($chars) - 1)];
    }

    return $code;
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        SELECT id, username
        FROM players
        WHERE player_key = ?
        LIMIT 1
    ");
    $stmt->execute([$playerKey]);
    $player = $stmt->fetch();

    if (!$player) {
        $pdo->rollBack();
        echo json_encode([
            "success" => false,
            "message" => "Player tidak ditemukan. Silakan join ulang."
        ]);
        exit;
    }

    $roomCode = null;

    for ($i = 0; $i < 10; $i++) {
        $candidate = generateRoomCode();

        $check = $pdo->prepare("
            SELECT id
            FROM rooms
            WHERE room_code = ?
            LIMIT 1
        ");
        $check->execute([$candidate]);

        if (!$check->fetch()) {
            $roomCode = $candidate;
            break;
        }
    }

    if (!$roomCode) {
        $pdo->rollBack();
        echo json_encode([
            "success" => false,
            "message" => "Gagal membuat kode room"
        ]);
        exit;
    }

    $insertRoom = $pdo->prepare("
        INSERT INTO rooms (
    room_code,
    mode,
    play_type,
    visibility,
    status,
    host_player_id,
    min_players,
    max_players
)
VALUES (?, ?, 'online', ?, 'waiting', ?, 2, ?)
    ");
    $insertRoom->execute([
    $roomCode,
    $mode,
    $visibility,
    $player["id"],
    $maxPlayers
]);

    $roomId = (int)$pdo->lastInsertId();

    $insertRoomPlayer = $pdo->prepare("
        INSERT INTO room_players (
            room_id,
            player_id,
            username,
            is_host,
            ready
        )
        VALUES (?, ?, ?, 1, 0)
    ");
    $insertRoomPlayer->execute([
        $roomId,
        $player["id"],
        $player["username"]
    ]);

    $updatePlayer = $pdo->prepare("
        UPDATE players
        SET status = 'in_room',
            current_room_id = ?,
            last_seen = NOW()
        WHERE id = ?
    ");
    $updatePlayer->execute([
        $roomId,
        $player["id"]
    ]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Room berhasil dibuat",
        "room" => [
            "id" => $roomId,
            "room_code" => $roomCode,
            "mode" => $mode,
            "status" => "waiting",
            "max_players" => $maxPlayers,
            "host_player_id" => (int)$player["id"]
        ]
    ]);
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Gagal membuat room"
    ]);
}