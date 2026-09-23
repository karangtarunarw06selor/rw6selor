<?php
declare(strict_types=1);

// Shim lama untuk API yang masih require https://rw6selor.org/api/config/db.php.
// Sumber koneksi utama tetap common/db.php.
require_once __DIR__ . '/../../db.php';
