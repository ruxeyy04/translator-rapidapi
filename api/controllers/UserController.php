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
    public function updateProfile($fname, $lname, $username, $email) {
        if (empty($fname) || empty($lname) || empty($username) || empty($email)) {
            return [
                'success' => false,
                'message' => 'All fields are required.'
            ];
        }
    
        // Get the current user's ID
        $userid = $_COOKIE['userid']; // Assumes user ID is stored in a cookie
    
        // Fetch the current username and email for this user
        $stmt = $this->conn->prepare('SELECT username, email FROM userinfo WHERE userid = ?');
        $stmt->bind_param('i', $userid);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
    
        // Check if username or email is already taken by someone else
        $stmt = $this->conn->prepare('SELECT userid FROM userinfo WHERE (username = ? OR email = ?) AND userid != ?');
        $stmt->bind_param('ssi', $username, $email, $userid);
        $stmt->execute();
        $result = $stmt->get_result();
    
        if ($result->num_rows > 0) {
            return [
                'success' => false,
                'message' => 'Username or email is already taken.'
            ];
        }
    
        // Update user profile information
        $stmt = $this->conn->prepare('UPDATE userinfo SET fname = ?, lname = ?, username = ?, email = ? WHERE userid = ?');
        $stmt->bind_param('ssssi', $fname, $lname, $username, $email, $userid);
    
        if ($stmt->execute()) {
            return [
                'success' => true,
                'message' => 'Profile updated successfully.'
            ];
        } else {
            return [
                'success' => false,
                'message' => 'Failed to update profile.'
            ];
        }
    }
    
    public function changePassword($oldPassword, $newPassword, $confirmPassword) {

        if (empty($oldPassword) || empty($newPassword) || empty($confirmPassword)) {
            return [
                'success' => false,
                'message' => 'All fields are required.'
            ];
        }

        if ($newPassword !== $confirmPassword) {
            return [
                'success' => false,
                'message' => 'New password and confirmation do not match.'
            ];
        }

        $userid = $_COOKIE['userid']; 
        $stmt = $this->conn->prepare('SELECT password FROM userinfo WHERE userid = ?');
        $stmt->bind_param('i', $userid);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        if (!password_verify($oldPassword, $row['password'])) {
            return [
                'success' => false,
                'message' => 'Old password is incorrect.'
            ];
        }

        $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
        $stmt = $this->conn->prepare('UPDATE userinfo SET password = ? WHERE userid = ?');
        $stmt->bind_param('si', $hashedPassword, $userid);

        if ($stmt->execute()) {
            return [
                'success' => true,
                'message' => 'Password changed successfully.'
            ];
        } else {
            return [
                'success' => false,
                'message' => 'Failed to change password.'
            ];
        }
    }
    public function getProfile($userid) {
  
        if (empty($userid)) {
            return [
                'success' => false,
                'message' => 'User ID is required.'
            ];
        }
    
        $stmt = $this->conn->prepare('SELECT fname, lname, username, email FROM userinfo WHERE userid = ?');
        $stmt->bind_param('i', $userid);
        $stmt->execute();
        $result = $stmt->get_result();
    
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            return [
                'success' => true,
                'data' => $user
            ];
        } else {
            return [
                'success' => false,
                'message' => 'User not found.'
            ];
        }
    }
    
}
