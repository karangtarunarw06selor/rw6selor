<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

function cors_response_headers(): void
{
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

function handle_cors_preflight(): void
{
    cors_response_headers();
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = sprintf(
    'mysql:host=%s;port=3306;dbname=%s;charset=%s',
    DB_HOST,
    DB_NAME,
    DB_CHARSET
);
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    return $pdo;
}

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    cors_response_headers();
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function json_input(): array
{
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function require_field(array $data, string $field): string
{
    $value = trim((string)($data[$field] ?? ''));
    if ($value === '') {
        json_response(['ok' => false, 'message' => "Field {$field} wajib diisi."], 422);
    }
    return $value;
}
