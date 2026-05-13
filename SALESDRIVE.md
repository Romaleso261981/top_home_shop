# Інтеграція з SalesDrive CRM

Офіційна документація REST API: [https://api.salesdrive.me/api/docs/](https://api.salesdrive.me/api/docs/)

## Де взяти API-ключ

У кабінеті **SalesDrive**: **Установки → Загальні налаштування і інтеграції → Інші сервіси → API**.

Авторизація: HTTP-заголовок **`X-Api-Key: ваш-ключ`** (ключ не вставляйте у frontend — лише в `.env.local` на dev і в змінних середовища на хостингу).

## Домен (піддомен акаунту)

Базовий URL API: `https://{Ваш_акаунт}.salesdrive.me/`

У змінній **`SALESDRIVE_DOMAIN`** вкажіть **лише піддомен** без `.salesdrive.me`, наприклад якщо сайт кабінету `https://monolit.salesdrive.me`, то:

```bash
SALESDRIVE_DOMAIN=monolit
```

### Хостинг (важливо)

Файл **`.env.local`** використовується лише на комп’ютері під **`npm run dev`**. На **хостингу** статичний сайт викликає **`/api/order.php`** — раніше PHP **не читав** `.env.local` автоматично; тепер **`order.php` сам завантажує** змінні з файлів **`.env`** і **`.env.local` у корені сайту** (та сама папка, де `package.json`, наприклад `/home/…/www/`), тому достатньо залишити `.env.local` на сервері як у вас.

Порядок читання файлів: спочатку **`.env`**, потім **`.env.local`** (другий перезаписує збіги). Змінні з **панелі хостингу** для PHP теж підходять; після оновлення `order.php` окремі змінні в панелі **не обов’язкові**, якщо ключі вже є в `.env.local` (або `.env`) у корені сайту. Якщо **ні** у файлах, **ні** в оточенні немає `SALESDRIVE_API_KEY` / `SALESDRIVE_DOMAIN`, заявка зберігається лише в **`storage/orders.jsonl`**.

Додано **`public/.htaccess`**: за замовчуванням Apache не віддає файли на кшталт `.env.local` по HTTP (не покладайтеся лише на це — ключі не варто світити в скріншотах; при потребі перевипустіть API-ключ у SalesDrive).

Також читаються **`.env` / `.env.local` у папці `api/`** (поруч із `order.php`) і опційно **`api/salesdrive.secrets.php`** — зручно, якщо **open_basedir** забороняє читати батьківський каталог. Зразок: `api/salesdrive.secrets.example.php` у репозиторії. У логах Apache шукайте рядки **`[order]`**: чи знайдено файли та чи встановлено ключ (`SALESDRIVE_API_KEY_set=1`).

Якщо в адресному рядку кабінету `https://mixs-bud.salesdrive.me`, у `.env` має бути **`mixs-bud`**, а не корпоративний сайт (`mixs-bud.com.ua`) — інакше збирається хост `mixs-bud.com.ua.salesdrive.me` і виникає помилка сертифіката SSL. У коді додано нормалізація: з помилкового значення береться перша мітка (`mixs-bud`).

## Створення заявки з сайту

Метод з документації: **POST** `https://{домен}.salesdrive.me/handler/` («Додавання заявок»).

Код збирає тіло з полів згідно опису заявки (ім’я, телефон, email, коментар, товар/послуга, UTM, сторінка, тип заявки тощо). У відповіді очікується `data.orderId` — ідентифікатор нової заявки в CRM.

### Статус «Нова заявка» та воронка

У різних акаунтів різні **ID статусів** і **організацій**. Щоб заявка одразу отримала потрібний статус:

1. Викличте з кабінету або через API метод **`GET /api/statuses/`** (з тим самим `X-Api-Key`) і знайдіть у списку рядок з назвою на кшталт «Нова заявка» — поле **`id`** (число).
2. Запишіть у `.env.local` / на хостингу:

```bash
SALESDRIVE_STATUS_ID=123
```

Якщо змінну не задати, SalesDrive підставить **статус за замовчуванням** для нової заявки (залежить від налаштувань вашої воронки).

Для прив’язки до **організації** (якщо потрібно):

```bash
SALESDRIVE_ORGANIZATION_ID=456
```

Тип заявки за замовчуванням **`1`** (заявка онлайн). Інший тип:

```bash
SALESDRIVE_TYPE_ID=1
```

## Приклад `.env.local` (локальна розробка)

```bash
SALESDRIVE_API_KEY=ваш_ключ_з_кабінету
SALESDRIVE_DOMAIN=ваш_піддомен
SALESDRIVE_STATUS_ID=ід_статусу_з_api_statuses
```

Після змін перезапустіть `npm run dev`.

## Telegram після заявки (опційно)

Створіть бота в [@BotFather](https://t.me/BotFather), отримайте токен. Дізнайтесь **chat_id** (особистий чат або група).

```bash
TELEGRAM_BOT_TOKEN=123456:ABC...
TELEGRAM_CHAT_ID=123456789
```

## Дубль на email через Resend (опційно)

Зареєструйтесь на [Resend](https://resend.com), створіть API key і підтверджений відправник.

```bash
RESEND_API_KEY=re_...
RESEND_FROM="Заявки <onboarding@resend.dev>"
ORDER_NOTIFY_EMAIL=ваш@email.com
```

## Пріоритет каналів у коді

1. **SalesDrive** — якщо задані `SALESDRIVE_API_KEY` і `SALESDRIVE_DOMAIN`
2. **Bitrix24** — `BITRIX24_LEAD_WEBHOOK_URL` / `CRM_BITRIX_LEAD_WEBHOOK_URL`
3. **Довільний вебхук** — `FORM_WEBHOOK_URL`
4. **Файл** — `storage/orders.jsonl` (якщо немає жодного з каналів вище)

Якщо SalesDrive повертає помилку, заявка дублюється в **`storage/orders-failed.jsonl`** (на сервері поруч із сайтом).

## Поля форми на сайті

| Поле | У CRM / API |
|------|-------------|
| Ім’я | `fName`, `lName`, `mName` (розбиття по словах) |
| Телефон * | `phone` (нормалізовано до +380…) |
| Email | `email` |
| Послуга / товар | рядок у `comment` + позиція в `products[]` |
| Повідомлення | `comment` |
| Сторінка | `utmPage` + рядок у `comment` |
| Дата/час | додається на сервері в `comment` |
| UTM з URL | `utmSource`, `utmMedium`, `utmCampaign`, `utmContent`, `utmTerm` |

UTM беруться з **поточного URL** сторінки (`?utm_source=...`).
