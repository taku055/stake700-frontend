import { instance } from "../instance";
import { tHPPPaymentResponse } from "./apiPayWithHpp";

export async function apiPaySimpleWithHpp(params: any) {
  const res = await instance.post<tHPPPaymentResponse>("/ereus/hpp-simple", params);
  return res.data;
}
