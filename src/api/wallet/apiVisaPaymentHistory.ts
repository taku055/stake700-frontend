import { instance } from "../instance";

export type tVisaPaymentHistory = {
  email: string;
  address: string;
  country: string;
  city: string;
  region: string;
  postcode: string;
  phone: string;
  first_name: string;
  last_name: string;
  birthday: string;
  street: string;
  state: string;
};

export async function apiVisaPaymentHistory() {
  const res = await instance.get<tVisaPaymentHistory[]>("/ereus/histories");
  return res.data;
}
