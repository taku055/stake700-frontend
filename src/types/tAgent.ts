import { tCurrencyBalance } from "./tCurrencyBalance";

export type tAgent = {
  id: string;
  userName: string;
  referCode: string;
  refererId?: string;
  isDeleted: boolean;
  isSuperAgent?: boolean;
  cash: number;
  createdAt: Date;
  updatedAt: Date;
  totalDeposit?: number;
  totalWithdraw?: number;
  password1?: string | null;
  profitPercentage: number;
  cashDetails: tCurrencyBalance[];
};
