import { instance } from "../instance";
import { tAgent } from "@/types/tAgent";

export const apiAdminChangePasswordAgent = async (
  id: string,
  password: string
) => {
  const res = await instance.post<tAgent>(`/admin/agent/${id}/password`, {
    password,
  });
  return res.data;
};
