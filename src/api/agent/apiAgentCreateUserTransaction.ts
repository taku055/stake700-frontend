import { tTransactionStatistics } from "@/types/tTransactionStatistics";
import { instance } from "../instance";
import { tBalance } from "@/types/tBalance";
import { eTransactionCurrency } from "@/types/tTransaction";
import { tLedger } from "@/types/tCurrencyBalance";

type tSubuserCreateTxWagering = {
  required: number;
  completed: number;
  remaining: number;
  progress: number;
  isMet: boolean;
};

/** `user` from POST `/agent/user/:id/transaction` — nested balances, not a flat ledger row. */
export type tSubuserCreateTxResUser = {
  userId: string;
  currencyCode: string;
  cash: {
    balance: number;
    wagering: tSubuserCreateTxWagering;
  };
  bonus: {
    balance: number;
    game: string[];
    isActive: boolean;
    wagering: tSubuserCreateTxWagering;
    wageringMultiplier: number;
    maxWithdraw: number;
  };
  freespin: {
    count: number;
    cost: number;
    expireHours: number;
  };
  promotion: unknown | null;
};

export type tSubuserCreateTxRes = {
  agent: tBalance;
  user: tSubuserCreateTxResUser;
  userStatistics: tTransactionStatistics;
};

/** Maps transaction response `user` into `tLedger` for UI/state that expects ledger rows. */
export const mapSubuserCreateTxUserToLedger = (
  u: tSubuserCreateTxResUser,
  existing?: tLedger | null
): tLedger => {
  const now = new Date().toISOString();
  let promoId: number | null = null;
  if (
    u.promotion != null &&
    typeof u.promotion === "object" &&
    "id" in u.promotion
  ) {
    const id = (u.promotion as { id: unknown }).id;
    promoId = typeof id === "number" ? id : Number(id);
  }

  return {
    id: existing?.id ?? 0,
    userId: u.userId,
    cashBalance: u.cash.balance,
    cashWageringCompleted: u.cash.wagering.completed,
    cashWageringRequired: u.cash.wagering.required,
    bonusBalance: u.bonus.balance,
    bonusWageringCompleted: u.bonus.wagering.completed,
    bonusWageringRequired: u.bonus.wagering.required,
    bonusWageringMultiplier: u.bonus.wageringMultiplier,
    bonusMaxWithdraw: u.bonus.maxWithdraw,
    isBonusActive: u.bonus.isActive,
    bonusGames: u.bonus.game,
    freeSpinCount: u.freespin.count,
    freeSpinCost: u.freespin.cost,
    expireHours: u.freespin.expireHours,
    currencyCode: u.currencyCode,
    promoId,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
};

export const apiAgentCreateUserTransaction = async (
  userId: string,
  currency: eTransactionCurrency,
  cash: number,
  isDeposit: boolean,
  note: string
) => {
  const res = await instance.post<tSubuserCreateTxRes>(
    `/agent/user/${userId}/transaction`,
    {
      cash,
      isDeposit,
      note,
      currency,
    }
  );
  return res.data;
};
