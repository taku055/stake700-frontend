import { instance } from "../instance";
import { tUser } from "@/types/tUser";

export const apiAdminCreateSubuser = async (
  agentId: string,
  userName: string,
  password: string
) => {
  const res = await instance.post<tUser>(`/admin/agent/${agentId}/subuser`, {
    userName,
    password,
    email: userName + "@agent.com",
  });
  return res.data;
};
