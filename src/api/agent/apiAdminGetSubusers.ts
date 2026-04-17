import { instance } from "../instance";
import { tPaginationResult } from "@/types/tPaginationResult";
import { tUser } from "@/types/tUser";
import { eTransactionCurrency } from "@/types/tTransaction";

export const apiAdminGetSubusers = async (
  agentId: string,
  currency: eTransactionCurrency,
  offset: number,
  length: number,
) => {
  const res = await instance.get<tPaginationResult<tUser>>(
    `/admin/agent/${agentId}/subuser?offset=${offset}&length=${length}&currency=${currency}`
  );
  return res.data;
};
