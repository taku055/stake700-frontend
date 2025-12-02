import { eTransactionCurrency } from "@/types/tTransaction";
import { instance } from "../instance";
import queryString from "query-string";

export type tSubuserTransactionParams = {
  startDate?: number;
  endDate?: number;
  currency: eTransactionCurrency;
};

export const apiAgentGetSubuserTransactionSum = async (
  userId: string,
  params: tSubuserTransactionParams
) => {
  const res = await instance.get<{
    totalDeposit: number;
    totalWithdraw: number;
  }>(
    `/agent/user/${userId}/transaction-sum?${queryString.stringify(params)}`
  );
  return res.data;
};
