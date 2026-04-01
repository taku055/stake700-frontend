import { instance } from "../instance";

export type tNeonpaySaleFormResponse = {
  success: boolean;
  client_orderid: string;
  paynet_order_id?: string;
  redirect_url: string;
  serial_number?: string;
};

export async function apiGetNeonpaySaleForm(amount: number, locale: string) {
  const res = await instance.post<tNeonpaySaleFormResponse>("/neonpay/sale-form", {
    amount,
    locale,
  });
  return res.data;
}
