<?php
require_once '../controllers/UserController.php';

$controller = new UserController($conn);

header('Content-Type: application/json');

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        $userid = $_POST['userid'] ?? null;
        if ($userid) {
            $fname = $_POST['fname'] ?? '';
            $lname = $_POST['lname'] ?? '';
            $username = $_POST['user'] ?? '';
            $email = $_POST['email'] ?? '';

            $response = $controller->updateProfile($fname, $lname, $username, $email);
        } else {
            $fname = $_POST['fname'] ?? '';
            $lname = $_POST['lname'] ?? '';
            $username = $_POST['user'] ?? '';
            $email = $_POST['email'] ?? '';
            $password = $_POST['pass'] ?? '';

            $response = $controller->register($fname, $lname, $username, $email, $password);
        }
        break;

    case 'GET':
        if (isset($_GET['userid'])) {
            $response = $controller->fetchUser($_GET['userid']);
        } else {
            $response = $controller->fetchUsers();
        }
        break;

    case 'DELETE':
        parse_str(file_get_contents("php://input"), $deleteData);
        $userid = $deleteData['userid'] ?? null;
        if ($userid) {
            $response = $controller->deleteUser($userid);
        } else {
            $response = [
                'success' => false,
                'message' => 'User ID is required.'
            ];
        }
        break;
    case 'PUT':
        $putData = json_decode(file_get_contents("php://input"), true);

        $userid = $putData['userid'] ?? null;
        if ($userid) {
            $fname = $putData['fname'] ?? '';
            $lname = $putData['lname'] ?? '';
            $username = $putData['user'] ?? '';
            $email = $putData['email'] ?? '';
            $newPassword = $putData['pass'] ?? null;

            $response = $controller->updateUser($userid, $fname, $lname, $username, $email, $newPassword);
        } else {
            $response = [
                'success' => false,
                'message' => 'User ID is required.'
            ];
        }
        break;

        break;
    default:
        $response = [
            'success' => false,
            'message' => 'Invalid request method.'
        ];
        break;
}

echo json_encode($response);
