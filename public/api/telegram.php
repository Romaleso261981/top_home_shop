<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed'], JSON_UNESCAPED_UNICODE);
  exit;
}

// Read env from hosting (do NOT hardcode tokens in repo)
$token = getenv('TELEGRAM_BOT_TOKEN') ?: '';
$chatId = getenv('TELEGRAM_CHAT_ID') ?: '';

if ($token === '' || $chatId === '') {
  http_response_code(500);
  echo json_encode([
    'ok' => false,
    'error' => 'Server is not configured (missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID)'
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

$raw = file_get_contents('php://input') ?: '';
$data = json_decode($raw, true);

if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Invalid JSON'], JSON_UNESCAPED_UNICODE);
  exit;
}

// Simple honeypot (bots often fill hidden fields)
$hp = trim((string)($data['website'] ?? ''));
if ($hp !== '') {
  http_response_code(200);
  echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
  exit;
}

$name = trim((string)($data['name'] ?? ''));
$phone = trim((string)($data['phone'] ?? ''));
$email = trim((string)($data['email'] ?? ''));
$message = trim((string)($data['message'] ?? ''));
$pageUrl = trim((string)($data['pageUrl'] ?? ''));

if ($phone === '' && $email === '' && $name === '' && $message === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Empty payload'], JSON_UNESCAPED_UNICODE);
  exit;
}

// Escape for Telegram HTML parse mode
function esc(string $s): string {
  return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$lines = [];
$lines[] = "<b>Нове звернення з сайту</b>";
if ($name !== '') $lines[] = "<b>Ім'я:</b> " . esc($name);
if ($phone !== '') $lines[] = "<b>Телефон:</b> " . esc($phone);
if ($email !== '') $lines[] = "<b>Email:</b> " . esc($email);
if ($message !== '') $lines[] = "<b>Повідомлення:</b>\n" . esc($message);
if ($pageUrl !== '') $lines[] = "<b>Сторінка:</b> " . esc($pageUrl);

$text = implode("\n", $lines);

$apiUrl = "https://api.telegram.org/bot{$token}/sendMessage";
$payload = json_encode([
  'chat_id' => $chatId,
  'text' => $text,
  'parse_mode' => 'HTML',
  'disable_web_page_preview' => true,
], JSON_UNESCAPED_UNICODE);

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$resp = curl_exec($ch);
$curlErr = curl_error($ch);
$httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($resp === false) {
  http_response_code(502);
  echo json_encode(['ok' => false, 'error' => 'cURL error: ' . $curlErr], JSON_UNESCAPED_UNICODE);
  exit;
}

if ($httpCode < 200 || $httpCode >= 300) {
  http_response_code(502);
  echo json_encode(['ok' => false, 'error' => 'Telegram API error', 'details' => $resp], JSON_UNESCAPED_UNICODE);
  exit;
}

echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);

