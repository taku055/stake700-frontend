import { tAgent } from "@/types/tAgent";
import { instance } from "../instance";
import { tPaginationResult } from "@/types/tPaginationResult";

export const apiAdminGetSubagents = async (agentId: string, offset: number, length: number) => {
  const res = await instance.get<tPaginationResult<tAgent>>(
    `/admin/superagents/${agentId}/subagent?offset=${offset}&length=${length}`
  );
  return res.data;
};
