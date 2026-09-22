<?php
require_once "db.php";

header("Content-Type: application/json");

$roomCode = trim($_GET["room_code"] ?? "");
$playerKey = trim($_GET["player_key"] ?? "");

if ($roomCode === "") {
    echo json_encode([
        "success" => false,
        "message" => "Room code kosong"
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT 
            r.id,
            r.room_code,
            r.mode,
            r.play_type,
            r.status,
            r.host_player_id,
            r.min_players,
            r.max_players,
            r.created_at,
            p.username AS host_username
        FROM rooms r
        LEFT JOIN players p ON p.id = r.host_player_id
        WHERE r.room_code = ?
        LIMIT 1
    ");
    $stmt->execute([$roomCode]);
    $room = $stmt->fetch();

    if (!$room) {
        echo json_encode([
            "success" => false,
            "message" => "Room tidak ditemukan"
        ]);
        exit;
    }

    $roomId = (int)$room["id"];
    $hostPlayerId = (int)$room["host_player_id"];

$syncHostStmt = $pdo->prepare("
    UPDATE room_players
    SET is_host = CASE WHEN player_id = ? THEN 1 ELSE 0 END
    WHERE room_id = ?
");
$syncHostStmt->execute([$hostPlayerId, $roomId]);

    $playersStmt = $pdo->prepare("
        SELECT
            rp.player_id,
            rp.username,
            rp.is_host,
            rp.ready,
            rp.turn_order,
            rp.score,
            rp.fouls,
            rp.balls_pocketed,
            p.player_key,
            p.status,
            p.last_seen,
            TIMESTAMPDIFF(SECOND, p.last_seen, NOW()) AS seconds_ago
        FROM room_players rp
        LEFT JOIN players p ON p.id = rp.player_id
        WHERE rp.room_id = ?
        ORDER BY rp.is_host DESC, rp.joined_at ASC
    ");
    $playersStmt->execute([$roomId]);
    $players = $playersStmt->fetchAll();

    $me = null;

    if ($playerKey !== "") {
        $meStmt = $pdo->prepare("
            SELECT
                p.id AS player_id,
                p.username,
                p.player_key,
                rp.is_host,
                rp.ready,
                rp.turn_order,
                rp.score,
                rp.fouls,
                rp.balls_pocketed
            FROM players p
            INNER JOIN room_players rp ON rp.player_id = p.id
            WHERE p.player_key = ?
              AND rp.room_id = ?
            LIMIT 1
        ");
        $meStmt->execute([$playerKey, $roomId]);
        $me = $meStmt->fetch();
    }

    echo json_encode([
        "success" => true,
        "room" => [
            "id" => $roomId,
            "room_code" => $room["room_code"],
            "mode" => $room["mode"],
            "play_type" => $room["play_type"],
            "status" => $room["status"],
            "host_player_id" => (int)$room["host_player_id"],
            "host_username" => $room["host_username"],
            "min_players" => (int)$room["min_players"],
            "max_players" => (int)$room["max_players"],
            "created_at" => $room["created_at"]
        ],
        "players" => $players,
        "player_count" => count($players),
        "me" => $me ? [
            "player_id" => (int)$me["player_id"],
            "username" => $me["username"],
            "player_key" => $me["player_key"],
            "is_host" => (int)$me["is_host"],
            "ready" => (int)$me["ready"],
            "turn_order" => (int)$me["turn_order"],
            "score" => (int)$me["score"],
            "fouls" => (int)$me["fouls"],
            "balls_pocketed" => $me["balls_pocketed"]
        ] : null
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil detail room"
    ]);
}