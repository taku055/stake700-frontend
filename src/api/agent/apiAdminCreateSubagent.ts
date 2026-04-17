import { tAgent } from "@/types/tAgent";
import { instance } from "../instance";

export const apiAdminCreateSubagent = async (superagentId: string, name: string, password: string) => {
  const res = await instance.post<tAgent>(`/admin/superagents/create-subagent`, {
    name,
    password,
    superagentId,
  });
  return res.data;
};
