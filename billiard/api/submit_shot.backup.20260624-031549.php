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
            "message" => "Fatal error di submit_shot.php",
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
$newBalls = $data["balls"] ?? null;

// Default true agar request lama tidak otomatis dianggap foul.
$cueHitObjectBall = array_key_exists("cue_hit_object_ball", $data)
    ? !empty($data["cue_hit_object_ball"])
    : true;
    
    // Default true agar request lama tidak otomatis dianggap rail foul.
$anyBallHitRail = array_key_exists("any_ball_hit_rail", $data)
    ? !empty($data["any_ball_hit_rail"])
    : true;

if ($playerKey === "" || $roomCode === "" || !is_array($newBalls)) {
    echo json_encode([
        "success" => false,
        "message" => "Data tidak lengkap",
        "debug" => [
            "player_key_empty" => $playerKey === "",
            "room_code_empty" => $roomCode === "",
            "balls_is_array" => is_array($newBalls)
        ]
    ]);
    exit;
}

function pc_normalize_balls($balls) {
    $result = [];

    foreach ($balls as $ball) {
        $result[] = [
            "id" => isset($ball["id"]) ? (int)$ball["id"] : 0,
            "number" => isset($ball["number"]) ? (int)$ball["number"] : 0,
            "type" => $ball["type"] ?? "",
            "color" => $ball["color"] ?? "#cccccc",
            "x" => isset($ball["x"]) ? round((float)$ball["x"], 2) : 0,
            "y" => isset($ball["y"]) ? round((float)$ball["y"], 2) : 0,
            "vx" => 0,
            "vy" => 0,
            "pocketed" => !empty($ball["pocketed"])
        ];
    }

    return $result;
}

function pc_find_ball_by_number($balls, $number) {
    foreach ($balls as $ball) {
        if ((int)($ball["number"] ?? -1) === (int)$number) {
            return $ball;
        }
    }

    return null;
}

function pc_get_next_turn_player_id($pdo, $roomId, $currentPlayerId) {
    $stmt = $pdo->prepare("
        SELECT 
            player_id,
            turn_order
        FROM room_players
        WHERE room_id = ?
        ORDER BY turn_order ASC, id ASC
    ");
    $stmt->execute([$roomId]);
    $players = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$players || count($players) === 0) {
        return $currentPlayerId;
    }

    $currentIndex = 0;

    foreach ($players as $index => $player) {
        if ((int)$player["player_id"] === (int)$currentPlayerId) {
            $currentIndex = $index;
            break;
        }
    }

    $nextIndex = ($currentIndex + 1) % count($players);

    return (int)$players[$nextIndex]["player_id"];
}

try {
    if (!isset($pdo)) {
        throw new Exception("Variable \$pdo tidak ditemukan dari db.php");
    }

    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        SELECT 
            id,
            username,
            status,
            current_room_id
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
        SELECT 
            id,
            room_code,
            mode,
            status
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
            "message" => "Room belum dalam status playing",
            "room_status" => $room["status"]
        ]);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT 
            id,
            room_id,
            mode,
            status,
            current_turn_player_id
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
            "message" => "Bukan giliran player ini",
            "player_id" => $playerId,
            "current_turn_player_id" => $currentTurnPlayerId
        ]);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT 
            id,
            state_json
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

    $oldState = json_decode($matchState["state_json"], true);

    if (!is_array($oldState)) {
        $oldState = [];
    }

    $oldBalls = $oldState["balls"] ?? [];
    $cleanNewBalls = pc_normalize_balls($newBalls);

    $newPocketedObjectBalls = [];
    $cueBallFoul = false;

    foreach ($cleanNewBalls as $newBall) {
        $number = (int)$newBall["number"];
        $oldBall = pc_find_ball_by_number($oldBalls, $number);

        $wasPocketed = $oldBall ? !empty($oldBall["pocketed"]) : false;
        $isPocketed = !empty($newBall["pocketed"]);

        if ($number === 0 && $isPocketed) {
            $cueBallFoul = true;
        }

        if ($number > 0 && !$wasPocketed && $isPocketed) {
            $newPocketedObjectBalls[] = $number;
        }
    }

    $pocketedCount = count($newPocketedObjectBalls);
$scoreAdded = 0;
$foulAdded = 0;

$noContactFoul = !$cueHitObjectBall;
$railFoul = false;

if ($cueHitObjectBall && $pocketedCount === 0 && !$anyBallHitRail) {
    $railFoul = true;
}

$hasFoul = $cueBallFoul || $noContactFoul || $railFoul;

$foulReason = null;

if ($cueBallFoul) {
    $foulReason = "cue_ball_pocketed";
} elseif ($noContactFoul) {
    $foulReason = "cue_ball_no_contact";
} elseif ($railFoul) {
    $foulReason = "no_ball_hit_rail_after_contact";
}

if ($hasFoul) {
    $foulAdded = 1;

    if ($cueBallFoul) {
        foreach ($cleanNewBalls as &$ball) {
            if ((int)$ball["number"] === 0) {
                $ball["pocketed"] = false;
                $ball["x"] = 220;
                $ball["y"] = 250;
                $ball["vx"] = 0;
                $ball["vy"] = 0;
                break;
            }
        }
        unset($ball);
    }

    $scoreAdded = 0;
} else {
    $scoreAdded = $pocketedCount;
}

$shouldKeepTurn = false;

if (!$hasFoul && $pocketedCount > 0) {
    $shouldKeepTurn = true;
}

    $nextTurnPlayerId = $shouldKeepTurn
        ? $playerId
        : pc_get_next_turn_player_id($pdo, $roomId, $playerId);

    if ($scoreAdded > 0) {
        $stmt = $pdo->prepare("
            UPDATE room_players
            SET score = score + ?
            WHERE room_id = ?
              AND player_id = ?
        ");
        $stmt->execute([$scoreAdded, $roomId, $playerId]);
    }

    if ($foulAdded > 0) {
        $stmt = $pdo->prepare("
            UPDATE room_players
            SET fouls = fouls + ?
            WHERE room_id = ?
              AND player_id = ?
        ");
        $stmt->execute([$foulAdded, $roomId, $playerId]);
    }

    $ballInHand = [
    "active" => false,
    "player_id" => null,
    "reason" => null
];

if ($hasFoul) {
    $ballInHand = [
        "active" => true,
        "player_id" => $nextTurnPlayerId,
        "reason" => $foulReason
    ];
}

    $oldState["balls"] = $cleanNewBalls;
    $oldState["ball_in_hand"] = $ballInHand;
    $oldState["last_shot"] = [
        "player_id" => $playerId,
        "username" => $player["username"],
        "pocketed_balls" => $newPocketedObjectBalls,
        "pocketed_count" => $pocketedCount,
        "score_added" => $scoreAdded,
        "foul" => $hasFoul,
"foul_reason" => $foulReason,
"cue_hit_object_ball" => $cueHitObjectBall,
"any_ball_hit_rail" => $anyBallHitRail,
"rail_foul" => $railFoul,
        "keep_turn" => $shouldKeepTurn,
        "next_turn_player_id" => $nextTurnPlayerId,
        "ball_in_hand" => $ballInHand,
        "created_at" => date("Y-m-d H:i:s")
    ];

    $newStateJson = json_encode($oldState, JSON_UNESCAPED_SLASHES);

    $stmt = $pdo->prepare("
        UPDATE match_states
        SET state_json = ?,
            updated_at = NOW()
        WHERE match_id = ?
    ");
    $stmt->execute([$newStateJson, $matchId]);

    $stmt = $pdo->prepare("
        UPDATE matches
        SET current_turn_player_id = ?
        WHERE id = ?
    ");
    $stmt->execute([$nextTurnPlayerId, $matchId]);

    $pdo->commit();

    while (ob_get_level() > 0) {
        ob_end_clean();
    }

    echo json_encode([
        "success" => true,
        "message" => "Shot tersimpan",
        "match_id" => $matchId,
        "room_code" => $roomCode,
        "player_id" => $playerId,
        "pocketed_balls" => $newPocketedObjectBalls,
        "pocketed_count" => $pocketedCount,
        "score_added" => $scoreAdded,
        "foul" => $hasFoul,
"foul_reason" => $foulReason,
"cue_hit_object_ball" => $cueHitObjectBall,
"any_ball_hit_rail" => $anyBallHitRail,
"rail_foul" => $railFoul,
"foul_added" => $foulAdded,
"keep_turn" => $shouldKeepTurn,
"next_turn_player_id" => $nextTurnPlayerId,
"ball_in_hand" => $ballInHand
    ]);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    while (ob_get_level() > 0) {
        ob_end_clean();
    }

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal menyimpan shot",
        "error" => $e->getMessage(),
        "file" => basename($e->getFile()),
        "line" => $e->getLine()
    ]);
}