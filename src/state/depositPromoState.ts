import { signal } from "@preact/signals-react";
import { clearDepositPromoFromUrl, currentUserHasActiveBonusCycle } from "@/helpers/hasActiveBonusCycle";

/**
 * Promotion attached to the player's next deposit (promotion id), or undefined.
 * Set by a promotion's "Deposit" button or the promo code box; the deposit
 * panel sends it to /predict-deposit so the bonus is credited when the crypto
 * arrives. Mirrored in ?promo= so a page reload keeps it.
 */
export const depositPromoIdState = signal<string | undefined>(undefined);

function promoFromUrl(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  return params.get("promo") ?? params.get("promotionId") ?? params.get("bonusId") ?? undefined;
}

export function setDepositPromo(promoId?: string) {
  depositPromoIdState.value = promoId || undefined;
  if (typeof window === "undefined") return;
  clearDepositPromoFromUrl();
  if (!promoId) return;
  const url = new URL(window.location.href);
  url.searchParams.set("promo", promoId);
  history.replaceState(history.state, "", url.pathname + url.search + url.hash);
}

/**
 * Picks up the promotion the wallet was opened with (button or ?promo=).
 * Opening the wallet without one keeps the current choice: it is shown in the
 * promo code box and stays until the player removes it. A running bonus
 * blocks new ones.
 */
export function initDepositPromo(fromButton?: string) {
  if (currentUserHasActiveBonusCycle()) {
    if (depositPromoIdState.value || promoFromUrl()) setDepositPromo(undefined);
    return;
  }
  const id = fromButton || promoFromUrl() || depositPromoIdState.value;
  if (id !== depositPromoIdState.value || (id && promoFromUrl() !== id)) setDepositPromo(id);
}
