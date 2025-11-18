import { tTransactionStatistics } from "@/types/tTransactionStatistics";
import { instance } from "../instance";
import { tBalance } from "@/types/tBalance";

type tRes = {
  balance: tBalance;
  statistics: tTransactionStatistics;
};

export const apiAdminCreateAgentTransaction = async (
  agentId: string,
  cash: number,
  isDeposit: boolean,
  note: string
) => {
  const res = await instance.post<tRes>(`/admin/agent/${agentId}/transaction`, {
    cash,
    isDeposit,
    note,
  });
  return res.data;
};
