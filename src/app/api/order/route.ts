import { NextResponse } from "next/server";
import { appendFile, mkdir } from "fs/promises";
import path from "path";

type BitrixLeadAddResponse = {
  result?: unknown;
  error?: string;
  error_description?: string;
};

/** Повний URL виклику crm.lead.add (див. DEPLOY.md). */
function resolveBitrixLeadWebhookUrl(): string {
  const a = process.env.BITRIX24_LEAD_WEBHOOK_URL?.trim() ?? "";
  const b = process.env.CRM_BITRIX_LEAD_WEBHOOK_URL?.trim() ?? "";
  return a || b;
}

function parseBody(data: unknown): {
  name: string;
  phone: string;
  email: string;
  message: string;
  pageUrl: string;
  website: string;
} {
  const obj = (data ?? {}) as Record<string, unknown>;
  return {
    name: String(obj.name ?? "").trim(),
    phone: String(obj.phone ?? "").trim(),
    email: String(obj.email ?? "").trim(),
    message: String(obj.message ?? "").trim(),
    pageUrl: String(obj.pageUrl ?? "").trim(),
    website: String(obj.website ?? "").trim(),
  };
}

async function appendLocalStorage(lead: {
  name: string;
  phone: string;
  email: string;
  message: string;
  pageUrl: string;
}): Promise<boolean> {
  const dir = path.join(process.cwd(), "storage");
  const file = path.join(dir, "orders.jsonl");
  const line =
    JSON.stringify({ t: new Date().toISOString(), ...lead }, null, 0) + "\n";
  try {
    await mkdir(dir, { recursive: true });
    await appendFile(file, line, { encoding: "utf8" });
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const bitrixUrl = resolveBitrixLeadWebhookUrl();
  const webhookUrl = process.env.FORM_WEBHOOK_URL?.trim() ?? "";

  let data: unknown;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const lead = parseBody(data);

  if (lead.website) {
    return NextResponse.json({ ok: true });
  }

  if (!lead.name && !lead.phone && !lead.email && !lead.message) {
    return NextResponse.json({ ok: false, error: "Empty payload" }, { status: 400 });
  }

  const genericPayload = {
    source: "website",
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    message: lead.message,
    pageUrl: lead.pageUrl,
  };

  if (bitrixUrl) {
    const comments = [lead.message, lead.pageUrl ? `Сторінка: ${lead.pageUrl}` : ""]
      .filter(Boolean)
      .join("\n");

    const fields: Record<string, unknown> = {
      TITLE: "Заявка з сайту",
      NAME: lead.name || "Без імені",
      COMMENTS: comments || "—",
      SOURCE_ID: "WEB",
      OPENED: "Y",
    };
    if (lead.phone) {
      fields.PHONE = [{ VALUE: lead.phone, VALUE_TYPE: "WORK" }];
    }
    if (lead.email) {
      fields.EMAIL = [{ VALUE: lead.email, VALUE_TYPE: "WORK" }];
    }

    const res = await fetch(bitrixUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
    });

    const raw = await res.text();
    let parsed: BitrixLeadAddResponse | null = null;
    try {
      parsed = JSON.parse(raw) as BitrixLeadAddResponse;
    } catch {
      parsed = null;
    }

    const okId =
      parsed &&
      parsed.result !== undefined &&
      (typeof parsed.result === "number" || typeof parsed.result === "string");

    if (!res.ok || !okId) {
      const msg =
        parsed?.error_description ??
        parsed?.error ??
        (raw ? raw.slice(0, 500) : "Bitrix24 error");
      return NextResponse.json(
        { ok: false, error: "Bitrix24: " + msg, details: raw },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  }

  if (webhookUrl) {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(genericPayload),
    });
    const raw = await res.text().catch(() => "");
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: "Webhook error (HTTP " + res.status + ")", details: raw },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  }

  const saved = await appendLocalStorage(lead);
  if (!saved) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Не вдалося зберегти заявку. Задайте BITRIX24_LEAD_WEBHOOK_URL або FORM_WEBHOOK_URL у .env.local, або перевірте права на папку storage/",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
