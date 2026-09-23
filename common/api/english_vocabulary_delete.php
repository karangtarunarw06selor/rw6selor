<?php
declare(strict_types=1);
require_once __DIR__ . '/english_helpers.php';
require_once __DIR__ . '/../db.php';
try { english_delete_row($pdo, 'english_vocabulary'); } catch (Throwable $e) { english_json(['success' => false, 'message' => $e->getMessage()], 400); }
