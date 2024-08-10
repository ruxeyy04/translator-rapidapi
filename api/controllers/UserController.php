<?php
include '../config.php';

class UserController
{
    private $conn;

    public function __construct($dbConnection)
    {
        $this->conn = $dbConnection;
    }

    public function register($fname, $lname, $username, $email, $password)
    {
        $stmt = $this->conn->prepare("SELECT * FROM userinfo WHERE username = ? OR email = ?");
        $stmt->bind_param('ss', $username, $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            return ['success' => false, 'message' => 'Username or email already exists.'];
        }

        $stmt = $this->conn->prepare("INSERT INTO userinfo (username, password, email, fname, lname, usertype) VALUES (?, ?, ?, ?, ?, 'user')");
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $stmt->bind_param('sssss', $username, $hashedPassword, $email, $fname, $lname);

        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Registration successful!'];
        } else {
            return ['success' => false, 'message' => 'Error: ' . $this->conn->error];
        }
    }

    public function login($username, $password)
    {
        $stmt = $this->conn->prepare("SELECT * FROM userinfo WHERE username = ?");
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if ($user && password_verify($password, $user['password'])) {
            return [
                'success' => true,
                'message' => 'Login successful!',
                'userid' => $user['userid']
            ];
        } else {
            return ['success' => false, 'message' => 'Invalid username or password.'];
        }
    }
}
