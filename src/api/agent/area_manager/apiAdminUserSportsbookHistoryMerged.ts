import { instance } from "../../instance";
import { tPaginationResult } from "@/types/tPaginationResult";
import { tMergedTransaction } from "@/types/tTransaction";
import queryString from "query-string";

export type tSubuserTransactionParams = {
  startDate?: number;
  endDate?: number;
  offset?: number;
  length?: number;
  orderBy?: string;
  orderByDirection: string;
};

export const apiAdminUserSportsbookHistoryMerged = async (
  userId: string,
  params: tSubuserTransactionParams
) => {
  const res = await instance.get<tPaginationResult<tMergedTransaction>>(
    `/admin/wallet/${userId}/sportsbook-history-merged?${queryString.stringify(params)}`
  );
  return res.data;
};
