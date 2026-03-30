<?php
declare(strict_types=1);

/**
 * Резерв: можна задати тут. Безпечніше на проді — змінні середовища в панелі хостингу
 * (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID), без токена в git.
 */
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID_HERE';

/**
 * Багато хостингів передають змінні лише в $_SERVER / $_ENV.
 */
function telegramEnv(string $name): string
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
 * Спочатку env (хостинг), інакше константи (якщо не плейсхолдери).
 *
 * @return array{token: string, chat_id: string}
 */
function resolveTelegramCredentials(): array
{
  $token = telegramEnv('TELEGRAM_BOT_TOKEN');
  $chatId = telegramEnv('TELEGRAM_CHAT_ID');

  if ($token === '') {
    $t = TELEGRAM_BOT_TOKEN;
    if ($t !== '' && $t !== 'YOUR_BOT_TOKEN_HERE') {
      $token = $t;
    }
  }
  if ($chatId === '') {
    $c = TELEGRAM_CHAT_ID;
    if ($c !== '' && $c !== 'YOUR_CHAT_ID_HERE') {
      $chatId = $c;
    }
  }

  return ['token' => $token, 'chat_id' => $chatId];
}

/**
 * Надсилає текст у Telegram через Bot API.
 *
 * @return array{ok: bool, error?: string, details?: string}
 */
function sendTelegramMessage(string $text, string $parseMode = 'HTML'): array
{
  $creds = resolveTelegramCredentials();
  $token = $creds['token'];
  $chatId = $creds['chat_id'];

  if ($token === '' || $chatId === '') {
    return ['ok' => false, 'error' => 'Server is not configured (set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in hosting environment or constants in telegram.php)'];
  }

  $apiUrl = 'https://api.telegram.org/bot' . $token . '/sendMessage';
  $payload = json_encode([
    'chat_id' => $chatId,
    'text' => $text,
    'parse_mode' => $parseMode,
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
    return ['ok' => false, 'error' => 'cURL error: ' . $curlErr];
  }

  if ($httpCode < 200 || $httpCode >= 300) {
    return ['ok' => false, 'error' => 'Telegram API error', 'details' => $resp];
  }

  return ['ok' => true];
}

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

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

function esc(string $s): string
{
  return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$lines = [];
$lines[] = "<b>Нове звернення з сайту</b>";
if ($name !== '') {
  $lines[] = "<b>Ім'я:</b> " . esc($name);
}
if ($phone !== '') {
  $lines[] = "<b>Телефон:</b> " . esc($phone);
}
if ($email !== '') {
  $lines[] = "<b>Email:</b> " . esc($email);
}
if ($message !== '') {
  $lines[] = "<b>Повідомлення:</b>\n" . esc($message);
}
if ($pageUrl !== '') {
  $lines[] = "<b>Сторінка:</b> " . esc($pageUrl);
}

$text = implode("\n", $lines);

$result = sendTelegramMessage($text);

if (!$result['ok']) {
  $msg = $result['error'] ?? 'Unknown error';
  if (strpos($msg, 'not configured') !== false) {
    http_response_code(500);
  } elseif (strpos($msg, 'cURL') === 0) {
    http_response_code(502);
  } else {
    http_response_code(502);
  }
  $out = ['ok' => false, 'error' => $msg];
  if (isset($result['details'])) {
    $out['details'] = $result['details'];
  }
  echo json_encode($out, JSON_UNESCAPED_UNICODE);
  exit;
}

echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
