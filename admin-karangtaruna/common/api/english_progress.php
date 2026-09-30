<?php
declare(strict_types=1);

require_once __DIR__ . '/english_helpers.php';
require_once __DIR__ . '/../db.php';

function english_progress_member(PDO $pdo, array $input): array
{
    $email = strtolower(trim((string)($input['email'] ?? $_GET['email'] ?? '')));
    $memberId = (int)($input['member_id'] ?? $_GET['member_id'] ?? 0);

    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        english_json(['success' => false, 'message' => 'Email anggota diperlukan.'], 422);
    }

    $stmt = $pdo->prepare("SELECT id, member_code, full_name, email FROM members WHERE LOWER(email) = :email AND is_active = 1 LIMIT 1");
    $stmt->execute([':email' => $email]);
    $member = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$member || ($memberId > 0 && (int)$member['id'] !== $memberId)) {
        english_json(['success' => false, 'message' => 'Anggota aktif tidak ditemukan.'], 401);
    }

    return $member;
}

function english_progress_rows(PDO $pdo, int $memberId): array
{
    $stmt = $pdo->prepare("SELECT level, skor, benar, salah, total_soal, akurasi, xp, streak, last_played_at, completed_at FROM english_member_progress WHERE member_id = :member_id");
    $stmt->execute([':member_id' => $memberId]);

    $progress = [];
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $progress[(string)$row['level']] = [
            'level' => (string)$row['level'],
            'skor' => (int)$row['skor'],
            'benar' => (int)$row['benar'],
            'salah' => (int)$row['salah'],
            'totalSoal' => (int)$row['total_soal'],
            'akurasi' => (int)$row['akurasi'],
            'xp' => (int)$row['xp'],
            'streak' => (int)$row['streak'],
            'waktu' => $row['completed_at'] ?: $row['last_played_at'],
        ];
    }

    return $progress;
}

function english_progress_current_streak(PDO $pdo, int $memberId): int
{
    $stmt = $pdo->prepare("SELECT MAX(streak) FROM english_member_progress WHERE member_id = :member_id");
    $stmt->execute([':member_id' => $memberId]);
    return max(0, (int)$stmt->fetchColumn());
}

function english_progress_next_streak(PDO $pdo, int $memberId): int
{
    $stmt = $pdo->prepare("SELECT MAX(DATE(last_played_at)) FROM english_member_progress WHERE member_id = :member_id");
    $stmt->execute([':member_id' => $memberId]);
    $lastDate = (string)$stmt->fetchColumn();
    $current = english_progress_current_streak($pdo, $memberId);
    $today = (new DateTimeImmutable('today'))->format('Y-m-d');
    $yesterday = (new DateTimeImmutable('yesterday'))->format('Y-m-d');

    if ($lastDate === $today) return max(1, $current);
    if ($lastDate === $yesterday) return max(1, $current + 1);
    return 1;
}

try {
    english_ensure_schema($pdo);
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $input = $method === 'POST' ? json_input() : [];
    if ($method === 'POST' && !$input && !empty($_POST)) {
        $input = $_POST;
    }

    $member = english_progress_member($pdo, $input);
    $memberId = (int)$member['id'];

    if ($method === 'GET') {
        english_json([
            'success' => true,
            'member' => [
                'id' => $memberId,
                'email' => (string)$member['email'],
                'member_code' => (string)($member['member_code'] ?? ''),
                'full_name' => (string)($member['full_name'] ?? ''),
            ],
            'progress' => english_progress_rows($pdo, $memberId),
            'streak' => english_progress_current_streak($pdo, $memberId),
        ]);
    }

    if ($method !== 'POST') {
        english_json(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
    }

    $level = strtolower(trim((string)($input['level'] ?? '')));
    if (!in_array($level, ['basic', 'intermediate', 'advanced'], true)) {
        english_json(['success' => false, 'message' => 'Level latihan tidak valid.'], 422);
    }

    $skor = max(0, (int)($input['skor'] ?? 0));
    $benar = max(0, (int)($input['benar'] ?? 0));
    $salah = max(0, (int)($input['salah'] ?? 0));
    $totalSoal = max(0, (int)($input['totalSoal'] ?? $input['total_soal'] ?? ($benar + $salah)));
    $akurasi = max(0, min(100, (int)($input['akurasi'] ?? ($totalSoal > 0 ? round(($benar / $totalSoal) * 100) : 0))));
    $xp = $skor;
    $streak = english_progress_next_streak($pdo, $memberId);

    $existingStmt = $pdo->prepare("SELECT skor, akurasi FROM english_member_progress WHERE member_id = :member_id AND level = :level LIMIT 1");
    $existingStmt->execute([':member_id' => $memberId, ':level' => $level]);
    $existing = $existingStmt->fetch(PDO::FETCH_ASSOC);
    $keepExisting = $existing
        && ((int)$existing['akurasi'] > $akurasi || ((int)$existing['akurasi'] === $akurasi && (int)$existing['skor'] >= $skor));

    if (!$keepExisting) {
        $stmt = $pdo->prepare("
            INSERT INTO english_member_progress
                (member_id, email, level, skor, benar, salah, total_soal, akurasi, xp, streak, last_played_at, completed_at)
            VALUES
                (:member_id, :email, :level, :skor, :benar, :salah, :total_soal, :akurasi, :xp, :streak, NOW(), NOW())
            ON DUPLICATE KEY UPDATE
                email = VALUES(email),
                skor = VALUES(skor),
                benar = VALUES(benar),
                salah = VALUES(salah),
                total_soal = VALUES(total_soal),
                akurasi = VALUES(akurasi),
                xp = VALUES(xp),
                streak = GREATEST(streak, VALUES(streak)),
                last_played_at = VALUES(last_played_at),
                completed_at = VALUES(completed_at)
        ");
        $stmt->execute([
            ':member_id' => $memberId,
            ':email' => strtolower((string)$member['email']),
            ':level' => $level,
            ':skor' => $skor,
            ':benar' => $benar,
            ':salah' => $salah,
            ':total_soal' => $totalSoal,
            ':akurasi' => $akurasi,
            ':xp' => $xp,
            ':streak' => $streak,
        ]);
    }

    english_json([
        'success' => true,
        'message' => 'Progress latihan tersimpan.',
        'progress' => english_progress_rows($pdo, $memberId),
        'streak' => english_progress_current_streak($pdo, $memberId),
    ]);
} catch (Throwable $error) {
    english_json(['success' => false, 'message' => 'Progress latihan gagal: ' . $error->getMessage()], 500);
}
