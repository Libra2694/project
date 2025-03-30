<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$API_KEY = "AIzaSyChr3ZTEV6G3O3D3u5cQQ626l6Ia6FZ_D8";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $prompt = $input['message'] ?? '';

    try {
        $data = [
            'contents' => [
                'parts' => [
                    ['text' => $prompt]
                ]
            ],
            'generationConfig' => [
                'temperature' => 0.7,
                'maxOutputTokens' => 1000
            ]
        ];

        $options = [
            'http' => [
                'header' => "Content-Type: application/json\r\n",
                'method' => 'POST',
                'content' => json_encode($data),
                'ignore_errors' => true
            ]
        ];

        $context = stream_context_create($options);
        $response = file_get_contents(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={$API_KEY}",
            false,
            $context
        );

        if ($response === FALSE) {
            throw new Exception("Failed to get response from API");
        }

        echo $response;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>