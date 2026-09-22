<?php
require_once __DIR__ . "/db.php";

header("Content-Type: application/json");

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$matchId = isset($data["match_id"]) ? intval($data["match_id"]) : 0;
$winnerPlayerId = isset($data["winner_player_id"]) ? intval($data["winner_player_id"]) : 0;

if ($matchId <= 0 || $winnerPlayerId <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "match_id atau winner_player_id tidak valid"
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        UPDATE matches
        SET
            status = 'finished',
            winner_player_id = :winner_player_id,
            ended_at = NOW()
        WHERE id = :match_id
          AND status != 'finished'
    ");

    $stmt->execute([
        ":winner_player_id" => $winnerPlayerId,
        ":match_id" => $matchId
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Match finished",
        "match_id" => $matchId,
        "winner_player_id" => $winnerPlayerId
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
