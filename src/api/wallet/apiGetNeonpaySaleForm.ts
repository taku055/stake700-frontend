import { instance } from "../instance";

export type tNeonpaySaleFormResponse = {
  success: boolean;
  client_orderid: string;
  paynet_order_id?: string;
  redirect_url: string;
  serial_number?: string;
};

export async function apiGetNeonpaySaleForm(amount: number, type: "card" | "googlepay" | "applepay", locale: string) {
  const res = await instance.post<tNeonpaySaleFormResponse>("/neonpay/sale-form", {
    amount,
    type,
    locale,
  });
  return res.data;
}
