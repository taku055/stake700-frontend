import { instance } from "../instance";

export type tMonthlyReferralBonus = {
  totalCount: number;
  totalBonus: number;
};

export const apiGetMonthlyReferralBonus = async () => {
  const res = await instance.get<tMonthlyReferralBonus>("/referral/monthly");
  return res.data;
};
