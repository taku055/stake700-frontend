import { tCurrencyBalance, tLedger } from "./tCurrencyBalance";
import { tPromotionInstance } from "./tPromotionInstance";
import { tUserRole } from "./tUserRole";
import { tUserSummarized } from "./tUserSummarized";

export type tUser = {
  id: string;
  email: string;
  userName: string;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  birthDay: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  identityNumber?: string | null;
  gender: number | null;
  zipCode: string | null;
  state: string | null;
  phone: string | null;
  ip: string | null;
  verifyCode: string;
  verifyRequestedAt: Date | null;
  verifiedAt: Date | null;
  password: string;
  role: tUserRole;
  agentId: string | null;
  referCode: string;
  refererId: string | null;
  subscription: string | null;
  isDeleted: boolean;
  cash: number;
  bonus: number;
  locked: number;
  wantBonus: boolean | null;
  bonusWithdrawPassed: boolean;
  btcAddress: string | null;
  btcPk: string | null;
  ethAddress: string | null;
  ethPk: string | null;
  solanaAddress: string | null;
  solanaPk: string | null;
  ltcPk: string | null;
  ltcAddress: string | null;
  tronPk: string | null;
  tronAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
  vipLevel: number;
  wagered: number;
  avatar: string | null;
  password1: string;
  smUserCursor: bigint;
  smSupporterCursor: bigint;
  promotionInstanceId: bigint | null;
  depositBonusPercent: number;
  referralBonusPercent: number;
  lastLoginAt: Date | null;
  isCallGroup: boolean;
  /**
   * Agent wallet rows use `currency` + `amount`.
   * Subuser list/detail may return per-currency ledger rows (`currencyCode` + `cashBalance`).
   */
  cashDetails: (tCurrencyBalance | tLedger)[];
  /** Per-currency ledger rows from `/agent/user/:id` when returned separately from API. */
  ledgers?: tLedger[];
  summarized?: tUserSummarized;

  PromotionInstance?: tPromotionInstance | null;

  depositCrypto?: number | null;
  depositManual?: number | null;
  depositVisa?: number | null;
  depositAgent?: number | null;
  depositBonus?: number | null;
  referralBonus?: number | null;
  levelupBonus?: number | null;
  leaderboardBonus?: number | null;
  rakeback?: number | null;
  transferIn?: number | null;
  withdrawCrypto?: number | null;
  withdrawManual?: number | null;
  withdrawBanned?: number | null;
  transferOut?: number | null;
  casinoBet?: number | null;
  casinoWin?: number | null;
  sportBet?: number | null;
  sportWin?: number | null;
  sportRollback?: number | null;

  referer?: tUser;

  isAgent?: boolean;
  isSuperAgent?: boolean;
};
