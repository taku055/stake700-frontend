import { tUser } from "@/types/tUser";
import { instance } from "../instance";

export type tClaimDailyCashback = {
  message: string;
  user?: tUser;
};

export const apiClaimCashback = async () => {
  const res = await instance.post<tClaimDailyCashback>("/cashback");
  return res.data;
};
