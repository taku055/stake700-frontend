import { instance } from "../instance";
import type { EpayclubDepositOptions } from "@/helpers/epayclubDeposit";

export type tEpayclubCreateDepositResponse = {
  success?: boolean;
  message?: string;
  redirect_url?: string;
  checkout_url?: string;
  reference?: string;
  checkoutToken?: string;
  data?: {
    redirect_url?: string;
    checkout_url?: string;
    reference?: string;
    checkoutToken?: string;
  };
};

export type tEpayclubCardPayRequest = {
  reference: string;
  checkoutToken: string;
  cardnumber: string;
  expirymonth: string;
  expiryyear: string;
  cvv: string;
  country: string;
  authOption?: "3DS" | "NOAUTH";
  billingaddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
  };
};

export type tEpayclubCardPayResponse = {
  success?: boolean;
  message?: string;
  redirect_url?: string;
  return_url?: string;
  reference?: string;
  status?: string;
  provider_status?: string;
  duplicate?: boolean;
};

export type tEpayclubVerifyResponse = {
  success?: boolean;
  duplicate?: boolean;
  reference?: string;
  status?: string;
  provider_status?: string;
  message?: string;
};

export async function apiGetEpayclubDepositOptions() {
  const res = await instance.get<EpayclubDepositOptions>(
    "/payment/epayclub/options",
  );
  return res.data;
}

export async function apiCreateEpayclubDeposit(amount: number, promoId?: string) {
  const body: { amount: number; promoId?: string } = { amount };
  if (promoId) {
    body.promoId = promoId;
  }

  const res = await instance.post<tEpayclubCreateDepositResponse>(
    "/payment/epayclub/card/deposit",
    body,
  );
  return res.data;
}

export async function apiCreateEpayclubLinkDeposit(
  amount: number,
  promoId?: string,
) {
  const body: { amount: number; promoId?: string } = { amount };
  if (promoId) {
    body.promoId = promoId;
  }

  const res = await instance.post<tEpayclubCreateDepositResponse>(
    "/payment/epayclub/link/deposit",
    body,
  );
  return res.data;
}

export async function apiPayEpayclubCard(params: tEpayclubCardPayRequest) {
  const res = await instance.post<tEpayclubCardPayResponse>(
    "/payment/epayclub/card/pay",
    params,
  );
  return res.data;
}

export async function apiVerifyEpayclub(reference: string, checkoutToken: string) {
  const res = await instance.post<tEpayclubVerifyResponse>(
    "/payment/epayclub/verify",
    { reference, checkoutToken },
  );
  return res.data;
}

const EPAYCLUB_PENDING_STATUSES = new Set([
  "pending",
  "pending_callback",
  "pending_authentication",
  "created",
]);

function isEpayclubVerifyPending(status?: string) {
  return EPAYCLUB_PENDING_STATUSES.has((status ?? "").toLowerCase());
}

export async function apiVerifyEpayclubWithPolling(
  reference: string,
  checkoutToken: string,
  options?: { maxAttempts?: number; intervalMs?: number },
) {
  const maxAttempts = options?.maxAttempts ?? 20;
  const intervalMs = options?.intervalMs ?? 3000;

  let lastResponse = await apiVerifyEpayclub(reference, checkoutToken);
  if (
    lastResponse.duplicate ||
    !isEpayclubVerifyPending(lastResponse.status)
  ) {
    return lastResponse;
  }

  for (let attempt = 1; attempt < maxAttempts; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    lastResponse = await apiVerifyEpayclub(reference, checkoutToken);
    if (
      lastResponse.duplicate ||
      !isEpayclubVerifyPending(lastResponse.status)
    ) {
      return lastResponse;
    }
  }

  return lastResponse;
}

export function buildEpayclubResultUrl(reference: string, checkoutToken: string) {
  const url = new URL("/payment/epayclub/result", window.location.origin);
  url.searchParams.set("reference", reference);
  url.searchParams.set("checkoutToken", checkoutToken);
  return url.toString();
}
