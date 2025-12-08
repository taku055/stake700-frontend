import { instance } from "../instance";
import { tProviderAnalysis } from "@/types/tProviderAnalysis";
import queryString from "query-string";
import { eTransactionCurrency } from "@/types/tTransaction";

type tParam = {
  startDate?: number;
  endDate?: number;
  currency: eTransactionCurrency;
};

export const apiAgentGetProviderAnalysis = async (agentId: string, param: tParam) => {
  const res = await instance.get<tProviderAnalysis[]>(
    `/agent/finance/platform-analysis?${queryString.stringify(param)}`
  );
  return res.data;
};
