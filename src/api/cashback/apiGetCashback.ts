import { instance } from "../instance";

export type tCashbackSettings = {
  enabled: boolean;
  /** % of yesterday's net cash slot loss */
  percent: number;
  /** max per day, 0 = no cap */
  dailyCap: number;
  /** smaller amounts are not paid */
  minAmount: number;
};

export type tCashbackPayout = {
  id: number;
  amount: number;
  rewardDate: string; // YYYY-MM-DD (UTC day the loss happened)
  createdAt: string;
};

export type tCashbackSummary = {
  settings: tCashbackSettings;
  today: { loss: number; estimate: number };
  /** no cashback while a bonus / promotion is active */
  paused: boolean;
  nextPayoutAt: string;
  totalReceived: number;
  payouts: number;
  history: tCashbackPayout[];
};

/** Logged-in player's cashback: rules, today's estimate and payout history. */
export const apiGetCashback = async (currency = "USD") => {
  const res = await instance.get<tCashbackSummary>(`/cashback?currency=${encodeURIComponent(currency)}`);
  return res.data;
};

/** Public cashback rules. */
export const apiGetCashbackSettings = async () => {
  const res = await instance.get<tCashbackSettings>("/cashback/settings");
  return res.data;
};
