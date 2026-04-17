import { tGame } from "@/types/tGame";
import { instance } from "../instance";
import { tPaginationResult } from "@/types/tPaginationResult";
import queryString from "query-string";

export type tGameSearchParams = {
  keyword?: string;
  category?: string;
  offset?: number;
  limit?: number;
  provider?: string;
  is_deleted?: boolean;
  freespins?: number;
  randomOrderby?: boolean;
  gameType?: string;
};

export const apiGetGames = async (params: tGameSearchParams) => {
  const response = await instance.get<tPaginationResult<tGame>>(
    `${import.meta.env.VITE_BACKEND_URL}/v1/game/games?${queryString.stringify(
      params
    )}`
  );
  return response.data;
};
