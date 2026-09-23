<?php
declare(strict_types=1);

require_once __DIR__ . '/marketplace_helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
}

unset($_SESSION['marketplace_user_id']);

json_response([
    'success' => true,
    'message' => 'Logout berhasil.'
]);
