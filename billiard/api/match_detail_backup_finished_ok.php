<?php
require_once "db.php";

$roomCode = strtoupper(trim($_GET["room_code"] ?? ""));

if ($roomCode === "") {
    echo json_encode([
        "success" => false,
        "message" => "Room code kosong"
    ]);
    exit;
}

try {
    $roomStmt = $pdo->prepare("
        SELECT 
            id,
            room_code,
            mode,
            status,
            host_player_id,
            max_players
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

    $matchStmt = $pdo->prepare("
        SELECT
            id,
            room_id,
            mode,
            status,
            current_turn_player_id,
            winner_player_id,
            started_at,
            ended_at
        FROM matches
        WHERE room_id = ?
        ORDER BY id DESC
        LIMIT 1
    ");
    $matchStmt->execute([$room["id"]]);
    $match = $matchStmt->fetch();

    if (!$match) {
        echo json_encode([
            "success" => false,
            "message" => "Match belum dibuat"
        ]);
        exit;
    }

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
            p.status,
            p.last_seen,
            TIMESTAMPDIFF(SECOND, p.last_seen, NOW()) AS seconds_ago
        FROM room_players rp
        LEFT JOIN players p ON p.id = rp.player_id
        WHERE rp.room_id = ?
        ORDER BY rp.turn_order ASC, rp.joined_at ASC
    ");
    $playersStmt->execute([$room["id"]]);
    $players = $playersStmt->fetchAll();

    $stateStmt = $pdo->prepare("
        SELECT
            id,
            match_id,
            state_json,
            updated_at
        FROM match_states
        WHERE match_id = ?
        ORDER BY id DESC
        LIMIT 1
    ");
    $stateStmt->execute([$match["id"]]);
    $stateRow = $stateStmt->fetch();

    $state = null;

    if ($stateRow && $stateRow["state_json"]) {
        $state = json_decode($stateRow["state_json"], true);
    }

    echo json_encode([
        "success" => true,
        "room" => [
            "id" => (int)$room["id"],
            "room_code" => $room["room_code"],
            "mode" => $room["mode"],
            "status" => $room["status"],
            "host_player_id" => (int)$room["host_player_id"],
            "max_players" => (int)$room["max_players"]
        ],
        "match" => [
            "id" => (int)$match["id"],
            "room_id" => (int)$match["room_id"],
            "mode" => $match["mode"],
            "status" => $match["status"],
            "current_turn_player_id" => $match["current_turn_player_id"] !== null ? (int)$match["current_turn_player_id"] : null,
            "winner_player_id" => $match["winner_player_id"] !== null ? (int)$match["winner_player_id"] : null,
            "started_at" => $match["started_at"],
            "ended_at" => $match["ended_at"]
        ],
        "players" => $players,
        "state" => $state
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil detail match"
    ]);
}