<?php
require_once "db.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$playerKey = trim($data["player_key"] ?? "");
$roomCode = strtoupper(trim($data["room_code"] ?? ""));

if ($playerKey === "") {
    echo json_encode([
        "success" => false,
        "message" => "Player key kosong"
    ]);
    exit;
}

if ($roomCode === "") {
    echo json_encode([
        "success" => false,
        "message" => "Room code kosong"
    ]);
    exit;
}

try {
    $pdo->beginTransaction();

    $playerStmt = $pdo->prepare("
        SELECT id, username
        FROM players
        WHERE player_key = ?
        LIMIT 1
    ");
    $playerStmt->execute([$playerKey]);
    $player = $playerStmt->fetch();

    if (!$player) {
        $pdo->rollBack();
        echo json_encode([
            "success" => false,
            "message" => "Player tidak ditemukan. Silakan join ulang."
        ]);
        exit;
    }

    $roomStmt = $pdo->prepare("
        SELECT id, room_code, mode, status, max_players
        FROM rooms
        WHERE room_code = ?
        LIMIT 1
    ");
    $roomStmt->execute([$roomCode]);
    $room = $roomStmt->fetch();

    if (!$room) {
        $pdo->rollBack();
        echo json_encode([
            "success" => false,
            "message" => "Room tidak ditemukan"
        ]);
        exit;
    }

    if ($room["status"] !== "waiting") {
        $pdo->rollBack();
        echo json_encode([
            "success" => false,
            "message" => "Room sudah tidak bisa dimasuki"
        ]);
        exit;
    }

    $countStmt = $pdo->prepare("
        SELECT COUNT(*) AS total
        FROM room_players
        WHERE room_id = ?
    ");
    $countStmt->execute([$room["id"]]);
    $count = (int)$countStmt->fetch()["total"];

    if ($count >= (int)$room["max_players"]) {
        $pdo->rollBack();
        echo json_encode([
            "success" => false,
            "message" => "Room sudah penuh"
        ]);
        exit;
    }

    $existsStmt = $pdo->prepare("
        SELECT id
        FROM room_players
        WHERE room_id = ? AND player_id = ?
        LIMIT 1
    ");
    $existsStmt->execute([$room["id"], $player["id"]]);
    $alreadyJoined = $existsStmt->fetch();

    if (!$alreadyJoined) {
        $insertStmt = $pdo->prepare("
            INSERT INTO room_players (
                room_id,
                player_id,
                username,
                is_host,
                ready
            )
            VALUES (?, ?, ?, 0, 0)
        ");
        $insertStmt->execute([
            $room["id"],
            $player["id"],
            $player["username"]
        ]);
    }

    $updatePlayer = $pdo->prepare("
        UPDATE players
        SET status = 'in_room',
            current_room_id = ?,
            last_seen = NOW()
        WHERE id = ?
    ");
    $updatePlayer->execute([
        $room["id"],
        $player["id"]
    ]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => $alreadyJoined ? "Player sudah ada di room" : "Berhasil masuk room",
        "room" => [
            "id" => (int)$room["id"],
            "room_code" => $room["room_code"],
            "mode" => $room["mode"],
            "status" => $room["status"],
            "max_players" => (int)$room["max_players"]
        ],
        "player" => [
            "id" => (int)$player["id"],
            "username" => $player["username"]
        ]
    ]);
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Gagal masuk room"
    ]);
}