import { NextResponse } from "next/server";
import { appendFile, mkdir } from "fs/promises";
import path from "path";

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

  const payload = {
    source: "website",
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    message: lead.message,
    pageUrl: lead.pageUrl,
  };

  if (webhookUrl) {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
          "Не вдалося зберегти заявку. Задайте FORM_WEBHOOK_URL у .env.local або перевірте права на папку storage/",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
