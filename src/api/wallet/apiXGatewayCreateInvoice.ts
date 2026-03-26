import { instance } from "../instance";

export type tXGatewayCreateInvoiceResponse = {
  success: boolean;
  data: string;
};

export async function apiXGatewayCreateInvoice(amount: number) {
  const res = await instance.post<tXGatewayCreateInvoiceResponse>(
    "/xgateway/create-invoice",
    { amount }
  );
  return res.data;
}
