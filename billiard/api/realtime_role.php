<?php
require_once "db.php";
header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true) ?: [];
$playerKey = trim((string)($input["player_key"] ?? ""));
$roomCode = strtoupper(trim((string)($input["room_code"] ?? "")));
if ($playerKey === "" || $roomCode === "") {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Identitas room tidak lengkap"]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT p.id AS player_id, rp.username, r.status, rp.turn_order
        FROM players p
        JOIN room_players rp ON rp.player_id = p.id
        JOIN rooms r ON r.id = rp.room_id
        WHERE p.player_key = ? AND r.room_code = ?
        LIMIT 1
    ");
    $stmt->execute([$playerKey, $roomCode]);
    $seat = $stmt->fetch();
    if (!$seat) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Seat tidak valid"]);
        exit;
    }
    echo json_encode([
        "success" => true,
        "player_id" => (int)$seat["player_id"],
        "username" => (string)$seat["username"],
        "spectator" => $seat["status"] === "playing" && $seat["turn_order"] === null,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Gagal memverifikasi seat"]);
}
