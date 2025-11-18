import { tTopWageredUser } from "@/types/tTopWageredUser";
import { instance } from "../instance";

export const apiGetTopWageredUsers = async (length: number) => {
  const res = await instance.get<tTopWageredUser[]>(
    `/wallet/top-wagered-users?length=${length}`
  );
  return res.data;
};
