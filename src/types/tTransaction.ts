export enum eTransactionType {
  deposit = "deposit",
  withdrawal = "withdrawal",
  rollback = "rollback",
  user_withdrawal = "user_withdrawal", // money went from agent to the user
  user_deposit = "user_deposit", // money came to agent from user
  bet = "bet",
  win = "win",
  refund = "refund",
  promo_win = "promo_win",
  tournament_win = "tournament_win",
}

export enum eTransactionPlatform {
  DepositVisa = "deposit.visa",
  DepositCrypto = "deposit.crypto",
  DepositManual = "deposit.manual",
  DepositAgent = "deposit.agent",
  DepositBonus = "deposit.bonus",
  DepositCashback = "deposit.cashback",
  WithdrawCrypto = "withdraw.crypto",
  WithdrawManual = "withdraw.manual",
  WithdrawBonus = "withdraw.bonus",
  WithdrawCashback = "withdraw.cashback",
  WithdrawBanned = "withdraw.banned",
  WithdrawRequested = "withdraw.requested",
  WithdrawCancelled = "withdraw.cancelled",
  Sportsbook = "sport",
  Gr8Casino = "gr8.casino",
  IGPCasino = "igp.casino",
  SoftCasino = "soft.casino",
  Fungamess = "fungamess.casino",
  ReferralBonus = "referral.bonus",
  Transfer = "transfer",
  CustomGame = "custom.game",
  LevelUpBonus = "levelup.bonus",
  LeaderboardBonus = "leaderboard.bonus",
  Rakeback = "rakeback",
  Cashback = "cashback",
}

export enum eTransactionCurrency {
  EUR = "EUR",
  USD = "USD",
}

export type tTransaction = {
  id: string;
  cash: number;
  bonus: number;
  locked: number;
  io: number;
  type: eTransactionType;
  platform: string;
  currency: eTransactionCurrency;
  createdAt: Date;
  context: any;
  userId: string;
  chainId: number;
  tokenAddress: string | null;
  tokenAmount: number;
  isDeleted: number;
  note: string | null;
  txHash: string | null;
  gameId: number | null;
  eventType: string | null;
  eventId: string | null;
  tokenName?: string;
  providerId?: string;
  provider?: string;
  cash_details: number[];
};



export type tMergedTransaction = {
  bet_amount: number;
  context: any;
  eventId: string;
  first_tx_at: Date;
  gameId: string;
  last_tx_at: Date;
  provider: string;
  providerId: string;
  win_amount: number;
  eventType?: string;
  cash_details: number[];
};