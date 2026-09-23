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

function generateInitialBalls($mode) {
    $balls = [];

    $cueX = 220;
    $cueY = 250;

    $balls[] = [
        "id" => 0,
        "number" => 0,
        "type" => "cue",
        "color" => "#ffffff",
        "x" => $cueX,
        "y" => $cueY,
        "vx" => 0,
        "vy" => 0,
        "pocketed" => false
    ];

    $colors = [
        1 => "#facc15",
        2 => "#2563eb",
        3 => "#dc2626",
        4 => "#7c3aed",
        5 => "#f97316",
        6 => "#16a34a",
        7 => "#7f1d1d",
        8 => "#111827",
        9 => "#fde047",
        10 => "#3b82f6",
        11 => "#ef4444",
        12 => "#8b5cf6",
        13 => "#fb923c",
        14 => "#22c55e",
        15 => "#92400e"
    ];

    if ($mode === "9ball") {
        $maxBall = 9;
        $rows = 5;
    } elseif ($mode === "10ball") {
        $maxBall = 10;
        $rows = 4;
    } else {
        $maxBall = 15;
        $rows = 5;
    }

    $startX = 620;
    $startY = 250;
    $radius = 13;
    $gapX = $radius * 1.85;
    $gapY = $radius * 2.12;

    $number = 1;

    for ($row = 0; $row < $rows; $row++) {
        for ($col = 0; $col <= $row; $col++) {
            if ($number > $maxBall) {
                break 2;
            }

            $type = "solid";

            if ($number === 8) {
                $type = "eight";
            } elseif ($number >= 9) {
                $type = "stripe";
            }

            $balls[] = [
                "id" => $number,
                "number" => $number,
                "type" => $type,
                "color" => $colors[$number] ?? "#cccccc",
                "x" => $startX + ($row * $gapX),
                "y" => $startY + (($col - ($row / 2)) * $gapY),
                "vx" => 0,
                "vy" => 0,
                "pocketed" => false
            ];

            $number++;
        }
    }

    return $balls;
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
            "message" => "Player tidak ditemukan"
        ]);
        exit;
    }

    $roomStmt = $pdo->prepare("
        SELECT id, room_code, mode, status, host_player_id
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

    if ((int)$room["host_player_id"] !== (int)$player["id"]) {
        $pdo->rollBack();
        echo json_encode([
            "success" => false,
            "message" => "Hanya host yang bisa memulai match"
        ]);
        exit;
    }

    if ($room["status"] !== "ready") {
        $pdo->rollBack();
        echo json_encode([
            "success" => false,
            "message" => "Room belum ready. Semua player harus ready."
        ]);
        exit;
    }

    $playersStmt = $pdo->prepare("
        SELECT 
            rp.player_id,
            rp.username,
            rp.ready,
            p.last_seen,
            TIMESTAMPDIFF(SECOND, p.last_seen, NOW()) AS seconds_ago
        FROM room_players rp
        LEFT JOIN players p ON p.id = rp.player_id
        WHERE rp.room_id = ?
        ORDER BY rp.joined_at ASC
    ");
    $playersStmt->execute([$room["id"]]);
    $roomPlayers = $playersStmt->fetchAll();

    $totalPlayers = count($roomPlayers);

    if ($totalPlayers < 2) {
        $pdo->rollBack();
        echo json_encode([
            "success" => false,
            "message" => "Minimal 2 player untuk mulai match"
        ]);
        exit;
    }

    foreach ($roomPlayers as $rp) {
        if ((int)$rp["ready"] !== 1) {
            $pdo->rollBack();
            echo json_encode([
                "success" => false,
                "message" => "Masih ada player yang belum ready"
            ]);
            exit;
        }

        if ((int)$rp["seconds_ago"] > 30) {
            $pdo->rollBack();
            echo json_encode([
                "success" => false,
                "message" => "Ada player yang sudah offline"
            ]);
            exit;
        }
    }

    $turnOrderPlayers = $roomPlayers;
    shuffle($turnOrderPlayers);

    foreach ($turnOrderPlayers as $index => $rp) {
        $turnOrderStmt = $pdo->prepare("
            UPDATE room_players
            SET turn_order = ?
            WHERE room_id = ? AND player_id = ?
        ");
        $turnOrderStmt->execute([
            $index + 1,
            $room["id"],
            $rp["player_id"]
        ]);
    }

    $currentTurnPlayerId = (int)$turnOrderPlayers[0]["player_id"];

    $createMatchStmt = $pdo->prepare("
        INSERT INTO matches (
            room_id,
            mode,
            status,
            current_turn_player_id,
            started_at
        )
        VALUES (?, ?, 'playing', ?, NOW())
    ");
    $createMatchStmt->execute([
        $room["id"],
        $room["mode"],
        $currentTurnPlayerId
    ]);

    $matchId = (int)$pdo->lastInsertId();

    $turnOrderIds = array_map(function ($p) {
        return (int)$p["player_id"];
    }, $turnOrderPlayers);

    $scores = [];
    foreach ($roomPlayers as $rp) {
        $scores[(string)$rp["player_id"]] = 0;
    }

    $initialState = [
    "match_id" => $matchId,
    "room_id" => (int)$room["id"],
    "room_code" => $room["room_code"],
    "mode" => $room["mode"],
    "status" => "playing",
    "turn_order" => $turnOrderIds,
    "current_turn_player_id" => $currentTurnPlayerId,
    "scores" => $scores,
    "balls" => generateInitialBalls($room["mode"]),
    "created_at" => date("Y-m-d H:i:s")
];

    $stateStmt = $pdo->prepare("
        INSERT INTO match_states (
            match_id,
            state_json
        )
        VALUES (?, ?)
    ");
    $stateStmt->execute([
        $matchId,
        json_encode($initialState)
    ]);

    $updateRoomStmt = $pdo->prepare("
        UPDATE rooms
        SET status = 'playing'
        WHERE id = ?
    ");
    $updateRoomStmt->execute([$room["id"]]);

    $updatePlayersStmt = $pdo->prepare("
        UPDATE players
        SET status = 'playing',
            last_seen = NOW()
        WHERE current_room_id = ?
    ");
    $updatePlayersStmt->execute([$room["id"]]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Match berhasil dimulai",
        "match" => [
            "id" => $matchId,
            "room_id" => (int)$room["id"],
            "room_code" => $room["room_code"],
            "mode" => $room["mode"],
            "status" => "playing",
            "turn_order" => $turnOrderIds,
            "current_turn_player_id" => $currentTurnPlayerId
        ]
    ]);
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Gagal memulai match"
    ]);
}