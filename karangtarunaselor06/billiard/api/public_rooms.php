<?php
require_once "db.php";

header("Content-Type: application/json");

$mode = isset($_GET["mode"]) ? trim($_GET["mode"]) : "straight_pool";

try {
    $stmt = $pdo->prepare("
        SELECT
            r.id,
            r.room_code,
            r.mode,
            r.play_type,
            r.visibility,
            r.status,
            r.host_player_id,
            r.min_players,
            r.max_players,
            r.created_at,
            p.username AS host_username,
            COUNT(rp.id) AS player_count,
            SUM(CASE WHEN rp.ready = 1 THEN 1 ELSE 0 END) AS ready_count
        FROM rooms r
        LEFT JOIN players p ON p.id = r.host_player_id
        LEFT JOIN room_players rp ON rp.room_id = r.id
        WHERE r.play_type = 'online'
          AND r.visibility = 'public'
          AND r.mode = ?
          AND r.status IN ('waiting', 'ready')
        GROUP BY
            r.id,
            r.room_code,
            r.mode,
            r.play_type,
            r.visibility,
            r.status,
            r.host_player_id,
            r.min_players,
            r.max_players,
            r.created_at,
            p.username
        HAVING player_count < r.max_players
        ORDER BY r.created_at ASC
        LIMIT 30
    ");

    $stmt->execute([$mode]);
    $rooms = $stmt->fetchAll();

    echo json_encode([
        "success" => true,
        "rooms" => $rooms,
        "count" => count($rooms)
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil daftar room"
    ]);
}