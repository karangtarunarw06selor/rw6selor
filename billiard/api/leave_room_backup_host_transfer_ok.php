<?php
require_once __DIR__ . "/db.php";

header("Content-Type: application/json");

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$roomCode = isset($data["room_code"]) ? trim($data["room_code"]) : "";
$playerKey = isset($data["player_key"]) ? trim($data["player_key"]) : "";

if ($roomCode === "" || $playerKey === "") {
    echo json_encode([
        "success" => false,
        "message" => "room_code atau player_key kosong"
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

    $playerStmt = $pdo->prepare("
        SELECT id
        FROM players
        WHERE player_key = ?
        LIMIT 1
    ");
    $playerStmt->execute([$playerKey]);
    $player = $playerStmt->fetch();

    if (!$player) {
        throw new Exception("Player tidak ditemukan");
    }

    $playerId = (int)$player["id"];

    $roomPlayerStmt = $pdo->prepare("
        SELECT id, is_host
        FROM room_players
        WHERE room_id = ?
          AND player_id = ?
        LIMIT 1
    ");
    $roomPlayerStmt->execute([$roomId, $playerId]);
    $roomPlayer = $roomPlayerStmt->fetch();

    if (!$roomPlayer) {
        throw new Exception("Player tidak ada di room ini");
    }

    $wasHost = (int)$roomPlayer["is_host"] === 1;

    $deleteStmt = $pdo->prepare("
        DELETE FROM room_players
        WHERE room_id = ?
          AND player_id = ?
    ");
    $deleteStmt->execute([$roomId, $playerId]);

    $remainingStmt = $pdo->prepare("
        SELECT
            rp.id,
            rp.player_id,
            rp.turn_order
        FROM room_players rp
        WHERE rp.room_id = ?
        ORDER BY rp.turn_order ASC, rp.id ASC
    ");
    $remainingStmt->execute([$roomId]);
    $remainingPlayers = $remainingStmt->fetchAll();

    if (!$remainingPlayers || count($remainingPlayers) === 0) {
        $deleteRoomStmt = $pdo->prepare("
            DELETE FROM rooms
            WHERE id = ?
        ");
        $deleteRoomStmt->execute([$roomId]);

        $pdo->commit();

        echo json_encode([
            "success" => true,
            "message" => "Room dihapus karena sudah kosong",
            "room_deleted" => true,
            "new_host_player_id" => null
        ]);
        exit;
    }

    $newHostPlayerId = null;

    if ($wasHost) {
        $newHostPlayerId = (int)$remainingPlayers[0]["player_id"];

        $clearHostStmt = $pdo->prepare("
            UPDATE room_players
            SET is_host = 0
            WHERE room_id = ?
        ");
        $clearHostStmt->execute([$roomId]);

        $setHostStmt = $pdo->prepare("
            UPDATE room_players
            SET is_host = 1
            WHERE room_id = ?
              AND player_id = ?
        ");
        $setHostStmt->execute([$roomId, $newHostPlayerId]);
    }

    $updateRoomStmt = $pdo->prepare("
        UPDATE rooms
        SET status = 'waiting'
        WHERE id = ?
          AND status != 'playing'
    ");
    $updateRoomStmt->execute([$roomId]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => $wasHost ? "Host keluar, host baru dipindahkan" : "Player keluar room",
        "room_deleted" => false,
        "new_host_player_id" => $newHostPlayerId
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