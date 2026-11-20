import { instance } from "../instance";
import { tUserBalance } from "@/types/tUserLedger";

/**
 * Cancels the logged-in player's active bonus / promotion (and its free spins).
 * The backend uses the session user, so a player can only cancel their own.
 */
export const apiCancelWagering = async (_userId: string, currencyCode: string = "USD") => {
  const res = await instance.post<{
    hasError: boolean;
    code?: string;
    message?: string;
    data: tUserBalance;
    cancelledFreespins?: number;
  }>(`/ledger/cancel-promotion`, { currency: currencyCode });
  if (res.data?.hasError) {
    throw new Error(res.data.message || "Failed to cancel wagering");
  }
  return res.data.data;
};
