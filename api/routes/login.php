<?php
require_once '../controllers/UserController.php'; 

$controller = new UserController($conn);

// Retrieve POST data
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

$response = $controller->login($username, $password);
header('Content-Type: application/json');
echo json_encode($response);
