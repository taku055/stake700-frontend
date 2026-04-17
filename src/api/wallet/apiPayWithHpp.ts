import { instance } from "../instance";

export type tHPPPaymentResponse = {
  code: string;
  message?: string;
  url?: string;
};

export async function apiPayWithHpp(params: any) {
  const res = await instance.post<tHPPPaymentResponse>("/ereus/hpp", params);
  return res.data;
}
