const STORAGE_KEY = "epayclub_checkout";

export type EpayclubCheckoutSession = {
  reference: string;
  checkoutToken: string;
};

export function saveEpayclubCheckout(
  reference: string,
  checkoutToken: string,
): void {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ reference, checkoutToken }),
    );
  } catch {
    // Ignore storage errors (private browsing, etc.)
  }
}

export function loadEpayclubCheckout(): EpayclubCheckoutSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as EpayclubCheckoutSession;
    if (!parsed.reference || !parsed.checkoutToken) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearEpayclubCheckout(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}
