import { tBanner } from "@/types/tBanner";
import { instance } from "../instance";

export const apiGetBanners = async () => {
  const res = await instance.get<tBanner[]>(`/admin/banner`);
  return res.data;
};
