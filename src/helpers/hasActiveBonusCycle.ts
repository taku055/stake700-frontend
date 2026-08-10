import { balanceState } from "@/state/balanceState";
import { currencyState } from "@/state/currencyState";
import { tUserBalance } from "@/types/tUserLedger";

/** True while a bonus cycle is unfinished (active, open wagering, or suspended residue). */
export function hasActiveBonusCycle(
  balance?: tUserBalance | null,
): boolean {
  if (!balance) return false;
  const bonusOpen =
    balance.bonus.wagering.required > 0 && !balance.bonus.wagering.isMet;
  const suspendedResidue =
    !balance.bonus.isActive && balance.promotion != null;
  return (
    !!balance.bonus.isActive ||
    balance.bonus.balance > 0 ||
    bonusOpen ||
    suspendedResidue
  );
}

export function currentUserHasActiveBonusCycle(): boolean {
  const code = currencyState.value.code;
  return hasActiveBonusCycle(balanceState.value[code] ?? null);
}

/**
 * Promo id for a deposit request. Returns undefined while a bonus cycle is
 * unfinished so a sticky `?promo=` cannot stack another deposit bonus.
 */
export function resolveDepositPromoId(
  explicitPromoId?: string | null,
): string | undefined {
  if (currentUserHasActiveBonusCycle()) {
    // Drop sticky ?promo so a later deposit after cycle ends does not re-apply it.
    clearDepositPromoFromUrl();
    return undefined;
  }
  if (explicitPromoId) return explicitPromoId;
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  return (
    params.get("promotionId") ??
    params.get("promo") ??
    params.get("bonusId") ??
    undefined
  );
}

/** Drop sticky deposit-bonus query params from the current URL. */
export function clearDepositPromoFromUrl(): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  let changed = false;
  for (const key of ["promo", "promotionId", "bonusId"]) {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  }
  if (changed) {
    history.replaceState(null, "", url.pathname + url.search + url.hash);
  }
}
