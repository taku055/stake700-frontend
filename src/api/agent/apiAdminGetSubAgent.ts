import { tAgent } from "@/types/tAgent";
import { instance } from "../instance";

export const apiAdminGetSubAgent = async (agentId: string) => {
  const res = await instance.get<tAgent>(`/admin/superagents/${agentId}`);
  return res.data;
};
