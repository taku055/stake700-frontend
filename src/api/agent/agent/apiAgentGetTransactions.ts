import { instance } from "../../instance";
import queryString from "query-string";
import { tAgentTransaction } from "@/types/tAgentTransaction";
import { tPaginationResult } from "@/types/tPaginationResult";

export type tParam = {
  startDate?: number;
  endDate?: number;
  offset?: number;
  length?: number;
};

export const apiAgentGetTransactions = async (params: tParam) => {
  const res = await instance.get<tPaginationResult<tAgentTransaction>>(
    `/agent/finance/transactions?${queryString.stringify(params)}`
  );
  return res.data;
};
