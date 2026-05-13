/**
 * Дублювання заявки на email через Resend (опційно, без додаткових npm-пакетів).
 * Змінні: RESEND_API_KEY, RESEND_FROM (перевірений відправник у Resend), ORDER_NOTIFY_EMAIL.
 */

export async function sendOrderEmailDuplicate(params: {
  subject: string;
  text: string;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim();
  const to = process.env.ORDER_NOTIFY_EMAIL?.trim();
  if (!key || !from || !to) {
    return;
  }
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: params.subject.slice(0, 200),
      text: params.text.slice(0, 50000),
    }),
  }).catch(() => {});
}
