import { tUser } from "@/types/tUser";
import { instance } from "../instance";

export type tClaimDailyReferralBonus = {
  message: string;
  user?: tUser;
};

export const apiClaimDailyReferralBonus = async () => {
  const res = await instance.post<tClaimDailyReferralBonus>("/referral/daily");
  return res.data;
};
