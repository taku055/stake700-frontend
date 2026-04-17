import { instance } from "../instance";
import { tPromotion } from "@/types/tPromotion";

export const apiGetLivePromotions = async () => {
  const res = await instance.get<tPromotion[]>(
    "/promotion/get-promotion?filter=ON"
  );
  return res.data;
};
