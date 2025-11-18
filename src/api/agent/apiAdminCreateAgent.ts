import { tAgent } from "@/types/tAgent";
import { instance } from "../instance";

export const apiAdminCreateAgent = async (name: string, password: string) => {
  const res = await instance.post<tAgent>(`/admin/agent`, {
    name,
    password,
  });
  return res.data;
};
