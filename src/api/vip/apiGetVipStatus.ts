import { instance } from "../instance";
import type { tVipStatusResponse } from "@/types/tVip";

export const apiGetVipStatus = async () => {
  const res = await instance.get<tVipStatusResponse>("/vip/status");
  return res.data;
};
