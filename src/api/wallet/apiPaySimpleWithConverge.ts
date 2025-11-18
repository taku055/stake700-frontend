import { instance } from "../instance";

export type tConvergePaymentResponse = {
  transaction: {
    result: string;
    merchanttransid: string;
    transref: string;
    gatetransid: string;
    errorcode: string;
    errormessage: string;
    description: string;
    descriptor: string;
  };
};

export async function apiPaySimpleWithConverge(params: any) {
  const res = await instance.post<tConvergePaymentResponse>(
    "/converge/simple",
    params
  );
  return res.data;
}