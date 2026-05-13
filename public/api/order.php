<?php
declare(strict_types=1);

/**
 * Заявки з форми сайту.
 *
 * 1) Якщо задано змінну середовища FORM_WEBHOOK_URL — POST JSON туди (Make, Zapier, власний скрипт, Telegram через посередника тощо).
 * 2) Інакше — допис рядка у storage/orders.jsonl поруч із сайтом (потрібні права на запис).
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function formEnv(string $name): string
{
  $v = getenv($name);
  if ($v !== false && $v !== '') {
    return $v;
  }
  if (isset($_ENV[$name]) && is_string($_ENV[$name]) && $_ENV[$name] !== '') {
    return $_ENV[$name];
  }
  if (isset($_SERVER[$name]) && is_string($_SERVER[$name]) && $_SERVER[$name] !== '') {
    return $_SERVER[$name];
  }
  return '';
}

/**
 * @param array{name: string, phone: string, email: string, message: string, pageUrl: string} $lead
 */
function sendToWebhook(string $url, array $lead): array
{
  $payload = json_encode([
    'source' => 'website',
    'name' => $lead['name'],
    'phone' => $lead['phone'],
    'email' => $lead['email'],
    'message' => $lead['message'],
    'pageUrl' => $lead['pageUrl'],
  ], JSON_UNESCAPED_UNICODE);

  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
  curl_setopt($ch, CURLOPT_TIMEOUT, 15);

  $resp = curl_exec($ch);
  $curlErr = curl_error($ch);
  $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);

  if ($resp === false) {
    return ['ok' => false, 'error' => 'cURL error: ' . $curlErr];
  }
  if ($httpCode >= 200 && $httpCode < 300) {
    return ['ok' => true];
  }
  return ['ok' => false, 'error' => 'Webhook error (HTTP ' . $httpCode . ')', 'details' => $resp];
}

/**
 * @param array{name: string, phone: string, email: string, message: string, pageUrl: string} $lead
 */
function appendOrderFile(array $lead): bool
{
  $root = dirname(__DIR__);
  $dir = $root . '/storage';
  if (!is_dir($dir)) {
    if (!@mkdir($dir, 0755, true)) {
      return false;
    }
  }
  $line = json_encode(['t' => gmdate('c'), ...$lead], JSON_UNESCAPED_UNICODE) . "\n";
  $path = $dir . '/orders.jsonl';
  $ok = @file_put_contents($path, $line, FILE_APPEND | LOCK_EX);
  return $ok !== false;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed'], JSON_UNESCAPED_UNICODE);
  exit;
}

$raw = file_get_contents('php://input') ?: '';
$data = json_decode($raw, true);

if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Invalid JSON'], JSON_UNESCAPED_UNICODE);
  exit;
}

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

$lead = [
  'name' => $name,
  'phone' => $phone,
  'email' => $email,
  'message' => $message,
  'pageUrl' => $pageUrl,
];

$webhook = formEnv('FORM_WEBHOOK_URL');

if ($webhook !== '') {
  $result = sendToWebhook($webhook, $lead);
  if (!$result['ok']) {
    $msg = $result['error'] ?? 'Unknown error';
    http_response_code(strpos($msg, 'cURL') === 0 ? 502 : 502);
    $out = ['ok' => false, 'error' => $msg];
    if (isset($result['details'])) {
      $out['details'] = $result['details'];
    }
    echo json_encode($out, JSON_UNESCAPED_UNICODE);
    exit;
  }
  echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
  exit;
}

if (appendOrderFile($lead)) {
  echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
  exit;
}

http_response_code(500);
echo json_encode([
  'ok' => false,
  'error' => 'Не вдалося зберегти заявку. Задайте FORM_WEBHOOK_URL у середовищі хостингу або дайте PHP права на запис у папку storage/',
], JSON_UNESCAPED_UNICODE);
