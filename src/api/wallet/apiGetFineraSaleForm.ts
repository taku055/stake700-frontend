import { instance } from "../instance";

export type tFineraSaleFormResponse = {
  success: boolean;
  client_orderid: string;
  paynet_order_id?: string;
  redirect_url: string;
  serial_number?: string;
};

export async function apiGetFineraSaleForm(
  amount: number,
  type: "card" | "googlepay" | "applepay",
  locale: string,
  promoId?: string,
  ftd?: boolean,
) {
  const body: {
    amount: number;
    type: "card" | "googlepay" | "applepay";
    locale: string;
    promoId?: string;
    ftd?: boolean;
  } = {
    amount,
    type,
    locale: locale.slice(0, 16),
  };
  if (promoId) {
    body.promoId = promoId;
  }
  if (ftd) {
    body.ftd = true;
  }

  const res = await instance.post<tFineraSaleFormResponse>(
    "/finera/sale-form",
    body,
  );
  return res.data;
}
