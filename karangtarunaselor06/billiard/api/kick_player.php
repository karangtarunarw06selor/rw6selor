<?php
require_once __DIR__ . "/db.php";
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true) ?: [];
$roomCode = trim($data["room_code"] ?? "");
$hostKey = trim($data["player_key"] ?? "");
$targetId = (int)($data["target_player_id"] ?? 0);
if ($roomCode === "" || $hostKey === "" || $targetId < 1) {
    echo json_encode(["success" => false, "message" => "Data kick tidak lengkap"]);
    exit;
}

try {
    $pdo->beginTransaction();
    $stmt = $pdo->prepare("
        SELECT r.id, r.host_player_id, p.id AS requester_id
        FROM rooms r
        INNER JOIN players p ON p.player_key = ?
        INNER JOIN room_players rp ON rp.room_id = r.id AND rp.player_id = p.id
        WHERE r.room_code = ?
        LIMIT 1
        FOR UPDATE
    ");
    $stmt->execute([$hostKey, $roomCode]);
    $room = $stmt->fetch();
    if (!$room || (int)$room["host_player_id"] !== (int)$room["requester_id"]) throw new Exception("Hanya host yang dapat mengeluarkan pemain");
    if ($targetId === (int)$room["requester_id"]) throw new Exception("Host tidak dapat mengeluarkan diri sendiri");

    $target = $pdo->prepare("SELECT id FROM room_players WHERE room_id = ? AND player_id = ? LIMIT 1");
    $target->execute([(int)$room["id"], $targetId]);
    if (!$target->fetch()) throw new Exception("Pemain tidak ditemukan di room ini");

    $delete = $pdo->prepare("DELETE FROM room_players WHERE room_id = ? AND player_id = ?");
    $delete->execute([(int)$room["id"], $targetId]);
    $pdo->commit();
    echo json_encode(["success" => true, "message" => "Pemain dikeluarkan dari room"]);
} catch (Throwable $error) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    echo json_encode(["success" => false, "message" => $error->getMessage()]);
}
