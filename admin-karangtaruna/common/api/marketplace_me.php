<?php
declare(strict_types=1);

require_once __DIR__ . '/marketplace_helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
}

$user = current_user();

json_response([
    'success' => true,
    'logged_in' => (bool) $user,
    'user' => $user
]);
