export type CardBrand =
  | "visa"
  | "mastercard"
  | "amex"
  | "discover"
  | "unknown";

export const onlyDigits = (value: string) => value.replace(/\D/g, "");

export function detectCardBrand(digits: string): CardBrand {
  if (!digits) return "unknown";
  if (/^4/.test(digits)) return "visa";
  if (/^3[47]/.test(digits)) return "amex";
  if (/^6(?:011|5)/.test(digits)) return "discover";
  if (/^5[1-5]/.test(digits) || /^2(?:2[2-9]|[3-6]\d|7[01]|720)/.test(digits)) {
    return "mastercard";
  }
  return "unknown";
}

export function formatCardNumber(value: string) {
  const digits = onlyDigits(value);
  const brand = detectCardBrand(digits);
  if (brand === "amex") {
    const p1 = digits.slice(0, 4);
    const p2 = digits.slice(4, 10);
    const p3 = digits.slice(10, 15);
    return [p1, p2, p3].filter(Boolean).join(" ");
  }
  return digits
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

export function maxCardDigits(brand: CardBrand) {
  return brand === "amex" ? 15 : 19;
}

export function expectedCvvLength(brand: CardBrand) {
  return brand === "amex" ? 4 : 3;
}

export function luhnCheck(digits: string) {
  if (digits.length < 13) return false;
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

export function isExpiryValid(month: string, year: string) {
  if (!/^\d{2}$/.test(month) || !/^\d{2}$/.test(year)) return false;
  const m = Number(month);
  if (m < 1 || m > 12) return false;
  const now = new Date();
  const fullYear = 2000 + Number(year);
  const expiry = new Date(fullYear, m, 0, 23, 59, 59);
  return expiry >= new Date(now.getFullYear(), now.getMonth(), 1);
}
