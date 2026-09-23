<?php
declare(strict_types=1);

define('DB_HOST', getenv('DB_HOST') ?: 'rw6selor-db');
define('DB_NAME', getenv('DB_NAME') ?: 'rw06selor');
define('DB_USER', getenv('DB_USER') ?: 'rw06selor');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_CHARSET', getenv('DB_CHARSET') ?: 'utf8mb4');
