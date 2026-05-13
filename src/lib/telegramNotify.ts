/**
 * Опційне сповіщення в Telegram після успішної заявки (серверний виклик, токен лише в env).
 */

export async function sendTelegramOrderNotification(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) {
    return;
  }
  const url = `https://api.telegram.org/bot${encodeURIComponent(token)}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text.slice(0, 4000),
      disable_web_page_preview: true,
    }),
  }).catch(() => {
    /* не блокуємо основний потік */
  });
}
