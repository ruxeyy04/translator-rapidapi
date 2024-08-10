<?php
require_once '../controllers/UserController.php'; 

$controller = new UserController($conn);

$fname = $_POST['fname'] ?? '';
$lname = $_POST['lname'] ?? '';
$username = $_POST['user'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['pass'] ?? '';

$response = $controller->register($fname, $lname, $username, $email, $password);
header('Content-Type: application/json');
echo json_encode($response);
