import { eTransactionCurrency } from "@/types/tTransaction";
import { instance } from "../instance";

export const apiStartSportsbook = async (currency: eTransactionCurrency) => {
  const res = await instance.post<{ token: string }>(`/game/start-sportsbook`, {
    gameId: "sportsbook",
    currency,
  });
  return res.data;
};
