import { instance } from "../../instance";
import queryString from "query-string";
import { tAgentTransaction } from "@/types/tAgentTransaction";
import { tPaginationResult } from "@/types/tPaginationResult";
import { tSuperAgentTransaction } from "@/types/tSuperAgentTransaction";

export type tParam = {
  agentId: string;
  startDate?: number;
  endDate?: number;
  offset?: number;
  length?: number;
};

export const apiAgentGetTransactionsBetweenAgents = async (params: tParam) => {
  const res = await instance.get<tPaginationResult<tSuperAgentTransaction>>(
    `/agent/finance/transactions-between-agents?${queryString.stringify(
      params
    )}`
  );
  return res.data;
};
