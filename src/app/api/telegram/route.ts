import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json(
      {
        ok: false,
        error: "Server is not configured (missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID)",
      },
      { status: 500 },
    );
  }

  let data: unknown;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const obj = (data ?? {}) as Record<string, unknown>;
  const hp = String(obj.website ?? "").trim();
  if (hp) return NextResponse.json({ ok: true });

  const name = String(obj.name ?? "").trim();
  const phone = String(obj.phone ?? "").trim();
  const email = String(obj.email ?? "").trim();
  const message = String(obj.message ?? "").trim();
  const pageUrl = String(obj.pageUrl ?? "").trim();

  if (!name && !phone && !email && !message) {
    return NextResponse.json({ ok: false, error: "Empty payload" }, { status: 400 });
  }

  const esc = (s: string) =>
    s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const lines: string[] = [];
  lines.push("<b>Нове звернення з сайту</b>");
  if (name) lines.push(`<b>Ім'я:</b> ${esc(name)}`);
  if (phone) lines.push(`<b>Телефон:</b> ${esc(phone)}`);
  if (email) lines.push(`<b>Email:</b> ${esc(email)}`);
  if (message) lines.push(`<b>Повідомлення:</b>\n${esc(message)}`);
  if (pageUrl) lines.push(`<b>Сторінка:</b> ${esc(pageUrl)}`);

  const text = lines.join("\n");

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  const raw = await res.text().catch(() => "");
  const parsed = (() => {
    try {
      return JSON.parse(raw) as { ok?: boolean; description?: string; error_code?: number };
    } catch {
      return null;
    }
  })();

  if (!res.ok || parsed?.ok === false) {
    const description =
      parsed?.description ??
      (raw ? raw.slice(0, 500) : "Telegram did not return a JSON error");
    return NextResponse.json(
      {
        ok: false,
        error: "Telegram API error",
        description,
        errorCode: parsed?.error_code,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

