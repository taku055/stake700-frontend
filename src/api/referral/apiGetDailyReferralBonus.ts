import { instance } from "../instance";

export type tDailyReferralBonus = {
  totalCount: number;
  totalBonus: number;
};

export const apiGetDailyReferralBonus = async () => {
  const res = await instance.get<tDailyReferralBonus>("/referral/daily");
  return res.data;
};
