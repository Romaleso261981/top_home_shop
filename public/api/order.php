<?php
declare(strict_types=1);

/**
 * Заявки з лендінгу: SalesDrive → Bitrix24 → довільний вебхук → файл storage/orders.jsonl
 * SalesDrive API: https://api.salesdrive.me/api/docs/
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

function resolveBitrixLeadWebhookUrl(): string
{
  $a = formEnv('BITRIX24_LEAD_WEBHOOK_URL');
  if ($a !== '') {
    return $a;
  }
  return formEnv('CRM_BITRIX_LEAD_WEBHOOK_URL');
}

function digitsOnly(string $s): string
{
  return preg_replace('/\D+/', '', $s);
}

function isValidUaPhone(string $phone): bool
{
  $d = digitsOnly(trim($phone));
  if (strlen($d) < 10) {
    return false;
  }
  $n = $d;
  if (str_starts_with($n, '380') && strlen($n) >= 12) {
    $n = '0' . substr($n, 3, 9);
  } elseif (strlen($n) === 9 && !str_starts_with($n, '0')) {
    $n = '0' . $n;
  }
  if (strlen($n) !== 10 || $n[0] !== '0') {
    return false;
  }
  $op = substr($n, 1, 2);
  $mobile = ['39', '50', '63', '66', '67', '68', '73', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
  if (in_array($op, $mobile, true)) {
    return true;
  }
  $other = ['32', '44', '45', '48', '52', '56'];
  if (in_array($op, $other, true)) {
    return true;
  }
  return (bool)preg_match('/^0\d{9}$/', $n);
}

function normalizeUaPhoneForCrm(string $phone): string
{
  $d = digitsOnly(trim($phone));
  if (str_starts_with($d, '380') && strlen($d) >= 12) {
    return '+' . substr($d, 0, 12);
  }
  if (strlen($d) === 10 && str_starts_with($d, '0')) {
    return '+38' . $d;
  }
  if (strlen($d) === 9) {
    return '+380' . $d;
  }
  return trim($phone);
}

function appendJsonl(string $file, array $record): bool
{
  $root = dirname(__DIR__);
  $dir = $root . '/storage';
  if (!is_dir($dir)) {
    if (!@mkdir($dir, 0755, true)) {
      return false;
    }
  }
  $line = json_encode($record, JSON_UNESCAPED_UNICODE) . "\n";
  $path = $dir . '/' . $file;
  return @file_put_contents($path, $line, FILE_APPEND | LOCK_EX) !== false;
}

/**
 * @param array{name: string, phone: string, email: string, message: string, pageUrl: string, service?: string, submittedAt?: string} $lead
 */
function sendLeadToBitrix(string $webhookUrl, array $lead): array
{
  $extra = [];
  if (!empty($lead['service'])) {
    $extra[] = 'Послуга: ' . $lead['service'];
  }
  if (!empty($lead['submittedAt'])) {
    $extra[] = 'Час: ' . $lead['submittedAt'];
  }
  $utmLine = trim(implode(', ', array_filter([
    !empty($lead['utm_source']) ? 'utm_source=' . $lead['utm_source'] : '',
    !empty($lead['utm_medium']) ? 'utm_medium=' . $lead['utm_medium'] : '',
    !empty($lead['utm_campaign']) ? 'utm_campaign=' . $lead['utm_campaign'] : '',
    !empty($lead['utm_content']) ? 'utm_content=' . $lead['utm_content'] : '',
    !empty($lead['utm_term']) ? 'utm_term=' . $lead['utm_term'] : '',
  ])));
  if ($utmLine !== '') {
    $extra[] = $utmLine;
  }

  $comments = trim(implode("\n", array_filter([
    $lead['message'] !== '' ? $lead['message'] : null,
    $lead['pageUrl'] !== '' ? ('Сторінка: ' . $lead['pageUrl']) : null,
    $extra !== [] ? implode("\n", $extra) : null,
  ])));

  $fields = [
    'TITLE' => !empty($lead['service']) ? $lead['service'] : 'Заявка з сайту',
    'NAME' => $lead['name'] !== '' ? $lead['name'] : 'Без імені',
    'COMMENTS' => $comments !== '' ? $comments : '—',
    'STATUS_ID' => 'NEW',
    'SOURCE_ID' => 'WEB',
    'OPENED' => 'Y',
  ];
  if ($lead['phone'] !== '') {
    $fields['PHONE'] = [['VALUE' => $lead['phone'], 'VALUE_TYPE' => 'WORK']];
  }
  if ($lead['email'] !== '') {
    $fields['EMAIL'] = [['VALUE' => $lead['email'], 'VALUE_TYPE' => 'WORK']];
  }

  $payload = json_encode(['fields' => $fields], JSON_UNESCAPED_UNICODE);

  $ch = curl_init($webhookUrl);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
  ]);
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
  if (is_array($decoded) && isset($decoded['result']) && (is_int($decoded['result']) || (is_string($decoded['result']) && ctype_digit($decoded['result'])))) {
    return ['ok' => true];
  }

  $err = is_array($decoded) && isset($decoded['error_description'])
    ? trim((string)$decoded['error_description'])
    : (is_array($decoded) && isset($decoded['error']) ? trim((string)$decoded['error']) : '');

  $msg = $err !== '' ? ('Bitrix24: ' . $err) : 'Bitrix24 API error';
  if ($err === '' && ($httpCode < 200 || $httpCode >= 300)) {
    $msg = 'Bitrix24 API error (HTTP ' . $httpCode . ')';
  }

  return ['ok' => false, 'error' => $msg, 'details' => $resp];
}

/**
 * @param array<string, string> $lead
 */
function sendToWebhook(string $url, array $lead): array
{
  $payload = json_encode([
    'source' => 'website',
    'name' => $lead['name'],
    'phone' => $lead['phone'],
    'email' => $lead['email'],
    'message' => $lead['message'],
    'service' => $lead['service'] ?? '',
    'pageUrl' => $lead['pageUrl'],
    'utm_source' => $lead['utm_source'] ?? '',
    'utm_medium' => $lead['utm_medium'] ?? '',
    'utm_campaign' => $lead['utm_campaign'] ?? '',
    'utm_content' => $lead['utm_content'] ?? '',
    'utm_term' => $lead['utm_term'] ?? '',
    'submittedAt' => $lead['submittedAt'] ?? '',
  ], JSON_UNESCAPED_UNICODE);

  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
  ]);
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

function normalizeSalesDriveSubdomain(string $raw): string
{
  $s = trim($raw);
  $s = preg_replace('#^https?://#i', '', $s) ?? '';
  $p = strpos($s, '/');
  if ($p !== false) {
    $s = substr($s, 0, $p);
  }
  $s = rtrim($s, '.');
  if (preg_match('/^([^.]+)\.salesdrive\.me$/i', $s, $m)) {
    return $m[1];
  }
  $s = preg_replace('/\.salesdrive\.me$/i', '', $s) ?? '';
  if (str_contains($s, '.')) {
    $parts = explode('.', $s);
    $first = $parts[0] ?? '';
    if ($first !== '' && preg_match('/^[a-z0-9_-]+$/i', $first)) {
      return $first;
    }
  }
  return $s;
}

/**
 * @param array<string, mixed> $body
 * @return array{ok: bool, orderId?: int, error?: string, raw?: string}
 */
function sendSalesDriveOrder(string $domain, string $apiKey, array $body): array
{
  $base = normalizeSalesDriveSubdomain($domain);
  $url = 'https://' . $base . '.salesdrive.me/handler/';

  $payload = json_encode($body, JSON_UNESCAPED_UNICODE);
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
    'X-Api-Key: ' . $apiKey,
  ]);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
  curl_setopt($ch, CURLOPT_TIMEOUT, 20);

  $resp = curl_exec($ch);
  $curlErr = curl_error($ch);
  $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);

  if ($resp === false) {
    return ['ok' => false, 'error' => 'cURL: ' . $curlErr, 'raw' => ''];
  }

  $decoded = json_decode((string)$resp, true);
  if (is_array($decoded) && !empty($decoded['error'])) {
    return ['ok' => false, 'error' => (string)$decoded['error'], 'raw' => (string)$resp];
  }
  if (is_array($decoded) && isset($decoded['data']['orderId'])) {
    $oid = (int)$decoded['data']['orderId'];
    if ($oid > 0) {
      return ['ok' => true, 'orderId' => $oid];
    }
  }

  $snippet = trim((string)$resp);
  if ($snippet === '') {
    $snippet = 'HTTP ' . $httpCode . ' (порожня відповідь)';
  }
  return ['ok' => false, 'error' => $snippet, 'raw' => (string)$resp];
}

function optionalIntEnv(string $name): ?int
{
  $v = formEnv($name);
  if ($v === '') {
    return null;
  }
  if (!ctype_digit($v)) {
    return null;
  }
  return (int)$v;
}

function notifyTelegram(string $text): void
{
  $token = formEnv('TELEGRAM_BOT_TOKEN');
  $chat = formEnv('TELEGRAM_CHAT_ID');
  if ($token === '' || $chat === '') {
    return;
  }
  $url = 'https://api.telegram.org/bot' . rawurlencode($token) . '/sendMessage';
  $p = json_encode([
    'chat_id' => $chat,
    'text' => mb_substr($text, 0, 4000),
    'disable_web_page_preview' => true,
  ], JSON_UNESCAPED_UNICODE);
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $p);
  curl_setopt($ch, CURLOPT_TIMEOUT, 10);
  curl_exec($ch);
  curl_close($ch);
}

function notifyResend(string $subject, string $text): void
{
  $key = formEnv('RESEND_API_KEY');
  $from = formEnv('RESEND_FROM');
  $to = formEnv('ORDER_NOTIFY_EMAIL');
  if ($key === '' || $from === '' || $to === '') {
    return;
  }
  $url = 'https://api.resend.com/emails';
  $p = json_encode([
    'from' => $from,
    'to' => [$to],
    'subject' => mb_substr($subject, 0, 200),
    'text' => mb_substr($text, 0, 50000),
  ], JSON_UNESCAPED_UNICODE);
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $key,
    'Content-Type: application/json',
  ]);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $p);
  curl_setopt($ch, CURLOPT_TIMEOUT, 15);
  curl_exec($ch);
  curl_close($ch);
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
$service = trim((string)($data['service'] ?? ''));
$utm_source = trim((string)($data['utm_source'] ?? ''));
$utm_medium = trim((string)($data['utm_medium'] ?? ''));
$utm_campaign = trim((string)($data['utm_campaign'] ?? ''));
$utm_content = trim((string)($data['utm_content'] ?? ''));
$utm_term = trim((string)($data['utm_term'] ?? ''));

if ($phone === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Вкажіть номер телефону'], JSON_UNESCAPED_UNICODE);
  exit;
}

if (!isValidUaPhone($phone)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Некоректний номер телефону. Використайте формат 0XX XXX XX XX (Україна).'], JSON_UNESCAPED_UNICODE);
  exit;
}

if ($name === '' && $message === '' && $service === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Empty payload'], JSON_UNESCAPED_UNICODE);
  exit;
}

$submittedAt = gmdate('c');
$phoneCrm = normalizeUaPhoneForCrm($phone);

$audit = [
  't' => $submittedAt,
  'name' => $name,
  'phone' => $phoneCrm,
  'email' => $email,
  'message' => $message,
  'service' => $service,
  'pageUrl' => $pageUrl,
  'utm_source' => $utm_source,
  'utm_medium' => $utm_medium,
  'utm_campaign' => $utm_campaign,
  'utm_content' => $utm_content,
  'utm_term' => $utm_term,
];

$lead = $audit;

$sdk = formEnv('SALESDRIVE_API_KEY');
$sdDomain = formEnv('SALESDRIVE_DOMAIN');

if ($sdk !== '' && $sdDomain !== '') {
  $serviceTitle = $service !== '' ? $service : 'Заявка з сайту';
  $parts = preg_split('/\s+/u', $name, -1, PREG_SPLIT_NO_EMPTY);
  $fName = $parts[0] ?? 'Клієнт';
  $lName = $parts[1] ?? '';
  $mName = count($parts) > 2 ? implode(' ', array_slice($parts, 2)) : '';

  $commentLines = array_filter([
    $message !== '' ? $message : null,
    'Послуга / товар: ' . $serviceTitle,
    'Сторінка: ' . ($pageUrl !== '' ? $pageUrl : '—'),
    'Дата та час заявки: ' . $submittedAt,
  ]);
  $comment = implode("\n", $commentLines);

  $body = [
    'getResultData' => 1,
    'fName' => $fName,
    'lName' => $lName,
    'mName' => $mName,
    'phone' => $phoneCrm,
    'email' => $email,
    'comment' => $comment,
    'typeId' => optionalIntEnv('SALESDRIVE_TYPE_ID') ?? 1,
    'products' => [[
      'id' => 'landing-service',
      'name' => $serviceTitle,
      'costPerItem' => 0,
      'amount' => 1,
      'description' => '',
      'discount' => '0',
      'sku' => '',
      'commission' => '0',
    ]],
  ];
  if ($utm_source !== '') {
    $body['utmSource'] = $utm_source;
  }
  if ($utm_medium !== '') {
    $body['utmMedium'] = $utm_medium;
  }
  if ($utm_campaign !== '') {
    $body['utmCampaign'] = $utm_campaign;
  }
  if ($utm_content !== '') {
    $body['utmContent'] = $utm_content;
  }
  if ($utm_term !== '') {
    $body['utmTerm'] = $utm_term;
  }
  if ($pageUrl !== '') {
    $body['utmPage'] = $pageUrl;
  }
  $sid = optionalIntEnv('SALESDRIVE_STATUS_ID');
  if ($sid !== null) {
    $body['statusId'] = $sid;
  }
  $org = optionalIntEnv('SALESDRIVE_ORGANIZATION_ID');
  if ($org !== null) {
    $body['organizationId'] = $org;
  }

  $sd = sendSalesDriveOrder($sdDomain, $sdk, $body);
  if (!$sd['ok']) {
    error_log('[order] SalesDrive: ' . ($sd['error'] ?? ''));
    appendJsonl('orders-failed.jsonl', array_merge($audit, ['stage' => 'salesdrive', 'error' => $sd['error'] ?? '']));
    http_response_code(502);
    echo json_encode([
      'ok' => false,
      'error' => 'SalesDrive: ' . ($sd['error'] ?? 'невідома помилка'),
      'details' => mb_substr((string)($sd['raw'] ?? ''), 0, 2000),
    ], JSON_UNESCAPED_UNICODE);
    exit;
  }

  $oid = $sd['orderId'] ?? 0;
  $summary = "Нова заявка SalesDrive #$oid\n$name · $phoneCrm\n$serviceTitle\n$pageUrl";
  notifyTelegram($summary);
  notifyResend('Нова заявка з сайту', $summary . "\n\n" . json_encode($audit, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
  echo json_encode(['ok' => true, 'orderId' => $oid], JSON_UNESCAPED_UNICODE);
  exit;
}

$bitrix = resolveBitrixLeadWebhookUrl();
$webhook = formEnv('FORM_WEBHOOK_URL');

if ($bitrix !== '') {
  $leadBitrix = $lead;
  $leadBitrix['phone'] = $phoneCrm;
  $leadBitrix['submittedAt'] = $submittedAt;
  $result = sendLeadToBitrix($bitrix, $leadBitrix);
  if (!$result['ok']) {
    error_log('[order] Bitrix: ' . ($result['error'] ?? ''));
    appendJsonl('orders-failed.jsonl', array_merge($audit, ['stage' => 'bitrix', 'error' => $result['error'] ?? '']));
    http_response_code(502);
    $out = ['ok' => false, 'error' => $result['error'] ?? 'Помилка'];
    if (isset($result['details'])) {
      $out['details'] = $result['details'];
    }
    echo json_encode($out, JSON_UNESCAPED_UNICODE);
    exit;
  }
  notifyTelegram("Bitrix: нова заявка\n$name · $phoneCrm");
  notifyResend('Нова заявка з сайту (Bitrix)', json_encode($audit, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
  echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
  exit;
}

if ($webhook !== '') {
  $whLead = array_merge($lead, ['submittedAt' => $submittedAt]);
  $result = sendToWebhook($webhook, $whLead);
  if (!$result['ok']) {
    error_log('[order] Webhook: ' . ($result['error'] ?? ''));
    appendJsonl('orders-failed.jsonl', array_merge($audit, ['stage' => 'webhook', 'error' => $result['error'] ?? '']));
    http_response_code(502);
    $out = ['ok' => false, 'error' => $result['error'] ?? 'Помилка'];
    if (isset($result['details'])) {
      $out['details'] = $result['details'];
    }
    echo json_encode($out, JSON_UNESCAPED_UNICODE);
    exit;
  }
  notifyTelegram("Заявка (webhook)\n$name · $phoneCrm");
  echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
  exit;
}

if (appendJsonl('orders.jsonl', array_merge($audit, ['channel' => 'file']))) {
  notifyTelegram("Заявка (файл)\n$name · $phoneCrm");
  echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
  exit;
}

http_response_code(500);
echo json_encode([
  'ok' => false,
  'error' => 'Не вдалося зберегти заявку. Налаштуйте SalesDrive (SALESDRIVE_API_KEY + SALESDRIVE_DOMAIN) або інший канал.',
], JSON_UNESCAPED_UNICODE);
