import { tUser } from "@/types/tUser";
import { instance } from "../../instance";

type tUpdateUser = {
  isCallGroup?: boolean;
};

export const apiAdminUpdateUser = async (id: string, data: tUpdateUser) => {
  const res = await instance.put<tUser>(`/admin/user/${id}`, data);
  return res.data;
};
