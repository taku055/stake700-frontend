import { tPaginationResult } from "@/types/tPaginationResult";
import { instance } from "../instance";
import queryString from "query-string";

export type tParam = {
  offset?: number;
  length?: number;
};

export type tReferredUsers = {
  id: string;
  email: string;
  userName: string;
  cash: number;
  totalDailyBonus: number;
  totalMonthlyBonus: number;
  totalBonus: number;

  userId: string
  depositVisa: number;
  depositCrypto: number;
  depositManual: number;
  depositAgent: number;
  depositBonus: number;
  depositCashback: number;
  withdrawCrypto: number;
  withdrawManual: number;
  withdrawBonus: number;
  withdrawCashback: number;
  withdrawBank: number;
  withdrawBanned: number;
  withdrawRequested: number;
  withdrawCancelled: number;
  levelupBonus: number;
  referralBonus: number;
  leaderboardBonus: number;
  rakeback: number;
  transferIn: number;
  transferOut: number;
  casinoBet: number;
  casinoWin: number;
  sportBet: number;
  sportWin: number;
  sportRollback: number;
};

export const apiGetReferredUsers = async (param: tParam) => {
  const res = await instance.get<tPaginationResult<tReferredUsers>>(
    `/referral/referred-users?${queryString.stringify(param)}`
  );
  return res.data;
};
