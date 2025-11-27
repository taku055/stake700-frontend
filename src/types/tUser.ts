import { tPromotionInstance } from "./tPromotionInstance";

export type tUser = {
  id: string;
  email: string;
  userName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  birthDay: string;
  country: string;
  city: string;
  address: string;
  emailVerified: boolean;
  verifyCode: string;
  verityTimeLimit: Date;
  role: string;
  agentId: string | null;
  referCode: string;
  refererId: string | null;
  subscription: string | null;
  cash: number;
  bonus: number;
  locked: number;
  tekioBonus: number;
  wantBonus: boolean | null;
  bonusWithdrawPassed: boolean;
  btcAddress: string;
  ethAddress: string;
  solanaAddress: string;
  createdAt: Date;
  updatedAt: Date;
  isAgent?: boolean;
  isSuperAgent?: boolean;
  totalDeposit?: number;
  totalWithdraw?: number;
  vipLevel: number;
  avatar?: string | null;
  smUserCursor: number; //Last support message id seen by user
  profitPercent?: number;
  isCallGroup: boolean;
  cash_details: number[];

  promotionInstanceId?: bigint | null;
  PromotionInstance?: tPromotionInstance | null;
} & {
  [key: string]: any;
};
