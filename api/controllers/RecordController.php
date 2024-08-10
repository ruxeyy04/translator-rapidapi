<?php
include '../config.php';

class RecordController {
    private $conn;

    public function __construct($dbConnection)
    {
        $this->conn = $dbConnection;
    }

    public function getRecordsByUser($userid) {
        $stmt = $this->conn->prepare("SELECT rec_id, source_lang, trans_lang, datetime FROM translate_records WHERE userid = ?");
        $stmt->bind_param("i", $userid);
        $stmt->execute();
        $result = $stmt->get_result();
        $records = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();

        return $records;
    }

    public function deleteRecord($rec_id) {
        $stmt = $this->conn->prepare("DELETE FROM translate_records WHERE rec_id = ?");
        $stmt->bind_param("i", $rec_id);
        $result = $stmt->execute();
        $stmt->close();

        return $result;
    }

    public function addRecord($sourceLang, $transLang, $userId, $datetime) {
        if ($sourceLang && $transLang && $userId && $datetime) {
            $stmt = $this->conn->prepare("INSERT INTO translate_records (source_lang, trans_lang, userid, datetime) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssis", $sourceLang, $transLang, $userId, $datetime);
    
            $result = $stmt->execute();
            $stmt->close();
    
            return $result;
        }
        return false;
    }
    
}
