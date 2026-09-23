<?php
require_once __DIR__ . "/db.php";

header("Content-Type: application/json");

$roomCode = isset($_GET["room_code"]) ? trim($_GET["room_code"]) : "";
$matchId = isset($_GET["match_id"]) ? intval($_GET["match_id"]) : 0;

if ($roomCode === "" || $matchId <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "room_code atau match_id tidak valid"
    ]);
    exit;
}

try {
    $roomStmt = $pdo->prepare("
        SELECT id, room_code
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

    echo json_encode([
        "success" => true,
        "room_code" => $roomCode,
        "room_id" => $roomId,
        "match_id" => $matchId,
        "ready_count" => $totalVotes,
        "total_players" => $totalPlayers,
        "all_ready" => $allReady
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
