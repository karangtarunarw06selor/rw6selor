<?php
require_once __DIR__ . "/db.php";

header("Content-Type: application/json");

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$roomCode = isset($data["room_code"]) ? trim($data["room_code"]) : "";
$matchId = isset($data["match_id"]) ? intval($data["match_id"]) : 0;
$playerId = isset($data["player_id"]) ? intval($data["player_id"]) : 0;

if ($roomCode === "" || $matchId <= 0 || $playerId <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "room_code, match_id, atau player_id tidak valid"
    ]);
    exit;
}

try {
    $pdo->beginTransaction();

    $roomStmt = $pdo->prepare("
        SELECT id, room_code, status
        FROM rooms
        WHERE room_code = ?
        LIMIT 1
    ");
    $roomStmt->execute([$roomCode]);
    $room = $roomStmt->fetch();

    if (!$room) {
        throw new Exception("Room tidak ditemukan");
    }

    $roomId = (int)$room["id"];

    $playerCheckStmt = $pdo->prepare("
        SELECT id
        FROM room_players
        WHERE room_id = ?
          AND player_id = ?
        LIMIT 1
    ");
    $playerCheckStmt->execute([$roomId, $playerId]);
    $playerInRoom = $playerCheckStmt->fetch();

    if (!$playerInRoom) {
        throw new Exception("Player tidak ada di room ini");
    }

    $matchStmt = $pdo->prepare("
        SELECT id, status
        FROM matches
        WHERE id = ?
          AND room_id = ?
        LIMIT 1
    ");
    $matchStmt->execute([$matchId, $roomId]);
    $match = $matchStmt->fetch();

    if (!$match) {
        throw new Exception("Match tidak ditemukan");
    }

    if ($match["status"] !== "finished") {
        throw new Exception("Rematch hanya bisa dilakukan setelah game selesai");
    }

    $voteStmt = $pdo->prepare("
        INSERT INTO rematch_votes (room_id, match_id, player_id, created_at)
        VALUES (?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE created_at = NOW()
    ");
    $voteStmt->execute([$roomId, $matchId, $playerId]);

    $playerCountStmt = $pdo->prepare("
        SELECT COUNT(*) AS total_players
        FROM room_players
        WHERE room_id = ?
    ");
    $playerCountStmt->execute([$roomId]);
    $playerCountRow = $playerCountStmt->fetch();
    $totalPlayers = (int)$playerCountRow["total_players"];

    $voteCountStmt = $pdo->prepare("
        SELECT COUNT(*) AS total_votes
        FROM rematch_votes
        WHERE room_id = ?
          AND match_id = ?
    ");
    $voteCountStmt->execute([$roomId, $matchId]);
    $voteCountRow = $voteCountStmt->fetch();
    $totalVotes = (int)$voteCountRow["total_votes"];

    $allReady = $totalPlayers > 0 && $totalVotes >= $totalPlayers;

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => $allReady ? "Semua player siap rematch" : "Menunggu player lain",
        "room_code" => $roomCode,
        "room_id" => $roomId,
        "match_id" => $matchId,
        "player_id" => $playerId,
        "ready_count" => $totalVotes,
        "total_players" => $totalPlayers,
        "all_ready" => $allReady
    ]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
