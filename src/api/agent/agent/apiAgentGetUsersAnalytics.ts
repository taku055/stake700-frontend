import { instance } from "../../instance";
import queryString from "query-string";
import { eTransactionCurrency } from "@/types/tTransaction";
import { tUserAnalysis } from "@/types/tUserAnalysis";

export type tParam = {
  startDate?: number;
  endDate?: number;
  currency: eTransactionCurrency;
};

export const apiAgentGetUsersAnalytics = async (params: tParam) => {
  const res = await instance.get<tUserAnalysis[]>(
    `/agent/finance/users-analysis?${queryString.stringify(params)}`
  );
  return res.data;
};
