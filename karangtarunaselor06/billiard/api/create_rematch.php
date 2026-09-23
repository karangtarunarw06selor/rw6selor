<?php
require_once __DIR__ . "/db.php";

header("Content-Type: application/json");

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$roomCode = isset($data["room_code"]) ? trim($data["room_code"]) : "";
$mode = isset($data["mode"]) ? trim($data["mode"]) : "straight_pool";

if ($roomCode === "") {
    echo json_encode([
        "success" => false,
        "message" => "room_code tidak valid"
    ]);
    exit;
}

function buildInitialState() {
    $colors = [
        0 => "#ffffff",
        1 => "#f6c744",
        2 => "#2f6fd6",
        3 => "#c83a3a",
        4 => "#7b4bd6",
        5 => "#e47732",
        6 => "#2f9b57",
        7 => "#7c2f2f",
        8 => "#222222",
        9 => "#f6c744",
        10 => "#2f6fd6",
        11 => "#c83a3a",
        12 => "#7b4bd6",
        13 => "#e47732",
        14 => "#2f9b57",
        15 => "#7c2f2f"
    ];

    $balls = [];

    // Cue ball
    $balls[] = [
        "number" => 0,
        "type" => "cue",
        "color" => $colors[0],
        "x" => 230,
        "y" => 250,
        "vx" => 0,
        "vy" => 0,
        "pocketed" => false,
        "sinking" => false
    ];

    // Rack balls
    $rackStartX = 650;
    $rackStartY = 250;
    $radius = 13;
    $gap = 1.5;

    $dx = ($radius * 2 + $gap) * 0.866;
    $dy = ($radius * 2 + $gap);

    $numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    $index = 0;

    for ($row = 0; $row < 5; $row++) {
        for ($col = 0; $col <= $row; $col++) {
            if (!isset($numbers[$index])) {
                continue;
            }

            $number = $numbers[$index];

            $balls[] = [
                "number" => $number,
                "type" => $number >= 9 ? "stripe" : "solid",
                "color" => $colors[$number],
                "x" => $rackStartX + ($row * $dx),
                "y" => $rackStartY + (($col - $row / 2) * $dy),
                "vx" => 0,
                "vy" => 0,
                "pocketed" => false,
                "sinking" => false
            ];

            $index++;
        }
    }

    return [
        "balls" => $balls,
        "ball_in_hand" => [
            "active" => false,
            "player_id" => null
        ],
        "last_shot" => null
    ];
}

function getNextStarterPlayerId($players, $previousStarterPlayerId) {
    if (!$players || count($players) === 0) {
        return 0;
    }

    if (!$previousStarterPlayerId) {
        return (int)$players[0]["player_id"];
    }

    $currentIndex = -1;

    foreach ($players as $index => $player) {
        if ((int)$player["player_id"] === (int)$previousStarterPlayerId) {
            $currentIndex = $index;
            break;
        }
    }

    if ($currentIndex < 0) {
        return (int)$players[0]["player_id"];
    }

    $nextIndex = $currentIndex + 1;

    if ($nextIndex >= count($players)) {
        $nextIndex = 0;
    }

    return (int)$players[$nextIndex]["player_id"];
}

try {
    $pdo->beginTransaction();

    // Ambil room yang sama
    $roomStmt = $pdo->prepare("
        SELECT id, room_code, mode
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
    $roomMode = $room["mode"] ?: $mode;

    // Ambil players dari room yang sama
    $playersStmt = $pdo->prepare("
        SELECT
            player_id,
            turn_order,
            is_host
        FROM room_players
        WHERE room_id = ?
        ORDER BY turn_order ASC
    ");
    $playersStmt->execute([$roomId]);
    $players = $playersStmt->fetchAll();

    if (!$players || count($players) === 0) {
        throw new Exception("Player room tidak ditemukan");
    }

    // Ambil match terakhir sebelum rematch.
    // Starter baru akan bergilir dari starter match sebelumnya.
    $lastMatchStmt = $pdo->prepare("
        SELECT
            id,
            current_turn_player_id,
            winner_player_id,
            status
        FROM matches
        WHERE room_id = ?
        ORDER BY id DESC
        LIMIT 1
    ");
    $lastMatchStmt->execute([$roomId]);
    $lastMatch = $lastMatchStmt->fetch();

    $previousStarterPlayerId = $lastMatch && $lastMatch["current_turn_player_id"] !== null
        ? (int)$lastMatch["current_turn_player_id"]
        : 0;

    $nextStarterPlayerId = getNextStarterPlayerId($players, $previousStarterPlayerId);

    if ($nextStarterPlayerId <= 0) {
        throw new Exception("Starter rematch tidak valid");
    }

    // Reset score/foul player di room yang sama untuk match baru
    $resetPlayersStmt = $pdo->prepare("
        UPDATE room_players
        SET
            score = 0,
            fouls = 0
        WHERE room_id = ?
    ");
    $resetPlayersStmt->execute([$roomId]);

    // Set room tetap playing
    $updateRoomStmt = $pdo->prepare("
        UPDATE rooms
        SET status = 'playing'
        WHERE id = ?
    ");
    $updateRoomStmt->execute([$roomId]);

    // Buat match baru di room yang sama
    $matchInsert = $pdo->prepare("
        INSERT INTO matches (
            room_id,
            mode,
            status,
            current_turn_player_id,
            winner_player_id,
            started_at,
            ended_at,
            created_at
        )
        VALUES (
            ?,
            ?,
            'playing',
            ?,
            NULL,
            NOW(),
            NULL,
            NOW()
        )
    ");
    $matchInsert->execute([
        $roomId,
        $roomMode,
        $nextStarterPlayerId
    ]);

    $newMatchId = (int)$pdo->lastInsertId();

    // Buat state bola awal untuk match baru
    $initialState = buildInitialState();

    $stateInsert = $pdo->prepare("
        INSERT INTO match_states (
            match_id,
            state_json,
            updated_at
        )
        VALUES (
            ?,
            ?,
            NOW()
        )
    ");
    $stateInsert->execute([
        $newMatchId,
        json_encode($initialState, JSON_UNESCAPED_SLASHES)
    ]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Rematch created in same room with alternate starter",
        "room_code" => $roomCode,
        "room_id" => $roomId,
        "match_id" => $newMatchId,
        "starter_player_id" => $nextStarterPlayerId,
        "previous_starter_player_id" => $previousStarterPlayerId
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