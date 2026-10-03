import { instance } from "../instance";

export type tFineraWithdrawRequest = {
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

export type tFineraWithdrawResponse = {
  success: boolean;
  message: string;
  trx: string;
};

export async function apiWithdrawWithFinera(params: tFineraWithdrawRequest) {
  const res = await instance.post<tFineraWithdrawResponse>(
    "/finera/withdraw",
    params,
  );
  return res.data;
}
