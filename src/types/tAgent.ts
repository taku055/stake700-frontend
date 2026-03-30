import { tCurrencyBalance } from "./tCurrencyBalance";
import { tUserRole } from "./tUserRole";

export type tAgent = {
  id: string;
  userName: string;
  referCode: string;
  refererId?: string | null;
  isDeleted: boolean;
  isSuperAgent?: boolean;
  cash: number;
  createdAt: string;
  updatedAt: string;
  totalDeposit?: number;
  totalWithdraw?: number;
  totalUserDeposit?: number;
  totalUserWithdraw?: number;
  password1?: string | null;
  profitPercent: number;
  role?: tUserRole;
  cashDetails: tCurrencyBalance[];
};
