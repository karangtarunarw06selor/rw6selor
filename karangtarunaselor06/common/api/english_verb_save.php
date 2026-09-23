<?php
declare(strict_types=1);
require_once __DIR__ . '/english_helpers.php';
require_once __DIR__ . '/../db.php';
try { english_save_verb($pdo); } catch (Throwable $e) { english_json(['success' => false, 'message' => $e->getMessage()], 400); }
