<?php
require_once '../controllers/RecordController.php';
require_once '../config.php'; // Include config.php to access the timestamp

$controller = new RecordController($conn);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['action'])) {
        switch ($data['action']) {
            case 'fetch':
                $userid = $data['userid'] ?? null;
                if ($userid !== null) {
                    $records = $controller->getRecordsByUser($userid);
                    echo json_encode($records);
                } else {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'User ID is required']);
                }
                break;

            case 'delete':
                $rec_id = $data['rec_id'] ?? null;
                if ($rec_id !== null) {
                    $result = $controller->deleteRecord($rec_id);
                    if ($result) {
                        echo json_encode(['success' => true, 'message' => 'Record deleted successfully']);
                    } else {
                        http_response_code(500);
                        echo json_encode(['success' => false, 'message' => 'Failed to delete record']);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'Record ID is required']);
                }
                break;

            case 'add':
            default:
                $source_lang = $data['source_lang'] ?? null;
                $trans_lang = $data['trans_lang'] ?? null;
                $userid = $data['userid'] ?? null;

                if ($source_lang && $trans_lang && $userid) {
                    $result = $controller->addRecord($source_lang, $trans_lang, $userid, $timestamp); // Use the timestamp here
                    if ($result) {
                        echo json_encode(['success' => true, 'message' => 'Record added successfully']);
                    } else {
                        http_response_code(500);
                        echo json_encode(['success' => false, 'message' => 'Failed to add record']);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'All fields are required']);
                }
                break;
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid request']);
    }
    header('Content-Type: application/json');
}
