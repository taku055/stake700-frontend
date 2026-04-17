import { tGame } from "@/types/tGame";
import queryString from "query-string";
import { instance } from "../instance";
import { tPaginationResult } from "@/types/tPaginationResult";

export type tGameSearchParams = {
  offset?: number;
  limit?: number;
};

export const apiGetRecentGame = async (params: tGameSearchParams) => {
  const res = await instance.get<tPaginationResult<tGame>>(
    `/recent-game?${queryString.stringify(params)}`
  );
  return res.data;
};
