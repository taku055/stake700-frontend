import { instance } from "../instance";

export type tReferredUsersTotal = {
  userCount: number;
  totalDailyBonus: number;
  totalMonthlyBonus: number;
  totalBonus: number;
};

export const apiGetReferredUsersCount = async () => {
  const res = await instance.get<tReferredUsersTotal>(`/referral/referred-users-count`);
  return res.data;
};
