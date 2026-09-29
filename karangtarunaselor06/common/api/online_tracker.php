<?php
require_once __DIR__ . '/db.php';

handle_cors_preflight();

function tracker_json(array $payload, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function tracker_schema(PDO $pdo): void {
    $pdo->exec("CREATE TABLE IF NOT EXISTS online_tracker (
        nama VARCHAR(120) PRIMARY KEY,
        email VARCHAR(190) DEFAULT NULL,
        last_ping TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_online_tracker_last (last_ping)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
}

try {
    $pdo = db();
    tracker_schema($pdo);
    
    $aksi = (string)($_GET['aksi'] ?? '');
    $namaUser = trim((string)($_GET['namaUser'] ?? ''));
    
    if ($aksi === 'pingUmum') {
        if ($namaUser === '') tracker_json(['status' => 'error', 'message' => 'namaUser diperlukan.'], 400);
        
        $stmt = $pdo->prepare('INSERT INTO online_tracker (nama, last_ping) VALUES (?, NOW()) ON DUPLICATE KEY UPDATE last_ping = NOW()');
        $stmt->execute([$namaUser]);
        
        $pdo->exec("DELETE FROM online_tracker WHERE last_ping < NOW() - INTERVAL 5 MINUTE");
        
        $stmt = $pdo->query('SELECT nama FROM online_tracker ORDER BY nama ASC');
        $onlineUsers = [];
        foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $onlineUsers[] = ['nama' => $row['nama']];
        }
        
        tracker_json(['status' => 'success', 'onlineUsers' => $onlineUsers]);
    }
    
    tracker_json(['status' => 'error', 'message' => 'Aksi tidak valid.'], 400);
} catch (Throwable $error) {
    tracker_json(['status' => 'error', 'message' => $error->getMessage()], 500);
}