import { tPromotionInstance } from "./tPromotionInstance";

export type tBalance = {
  cash: number;
  bonus: number;
  locked: number;

  cash_details: number[];

  promotionInstanceId?: bigint | null;
  PromotionInstance?: tPromotionInstance | null;
};
