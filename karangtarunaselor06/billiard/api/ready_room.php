<?php
require_once "db.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$playerKey = trim($data["player_key"] ?? "");
$roomCode = strtoupper(trim($data["room_code"] ?? ""));
$ready = isset($data["ready"]) ? (int)$data["ready"] : 1;
$ready = $ready ? 1 : 0;

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
    $playerStmt = $pdo->prepare("
        SELECT id, username
        FROM players
        WHERE player_key = ?
        LIMIT 1
    ");
    $playerStmt->execute([$playerKey]);
    $player = $playerStmt->fetch();

    if (!$player) {
        echo json_encode([
            "success" => false,
            "message" => "Player tidak ditemukan"
        ]);
        exit;
    }

    $roomStmt = $pdo->prepare("
        SELECT id, status
        FROM rooms
        WHERE room_code = ?
        LIMIT 1
    ");
    $roomStmt->execute([$roomCode]);
    $room = $roomStmt->fetch();

    if (!$room) {
        echo json_encode([
            "success" => false,
            "message" => "Room tidak ditemukan"
        ]);
        exit;
    }

    if ($room["status"] !== "waiting" && $room["status"] !== "ready") {
        echo json_encode([
            "success" => false,
            "message" => "Room sudah tidak dalam status waiting/ready"
        ]);
        exit;
    }

    $memberStmt = $pdo->prepare("
        SELECT id
        FROM room_players
        WHERE room_id = ? AND player_id = ?
        LIMIT 1
    ");
    $memberStmt->execute([$room["id"], $player["id"]]);
    $member = $memberStmt->fetch();

    if (!$member) {
        echo json_encode([
            "success" => false,
            "message" => "Player belum masuk room ini"
        ]);
        exit;
    }

    $updateRoomPlayerReady = $pdo->prepare("
        UPDATE room_players
        SET ready = ?
        WHERE room_id = ? AND player_id = ?
    ");
    $updateRoomPlayerReady->execute([
        $ready,
        $room["id"],
        $player["id"]
    ]);

    $playerStatus = $ready ? "ready" : "in_room";

    $updatePlayerStatus = $pdo->prepare("
        UPDATE players
        SET status = ?,
            last_seen = NOW()
        WHERE id = ?
    ");
    $updatePlayerStatus->execute([
        $playerStatus,
        $player["id"]
    ]);

    $countStmt = $pdo->prepare("
        SELECT 
            COUNT(*) AS total_players,
            SUM(CASE WHEN ready = 1 THEN 1 ELSE 0 END) AS ready_players
        FROM room_players
        WHERE room_id = ?
    ");
    $countStmt->execute([$room["id"]]);
    $counts = $countStmt->fetch();

    $totalPlayers = (int)$counts["total_players"];
    $readyPlayers = (int)$counts["ready_players"];

    $newRoomStatus = ($totalPlayers >= 2 && $totalPlayers === $readyPlayers)
        ? "ready"
        : "waiting";

    $roomStatusStmt = $pdo->prepare("
        UPDATE rooms
        SET status = ?
        WHERE id = ?
    ");
    $roomStatusStmt->execute([
        $newRoomStatus,
        $room["id"]
    ]);

    echo json_encode([
        "success" => true,
        "message" => $ready ? "Player siap" : "Player batal siap",
        "room_status" => $newRoomStatus,
        "total_players" => $totalPlayers,
        "ready_players" => $readyPlayers
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Gagal update ready"
    ]);
}