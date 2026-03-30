import { CURRENCY_LIST } from "@/config/constants";
import { tAgent } from "@/types/tAgent";
import { tUserBalance, WageringProgress } from "@/types/tUserLedger";

const agentWageringPlaceholder: WageringProgress = {
  required: 0,
  completed: 0,
  remaining: 0,
  progress: 100,
  isMet: true,
};

/** Maps agent `cashDetails` into the same `balanceState` shape used for players. */
export function agentToUserBalanceMap(
  agent: tAgent,
): Record<string, tUserBalance> {
  const next: Record<string, tUserBalance> = {};
  for (const cur of CURRENCY_LIST) {
    const amount =
      agent.cashDetails?.find((d) => d.currency === cur.code)?.amount ?? 0;
    next[cur.code] = {
      userId: agent.id,
      currencyCode: cur.code,
      cash: {
        balance: amount,
        wagering: agentWageringPlaceholder,
      },
      bonus: {
        balance: 0,
        game: [],
        isActive: false,
        wagering: agentWageringPlaceholder,
        wageringMultiplier: 0,
        maxWithdraw: 0,
      },
      freespin: {
        count: 0,
        cost: 0,
        expireHours: 0,
      },
      promotion: null,
    };
  }
  return next;
}
