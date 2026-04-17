import { instance } from "../instance";

export type tCreateAriesPaymentRequest = {
  amount: number;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  email: string;
  phone?: string;
  name: string;
  promoId?: string;
  language?: string;
  isMobile?: boolean;
  applePayEnabled?: boolean;
  googlePayEnabled?: boolean;
};

export type tCreateAriesPaymentResponse = {
  status: boolean;
  message: string;
  data: {
    paymentUrl: string;
  };
};

export async function apiPayWithAries(params: tCreateAriesPaymentRequest) {
  const res = await instance.post<tCreateAriesPaymentResponse>(
    "/payment/aries/create-deposit",
    params
  );
  return res.data;
}
