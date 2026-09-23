<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

$outputPath = __DIR__ . '/../sql/mudamudi_common_SAFE_UPDATE.sql';
$database = DB_NAME;

function sql_ident(string $name): string
{
    return '`' . str_replace('`', '``', $name) . '`';
}

function sql_value(mixed $value): string
{
    global $pdo;
    if ($value === null) {
        return 'NULL';
    }
    return $pdo->quote((string)$value);
}

function normalize_create_table(string $sql): string
{
    $sql = preg_replace('/^CREATE TABLE `/i', 'CREATE TABLE IF NOT EXISTS `', $sql);
    $sql = preg_replace('/AUTO_INCREMENT=\d+\s+/i', '', (string)$sql);
    return rtrim((string)$sql, ";\n") . ";\n";
}

function column_definition(array $column, bool $forAlter = false): string
{
    $definition = sql_ident((string)$column['COLUMN_NAME']) . ' ' . (string)$column['COLUMN_TYPE'];

    if (($column['CHARACTER_SET_NAME'] ?? null) !== null) {
        $definition .= ' CHARACTER SET ' . $column['CHARACTER_SET_NAME'];
    }
    if (($column['COLLATION_NAME'] ?? null) !== null) {
        $definition .= ' COLLATE ' . $column['COLLATION_NAME'];
    }

    $extra = (string)($column['EXTRA'] ?? '');
    $hasDefault = array_key_exists('COLUMN_DEFAULT', $column) && $column['COLUMN_DEFAULT'] !== null;
    $isAutoIncrement = stripos($extra, 'auto_increment') !== false;
    $forceNullableForExistingData = $forAlter
        && !$isAutoIncrement
        && !$hasDefault
        && (($column['IS_NULLABLE'] ?? 'YES') === 'NO');

    $definition .= (($column['IS_NULLABLE'] ?? 'YES') === 'NO' && !$forceNullableForExistingData) ? ' NOT NULL' : ' NULL';

    if ($hasDefault) {
        $default = (string)$column['COLUMN_DEFAULT'];
        if (strtoupper($default) === 'CURRENT_TIMESTAMP' || preg_match('/^current_timestamp\(\)?$/i', $default)) {
            $definition .= ' DEFAULT CURRENT_TIMESTAMP';
        } else {
            $definition .= ' DEFAULT ' . sql_value($default);
        }
    } elseif (($column['IS_NULLABLE'] ?? 'YES') === 'YES' || $forceNullableForExistingData) {
        $definition .= ' DEFAULT NULL';
    }

    if ($extra !== '') {
        $extra = preg_replace('/DEFAULT_GENERATED\s*/i', '', $extra);
        $definition .= ' ' . trim((string)$extra);
    }

    if (($column['COLUMN_COMMENT'] ?? '') !== '') {
        $definition .= ' COMMENT ' . sql_value((string)$column['COLUMN_COMMENT']);
    }

    return $definition;
}

$tables = $pdo->query('SHOW FULL TABLES WHERE Table_type = "BASE TABLE"')->fetchAll(PDO::FETCH_NUM);

$sql = [];
$sql[] = '-- Safe update dump for mudamudi_common';
$sql[] = '-- Import file ini di hosting untuk menambah tabel/kolom/data tanpa menimpa data lama.';
$sql[] = '-- Generated: ' . date('Y-m-d H:i:s');
$sql[] = 'SET NAMES utf8mb4;';
$sql[] = 'SET FOREIGN_KEY_CHECKS=0;';
$sql[] = 'SET UNIQUE_CHECKS=0;';
$sql[] = '';

foreach ($tables as $tableRow) {
    $table = (string)$tableRow[0];
    $quotedTable = sql_ident($table);

    $createStmt = $pdo->query('SHOW CREATE TABLE ' . $quotedTable)->fetch(PDO::FETCH_ASSOC);
    $createSql = (string)($createStmt['Create Table'] ?? '');

    $sql[] = '-- --------------------------------------------------------';
    $sql[] = '-- Table structure for ' . $quotedTable;
    $sql[] = normalize_create_table($createSql);

    $columnsStmt = $pdo->prepare("
        SELECT *
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = :schema
          AND TABLE_NAME = :table
        ORDER BY ORDINAL_POSITION
    ");
    $columnsStmt->execute([':schema' => $database, ':table' => $table]);
    $columns = $columnsStmt->fetchAll(PDO::FETCH_ASSOC);

    $previousColumn = '';
    foreach ($columns as $column) {
        $columnName = (string)$column['COLUMN_NAME'];
        $definition = column_definition($column, true);
        $position = $previousColumn === '' ? ' FIRST' : ' AFTER ' . sql_ident($previousColumn);
        $alterSql = 'ALTER TABLE ' . $quotedTable . ' ADD COLUMN ' . $definition . $position;

        $sql[] = "SET @column_exists := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = " . sql_value($table) . " AND COLUMN_NAME = " . sql_value($columnName) . ");";
        $sql[] = "SET @safe_sql := IF(@column_exists = 0, " . sql_value($alterSql) . ", 'SELECT 1');";
        $sql[] = 'PREPARE safe_stmt FROM @safe_sql;';
        $sql[] = 'EXECUTE safe_stmt;';
        $sql[] = 'DEALLOCATE PREPARE safe_stmt;';
        $previousColumn = $columnName;
    }
    $sql[] = '';

    $columnNames = array_map(fn($column) => (string)$column['COLUMN_NAME'], $columns);
    if (!$columnNames) {
        continue;
    }

    $selectSql = 'SELECT ' . implode(', ', array_map('sql_ident', $columnNames)) . ' FROM ' . $quotedTable;
    $rows = $pdo->query($selectSql)->fetchAll(PDO::FETCH_ASSOC);
    if (!$rows) {
        continue;
    }

    $sql[] = '-- Data for ' . $quotedTable;
    $sql[] = 'LOCK TABLES ' . $quotedTable . ' WRITE;';
    $sql[] = '/*!40000 ALTER TABLE ' . $quotedTable . ' DISABLE KEYS */;';

    $columnSql = '(' . implode(', ', array_map('sql_ident', $columnNames)) . ')';
    $batch = [];
    foreach ($rows as $row) {
        $values = [];
        foreach ($columnNames as $columnName) {
            $values[] = sql_value($row[$columnName] ?? null);
        }
        $batch[] = '(' . implode(',', $values) . ')';

        if (count($batch) >= 80) {
            $sql[] = 'INSERT IGNORE INTO ' . $quotedTable . ' ' . $columnSql . ' VALUES ' . implode(',', $batch) . ';';
            $batch = [];
        }
    }
    if ($batch) {
        $sql[] = 'INSERT IGNORE INTO ' . $quotedTable . ' ' . $columnSql . ' VALUES ' . implode(',', $batch) . ';';
    }

    $sql[] = '/*!40000 ALTER TABLE ' . $quotedTable . ' ENABLE KEYS */;';
    $sql[] = 'UNLOCK TABLES;';
    $sql[] = '';
}

$sql[] = 'SET UNIQUE_CHECKS=1;';
$sql[] = 'SET FOREIGN_KEY_CHECKS=1;';
$sql[] = '';

file_put_contents($outputPath, implode("\n", $sql));

header('Content-Type: text/plain; charset=utf-8');
echo "Safe update dump berhasil dibuat:\n";
echo $outputPath . "\n";
