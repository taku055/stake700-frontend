import { instance } from "../instance";
import { tUser } from "@/types/tUser";

export const apiAgentCreateSubuser = async (
  userName: string,
  password: string,
  email: string,
) => {
  const res = await instance.post<tUser>(`/agent/user`, {
    userName,
    password,
    email,
  });
  return res.data;
};
