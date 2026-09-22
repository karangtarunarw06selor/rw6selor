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
        SELECT 
            id,
            player_key,
            username,
            status,
            current_room_id,
            last_seen
        FROM players
        WHERE player_key = ?
        LIMIT 1
    ");
    $stmt->execute([$playerKey]);
    $player = $stmt->fetch();

    if (!$player) {
        echo json_encode([
            "success" => false,
            "message" => "Player tidak ditemukan"
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "player" => [
            "id" => (int)$player["id"],
            "player_key" => $player["player_key"],
            "username" => $player["username"],
            "status" => $player["status"],
            "current_room_id" => $player["current_room_id"] !== null ? (int)$player["current_room_id"] : null,
            "last_seen" => $player["last_seen"]
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil data player"
    ]);
}