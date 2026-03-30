import { NextResponse } from "next/server";

type BitrixLeadAddResponse = {
  result?: unknown;
  error?: string;
  error_description?: string;
};

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

export async function POST(req: Request) {
  const bitrixUrl = process.env.CRM_BITRIX_LEAD_WEBHOOK_URL?.trim() ?? "";
  const genericUrl = process.env.CRM_GENERIC_WEBHOOK_URL?.trim() ?? "";

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

  if (!bitrixUrl && !genericUrl) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Server is not configured (set CRM_BITRIX_LEAD_WEBHOOK_URL or CRM_GENERIC_WEBHOOK_URL in .env.local)",
      },
      { status: 500 },
    );
  }

  const comments = [lead.message, lead.pageUrl ? `Сторінка: ${lead.pageUrl}` : ""]
    .filter(Boolean)
    .join("\n");

  if (bitrixUrl) {
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

  const res = await fetch(genericUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: "website",
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      message: lead.message,
      pageUrl: lead.pageUrl,
    }),
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
