<?php
include '../config.php';

class RecordController {
    private $conn;

    public function __construct($dbConnection)
    {
        $this->conn = $dbConnection;
    }

    public function addRecord($sourceLang, $transLang, $userId, $datetime) {
        $stmt = $this->conn->prepare("INSERT INTO translate_records (source_lang, trans_lang, userid, datetime) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssis", $sourceLang, $transLang, $userId, $datetime);
        
        $result = $stmt->execute();
        $stmt->close();

        return $result;
    }

    public function __destruct() {
        $this->conn->close();
    }
}
