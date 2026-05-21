import { instance } from "../instance";

export type tNeonpaySaleFormResponse = {
  success: boolean;
  client_orderid: string;
  paynet_order_id?: string;
  redirect_url: string;
  serial_number?: string;
};

export async function apiGetNeonpaySaleForm(
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

  const res = await instance.post<tNeonpaySaleFormResponse>(
    "/neonpay/sale-form",
    body,
  );
  return res.data;
}
