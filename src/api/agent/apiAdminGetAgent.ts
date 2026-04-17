import { tAgent } from "@/types/tAgent";
import { instance } from "../instance";

export const apiAdminGetAgent = async (agentId: string) => {
  const res = await instance.get<tAgent>(`/admin/agent/${agentId}`);
  return res.data;
};
