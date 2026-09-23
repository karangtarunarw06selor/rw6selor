<?php
require_once "db.php";

try {
    $stmt = $pdo->prepare("
        SELECT 
            id,
            username,
            status,
            current_room_id,
            last_seen,
            TIMESTAMPDIFF(SECOND, last_seen, NOW()) AS seconds_ago
        FROM players
        WHERE last_seen >= (NOW() - INTERVAL 20 SECOND)
        ORDER BY last_seen DESC
    ");
    $stmt->execute();

    $players = $stmt->fetchAll();

    echo json_encode([
        "success" => true,
        "players" => $players,
        "count" => count($players)
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil player aktif"
    ]);
}