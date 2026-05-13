import { NextResponse } from "next/server";
import { isValidUaPhone, normalizeUaPhoneForCrm } from "@/lib/phone";
import { logOrderFailure, logOrderReceived } from "@/lib/orderLog";
import { sendOrderEmailDuplicate } from "@/lib/resendNotify";
import {
  buildSalesDriveOrderBody,
  sendSalesDriveOrder,
  type LandingOrderInput,
} from "@/lib/salesdrive";
import { sendTelegramOrderNotification } from "@/lib/telegramNotify";

type BitrixLeadAddResponse = {
  result?: unknown;
  error?: string;
  error_description?: string;
};

function isBitrixLeadId(result: unknown): boolean {
  if (typeof result === "number" && Number.isFinite(result)) {
    return true;
  }
  if (typeof result === "string" && /^\d+$/.test(result)) {
    return true;
  }
  return false;
}

function bitrixFailureMessage(
  parsed: BitrixLeadAddResponse | null,
  raw: string,
  httpStatus: number,
): string {
  const desc = parsed?.error_description?.trim();
  const code = parsed?.error?.trim();
  if (desc) {
    return desc;
  }
  if (code) {
    return code;
  }
  const trimmed = raw.trim();
  if (trimmed.length > 0) {
    return trimmed.length > 500 ? trimmed.slice(0, 500) + "…" : trimmed;
  }
  if (httpStatus >= 300 && httpStatus < 400) {
    return `Перенаправлення HTTP ${httpStatus}. Вкажіть повний фінальний HTTPS-URL вебхука …/crm.lead.add.`;
  }
  return `Порожня або незрозуміла відповідь Bitrix24 (HTTP ${httpStatus}).`;
}

function resolveBitrixLeadWebhookUrl(): string {
  const a = process.env.BITRIX24_LEAD_WEBHOOK_URL?.trim() ?? "";
  const b = process.env.CRM_BITRIX_LEAD_WEBHOOK_URL?.trim() ?? "";
  return a || b;
}

function parseIntEnv(name: string): number | undefined {
  const v = process.env[name]?.trim();
  if (!v) {
    return undefined;
  }
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : undefined;
}

function parseOrderBody(data: unknown): {
  name: string;
  phone: string;
  email: string;
  message: string;
  service: string;
  pageUrl: string;
  website: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
} {
  const obj = (data ?? {}) as Record<string, unknown>;
  return {
    name: String(obj.name ?? "").trim(),
    phone: String(obj.phone ?? "").trim(),
    email: String(obj.email ?? "").trim(),
    message: String(obj.message ?? "").trim(),
    service: String(obj.service ?? "").trim(),
    pageUrl: String(obj.pageUrl ?? "").trim(),
    website: String(obj.website ?? "").trim(),
    utm_source: String(obj.utm_source ?? "").trim(),
    utm_medium: String(obj.utm_medium ?? "").trim(),
    utm_campaign: String(obj.utm_campaign ?? "").trim(),
    utm_content: String(obj.utm_content ?? "").trim(),
    utm_term: String(obj.utm_term ?? "").trim(),
  };
}

async function notifySuccessChannels(
  summary: string,
  fullText: string,
): Promise<void> {
  await sendTelegramOrderNotification(summary);
  await sendOrderEmailDuplicate({
    subject: "Нова заявка з сайту",
    text: fullText,
  });
}

export async function POST(req: Request) {
  const salesdriveKey = process.env.SALESDRIVE_API_KEY?.trim() ?? "";
  const salesdriveDomain = process.env.SALESDRIVE_DOMAIN?.trim() ?? "";
  const bitrixUrl = resolveBitrixLeadWebhookUrl();
  const webhookUrl = process.env.FORM_WEBHOOK_URL?.trim() ?? "";

  let data: unknown;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const row = parseOrderBody(data);

  if (row.website) {
    return NextResponse.json({ ok: true });
  }

  if (!row.phone) {
    return NextResponse.json(
      { ok: false, error: "Вкажіть номер телефону" },
      { status: 400 },
    );
  }

  if (!isValidUaPhone(row.phone)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Некоректний номер телефону. Використайте формат 0XX XXX XX XX (Україна).",
      },
      { status: 400 },
    );
  }

  if (!row.name && !row.message && !row.service) {
    return NextResponse.json({ ok: false, error: "Empty payload" }, { status: 400 });
  }

  const submittedAt = new Date().toISOString();
  const phoneCrm = normalizeUaPhoneForCrm(row.phone);

  const landingInput: LandingOrderInput = {
    name: row.name,
    phone: phoneCrm,
    email: row.email,
    message: row.message,
    service: row.service,
    pageUrl: row.pageUrl,
    submittedAt,
    utm: {
      utm_source: row.utm_source,
      utm_medium: row.utm_medium,
      utm_campaign: row.utm_campaign,
      utm_content: row.utm_content,
      utm_term: row.utm_term,
    },
  };

  const auditBase = {
    t: submittedAt,
    name: row.name,
    phone: phoneCrm,
    email: row.email,
    message: row.message,
    service: row.service,
    pageUrl: row.pageUrl,
    utm_source: row.utm_source,
    utm_medium: row.utm_medium,
    utm_campaign: row.utm_campaign,
    utm_content: row.utm_content,
    utm_term: row.utm_term,
  };

  const genericPayload = {
    source: "website",
    ...auditBase,
    submittedAt,
  };

  if (salesdriveKey && salesdriveDomain) {
    const sdBody = buildSalesDriveOrderBody(landingInput, {
      statusId: parseIntEnv("SALESDRIVE_STATUS_ID"),
      typeId: parseIntEnv("SALESDRIVE_TYPE_ID") ?? 1,
      organizationId: parseIntEnv("SALESDRIVE_ORGANIZATION_ID"),
    });

    const sd = await sendSalesDriveOrder(salesdriveDomain, salesdriveKey, sdBody);

    if (!sd.ok) {
      console.error("[order] SalesDrive error:", sd.message, sd.raw);
      await logOrderFailure({
        ...auditBase,
        stage: "salesdrive",
        error: sd.message,
        responseSnippet: sd.raw.slice(0, 2000),
      });
      return NextResponse.json(
        {
          ok: false,
          error: "SalesDrive: " + sd.message,
          details: sd.raw.slice(0, 2000),
        },
        { status: 502 },
      );
    }

    const summary =
      `Нова заявка SalesDrive #${sd.orderId ?? "?"}\n` +
      `${row.name || "—"} · ${phoneCrm}\n` +
      `${row.service || "—"}\n` +
      (row.pageUrl || "");
    const fullText =
      summary +
      "\n\n" +
      [
        `Повідомлення: ${row.message || "—"}`,
        `Email: ${row.email || "—"}`,
        `UTM: ${[row.utm_source, row.utm_medium, row.utm_campaign].filter(Boolean).join(" / ") || "—"}`,
        `Час: ${submittedAt}`,
      ].join("\n");

    await notifySuccessChannels(summary, fullText);

    return NextResponse.json({ ok: true, orderId: sd.orderId });
  }

  if (bitrixUrl) {
    const comments = [
      row.message,
      row.service ? `Послуга: ${row.service}` : "",
      row.pageUrl ? `Сторінка: ${row.pageUrl}` : "",
      `Час: ${submittedAt}`,
      [
        row.utm_source && `utm_source=${row.utm_source}`,
        row.utm_medium && `utm_medium=${row.utm_medium}`,
        row.utm_campaign && `utm_campaign=${row.utm_campaign}`,
        row.utm_content && `utm_content=${row.utm_content}`,
        row.utm_term && `utm_term=${row.utm_term}`,
      ]
        .filter(Boolean)
        .join(", "),
    ]
      .filter(Boolean)
      .join("\n");

    const fields: Record<string, unknown> = {
      TITLE: row.service || "Заявка з сайту",
      NAME: row.name || "Без імені",
      COMMENTS: comments || "—",
      STATUS_ID: "NEW",
      SOURCE_ID: "WEB",
      OPENED: "Y",
    };
    fields.PHONE = [{ VALUE: phoneCrm, VALUE_TYPE: "WORK" }];
    if (row.email) {
      fields.EMAIL = [{ VALUE: row.email, VALUE_TYPE: "WORK" }];
    }

    const res = await fetch(bitrixUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ fields }),
    });

    const raw = await res.text();
    let parsed: BitrixLeadAddResponse | null = null;
    try {
      parsed = raw ? (JSON.parse(raw) as BitrixLeadAddResponse) : null;
    } catch {
      parsed = null;
    }

    const okId = parsed !== null && isBitrixLeadId(parsed.result);

    if (!res.ok || !okId) {
      const msg = bitrixFailureMessage(parsed, raw, res.status);
      console.error("[order] Bitrix error:", msg, raw.slice(0, 500));
      await logOrderFailure({ ...auditBase, stage: "bitrix", error: msg });
      return NextResponse.json(
        { ok: false, error: "Bitrix24: " + msg, details: raw.slice(0, 2000) },
        { status: 502 },
      );
    }

    await notifySuccessChannels(
      `Bitrix: нова заявка\n${row.name} · ${phoneCrm}`,
      JSON.stringify(auditBase, null, 2),
    );

    return NextResponse.json({ ok: true });
  }

  if (webhookUrl) {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(genericPayload),
    });
    const raw = await res.text().catch(() => "");
    if (!res.ok) {
      console.error("[order] Webhook error:", res.status, raw);
      await logOrderFailure({ ...auditBase, stage: "webhook", error: `HTTP ${res.status}` });
      return NextResponse.json(
        { ok: false, error: "Webhook error (HTTP " + res.status + ")", details: raw },
        { status: 502 },
      );
    }
    await notifySuccessChannels(`Заявка (webhook)\n${row.name} · ${phoneCrm}`, JSON.stringify(auditBase, null, 2));
    return NextResponse.json({ ok: true });
  }

  const saved = await logOrderReceived({ ...auditBase, channel: "file" });
  if (!saved) {
    console.error("[order] Failed to write storage/orders.jsonl");
    return NextResponse.json(
      {
        ok: false,
        error:
          "Не вдалося зберегти заявку. Налаштуйте SalesDrive (SALESDRIVE_API_KEY + SALESDRIVE_DOMAIN) або інший канал у .env.local.",
      },
      { status: 500 },
    );
  }

  await notifySuccessChannels(`Заявка (файл)\n${row.name} · ${phoneCrm}`, JSON.stringify(auditBase, null, 2));
  return NextResponse.json({ ok: true });
}
