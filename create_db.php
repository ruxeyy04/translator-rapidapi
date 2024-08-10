<?php
// run this file using command : php create_db.php
require_once 'vendor/autoload.php'; 

use Dotenv\Dotenv;
$dotenv = Dotenv::createImmutable(__DIR__); 
$dotenv->load();
$host = $_ENV['DB_HOST'];
$user = $_ENV['DB_USER'];
$pass = $_ENV['DB_PASS'];
$dbname = $_ENV['DB_NAME'];

$conn = new mysqli($host, $user, $pass);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "CREATE DATABASE IF NOT EXISTS `$dbname`";
if ($conn->query($sql) === TRUE) {
    echo "Database created or already exists.\n";
} else {
    die("Error creating database: " . $conn->error);
}

$conn->select_db($dbname);

$tableQueries = "
CREATE TABLE IF NOT EXISTS `translate_records` (
  `rec_id` int(11) NOT NULL AUTO_INCREMENT,
  `source_lang` text NOT NULL,
  `trans_lang` text NOT NULL,
  `userid` int(11) NOT NULL,
  `datetime` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`rec_id`),
  KEY `userid` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `userinfo` (
  `userid` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `fname` varchar(255) NOT NULL,
  `lname` varchar(255) NOT NULL,
  `usertype` varchar(50) NOT NULL DEFAULT 'Client',
  `datetime` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Constraints
ALTER TABLE `translate_records`
  ADD CONSTRAINT `translate_records_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `userinfo` (`userid`) ON DELETE CASCADE;
";

if ($conn->multi_query($tableQueries)) {
    do {
        if ($result = $conn->store_result()) {
            $result->free();
        }
    } while ($conn->more_results() && $conn->next_result());

    echo "Tables and constraints created successfully.\n";
} else {
    echo "Error creating tables or constraints: " . $conn->error . "\n";
}

$conn->close();
?>