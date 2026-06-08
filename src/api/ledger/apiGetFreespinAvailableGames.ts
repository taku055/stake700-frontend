import { instance } from "../instance";
import type { tFreespinAvailableGamesResponse } from "@/types/tFreespinAvailableGame";

export const apiGetFreespinAvailableGames = async (
  userId: string,
  currency: string,
) => {
  const res = await instance.get<tFreespinAvailableGamesResponse>(
    `/ledger/user/${userId}/freespin-games?currency=${encodeURIComponent(currency)}`,
  );
  return res.data.data ?? [];
};
