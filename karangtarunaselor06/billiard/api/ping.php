<?php
require_once "db.php";

echo json_encode([
    "success" => true,
    "message" => "API aktif dan database tersambung"
]);