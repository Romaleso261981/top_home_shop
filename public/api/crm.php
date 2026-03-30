<?php
declare(strict_types=1);

/**
 * Заявки з форми → CRM.
 *
 * Варіант A — Bitrix24: вхідний webhook на метод crm.lead.add (повний URL з порталу).
 * Варіант B — довільний URL (Make, Zapier, власний проксі до amoCRM тощо): JSON тіла форми.
 *
 * На проді краще задати змінні в панелі хостингу, без секретів у git.
 */
const CRM_BITRIX_LEAD_WEBHOOK_URL = '';
const CRM_GENERIC_WEBHOOK_URL = '';

function crmEnv(string $name): string
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
 * @return array{bitrix: string, generic: string}
 */
function resolveCrmEndpoints(): array
{
  $bitrix = crmEnv('CRM_BITRIX_LEAD_WEBHOOK_URL');
  $generic = crmEnv('CRM_GENERIC_WEBHOOK_URL');
  if ($bitrix === '' && CRM_BITRIX_LEAD_WEBHOOK_URL !== '') {
    $bitrix = CRM_BITRIX_LEAD_WEBHOOK_URL;
  }
  if ($generic === '' && CRM_GENERIC_WEBHOOK_URL !== '') {
    $generic = CRM_GENERIC_WEBHOOK_URL;
  }
  return ['bitrix' => $bitrix, 'generic' => $generic];
}

/**
 * @param array{name: string, phone: string, email: string, message: string, pageUrl: string} $data
 * @return array{ok: bool, error?: string, details?: string}
 */
function sendLeadToBitrix(string $webhookUrl, array $data): array
{
  $name = $data['name'];
  $phone = $data['phone'];
  $email = $data['email'];
  $message = $data['message'];
  $pageUrl = $data['pageUrl'];

  $comments = trim(implode("\n", array_filter([
    $message !== '' ? $message : null,
    $pageUrl !== '' ? ('Сторінка: ' . $pageUrl) : null,
  ])));

  $fields = [
    'TITLE' => 'Заявка з сайту',
    'NAME' => $name !== '' ? $name : 'Без імені',
    'COMMENTS' => $comments !== '' ? $comments : '—',
    'SOURCE_ID' => 'WEB',
    'OPENED' => 'Y',
  ];
  if ($phone !== '') {
    $fields['PHONE'] = [['VALUE' => $phone, 'VALUE_TYPE' => 'WORK']];
  }
  if ($email !== '') {
    $fields['EMAIL'] = [['VALUE' => $email, 'VALUE_TYPE' => 'WORK']];
  }

  $payload = json_encode(['fields' => $fields], JSON_UNESCAPED_UNICODE);

  $ch = curl_init($webhookUrl);
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

  $decoded = json_decode($resp, true);
  if (is_array($decoded) && isset($decoded['result']) && (is_int($decoded['result']) || is_numeric($decoded['result']))) {
    return ['ok' => true];
  }

  $err = is_array($decoded) && isset($decoded['error_description'])
    ? (string)$decoded['error_description']
    : (is_array($decoded) && isset($decoded['error']) ? (string)$decoded['error'] : '');

  $msg = $err !== '' ? ('Bitrix24: ' . $err) : 'Bitrix24 API error';
  if ($err === '' && ($httpCode < 200 || $httpCode >= 300)) {
    $msg = 'Bitrix24 API error (HTTP ' . $httpCode . ')';
  }

  return ['ok' => false, 'error' => $msg, 'details' => $resp];
}

/**
 * @param array{name: string, phone: string, email: string, message: string, pageUrl: string} $data
 * @return array{ok: bool, error?: string, details?: string}
 */
function sendLeadToGenericWebhook(string $url, array $data): array
{
  $payload = json_encode([
    'source' => 'website',
    'name' => $data['name'],
    'phone' => $data['phone'],
    'email' => $data['email'],
    'message' => $data['message'],
    'pageUrl' => $data['pageUrl'],
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

$endpoints = resolveCrmEndpoints();
$result = null;

if ($endpoints['bitrix'] !== '') {
  $result = sendLeadToBitrix($endpoints['bitrix'], $lead);
} elseif ($endpoints['generic'] !== '') {
  $result = sendLeadToGenericWebhook($endpoints['generic'], $lead);
} else {
  http_response_code(500);
  echo json_encode([
    'ok' => false,
    'error' => 'Server is not configured (set CRM_BITRIX_LEAD_WEBHOOK_URL or CRM_GENERIC_WEBHOOK_URL)',
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

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
