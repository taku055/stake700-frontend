import { tAgent } from "@/types/tAgent";
import { instance } from "../../instance";

export const apiAdminGetSubAgent = async (areaManagerId: string, agentId: string) => {
  const res = await instance.get<tAgent>(`/admin/area-manager/${areaManagerId}/subagent/${agentId}`);
  return res.data;
};
