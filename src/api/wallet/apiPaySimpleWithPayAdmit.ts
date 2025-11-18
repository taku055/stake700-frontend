import { instance } from "../instance";

export type tPayAdmitPaymentResponse = any;

export type tPayAdmitPaymentRequest = {
  amount: number;
  returnUrl: string;
  pendingReturnUrl: string;
  successReturnUrl: string;
  declineReturnUrl: string;
  locale: string;
  cardNumber: string;
  expMonth: number;
  expYear: number;
  cvv: string;
};

export async function apiPaySimpleWithPayAdmit(
  params: tPayAdmitPaymentRequest
) {
  const res = await instance.post<tPayAdmitPaymentResponse>(
    "/payadmit/simple",
    params
  );
  return res.data;
}
