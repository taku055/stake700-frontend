export type tVipTier = {
  id: number;
  title: string;
  cashback?: number;
  wagered?: number;
  levelUpBonus?: number;
  levelUpFreeSpins?: number;
  rakeback?: number;
};

export type tVipLevel = tVipTier & {
  levelUpFreeSpinGameId?: string | null;
  levelUpFreeSpinGame?: tVipRewardGame;
  levelUpPerSpinCost?: number;
  levelUpFreeSpinExpireHours?: number;
};

export type tVipRewardGame = {
  id: string;
  name: string;
  img: string | null;
  img_custom: string | null;
  providerId: string;
  gameSource: string;
} | null;

export type tVipLevelUpReward = {
  id: string;
  vipLevel: number;
  title: string;
  cashAmount: number;
  freeSpins: number;
  perSpinCost: number;
  expireHours: number;
  currency: string;
  game: tVipRewardGame;
  claimable: boolean;
  claimBlockedReason: "ACTIVE_FREESPIN_EXISTS" | null;
  activeFreespinRemaining: number;
};

export type tVipLevelUpRewardsResponse = {
  vipLevel: number;
  vipTier: tVipTier | null;
  totalUnclaimedCash: number;
  totalUnclaimedFreeSpins: number;
  totalClaimableCash: number;
  totalClaimableFreeSpins: number;
  rewards: tVipLevelUpReward[];
};

export type tVipStatusResponse = {
  vipLevel: number;
  wagered: number;
  currentTier: tVipLevel | null;
  nextTier: tVipLevel | null;
  progressPercent: number;
  levels: tVipLevel[];
  pendingRewards: tVipLevelUpRewardsResponse;
};

export type tClaimVipLevelUpRewardResponse = {
  message: string;
  vipLevel: number;
  cashAmount: number;
  freeSpins: number;
  reward: tVipLevelUpReward;
};
