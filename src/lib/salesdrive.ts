/**
 * Клієнт SalesDrive CRM — створення заявки через POST /handler/
 * Документація: https://api.salesdrive.me/api/docs/ (розділ order → Додавання заявок)
 */

export type SalesDriveCreateOrderResponse = {
  error?: string;
  success?: boolean;
  data?: {
    orderId?: number;
    userId?: number;
  };
};

export type LandingOrderInput = {
  name: string;
  phone: string;
  email: string;
  message: string;
  service: string;
  pageUrl: string;
  submittedAt: string;
  utm: {
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_content: string;
    utm_term: string;
  };
};

function splitName(full: string): { fName: string; lName: string; mName: string } {
  const t = full.trim().replace(/\s+/g, " ");
  if (!t) {
    return { fName: "Клієнт", lName: "", mName: "" };
  }
  const parts = t.split(" ");
  const fName = parts[0] ?? t;
  const lName = parts[1] ?? "";
  const mName = parts.length > 2 ? parts.slice(2).join(" ") : "";
  return { fName, lName, mName };
}

/**
 * Тіло POST на /handler/ (поля заявки згідно TOrderCreateFields у SalesDrive API).
 * @see https://api.salesdrive.me/api/docs/#/order/order-create
 */
export function buildSalesDriveOrderBody(
  input: LandingOrderInput,
  options: {
    /** ID статусу з GET /api/statuses/ (наприклад «Нова заявка») */
    statusId?: number;
    /** Тип заявки: 1 — онлайн */
    typeId?: number;
    organizationId?: number;
  } = {},
): Record<string, unknown> {
  const { fName, lName, mName } = splitName(input.name);
  const serviceTitle = input.service.trim() || "Заявка з сайту";

  const commentLines = [
    input.message.trim() || null,
    `Послуга / товар: ${serviceTitle}`,
    `Сторінка: ${input.pageUrl || "—"}`,
    `Дата та час заявки: ${input.submittedAt}`,
  ].filter(Boolean);

  const body: Record<string, unknown> = {
    getResultData: 1,
    fName,
    lName,
    mName,
    phone: input.phone,
    email: input.email.trim(),
    comment: commentLines.join("\n"),
    typeId: options.typeId ?? 1,
    products: [
      {
        id: "landing-service",
        name: serviceTitle,
        costPerItem: 0,
        amount: 1,
        description: "",
        discount: "0",
        sku: "",
        commission: "0",
      },
    ],
    utmSource: input.utm.utm_source || undefined,
    utmMedium: input.utm.utm_medium || undefined,
    utmCampaign: input.utm.utm_campaign || undefined,
    utmContent: input.utm.utm_content || undefined,
    utmTerm: input.utm.utm_term || undefined,
    utmPage: input.pageUrl || undefined,
  };

  if (options.statusId !== undefined && Number.isFinite(options.statusId)) {
    body.statusId = options.statusId;
  }
  if (options.organizationId !== undefined && Number.isFinite(options.organizationId)) {
    body.organizationId = options.organizationId;
  }

  return body;
}

/**
 * Нормалізує значення SALESDRIVE_DOMAIN до одного піддомену (наприклад `mixs-bud`).
 * Якщо випадково вказано `mixs-bud.com.ua`, береться перша мітка — `mixs-bud`
 * (інакше виходить `mixs-bud.com.ua.salesdrive.me` і помилка SSL).
 */
export function normalizeSalesDriveSubdomain(raw: string): string {
  let s = raw.trim().replace(/^https?:\/\//i, "");
  const slash = s.indexOf("/");
  if (slash >= 0) {
    s = s.slice(0, slash);
  }
  s = s.replace(/\.+$/g, "").trim();
  const hostMatch = /^([^.]+)\.salesdrive\.me$/i.exec(s);
  if (hostMatch?.[1]) {
    return hostMatch[1];
  }
  s = s.replace(/\.salesdrive\.me$/i, "");
  if (s.includes(".")) {
    const first = s.split(".")[0] ?? "";
    if (first && /^[a-z0-9_-]+$/i.test(first)) {
      return first;
    }
  }
  return s;
}

export async function sendSalesDriveOrder(
  domain: string,
  apiKey: string,
  body: Record<string, unknown>,
): Promise<{ ok: true; orderId?: number } | { ok: false; message: string; raw: string }> {
  const base = normalizeSalesDriveSubdomain(domain);
  const url = `https://${base}.salesdrive.me/handler/`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify(body),
  });

  const raw = await res.text();
  let parsed: SalesDriveCreateOrderResponse | null = null;
  try {
    parsed = raw ? (JSON.parse(raw) as SalesDriveCreateOrderResponse) : null;
  } catch {
    parsed = null;
  }

  if (parsed?.error) {
    return { ok: false, message: parsed.error, raw: raw.slice(0, 4000) };
  }

  const orderId = parsed?.data?.orderId;
  if (typeof orderId === "number" && orderId > 0) {
    return { ok: true, orderId };
  }

  const fallback =
    raw.trim().slice(0, 500) ||
    `HTTP ${res.status}. Перевірте X-Api-Key та піддомен у SALESDRIVE_DOMAIN.`;
  return { ok: false, message: fallback, raw: raw.slice(0, 4000) };
}
