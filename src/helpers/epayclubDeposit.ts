import type { tEpayclubCreateDepositResponse } from "@/api/wallet/apiEpayclub";

export type EpayclubDepositMethod = "card" | "payment_link";

export type EpayclubDepositOptions = {
  enabled: boolean;
  currency: string;
  min_amount: number;
  max_amount: number;
  payment_link_enabled: boolean;
  card_checkout_enabled: boolean;
};

export type EpayclubCheckoutTarget =
  | { type: "internal"; path: string }
  | { type: "external"; url: string };

export const DEFAULT_EPAYCLUB_DEPOSIT_OPTIONS: EpayclubDepositOptions = {
  enabled: true,
  currency: "USD",
  min_amount: 1,
  max_amount: 1_000_000,
  // payment_link_enabled: true,
  payment_link_enabled: false,
  card_checkout_enabled: true,
};

export function parseEpayclubMethodParam(
  search: string,
): EpayclubDepositMethod | null {
  const raw = new URLSearchParams(search).get("epayclub")?.trim().toLowerCase();
  if (!raw) return null;
  if (raw === "card") return "card";
  if (raw === "link" || raw === "payment_link" || raw === "payment-link") {
    return "payment_link";
  }
  return null;
}

export function resolveEpayclubDepositMethod(
  options: EpayclubDepositOptions,
  search = "",
): EpayclubDepositMethod {
  const requested = parseEpayclubMethodParam(search);
  // Payment link deposit temporarily disabled on frontend.
  // if (requested === "payment_link" && options.payment_link_enabled) {
  //   return "payment_link";
  // }
  if (requested === "card" && options.card_checkout_enabled) {
    return "card";
  }
  // if (options.payment_link_enabled) return "payment_link";
  if (options.card_checkout_enabled) return "card";
  // return "payment_link";
  return "card";
}

export function hasMultipleEpayclubDepositMethods(
  options: EpayclubDepositOptions,
): boolean {
  return options.payment_link_enabled && options.card_checkout_enabled;
}

/** @deprecated use hasMultipleEpayclubDepositMethods */
export function canChooseEpayclubDepositMethod(
  options: EpayclubDepositOptions,
): boolean {
  return hasMultipleEpayclubDepositMethods(options);
}

export function getEpayclubCheckoutBaseUrl(): string | null {
  const raw = import.meta.env.VITE_EPAYCLUB_CHECKOUT_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/$/, "");
}

export function buildEpayclubExternalCheckoutUrl(
  reference: string,
  checkoutToken: string,
): string | null {
  const base = getEpayclubCheckoutBaseUrl();
  if (!base) return null;
  const url = new URL("/checkout", `${base}/`);
  url.searchParams.set("reference", reference);
  url.searchParams.set("checkoutToken", checkoutToken);
  return url.toString();
}

export function buildEpayclubExternalResultUrl(
  reference: string,
  checkoutToken: string,
): string | null {
  const base = getEpayclubCheckoutBaseUrl();
  if (!base) return null;
  const url = new URL("/result", `${base}/`);
  url.searchParams.set("reference", reference);
  url.searchParams.set("checkoutToken", checkoutToken);
  return url.toString();
}

export function resolveEpayclubCheckoutTarget(
  res: tEpayclubCreateDepositResponse,
  method: EpayclubDepositMethod,
): EpayclubCheckoutTarget | null {
  const redirectUrl =
    res.redirect_url ??
    res.checkout_url ??
    res.data?.redirect_url ??
    res.data?.checkout_url;

  if (redirectUrl) {
    try {
      const parsed = new URL(redirectUrl, window.location.origin);
      if (parsed.origin === window.location.origin) {
        return {
          type: "internal",
          path: `${parsed.pathname}${parsed.search}`,
        };
      }
    } catch {
      // Fall through to external navigation.
    }
    return { type: "external", url: redirectUrl };
  }

  if (method === "payment_link") {
    return null;
  }

  const reference = res.reference ?? res.data?.reference;
  const checkoutToken = res.checkoutToken ?? res.data?.checkoutToken;
  if (!reference || !checkoutToken) {
    return null;
  }

  const externalCheckout = buildEpayclubExternalCheckoutUrl(
    reference,
    checkoutToken,
  );
  if (externalCheckout) {
    return { type: "external", url: externalCheckout };
  }

  const params = new URLSearchParams({
    reference,
    checkoutToken,
  });
  return {
    type: "internal",
    path: `/payment/epayclub/card/checkout?${params.toString()}`,
  };
}

export function extractEpayclubCheckoutSession(
  res: tEpayclubCreateDepositResponse,
) {
  const reference = res.reference ?? res.data?.reference;
  const checkoutToken = res.checkoutToken ?? res.data?.checkoutToken;
  if (!reference || !checkoutToken) {
    return null;
  }
  return { reference, checkoutToken };
}
