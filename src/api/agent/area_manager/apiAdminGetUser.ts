import { instance } from "../../instance";
import { tUser } from "@/types/tUser";

export const apiAdminGetUser = async (userId: string) => {
  const res = await instance.get<tUser>(`/admin/user/${userId}`);
  return res.data;
};
