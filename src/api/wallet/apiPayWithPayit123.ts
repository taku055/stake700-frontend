import { instance } from "../instance";

export type tPayit123Response = {
  code: string;
  status: string;
  amount: number;
  currency: string;
  invoiceNumber: string;
  message: string;
  transactionId: string
  Statement_Descriptor: string;
  ["3DSUrl"]?: string;
};

export async function apiPayWithPayit123(params: any) {
  const res = await instance.post<tPayit123Response>(
    "/payit123",
    params
  );
  return res.data;
}