import { tPromotionInstance } from "./tPromotionInstance";

export type tBalance = {
  cash: number;
  bonus: number;
  locked: number;

  promotionInstanceId?: bigint | null;
  PromotionInstance?: tPromotionInstance | null;
};
