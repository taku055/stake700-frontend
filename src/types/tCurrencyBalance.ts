export type tCurrencyBalance = {
  id: number;
  currency: string;
  amount: number;
  /** Present on agent / superagent `cashDetails` rows from the API */
  agentId?: string;
};


/** Mirrors Prisma `CurrencyBalance` (per-user ledger row). Relations omitted when nested. */
export type tLedger = {
  id: number;
  userId: string;
  cashBalance: number;
  cashWageringCompleted: number;
  cashWageringRequired: number;
  bonusBalance: number;
  bonusWageringCompleted: number;
  bonusWageringRequired: number;
  bonusWageringMultiplier: number;
  /** Max withdrawal from bonus winnings; 0 = unlimited */
  bonusMaxWithdraw: number;
  isBonusActive: boolean;
  /** Game ids bonus applies to; empty = all games */
  bonusGames: string[];
  freeSpinCount: number;
  freeSpinCost: number;
  expireHours: number;
  currencyCode: string;
  promoId: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};
