import { instance } from "../instance";
import { tLedgerPromotion, tUserBalance } from "@/types/tUserLedger";

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

export const apiClaimNoDepositBonus = async (
  promotionId: number,
  dto?: { currencyCode?: string },
) => {
  const res = await instance.post<{
    hasError: boolean;
    errorCode?: string;
    message: string;
    data?: {
      bonusAmount: number;
      balance: tUserBalance;
    };
  }>(`/ledger/promotions/${promotionId}/claim-no-deposit`, dto ?? {});
  if (res.data.hasError) {
    throw new Error(res.data.message || "Failed to claim no-deposit bonus.");
  }
  return res.data.data;
};
