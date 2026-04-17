import { tUser } from "@/types/tUser";
import { instance } from "../instance";

export type tClaimMonthlyReferralBonus = {
  message: string;
  user?: tUser;
};

export const apiClaimMonthlyReferralBonus = async () => {
  const res = await instance.post<tClaimMonthlyReferralBonus>("/referral/monthly");
  return res.data;
};
