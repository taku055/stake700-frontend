import { instance } from "../instance";

export type tDailyCashback = {
  totalAmount: number;
  unclaimedCount: number;
};

export const apiGetCashback = async () => {
  const res = await instance.get<tDailyCashback>("/cashback");
  return res.data;
};
