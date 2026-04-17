import { tMergedTransaction } from "@/types/tTransaction";
import { instance } from "../instance";
import { tPaginationResult } from "@/types/tPaginationResult";
import queryString from "query-string";

export type tSearchParams = {
  offset?: number;
  length?: number;
  startDate?: number;
  endDate?: number;
  orderBy?: string;
  orderByDirection?: "asc" | "desc";
};

export const apiGetSportsbookTransaction = async (
  params: tSearchParams
) => {
  const res = await instance.get<tPaginationResult<tMergedTransaction>>(
    `/profile/sportsbook-history-merged?${queryString.stringify({
      ...params
    })}`
  );
  return res.data;
};
