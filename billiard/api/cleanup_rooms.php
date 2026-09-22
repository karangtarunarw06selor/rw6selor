<?php
require_once "db.php";

$offlineSeconds = 30;

try {
    $pdo->beginTransaction();

    // Ambil semua room yang masih belum selesai
    $roomStmt = $pdo->prepare("
        SELECT
            id,
            room_code,
            status,
            host_player_id
        FROM rooms
        WHERE status IN ('waiting', 'ready')
    ");
    $roomStmt->execute();
    $rooms = $roomStmt->fetchAll();

    $deletedRooms = [];
    $transferredHosts = [];
    $removedPlayers = [];

    foreach ($rooms as $room) {
        $roomId = (int)$room["id"];
        $hostPlayerId = (int)$room["host_player_id"];

        // Ambil semua player dalam room + status aktifnya
        $playersStmt = $pdo->prepare("
            SELECT
                rp.id AS room_player_id,
                rp.player_id,
                rp.username,
                rp.is_host,
                rp.joined_at,
                p.last_seen,
                TIMESTAMPDIFF(SECOND, p.last_seen, NOW()) AS seconds_ago
            FROM room_players rp
            LEFT JOIN players p ON p.id = rp.player_id
            WHERE rp.room_id = ?
            ORDER BY rp.joined_at ASC
        ");
        $playersStmt->execute([$roomId]);
        $roomPlayers = $playersStmt->fetchAll();

        $activePlayers = [];
        $offlineRoomPlayerIds = [];

        foreach ($roomPlayers as $rp) {
            $secondsAgo = isset($rp["seconds_ago"]) ? (int)$rp["seconds_ago"] : 999999;

            if ($secondsAgo <= $offlineSeconds) {
                $activePlayers[] = $rp;
            } else {
                $offlineRoomPlayerIds[] = (int)$rp["room_player_id"];
            }
        }

        // Kalau tidak ada player aktif, hapus room dan semua player room-nya
        if (count($activePlayers) === 0) {
            $deleteRoomPlayers = $pdo->prepare("
                DELETE FROM room_players
                WHERE room_id = ?
            ");
            $deleteRoomPlayers->execute([$roomId]);

            $deleteRoom = $pdo->prepare("
                DELETE FROM rooms
                WHERE id = ?
            ");
            $deleteRoom->execute([$roomId]);

            $deletedRooms[] = $room["room_code"];
            continue;
        }

        // Hapus player offline dari room_players
        if (count($offlineRoomPlayerIds) > 0) {
    $placeholders = implode(",", array_fill(0, count($offlineRoomPlayerIds), "?"));

    $getOfflinePlayerIds = $pdo->prepare("
        SELECT player_id
        FROM room_players
        WHERE id IN ($placeholders)
    ");
    $getOfflinePlayerIds->execute($offlineRoomPlayerIds);
    $offlinePlayersInRoom = $getOfflinePlayerIds->fetchAll(PDO::FETCH_COLUMN);

    if (count($offlinePlayersInRoom) > 0) {
        $playerPlaceholders = implode(",", array_fill(0, count($offlinePlayersInRoom), "?"));

        $clearOfflinePlayersRoom = $pdo->prepare("
            UPDATE players
            SET current_room_id = NULL
            WHERE id IN ($playerPlaceholders)
        ");
        $clearOfflinePlayersRoom->execute($offlinePlayersInRoom);
    }

    $deleteOfflinePlayers = $pdo->prepare("
        DELETE FROM room_players
        WHERE id IN ($placeholders)
    ");
    $deleteOfflinePlayers->execute($offlineRoomPlayerIds);

    foreach ($offlineRoomPlayerIds as $removedId) {
        $removedPlayers[] = $removedId;
    }
}

        // Cek apakah host masih aktif
        $hostStillActive = false;

        foreach ($activePlayers as $active) {
            if ((int)$active["player_id"] === $hostPlayerId) {
                $hostStillActive = true;
                break;
            }
        }

        // Kalau host offline, pindahkan host ke player aktif paling awal masuk
        if (!$hostStillActive) {
            $newHost = $activePlayers[0];
            $newHostPlayerId = (int)$newHost["player_id"];

            // Reset semua is_host di room
            $resetHost = $pdo->prepare("
                UPDATE room_players
                SET is_host = 0
                WHERE room_id = ?
            ");
            $resetHost->execute([$roomId]);

            // Set host baru
            $setNewHost = $pdo->prepare("
                UPDATE room_players
                SET is_host = 1
                WHERE room_id = ? AND player_id = ?
            ");
            $setNewHost->execute([$roomId, $newHostPlayerId]);

            // Update host_player_id di rooms
            $updateRoomHost = $pdo->prepare("
                UPDATE rooms
                SET host_player_id = ?
                WHERE id = ?
            ");
            $updateRoomHost->execute([$newHostPlayerId, $roomId]);

            $transferredHosts[] = [
                "room_code" => $room["room_code"],
                "new_host_player_id" => $newHostPlayerId,
                "new_host_username" => $newHost["username"]
            ];
        }

        // Setelah offline player dihapus, hitung ulang ready status room
        $countStmt = $pdo->prepare("
            SELECT
                COUNT(*) AS total_players,
                SUM(CASE WHEN ready = 1 THEN 1 ELSE 0 END) AS ready_players
            FROM room_players
            WHERE room_id = ?
        ");
        $countStmt->execute([$roomId]);
        $counts = $countStmt->fetch();

        $totalPlayers = (int)$counts["total_players"];
        $readyPlayers = (int)$counts["ready_players"];

        $newStatus = ($totalPlayers >= 2 && $totalPlayers === $readyPlayers)
            ? "ready"
            : "waiting";

        $updateStatus = $pdo->prepare("
            UPDATE rooms
            SET status = ?
            WHERE id = ?
        ");
        $updateStatus->execute([$newStatus, $roomId]);
    }

    // Tandai player yang heartbeat-nya lama sebagai offline
    $offlinePlayers = $pdo->prepare("
        UPDATE players
        SET status = 'offline',
            current_room_id = NULL
        WHERE last_seen < (NOW() - INTERVAL $offlineSeconds SECOND)
          AND status != 'offline'
    ");
    $offlinePlayers->execute();

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Cleanup selesai",
        "deleted_rooms" => $deletedRooms,
        "transferred_hosts" => $transferredHosts,
        "removed_room_player_ids" => $removedPlayers
    ]);
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Cleanup gagal"
    ]);
}