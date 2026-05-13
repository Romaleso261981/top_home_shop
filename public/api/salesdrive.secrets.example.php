<?php
/**
 * Приклад локальних секретів для SalesDrive на хостингу.
 * Скопіюйте цей файл як `salesdrive.secrets.php` у ту саму папку `api/`
 * і заповніть значення. Файл `salesdrive.secrets.php` не комітиться в git.
 *
 * Зручно, якщо open_basedir не дає читати `../.env.local` з api/order.php.
 */
return [
  'SALESDRIVE_API_KEY' => '',
  'SALESDRIVE_DOMAIN' => 'mixs-bud',
  // 'SALESDRIVE_STATUS_ID' => '123',
];
