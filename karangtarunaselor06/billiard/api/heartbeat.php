<?php
require_once "db.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$playerKey = trim($data["player_key"] ?? "");

if ($playerKey === "") {
    echo json_encode([
        "success" => false,
        "message" => "Player key kosong"
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        UPDATE players
        SET last_seen = NOW(),
            status = CASE
                WHEN status = 'offline' THEN 'lobby'
                ELSE status
            END
        WHERE player_key = ?
    ");
    $stmt->execute([$playerKey]);

    echo json_encode([
        "success" => true,
        "message" => "Heartbeat updated"
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Gagal update heartbeat"
    ]);
}