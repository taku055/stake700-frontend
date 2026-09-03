import { instance } from "../instance";

export type tEcohpaySaleFormResponse = {
  success: boolean;
  client_orderid: string;
  paynet_order_id?: string;
  redirect_url: string;
  serial_number?: string;
};

export async function apiGetEcohpaySaleForm(
  amount: number,
  type: "card" | "googlepay" | "applepay",
  locale: string,
  promoId?: string,
) {
  const body: {
    amount: number;
    type: "card" | "googlepay" | "applepay";
    locale: string;
    promoId?: string;
  } = {
    amount,
    type,
    locale: locale.slice(0, 16),
  };
  if (promoId) {
    body.promoId = promoId;
  }

  const res = await instance.post<tEcohpaySaleFormResponse>(
    "/ecohpay/sale-form",
    body,
  );
  return res.data;
}
