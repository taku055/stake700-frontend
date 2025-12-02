import { tTransactionStatistics } from "@/types/tTransactionStatistics";
import { instance } from "../instance";
import { tBalance } from "@/types/tBalance";
import { eTransactionCurrency } from "@/types/tTransaction";

export type tSubuserCreateTxRes = {
  agent: tBalance;
  user: tBalance;
  userStatistics: tTransactionStatistics;
};

export const apiAgentCreateUserTransaction = async (
  userId: string,
  currency: eTransactionCurrency,
  cash: number,
  isDeposit: boolean,
  note: string
) => {
  const res = await instance.post<tSubuserCreateTxRes>(
    `/agent/user/${userId}/transaction`,
    {
      cash,
      isDeposit,
      note,
      currency,
    }
  );
  return res.data;
};
