import { instance } from "../instance";
import { tUser } from "@/types/tUser";

export const apiCancelPromotionInstance = async (
  promotionId: bigint,
) => {
  const res = await instance.post<tUser>(
    "/promotion/change-promotion-instance",
    { id: promotionId, status: "CANCELED_BY_USER" }
  );
  return res.data;
};
