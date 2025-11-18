import { tAgent } from "@/types/tAgent";
import { instance } from "../instance";
import { tPaginationResult } from "@/types/tPaginationResult";

export const apiAdminGetAgents = async (offset: number, length: number) => {
  const res = await instance.get<tPaginationResult<tAgent>>(
    `/admin/agent?offset=${offset}&length=${length}`
  );
  return res.data;
};
