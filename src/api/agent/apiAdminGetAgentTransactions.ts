import { tAgentTransaction } from "@/types/tAgentTransaction";
import { instance } from "../instance";
import { tPaginationResult } from "@/types/tPaginationResult";
import queryString from "query-string";

export type tParams = {
  startDate?: number;
  endDate?: number;
  offset?: number;
  length?: number;
};

export const apiAdminGetAgentTransactions = async (
  agentId: string,
  params: tParams
) => {
  const res = await instance.get<
    tPaginationResult<
      tAgentTransaction,
      {
        totalDeposit: number;
        totalWithdraw: number;
        totalUserDeposit: number;
        totalUserWithdraw: number;
      }
    >
  >(`/admin/agent/${agentId}/transaction?${queryString.stringify(params)}`);
  return res.data;
};
