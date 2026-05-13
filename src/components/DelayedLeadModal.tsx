"use client";

import { isValidUaPhone } from "@/lib/phone";
import { parseUtmFromUrl } from "@/lib/utm";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

/** Мінімальний час на сторінці (мс) перед показом за скролом — щоб не з’являвся миттєво під час завантаження. */
const MIN_MS_BEFORE_SCROLL_SHOW = 3_000;

/** Поріг вертикального скролу (px), після якого можна показати банер (раніше за таймер). */
const SCROLL_Y_TRIGGER = 140;

/** Інтервал (мс) після завантаження сторінки, після якого з’являється банер, якщо скрол ще не спрацював. */
export const LEAD_MODAL_SHOW_AFTER_MS = 6_000;

/** Не показувати знову після успішної відправки заявки (одна вкладка браузера). Закриття хрестиком блокує лише до перезавантаження сторінки. */
const SESSION_KEY_SUBMITTED = "lead_modal_submitted";

type FormSubmitResponse = {
  ok?: boolean;
  error?: string;
  description?: string;
  details?: string;
};

const SUBMIT_COOLDOWN_MS = 2200;

const DEFAULT_SERVICE =
  "Заявка з банера: безкоштовний розрахунок вартості для об’єкта";

export function DelayedLeadModal() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [errorText, setErrorText] = useState("");
  const lastSubmitAt = useRef(0);
  const mountAt = useRef(0);
  const openedRef = useRef(false);

  const tryOpen = useCallback(() => {
    if (openedRef.current) {
      return;
    }
    openedRef.current = true;
    setOpen(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      if (sessionStorage.getItem(SESSION_KEY_SUBMITTED) === "1") {
        return;
      }
    } catch {
      /* ignore */
    }

    mountAt.current = Date.now();

    const t = window.setTimeout(() => {
      tryOpen();
    }, LEAD_MODAL_SHOW_AFTER_MS);

    const getScrollY = () =>
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    const onScroll = () => {
      if (openedRef.current) {
        return;
      }
      if (getScrollY() < SCROLL_Y_TRIGGER) {
        return;
      }
      if (Date.now() - mountAt.current < MIN_MS_BEFORE_SCROLL_SHOW) {
        return;
      }
      window.clearTimeout(t);
      tryOpen();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, [tryOpen]);

  useEffect(() => {
    if (!open || typeof document === "undefined") {
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const dismiss = useCallback(() => {
    setOpen(false);
  }, []);

  const handleClose = useCallback(() => {
    dismiss();
  }, [dismiss]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-10000 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Закрити вікно"
        className="absolute inset-0 bg-zinc-900/55 backdrop-blur-[1px]"
        onClick={handleClose}
      />
      <div
        className="relative z-10001 w-full max-w-[min(100%,26rem)] rounded-lg bg-white px-6 py-8 shadow-2xl sm:px-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          aria-label="Закрити"
          onClick={handleClose}
          className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl font-light leading-none text-zinc-600 shadow-md transition hover:bg-zinc-50 hover:text-zinc-900 sm:-right-3 sm:-top-3"
        >
          ×
        </button>

        <h2
          id={titleId}
          className="pr-6 text-center text-base font-bold uppercase leading-snug tracking-tight text-zinc-800 sm:text-lg"
        >
          Хочете отримати безкоштовний розрахунок вартості для вашого об’єкта?
        </h2>
        <p className="mt-4 text-center text-sm leading-relaxed text-zinc-600 sm:text-[0.9375rem]">
          Вкажіть ваш телефон і ми зв’яжемося з вами найближчим часом
        </p>

        {status === "success" ? (
          <p className="mt-8 text-center text-base font-medium text-emerald-600">
            Дякуємо! Ми зателефонуємо вам найближчим часом.
          </p>
        ) : (
          <form
            className="mt-8 space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              const now = Date.now();
              if (now - lastSubmitAt.current < SUBMIT_COOLDOWN_MS) {
                return;
              }
              lastSubmitAt.current = now;

              const form = e.currentTarget;
              const fd = new FormData(form);
              const phone = String(fd.get("phone") ?? "").trim();

              if (!phone) {
                setStatus("error");
                setErrorText("Вкажіть номер телефону.");
                return;
              }
              if (!isValidUaPhone(phone)) {
                setStatus("error");
                setErrorText(
                  "Некоректний номер телефону. Наприклад: 067 123 45 67.",
                );
                return;
              }

              const pageUrl =
                typeof window !== "undefined" ? window.location.href : "";
              const utm = parseUtmFromUrl(pageUrl);

              setStatus("sending");
              setErrorText("");

              const payload = {
                name: "",
                phone,
                email: "",
                message: "",
                service: DEFAULT_SERVICE,
                website: "",
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
                  setErrorText(
                    json?.error ??
                      (res.status >= 500
                        ? "Сервер тимчасово недоступний. Спробуйте пізніше."
                        : "Не вдалося відправити. Спробуйте пізніше."),
                  );
                  return;
                }

                setStatus("success");
                form.reset();
                try {
                  sessionStorage.setItem(SESSION_KEY_SUBMITTED, "1");
                } catch {
                  /* ignore */
                }
                window.setTimeout(() => {
                  dismiss();
                }, 2200);
              } catch {
                setStatus("error");
                setErrorText(
                  "Не вдалося відправити. Перевірте інтернет і спробуйте ще раз.",
                );
              }
            }}
          >
            <input type="hidden" name="website" value="" tabIndex={-1} />
            <label className="sr-only" htmlFor="lead-modal-phone">
              Телефон
            </label>
            <input
              id="lead-modal-phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="Телефон*"
              className="h-12 w-full rounded border border-zinc-200 bg-white px-4 text-zinc-900 outline-none ring-emerald-500/30 transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2"
            />

            {status === "error" ? (
              <p className="text-center text-sm text-rose-600">{errorText}</p>
            ) : null}

            <div className="flex justify-center pt-1">
              <button
                type="submit"
                disabled={status === "sending"}
                className="min-w-48 rounded-full bg-emerald-500 px-10 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "sending" ? "Відправляємо…" : "Відправити"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
