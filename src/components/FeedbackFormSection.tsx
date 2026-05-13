"use client";

import { ctaButtonClass } from "@/components/buttonStyles";
import { isValidUaPhone } from "@/lib/phone";
import { parseUtmFromUrl } from "@/lib/utm";
import { useMemo, useRef, useState } from "react";

type FeedbackFormSectionProps = {
  title: string;
  buttonText: string;
  /** Підставляється в поле «Послуга / товар» за замовчуванням */
  defaultServiceName?: string;
};

type FormSubmitResponse = {
  ok?: boolean;
  error?: string;
  description?: string;
  details?: string;
  orderId?: number;
};

const SUBMIT_COOLDOWN_MS = 2200;

export function FeedbackFormSection({
  title,
  buttonText,
  defaultServiceName = "",
}: FeedbackFormSectionProps) {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorText, setErrorText] = useState<string>("");
  const lastSubmitAt = useRef(0);

  const canSubmit = useMemo(() => status !== "sending", [status]);

  return (
    <section className="mb-12 bg-[#15698f] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">{title}</h2>

        <form
          className="mt-8"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!canSubmit) {
              return;
            }

            const now = Date.now();
            if (now - lastSubmitAt.current < SUBMIT_COOLDOWN_MS) {
              return;
            }
            lastSubmitAt.current = now;

            const form = e.currentTarget;
            const fd = new FormData(form);

            const name = String(fd.get("name") ?? "").trim();
            const phone = String(fd.get("phone") ?? "").trim();
            const email = String(fd.get("email") ?? "").trim();
            const message = String(fd.get("message") ?? "").trim();
            const service = String(fd.get("service") ?? "").trim();
            const website = String(fd.get("website") ?? "").trim();

            if (!phone) {
              setStatus("error");
              setErrorText("Вкажіть номер телефону.");
              return;
            }
            if (!isValidUaPhone(phone)) {
              setStatus("error");
              setErrorText(
                "Некоректний номер телефону. Використайте український формат, наприклад 067 123 45 67.",
              );
              return;
            }

            if (!name && !message && !service) {
              setStatus("error");
              setErrorText("Заповніть ім’я, послугу або повідомлення.");
              return;
            }

            const pageUrl =
              typeof window !== "undefined" ? window.location.href : "";
            const utm = parseUtmFromUrl(pageUrl);

            setStatus("sending");
            setErrorText("");

            const payload = {
              name,
              phone,
              email,
              message,
              service,
              website,
              pageUrl,
              utm_source: utm.utm_source,
              utm_medium: utm.utm_medium,
              utm_campaign: utm.utm_campaign,
              utm_content: utm.utm_content,
              utm_term: utm.utm_term,
            };

            try {
              const isLocal =
                typeof window !== "undefined" &&
                (window.location.hostname === "localhost" ||
                  window.location.hostname === "127.0.0.1");

              const endpoint = isLocal ? "/api/order" : "/api/order.php";

              const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });

              const raw = await res.text();
              let json: FormSubmitResponse | null = null;
              if (raw) {
                try {
                  json = JSON.parse(raw) as FormSubmitResponse;
                } catch {
                  json = null;
                }
              }

              if (!res.ok || !json?.ok) {
                setStatus("error");
                const base =
                  json?.error ??
                  (res.status >= 500
                    ? "Сервер тимчасово недоступний. Спробуйте пізніше."
                    : "Не вдалося відправити. Спробуйте пізніше.");
                const rawDetails =
                  json?.details && typeof json.details === "string"
                    ? json.details.trim()
                    : "";
                const detail =
                  rawDetails.length > 0 ? rawDetails.slice(0, 280) : "";
                const detailSuffix = rawDetails.length > 280 ? "…" : "";
                const parts = [
                  base,
                  json?.description ? `(${json.description})` : "",
                  detail ? ` — ${detail}${detailSuffix}` : "",
                ].filter(Boolean);
                const fullMsg = parts.join(" ");
                setErrorText(fullMsg);
                console.error("[FeedbackForm] submit failed", {
                  status: res.status,
                  body: json,
                  raw: raw.slice(0, 1500),
                });
                return;
              }

              setStatus("success");
              form.reset();
            } catch (err) {
              setStatus("error");
              setErrorText(
                "Не вдалося відправити. Перевірте інтернет і спробуйте ще раз.",
              );
              console.error("[FeedbackForm] network error", err);
            }
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Ваше ім'я"
              className="h-12 w-full border-0 bg-white px-5 text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400"
            />
            <input
              type="tel"
              name="phone"
              required
              autoComplete="tel"
              placeholder="Телефон * (наприклад 067 123 45 67)"
              className="h-12 w-full border-0 bg-white px-5 text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400"
            />
          </div>

          <input
            type="text"
            name="service"
            defaultValue={defaultServiceName}
            placeholder="Назва послуги або товару"
            className="mt-4 h-12 w-full border-0 bg-white px-5 text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400"
          />

          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email (необов’язково)"
            className="mt-4 h-12 w-full border-0 bg-white px-5 text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400"
          />

          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          <textarea
            name="message"
            placeholder="Коментар або питання"
            rows={7}
            className="mt-4 w-full border-0 bg-white px-5 py-4 text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400"
          />

          {status === "success" ? (
            <p className="mt-4 text-center text-base font-medium text-emerald-100">
              Дякуємо, вашу заявку прийнято.
            </p>
          ) : null}
          {status === "error" ? (
            <p className="mt-4 text-center text-sm text-rose-100">{errorText}</p>
          ) : null}

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={!canSubmit}
              className={`${ctaButtonClass} min-w-[280px] disabled:cursor-not-allowed disabled:opacity-70`}
            >
              {status === "sending" ? "Відправляємо..." : buttonText}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
