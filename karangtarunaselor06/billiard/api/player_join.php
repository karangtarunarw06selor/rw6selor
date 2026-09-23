<?php
require_once "db.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$username = trim($data["username"] ?? "");
$playerKey = trim($data["player_key"] ?? "");

if ($username === "" || strlen($username) < 2) {
    echo json_encode([
        "success" => false,
        "message" => "Username minimal 2 karakter"
    ]);
    exit;
}

if ($playerKey === "") {
    echo json_encode([
        "success" => false,
        "message" => "Player key kosong"
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT id, username, player_key, status
        FROM players
        WHERE player_key = ?
        LIMIT 1
    ");
    $stmt->execute([$playerKey]);
    $existing = $stmt->fetch();

    if ($existing) {
        $update = $pdo->prepare("
            UPDATE players
            SET username = ?, status = 'lobby', last_seen = NOW()
            WHERE player_key = ?
        ");
        $update->execute([$username, $playerKey]);

        echo json_encode([
            "success" => true,
            "message" => "Player lama masuk lobby",
            "player" => [
                "id" => (int)$existing["id"],
                "username" => $username,
                "player_key" => $playerKey,
                "status" => "lobby"
            ]
        ]);
        exit;
    }

    $insert = $pdo->prepare("
        INSERT INTO players (player_key, username, status, last_seen)
        VALUES (?, ?, 'lobby', NOW())
    ");
    $insert->execute([$playerKey, $username]);

    $playerId = $pdo->lastInsertId();

    echo json_encode([
        "success" => true,
        "message" => "Player baru masuk lobby",
        "player" => [
            "id" => (int)$playerId,
            "username" => $username,
            "player_key" => $playerKey,
            "status" => "lobby"
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Gagal menyimpan player"
    ]);
}