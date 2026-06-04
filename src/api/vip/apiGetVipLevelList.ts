import { instance } from "../instance";
import type { tVipLevel } from "@/types/tVip";

export const apiGetVipLevelList = async () => {
  const res = await instance.get<tVipLevel[]>("/vip/list");
  return res.data;
};
