import { tAgentTransaction } from "@/types/tAgentTransaction";
import { instance } from "../../instance";
import { tPaginationResult } from "@/types/tPaginationResult";
import queryString from "query-string";
import { eTransactionCurrency } from "@/types/tTransaction";

export type tParams = {
  startDate?: number;
  endDate?: number;
  offset?: number;
  length?: number;
  currency?: eTransactionCurrency;
};

export const apiAdminGetSuperTransfers = async (
  agentId: string,
  params: tParams
) => {
  const res = await instance.get<
    tPaginationResult<
      tAgentTransaction,
      {
        totalDeposit: number;
        totalWithdraw: number;
      }
    >
  >(
    `/admin/area-manager/${agentId}/transactionforagent?${queryString.stringify(
      params
    )}`
  );
  return res.data;
};
