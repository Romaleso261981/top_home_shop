"use client";

import { ctaButtonClass } from "@/components/buttonStyles";
import { useMemo, useState } from "react";

type FeedbackFormSectionProps = {
  title: string;
  buttonText: string;
};

type TelegramFormResponse = {
  ok?: boolean;
  error?: string;
  description?: string;
  details?: string;
};

export function FeedbackFormSection({
  title,
  buttonText,
}: FeedbackFormSectionProps) {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorText, setErrorText] = useState<string>("");

  const canSubmit = useMemo(() => status !== "sending", [status]);

  return (
    <section className="mb-12 bg-[#15698f] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">{title}</h2>

        <form
          className="mt-8"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!canSubmit) return;

            setStatus("sending");
            setErrorText("");

            const form = e.currentTarget;
            const fd = new FormData(form);

            const payload = {
              name: String(fd.get("name") ?? "").trim(),
              phone: String(fd.get("phone") ?? "").trim(),
              email: String(fd.get("email") ?? "").trim(),
              message: String(fd.get("message") ?? "").trim(),
              website: String(fd.get("website") ?? "").trim(), // honeypot
              pageUrl: typeof window !== "undefined" ? window.location.href : "",
            };

            try {
              const isLocal =
                typeof window !== "undefined" &&
                (window.location.hostname === "localhost" ||
                  window.location.hostname === "127.0.0.1");

              const endpoint = isLocal ? "/api/crm" : "/api/crm.php";

              const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });

              const raw = await res.text();
              let json: TelegramFormResponse | null = null;
              if (raw) {
                try {
                  json = JSON.parse(raw) as TelegramFormResponse;
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
                const parts = [
                  base,
                  json?.description ? `(${json.description})` : "",
                ].filter(Boolean);
                setErrorText(parts.join(" "));
                return;
              }

              setStatus("success");
              form.reset();
            } catch {
              setStatus("error");
              setErrorText("Не вдалося відправити. Перевірте інтернет і спробуйте ще раз.");
            }
          }}
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <input
              type="text"
              name="name"
              placeholder="Ваше ім'я"
              className="h-12 w-full border-0 bg-white px-5 text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Ваш телефон"
              className="h-12 w-full border-0 bg-white px-5 text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Ваш емейл"
              className="h-12 w-full border-0 bg-white px-5 text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400"
            />
          </div>

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
            placeholder="Напишіть питання"
            rows={9}
            className="mt-4 w-full border-0 bg-white px-5 py-4 text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400"
          />

          {status === "success" ? (
            <p className="mt-4 text-center text-sm text-emerald-100">
              Дякуємо! Повідомлення відправлено.
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

