import { instance } from "../instance";

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

export function buildEpayclubResultUrl(reference: string, checkoutToken: string) {
  const url = new URL("/payment/epayclub/result", window.location.origin);
  url.searchParams.set("reference", reference);
  url.searchParams.set("checkoutToken", checkoutToken);
  return url.toString();
}
