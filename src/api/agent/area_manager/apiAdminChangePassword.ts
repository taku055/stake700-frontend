import { tUser } from "@/types/tUser";
import { instance } from "../../instance";

export const apiAdminChangePassword = async (id: string, password: string) => {
  const res = await instance.post<tUser>(`/admin/user/${id}/password`, {
    password,
  });
  return res.data;
};
