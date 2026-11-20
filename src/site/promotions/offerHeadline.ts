import type { Locale } from "@/config/i18n";
import { translate } from "@/lib/seo";
import type { tLedgerPromotion } from "@/types/tUserLedger";
import { promoHeadline } from "./promoDisplay";

/** Server-side version of the card headline ("100 free spins", "50% bonus up to $500"). */
export function offerHeadline(lang: Locale, promo: tLedgerPromotion): string {
  return promoHeadline(promo, (key: string, values?: Record<string, string>) =>
    translate(lang, `PromotionsPage.${key}`, values),
  );
}
