import { tTransactionStatistics } from "@/types/tTransactionStatistics";
import { instance } from "../instance";
import { eTransactionCurrency } from "@/types/tTransaction";
import { tCurrencyBalance } from "@/types/tCurrencyBalance";

type tRes = {
  newAgent: tCurrencyBalance;
  newSuperagent: tCurrencyBalance;
  statistics: tTransactionStatistics;
};

export const apiAdminCreateSuperTransaction = async (
  agentId: string,
  currency: eTransactionCurrency,
  cash: number,
  isDeposit: boolean,
  note: string,
  superagentId: string,
) => {
  const res = await instance.post<tRes>(`/admin/superagents/super-transaction`, {
    agentId,
    superagentId,
    currency,
    cash,
    isDeposit,
    note,
  });
  return res.data;
};
