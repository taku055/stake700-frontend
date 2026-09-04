import { instance } from "../instance";

export type tEcohpayWithdrawRequest = {
  amount: number;
  method: "card" | "card_ref" | "bank";
  credit_card_number?: string;
  card_printed_name?: string;
  expire_month?: string;
  expire_year?: string;
  destination_card_ref_id?: string;
  account_number?: string;
  account_name?: string;
  routing_number?: string;
};

export type tEcohpayWithdrawResponse = {
  success: boolean;
  message: string;
  trx: string;
};

export async function apiWithdrawWithEcohpay(params: tEcohpayWithdrawRequest) {
  const res = await instance.post<tEcohpayWithdrawResponse>(
    "/ecohpay/withdraw",
    params,
  );
  return res.data;
}
