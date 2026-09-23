<?php
declare(strict_types=1);
require_once __DIR__ . '/english_helpers.php';
require_once __DIR__ . '/../db.php';
try { english_list_exercises($pdo, false); } catch (Throwable $e) { english_json(['success' => false, 'message' => $e->getMessage()], 500); }
