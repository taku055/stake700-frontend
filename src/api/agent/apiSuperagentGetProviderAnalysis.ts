import { instance } from "../instance";
import { tProviderAnalysis } from "@/types/tProviderAnalysis";
import queryString from "query-string";
import { eTransactionCurrency } from "@/types/tTransaction";

type tParam = {
  startDate?: number;
  endDate?: number;
  currency: eTransactionCurrency;
};

export const apiSuperagentGetProviderAnalysis = async (
  agentId: string,
  param: tParam
) => {
  const res = await instance.get<tProviderAnalysis[]>(
    `/admin/superagents/${agentId}/finance/platform-analysis?${queryString.stringify(param)}`
  );
  return res.data;
};
