const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type UtmPayload = Record<(typeof UTM_KEYS)[number], string>;

export function emptyUtm(): UtmPayload {
  return {
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
  };
}

/** Парсинг UTM з рядка query (?a=1&b=2) або з повного URL. */
export function parseUtmFromUrl(href: string): UtmPayload {
  const out = emptyUtm();
  try {
    const u = href.includes("://") ? new URL(href) : new URL(href, "https://example.local");
    for (const key of UTM_KEYS) {
      const v = u.searchParams.get(key);
      if (v) {
        out[key] = v.trim().slice(0, 500);
      }
    }
  } catch {
    /* ignore */
  }
  return out;
}
