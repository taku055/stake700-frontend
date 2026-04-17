import { instance } from "../instance";
import { tUser } from "@/types/tUser";

export const apiCreatePromotionInstance = async (
  promotionId: bigint,
  userId: string
) => {
  const res = await instance.post<tUser>(
    "/promotion/create-promotion-instance",
    { promotionId, userId }
  );
  return res.data;
};
