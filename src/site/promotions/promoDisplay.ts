import { Crown, Gift, Sparkles, type LucideIcon } from "lucide-react";
import { DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";
import type { tLedgerPromotion } from "@/types/tUserLedger";

export type PromoKind = "deposit" | "spins" | "vip";
type T = (key: string, values?: Record<string, string>) => string;

const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const money = (amount: number) =>
  `${DEFAULT_CURRENCY_SYMBOL}${amount.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;

export function promoBonusValue(p: tLedgerPromotion) {
  return num(p.bonusValue);
}

export function promoMaxBonus(p: tLedgerPromotion) {
  return num(p.maxBonusLimit);
}

export function promoMinDeposit(p: tLedgerPromotion & { minDeposit?: unknown }) {
  return num(p.minDeposit);
}

/** What the offer is mainly about, for filtering and colour. */
export function promoKind(p: tLedgerPromotion): PromoKind {
  if ((p.minVipLevel ?? 0) > 0 || p.eligibility === "VIP") return "vip";
  if (p.freeSpins > 0 && promoBonusValue(p) <= 0) return "spins";
  return "deposit";
}

export const KIND_LOOK: Record<PromoKind, { Icon: LucideIcon; accent: string; accent2: string }> = {
  deposit: { Icon: Gift, accent: "#4aa3ff", accent2: "#6ef2ff" },
  spins: { Icon: Sparkles, accent: "#b28cff", accent2: "#ff7ad9" },
  vip: { Icon: Crown, accent: "#ffc83d", accent2: "#ff8a3d" },
};

const DAY_INDEX: Record<string, number> = { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 };

/** "SUN" -> "Sunday" in the visitor's language (falls back to the raw key). */
export function weekdayName(day: string, locale: string): string {
  const i = DAY_INDEX[day?.toUpperCase()];
  if (i === undefined) return day;
  // 2023-01-01 was a Sunday
  return new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" }).format(Date.UTC(2023, 0, 1 + i));
}

/** Anchor id of an offer on the bonus terms page. */
export const termsAnchor = (code: string) => `offer-${code.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

/** Short "what you get" line, e.g. "50% bonus up to $1,000 + 100 free spins". */
export function promoHeadline(p: tLedgerPromotion, t: T): string {
  const parts: string[] = [];
  const value = promoBonusValue(p);
  const max = promoMaxBonus(p);
  if (value > 0) {
    if (p.isPercentBonus) {
      parts.push(
        max > 0
          ? `${t("headline_percent", { value: String(value) })} ${t("headline_upto", { amount: money(max) })}`
          : t("headline_percent", { value: String(value) }),
      );
    } else {
      parts.push(t("headline_fixed", { amount: money(value) }));
    }
  }
  if (p.freeSpins > 0) {
    parts.push(t("headline_spins", { count: String(p.freeSpins) }));
  }
  return parts.join(" + ") || p.name;
}
