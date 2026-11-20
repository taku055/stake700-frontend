"use client";

import { useCallback } from "react";
import { isNoDepositPromoType } from "@/config/promoConstants";
import { requireLogin } from "@/helpers/requireAuth";
import { openAccountDialog } from "@/state/accountDialogs";
import type { tLedgerPromotion } from "@/types/tUserLedger";
import PromoOfferCard from "./PromoOfferCard";
import { OfferTerms } from "./terms";

/** Offer page body: the claimable card next to the offer's full terms. */
export default function OfferStage({ promo, gameName }: { promo: tLedgerPromotion; gameName?: string }) {
  const claim = useCallback(() => {
    if (isNoDepositPromoType(promo.type) || !promo.available) return;
    if (!requireLogin()) return;
    openAccountDialog("/balance-management/deposit", String(promo.id));
  }, [promo]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start">
      <PromoOfferCard promo={promo} onClaim={claim} />
      <OfferTerms promo={promo} gameName={gameName} />
    </div>
  );
}
