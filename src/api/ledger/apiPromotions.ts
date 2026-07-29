import { instance } from "../instance";
import { tLedgerPromotion } from "@/types/tUserLedger";

export const apiGetPromotions = async (
  category: "ALL" | "NORMAL" | "USER" = "ALL",
  userId: string,
  currencyCode: string = "USD",
  page: number = 1,
  pageSize: number = 20,
) => {
  const res = await instance.get<{
    hasError: boolean;
    code: string;
    message: string;
    data: {
      promotions: tLedgerPromotion[];
      total: number;
    };
  }>(
    `/ledger/promotions?category=${category}&userId=${userId}&currencyCode=${currencyCode}&page=${page}&pageSize=${pageSize}`,
  );
  return res.data.data;
};

/** Claim a fixed NO_DEPOSIT promotion without making a deposit. */
export const apiClaimNoDepositBonus = async (
  promotionId: number,
  currencyCode: string = "USD",
) => {
  const res = await instance.post<{
    hasError: boolean;
    errorCode?: string;
    message: string;
    data?: {
      bonusAmount: number;
      balance: unknown;
    };
  }>(`/ledger/promotions/${promotionId}/claim-no-deposit`, { currencyCode });
  if (res.data.hasError) {
    throw new Error(res.data.message || "Failed to claim no-deposit bonus.");
  }
  return res.data.data;
};
