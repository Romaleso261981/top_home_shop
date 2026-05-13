/**
 * SalesDrive — значення прямо в коді (без process.env).
 * Заповніть рядки нижче. Не комітьте реальний API-ключ у публічний репозиторій.
 */

export const HARDCODED_SALESDRIVE_API_KEY = "w6du84l1_fpcxUEB8AGhMze1d77HQpfS9i1ii3cXIxZSDyRCS2wuGjI-xKgK2xS6UkWrSmW8MABKR2r14_aB8ROcaIE6ssoJ3ay4";

/** Лише піддомен, наприклад mixs-bud (без .salesdrive.me) */
export const HARDCODED_SALESDRIVE_DOMAIN = "mixs-bud";

/** Порожній рядок = не передавати; інакше число рядком, наприклад "123" */
export const HARDCODED_SALESDRIVE_STATUS_ID = "1";

export const HARDCODED_SALESDRIVE_TYPE_ID = "1";

export const HARDCODED_SALESDRIVE_ORGANIZATION_ID = "1";

export function optionalHardcodedPositiveInt(raw: string): number | undefined {
  const t = raw.trim();
  if (!t || !/^\d+$/.test(t)) {
    return undefined;
  }
  const n = Number.parseInt(t, 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}
