import { instance } from "../instance";

export async function apiGetAriesOrderStatus(orderId: string) {
  const res = await instance.get<{ status: string }>(
    `/payment/aries/orders/${orderId}`
  );
  return res.data;
}
