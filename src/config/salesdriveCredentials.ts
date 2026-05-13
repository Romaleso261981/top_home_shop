/**
 * SalesDrive: спочатку змінні середовища (.env.local у dev), потім запасні рядки нижче.
 * Не комітьте реальний API-ключ у публічний репозиторій.
 */

function envTrim(name: string): string {
  return String(process.env[name] ?? "").trim();
}

export const HARDCODED_SALESDRIVE_API_KEY = "";

/** Лише піддомен, наприклад mixs-bud (без .salesdrive.me) */
export const HARDCODED_SALESDRIVE_DOMAIN = "";

/** Порожній рядок = не передавати; інакше число рядком, наприклад "123" */
export const HARDCODED_SALESDRIVE_STATUS_ID = "";

export const HARDCODED_SALESDRIVE_TYPE_ID = "";

export const HARDCODED_SALESDRIVE_ORGANIZATION_ID = "";

export function optionalHardcodedPositiveInt(raw: string): number | undefined {
  const t = raw.trim();
  if (!t || !/^\d+$/.test(t)) {
    return undefined;
  }
  const n = Number.parseInt(t, 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export function resolveSalesDriveApiKey(): string {
  return envTrim("SALESDRIVE_API_KEY") || HARDCODED_SALESDRIVE_API_KEY.trim();
}

export function resolveSalesDriveDomain(): string {
  return envTrim("SALESDRIVE_DOMAIN") || HARDCODED_SALESDRIVE_DOMAIN.trim();
}

export function resolveSalesDriveStatusId(): number | undefined {
  const e = envTrim("SALESDRIVE_STATUS_ID");
  if (e) {
    return optionalHardcodedPositiveInt(e);
  }
  return optionalHardcodedPositiveInt(HARDCODED_SALESDRIVE_STATUS_ID);
}

/** Якщо ні env, ні fallback — undefined; у route підставляється 1 */
export function resolveSalesDriveTypeId(): number | undefined {
  const e = envTrim("SALESDRIVE_TYPE_ID");
  if (e) {
    return optionalHardcodedPositiveInt(e);
  }
  return optionalHardcodedPositiveInt(HARDCODED_SALESDRIVE_TYPE_ID);
}

export function resolveSalesDriveOrganizationId(): number | undefined {
  const e = envTrim("SALESDRIVE_ORGANIZATION_ID");
  if (e) {
    return optionalHardcodedPositiveInt(e);
  }
  return optionalHardcodedPositiveInt(HARDCODED_SALESDRIVE_ORGANIZATION_ID);
}
