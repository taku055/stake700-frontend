import { instance } from "../instance";

/** A deposit offer the player earned but hasn't received yet (claim it to get it). */
export type tEarnedOffer = {
  id: string;
  earnedAt: string;
  depositAmount: number;
  currencyCode: string;
  /** Why it can't be claimed right now (e.g. a bonus is still running); null = claimable now. */
  blockedReason: string | null;
  promotion: {
    id: number;
    code: string;
    name: string;
    eligibility: string;
    imageUrl: string | null;
    freeSpins: number;
    bonusAmount: number;
    isPercentBonus: boolean;
    bonusValue: number;
    wageringMultiplier: number;
  };
};

export const apiGetEarnedOffers = async (userId: string, currency: string) => {
  const res = await instance.get<tEarnedOffer[]>(
    `/ledger/user/${encodeURIComponent(userId)}/earned-offers?currency=${encodeURIComponent(currency)}`,
  );
  return Array.isArray(res.data) ? res.data : [];
};

export const apiClaimEarnedOffer = async (id: string) => {
  const res = await instance.post(`/ledger/earned-offers/${encodeURIComponent(id)}/claim`);
  return res.data;
};
