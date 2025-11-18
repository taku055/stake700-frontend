import { tGame } from "@/types/tGame";
import { tPaginationResult } from "@/types/tPaginationResult";

export type tGameSearchParams = {
  keyword?: string;
  category?: string;
  offset?: number;
  limit?: number;
  provider?: string;
  is_deleted?: boolean;
  freespins?: number;
  randomOrderby?: boolean;
  platform?: string;
};

export const apiGetGames = async (params: tGameSearchParams) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/v1/game/games`,
    {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const res: tPaginationResult<tGame> = await response.json();
  return res;
};
