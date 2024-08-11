<?php
require_once '../controllers/UserController.php'; 

$controller = new UserController($conn);

$oldPassword = $_POST['old_password'] ?? '';
$newPassword = $_POST['new_password'] ?? '';
$confirmPassword = $_POST['confirm_password'] ?? '';

$response = $controller->changePassword($oldPassword, $newPassword, $confirmPassword);
header('Content-Type: application/json');
echo json_encode($response);
?>
