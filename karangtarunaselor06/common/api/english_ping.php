<?php
declare(strict_types=1);
require_once __DIR__ . '/english_helpers.php';
require_once __DIR__ . '/../db.php';
try { english_ensure_schema($pdo); english_json(['success' => true, 'message' => 'English Academy API tersambung.', 'counts' => english_table_counts($pdo)]); } catch (Throwable $e) { english_json(['success' => false, 'message' => $e->getMessage()], 500); }
