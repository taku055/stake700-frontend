import { instance } from "../instance";
import { tWageringStatus } from "@/types/tUserLedger";

export const apiCheckWagering = async (
  userId: string,
  currency: string,
) => {
  const res = await instance.get<{
    hasError: boolean;
    code: string;
    message: string;
    data: tWageringStatus;
  }>(
    `/ledger/check-wagering?userId=${encodeURIComponent(userId)}&currency=${encodeURIComponent(currency)}`,
  );
  return res.data.data;
};
