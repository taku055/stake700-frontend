/** Digits only, 13–19 length, passes Luhn checksum (standard card PAN checks). */
export const validateCardPan = (raw: string): string | null => {
  const digits = raw.replace(/\D/g, "");
  if (!digits) {
    return "Please enter a card number.";
  }
  if (digits.length < 13 || digits.length > 19) {
    return "Card number must be between 13 and 19 digits.";
  }
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number.parseInt(digits[i]!, 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  if (sum % 10 !== 0) {
    return "Card number is not valid (check digits).";
  }
  return null;
};
