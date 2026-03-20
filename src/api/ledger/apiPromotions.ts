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
