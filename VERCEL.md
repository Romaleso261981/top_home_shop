# Деплой на Vercel (основний прод)

Сайт — **Next.js** з API-маршрутом **`/api/order`** (SalesDrive). **PHP (`order.php`) на Vercel не використовується.**

## 1. Підключити репозиторій

1. [vercel.com](https://vercel.com) → **Add New → Project** → імпорт **`Romaleso261981/top_home_shop`** (GitHub).
2. Framework: **Next.js** (автовизначення).
3. **Build Command:** `npm run build` (за замовчуванням).
4. **НЕ** задавайте `STATIC_EXPORT=true` — інакше API-маршрути не потраплять у деплой.

## 2. Змінні середовища (Settings → Environment Variables)

Для **Production** (і за бажанням Preview):

| Змінна | Значення |
|--------|----------|
| `SALESDRIVE_API_KEY` | секрет з кабінету SalesDrive («інтеграция с сайтом») |
| `SALESDRIVE_DOMAIN` | піддомен, напр. `mixs-bud` |

Опційно: `SALESDRIVE_STATUS_ID`, Bitrix, `TELEGRAM_*`, `RESEND_*` — див. **`SALESDRIVE.md`**.

Після зміни env — **Redeploy** останнього deployment.

## 3. Домен

**Settings → Domains** → `mixs-bud.com.ua`, `www.mixs-bud.com.ua`.

DNS у реєстратора / adm.tools — записи, які показує Vercel (A/CNAME).

## 4. Перевірка форми

1. Відкрити сайт → форма «Залишились питання?».
2. У DevTools → Network: POST **`/api/order`** → **200**, JSON `"ok": true`, `"delivery": "salesdrive"`.
3. Нова заявка в SalesDrive.

## Локальна розробка

`.env.local` у корені проєкту (див. `.env.example`) → `npm run dev`.

## Legacy: static + PHP на ukraina.com.ua

Якщо колись знову потрібен Apache + `order.php`: збірка з `STATIC_EXPORT=true` і деплой SSH — див. **`DEPLOY.md`**. GitHub workflow **Deploy to hosting** запускається **вручну** (workflow_dispatch), щоб не плутати з Vercel.
