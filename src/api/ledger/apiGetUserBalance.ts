import { instance } from "../instance";
import { tUserBalance } from "@/types/tUserLedger";

export const apiGetUserBalance = async (
  userId: string,
  currency: string = "TRY",
) => {
  const res = await instance.get<{
    hasError: boolean;
    code: string;
    message: string;
    data: tUserBalance;
  }>(`/ledger/user/${userId}?currency=${currency}`);
  return res.data.data;
};
