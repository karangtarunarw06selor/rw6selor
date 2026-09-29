<?php
require_once __DIR__ . '/db.php';

handle_cors_preflight();

function health_json(array $payload, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function health_input(): array {
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET') return $_GET;
    $raw = (string)file_get_contents('php://input');
    $json = json_decode($raw, true);
    return is_array($json) ? $json : $_POST;
}

function health_schema(PDO $pdo): void {
    $pdo->exec("CREATE TABLE IF NOT EXISTS health_profiles (
        email VARCHAR(190) PRIMARY KEY,
        nama VARCHAR(160) DEFAULT '',
        gender VARCHAR(30) DEFAULT 'Laki-laki',
        umur INT DEFAULT 0,
        tb INT DEFAULT 0,
        bb DECIMAL(8,2) DEFAULT 0,
        diet VARCHAR(40) DEFAULT 'maintain',
        bmr INT DEFAULT 0,
        target_protein INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $pdo->exec("CREATE TABLE IF NOT EXISTS health_foods (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(160) NOT NULL,
        kalori INT NOT NULL DEFAULT 0,
        protein DECIMAL(8,2) NOT NULL DEFAULT 0,
        kategori VARCHAR(80) DEFAULT 'Makanan',
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        UNIQUE KEY uniq_food_nama (nama)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $pdo->exec("CREATE TABLE IF NOT EXISTS health_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(190) NOT NULL,
        log_type ENUM('makanan','aktivitas') NOT NULL,
        nama VARCHAR(220) NOT NULL,
        detail TEXT NULL,
        kalori INT NOT NULL DEFAULT 0,
        protein DECIMAL(8,2) NOT NULL DEFAULT 0,
        kategori VARCHAR(120) DEFAULT NULL,
        log_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_health_logs_email_date (email, log_date),
        INDEX idx_health_logs_type (log_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $count = (int)$pdo->query('SELECT COUNT(*) FROM health_foods')->fetchColumn();
    if ($count === 0) {
        $seed = [
            ['Nasi Putih 1 porsi', 260, 5, 'Makanan'], ['Telur Ayam', 75, 6, 'Makanan'], ['Ayam Goreng', 240, 20, 'Makanan'],
            ['Tempe Goreng', 160, 10, 'Makanan'], ['Tahu Goreng', 120, 8, 'Makanan'], ['Susu UHT', 150, 7, 'Minuman'],
            ['Teh Manis', 90, 0, 'Minuman'], ['Kopi Susu', 120, 3, 'Minuman'], ['Pisang', 100, 1, 'Buah'], ['Roti Tawar', 80, 3, 'Makanan']
        ];
        $stmt = $pdo->prepare('INSERT IGNORE INTO health_foods (nama, kalori, protein, kategori) VALUES (?, ?, ?, ?)');
        foreach ($seed as $row) $stmt->execute($row);
    }
}

function health_calc_bmr(string $gender, int $umur, int $tb, float $bb): int {
    if ($umur <= 0 || $tb <= 0 || $bb <= 0) return 0;
    $base = 10 * $bb + 6.25 * $tb - 5 * $umur;
    $base += strtolower($gender) === 'perempuan' ? -161 : 5;
    return (int)round($base);
}

function health_target_protein(float $bb): int {
    return $bb > 0 ? (int)round($bb * 1.6) : 0;
}

function health_jurnal(PDO $pdo, string $email): array {
    $stmt = $pdo->prepare('SELECT * FROM health_logs WHERE email = ? AND log_date = CURDATE() ORDER BY id DESC');
    $stmt->execute([$email]);
    $makanan = [];
    $aktivitas = [];
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        if ($row['log_type'] === 'makanan') {
            $makanan[] = ['idLog' => (string)$row['id'], 'nama' => $row['nama'], 'kalori' => (int)$row['kalori'], 'protein' => (float)$row['protein'], 'kategori' => $row['kategori'] ?: 'Makanan'];
        } else {
            $aktivitas[] = ['idLog' => (string)$row['id'], 'jenis' => $row['nama'], 'detail' => $row['detail'] ?: '', 'kalori' => (int)$row['kalori']];
        }
    }
    return ['makanan' => $makanan, 'aktivitas' => $aktivitas];
}

function health_totals(array $jurnal): array {
    $kaloriMasuk = 0; $proteinMasuk = 0; $kaloriBakar = 0;
    foreach ($jurnal['makanan'] as $item) { $kaloriMasuk += (int)$item['kalori']; $proteinMasuk += (float)$item['protein']; }
    foreach ($jurnal['aktivitas'] as $item) { $kaloriBakar += (int)$item['kalori']; }
    return ['kaloriMasuk' => $kaloriMasuk, 'proteinMasuk' => $proteinMasuk, 'kaloriBakar' => $kaloriBakar];
}

function health_profile_payload(PDO $pdo, string $email): array {
    $stmt = $pdo->prepare('SELECT * FROM health_profiles WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) return [];
    $jurnal = health_jurnal($pdo, $email);
    $totals = health_totals($jurnal);
    return [
        'email' => $email,
        'nama' => $row['nama'] ?: '',
        'gender' => $row['gender'] ?: 'Laki-laki',
        'umur' => (int)$row['umur'],
        'tb' => (int)$row['tb'],
        'bb' => (float)$row['bb'],
        'diet' => $row['diet'] ?: 'maintain',
        'bmr' => (int)$row['bmr'],
        'targetProtein' => (int)$row['target_protein'],
        'kaloriMasuk' => $totals['kaloriMasuk'],
        'proteinMasuk' => $totals['proteinMasuk'],
        'kaloriBakar' => $totals['kaloriBakar'],
    ];
}

try {
    $pdo = db();
    health_schema($pdo);
    $input = health_input();
    $aksi = (string)($input['aksi'] ?? '');

    if ($aksi === 'getMakanan') {
        $rows = $pdo->query('SELECT nama, kalori, protein, kategori FROM health_foods WHERE is_active = 1 ORDER BY nama ASC')->fetchAll(PDO::FETCH_ASSOC);
        health_json($rows);
    }

    $email = strtolower(trim((string)($input['email'] ?? '')));
    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) health_json(['status' => 'error', 'message' => 'Email tidak valid.'], 422);

    if ($aksi === 'login') {
        $payload = health_profile_payload($pdo, $email);
        if ($payload) health_json(['status' => 'old_user', 'data' => $payload, 'jurnal' => health_jurnal($pdo, $email)]);
        health_json(['status' => 'new_user', 'data' => null, 'jurnal' => ['makanan' => [], 'aktivitas' => []]]);
    }

    if ($aksi === 'simpanProfil') {
        $gender = (string)($input['gender'] ?? 'Laki-laki');
        $umur = (int)($input['umur'] ?? 0);
        $tb = (int)($input['tb'] ?? 0);
        $bb = (float)($input['bb'] ?? 0);
        $bmr = health_calc_bmr($gender, $umur, $tb, $bb);
        $targetProtein = health_target_protein($bb);
        $stmt = $pdo->prepare('INSERT INTO health_profiles (email, nama, gender, umur, tb, bb, diet, bmr, target_protein) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE nama=VALUES(nama), gender=VALUES(gender), umur=VALUES(umur), tb=VALUES(tb), bb=VALUES(bb), diet=VALUES(diet), bmr=VALUES(bmr), target_protein=VALUES(target_protein)');
        $stmt->execute([$email, trim((string)($input['nama'] ?? '')), $gender, $umur, $tb, $bb, (string)($input['diet'] ?? 'maintain'), $bmr, $targetProtein]);
        health_json(['status' => 'success', 'bmr' => $bmr, 'targetProtein' => $targetProtein, 'jurnal' => health_jurnal($pdo, $email)]);
    }

    if ($aksi === 'logMakan') {
        $stmt = $pdo->prepare("INSERT INTO health_logs (email, log_type, nama, kalori, protein, kategori, log_date) VALUES (?, 'makanan', ?, ?, ?, ?, CURDATE())");
        $stmt->execute([$email, (string)($input['namaMakanan'] ?? 'Makanan'), (int)($input['kalori'] ?? 0), (float)($input['protein'] ?? 0), (string)($input['kategori'] ?? 'Makanan')]);
        $jurnal = health_jurnal($pdo, $email); $totals = health_totals($jurnal);
        health_json(['status' => 'success', 'kaloriSekarang' => $totals['kaloriMasuk'], 'proteinSekarang' => $totals['proteinMasuk'], 'jurnal' => $jurnal]);
    }

    if ($aksi === 'logAktivitas') {
        $stmt = $pdo->prepare("INSERT INTO health_logs (email, log_type, nama, detail, kalori, log_date) VALUES (?, 'aktivitas', ?, ?, ?, CURDATE())");
        $stmt->execute([$email, (string)($input['jenis'] ?? 'Aktivitas'), (string)($input['detail'] ?? ''), (int)($input['kalBakar'] ?? 0)]);
        $jurnal = health_jurnal($pdo, $email); $totals = health_totals($jurnal);
        health_json(['status' => 'success', 'bakarSekarang' => $totals['kaloriBakar'], 'jurnal' => $jurnal]);
    }

    if ($aksi === 'hapusLogPerBaris') {
        $stmt = $pdo->prepare('DELETE FROM health_logs WHERE id = ? AND email = ? LIMIT 1');
        $stmt->execute([(int)($input['idLog'] ?? 0), $email]);
        $jurnal = health_jurnal($pdo, $email); $totals = health_totals($jurnal);
        health_json(['status' => 'success', 'kaloriMasuk' => $totals['kaloriMasuk'], 'proteinMasuk' => $totals['proteinMasuk'], 'kaloriBakar' => $totals['kaloriBakar'], 'jurnal' => $jurnal]);
    }

    if ($aksi === 'resetHarian') {
        $stmt = $pdo->prepare('DELETE FROM health_logs WHERE email = ? AND log_date = CURDATE()');
        $stmt->execute([$email]);
        health_json(['status' => 'success', 'jurnal' => ['makanan' => [], 'aktivitas' => []]]);
    }

    health_json(['status' => 'error', 'message' => 'Aksi tidak valid.'], 400);
} catch (Throwable $error) {
    health_json(['status' => 'error', 'message' => $error->getMessage()], 500);
}
