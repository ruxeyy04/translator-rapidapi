<?php
require_once '../controllers/RecordController.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $controller = new RecordController($conn);

    $result = $controller->addRecord(
        $data['source_lang'],
        $data['trans_lang'],
        $data['userid'],
        $data['datetime']
    );

    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Record added successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to add record']);
    }
}
