import { instance } from "../instance";

export type tCreateAriesWithdrawRequest = {
  amount: number;
  pan: string;
};

export type tCreateAriesWithdrawResponse = {
  status: boolean;
  message: string;
  data: {
    paymentUrl: string;
  };
};

export async function apiWithdrawWithAries(params: tCreateAriesWithdrawRequest) {
  const res = await instance.post<tCreateAriesWithdrawResponse>(
    "/payment/aries/create-withdraw",
    params
  );
  return res.data;
}
