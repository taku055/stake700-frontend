import { instance } from "../instance";
import { tPaginationResult } from "@/types/tPaginationResult";
import { tUser } from "@/types/tUser";

export const apiAdminGetSubusers = async (
  agentId: string,
  offset: number,
  length: number
) => {
  const res = await instance.get<tPaginationResult<tUser>>(
    `/admin/agent/${agentId}/subuser?offset=${offset}&length=${length}`
  );
  return res.data;
};
