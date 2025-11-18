import { tTransactionStatistics } from "@/types/tTransactionStatistics";
import { instance } from "../instance";
import { tAgent } from "@/types/tAgent";

type tRes = {
  newAgent: tAgent;
  newSuperagent: tAgent;
  statistics: tTransactionStatistics;
};

export const apiAdminCreateSuperTransaction = async (
  agentId: string,
  cash: number,
  isDeposit: boolean,
  note: string,
  superagentId: string,
) => {
  const res = await instance.post<tRes>(`/admin/superagents/super-transaction`, {
    agentId,
    superagentId,
    cash,
    isDeposit,
    note,
  });
  return res.data;
};
