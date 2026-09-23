<?php
ob_start();

ini_set("display_errors", "0");
error_reporting(E_ALL);

header("Content-Type: application/json");

register_shutdown_function(function () {
    $error = error_get_last();

    if ($error && in_array($error["type"], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        while (ob_get_level() > 0) {
            ob_end_clean();
        }

        http_response_code(500);

        echo json_encode([
            "success" => false,
            "message" => "Fatal error di update_ball_in_hand.php",
            "error" => $error["message"],
            "file" => basename($error["file"]),
            "line" => $error["line"]
        ]);
    }
});

require_once "db.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$playerKey = trim($data["player_key"] ?? "");
$roomCode = strtoupper(trim($data["room_code"] ?? ""));
$cueX = isset($data["cue_x"]) ? round((float)$data["cue_x"], 2) : null;
$cueY = isset($data["cue_y"]) ? round((float)$data["cue_y"], 2) : null;

if ($playerKey === "" || $roomCode === "" || $cueX === null || $cueY === null) {
    echo json_encode([
        "success" => false,
        "message" => "Data tidak lengkap"
    ]);
    exit;
}

try {
    if (!isset($pdo)) {
        throw new Exception("Variable \$pdo tidak ditemukan dari db.php");
    }

    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        SELECT id, username
        FROM players
        WHERE player_key = ?
        LIMIT 1
        FOR UPDATE
    ");
    $stmt->execute([$playerKey]);
    $player = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$player) {
        $pdo->rollBack();
        echo json_encode([
            "success" => false,
            "message" => "Player tidak ditemukan"
        ]);
        exit;
    }

    $playerId = (int)$player["id"];

    $stmt = $pdo->prepare("
        SELECT id, room_code, status
        FROM rooms
        WHERE room_code = ?
        LIMIT 1
        FOR UPDATE
    ");
    $stmt->execute([$roomCode]);
    $room = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$room) {
        $pdo->rollBack();
        echo json_encode([
            "success" => false,
            "message" => "Room tidak ditemukan"
        ]);
        exit;
    }

    $roomId = (int)$room["id"];

    if ($room["status"] !== "playing") {
        $pdo->rollBack();
        echo json_encode([
            "success" => false,
            "message" => "Room belum dalam status playing"
        ]);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT id, current_turn_player_id
        FROM matches
        WHERE room_id = ?
          AND status = 'playing'
        ORDER BY id DESC
        LIMIT 1
        FOR UPDATE
    ");
    $stmt->execute([$roomId]);
    $match = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$match) {
        $pdo->rollBack();
        echo json_encode([
            "success" => false,
            "message" => "Match aktif tidak ditemukan"
        ]);
        exit;
    }

    $matchId = (int)$match["id"];
    $currentTurnPlayerId = (int)$match["current_turn_player_id"];

    if ($playerId !== $currentTurnPlayerId) {
        $pdo->rollBack();
        echo json_encode([
            "success" => false,
            "message" => "Bukan giliran player ini"
        ]);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT id, state_json
        FROM match_states
        WHERE match_id = ?
        LIMIT 1
        FOR UPDATE
    ");
    $stmt->execute([$matchId]);
    $matchState = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$matchState) {
        $pdo->rollBack();
        echo json_encode([
            "success" => false,
            "message" => "Match state tidak ditemukan"
        ]);
        exit;
    }

    $state = json_decode($matchState["state_json"], true);

    if (!is_array($state)) {
        $state = [];
    }

    $ballInHand = $state["ball_in_hand"] ?? [
        "active" => false,
        "player_id" => null,
        "reason" => null
    ];

    if (empty($ballInHand["active"]) || (int)$ballInHand["player_id"] !== $playerId) {
        $pdo->rollBack();
        echo json_encode([
            "success" => false,
            "message" => "Ball in hand tidak aktif untuk player ini"
        ]);
        exit;
    }

    if (!isset($state["balls"]) || !is_array($state["balls"])) {
        $state["balls"] = [];
    }

    $cueFound = false;

    foreach ($state["balls"] as &$ball) {
        if ((int)($ball["number"] ?? -1) === 0) {
            $ball["x"] = $cueX;
            $ball["y"] = $cueY;
            $ball["vx"] = 0;
            $ball["vy"] = 0;
            $ball["pocketed"] = false;
            $cueFound = true;
            break;
        }
    }

    unset($ball);

    if (!$cueFound) {
        array_unshift($state["balls"], [
            "id" => 0,
            "number" => 0,
            "type" => "cue",
            "color" => "#ffffff",
            "x" => $cueX,
            "y" => $cueY,
            "vx" => 0,
            "vy" => 0,
            "pocketed" => false
        ]);
    }

    $state["ball_in_hand"] = $ballInHand;
    $state["last_ball_in_hand_move"] = [
        "player_id" => $playerId,
        "username" => $player["username"],
        "cue_x" => $cueX,
        "cue_y" => $cueY,
        "created_at" => date("Y-m-d H:i:s")
    ];

    $newStateJson = json_encode($state, JSON_UNESCAPED_SLASHES);

    $stmt = $pdo->prepare("
        UPDATE match_states
        SET state_json = ?,
            updated_at = NOW()
        WHERE match_id = ?
    ");
    $stmt->execute([$newStateJson, $matchId]);

    $pdo->commit();

    while (ob_get_level() > 0) {
        ob_end_clean();
    }

    echo json_encode([
        "success" => true,
        "message" => "Posisi ball in hand tersimpan",
        "match_id" => $matchId,
        "room_code" => $roomCode,
        "player_id" => $playerId,
        "cue_x" => $cueX,
        "cue_y" => $cueY
    ]);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    while (ob_get_level() > 0) {
        ob_end_clean();
    }

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal update ball in hand",
        "error" => $e->getMessage()
    ]);
}
