import { instance } from "../instance";
import { tProviderAnalysis } from "@/types/tProviderAnalysis";
import queryString from "query-string";

type tParam = {
  startDate?: number;
  endDate?: number;
};

export const apiAgentGetProviderAnalysis = async (param: tParam) => {
  const res = await instance.get<tProviderAnalysis[]>(
    `/agent/finance/platform-analysis?${queryString.stringify(param)}`
  );
  return res.data;
};
