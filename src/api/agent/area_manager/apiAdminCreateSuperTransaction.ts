import { instance } from "../../instance";
import { eTransactionCurrency } from "@/types/tTransaction";
import { tCurrencyBalance } from "@/types/tCurrencyBalance";
import { tSuperAgentTransaction } from "@/types/tSuperAgentTransaction";

type tRes = {
  newAreaManager: tCurrencyBalance;
  newSuperAgent: tCurrencyBalance;
  transaction: tSuperAgentTransaction;
};

export const apiAdminCreateSuperTransaction = async (
  superAgentId: string,
  currency: eTransactionCurrency,
  cash: number,
  isDeposit: boolean,
  note: string,
  areaManagerId: string
) => {
  const res = await instance.post<tRes>(
    `/admin/area-manager/area-manager-transaction`,
    {
      superAgentId,
      areaManagerId,
      currency,
      cash,
      isDeposit,
      note,
    }
  );
  return res.data;
};
