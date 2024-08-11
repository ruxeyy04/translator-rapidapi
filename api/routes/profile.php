<?php
require_once '../controllers/UserController.php'; 

$controller = new UserController($conn);

$action = $_GET['action'] ?? '';

$response = [];
switch ($action) {
    case 'getProfile':
        $userid = $_COOKIE['userid'];
        $response = $controller->getProfile($userid);
        break;
    default:
        $fname = $_POST['fname'] ?? '';
        $lname = $_POST['lname'] ?? '';
        $username = $_POST['user'] ?? '';
        $email = $_POST['email'] ?? '';
        $response = $controller->updateProfile($fname, $lname, $username, $email);
        break;
}

header('Content-Type: application/json');
echo json_encode($response);
