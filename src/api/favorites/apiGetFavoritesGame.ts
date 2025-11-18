import { tGame } from "@/types/tGame";
import queryString from "query-string";
import { instance } from "../instance";
import { tPaginationResult } from "@/types/tPaginationResult";

export type tGameSearchParams = {
  keyword?: string;
  category?: string;
  type?: string;
  offset?: number;
  limit?: number;
  providerId?: number;
};

export const apiGetFavoritesGame = async (params: tGameSearchParams) => {
  const res = await instance.get<tPaginationResult<tGame>>(
    `/favorite-game?${queryString.stringify(params)}`
  );
  return res.data;
};
