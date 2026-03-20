import { instance } from "../instance";
import { tUserBalance } from "@/types/tUserLedger";

export const apiCancelWagering = async (
  userId: string,
  currencyCode : string = "USD",
) => {
  const res = await instance.get<{
    hasError: boolean;
    code: string;
    message: string;
    data: tUserBalance;
  }>(`/ledger/user/${userId}/cancel-wagering?currencyCode=${currencyCode}`);
  return res.data.data;
};
