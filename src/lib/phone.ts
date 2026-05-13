/** Нормалізація для перевірки: лише цифри, очікуємо UA (38 + 10 цифр після 0). */
export function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Перевірка українського мобільного/міського формату після нормалізації.
 * Приймає: +380671112233, 380671112233, 0671112233, 671112233 (додаємо 0).
 */
export function isValidUaPhone(phone: string): boolean {
  const d = digitsOnly(phone.trim());
  if (d.length < 10) {
    return false;
  }
  let n = d;
  if (n.startsWith("380") && n.length >= 12) {
    n = "0" + n.slice(3);
  } else if (n.length === 9 && !n.startsWith("0")) {
    n = "0" + n;
  }
  if (n.length !== 10 || !n.startsWith("0")) {
    return false;
  }
  const op = n.slice(1, 3);
  const validMobilePrefixes = new Set([
    "39",
    "50",
    "63",
    "66",
    "67",
    "68",
    "73",
    "91",
    "92",
    "93",
    "94",
    "95",
    "96",
    "97",
    "98",
    "99",
  ]);
  if (validMobilePrefixes.has(op)) {
    return true;
  }
  if (op === "32" || op === "44" || op === "45" || op === "48" || op === "52" || op === "56") {
    return true;
  }
  return /^0\d{9}$/.test(n);
}

export function normalizeUaPhoneForCrm(phone: string): string {
  const d = digitsOnly(phone.trim());
  if (d.startsWith("380") && d.length >= 12) {
    return "+" + d.slice(0, 12);
  }
  if (d.length === 10 && d.startsWith("0")) {
    return "+38" + d;
  }
  if (d.length === 9) {
    return "+380" + d;
  }
  return phone.trim();
}
