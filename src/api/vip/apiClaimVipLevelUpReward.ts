import { instance } from "../instance";
import type { tClaimVipLevelUpRewardResponse } from "@/types/tVip";

export const apiClaimVipLevelUpReward = async (vipLevel: number) => {
  const res = await instance.post<tClaimVipLevelUpRewardResponse>(
    `/vip/level-up-rewards/${vipLevel}/claim`
  );
  return res.data;
};
