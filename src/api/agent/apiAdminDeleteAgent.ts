import { instance } from "../instance";

export const apiAdminDeleteAgent = async (agentId: string) => {
  const res = await instance.delete(`/admin/agent/${agentId}`);
  return res.data;
};
