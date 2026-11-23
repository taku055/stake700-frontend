"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import axios from "axios";
import { Gift, Loader2, PauseCircle, Sparkles } from "lucide-react";
import { useTranslations } from "@/context/I18nContext";
import { apiClaimEarnedOffer, apiGetEarnedOffers, type tEarnedOffer } from "@/api/ledger/apiEarnedOffers";
import { currencyState } from "@/state/currencyState";
import { userState } from "@/state/userState";
import { toast } from "@/helpers/toast";
import { money } from "./promoDisplay";

const ACCENT = { "--accent": "#a855f7", "--accent-2": "#ec4899" } as CSSProperties;

/** "1st" / "2nd" / "3rd" deposit, from the offer's eligibility. */
const DEPOSIT_NUMBER: Record<string, number> = {
  FIRST_DEPOSIT: 1,
  FIRST_CRYPTO_DEPOSIT: 1,
  SECOND_DEPOSIT: 2,
  THIRD_DEPOSIT: 3,
};

/**
 * Deposit offers the player earned but didn't receive with the deposit (for
 * example because another bonus was still running). They never expire here:
 * the player claims them once nothing else is running. Hidden when empty.
 */
export default function EarnedOffers() {
  const t = useTranslations("EarnedOffers");
  const userId = userState.value?.id;
  const currency = currencyState.value.unit;
  const [offers, setOffers] = useState<tEarnedOffer[]>([]);
  const [claiming, setClaiming] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) {
      setOffers([]);
      return;
    }
    try {
      setOffers(await apiGetEarnedOffers(userId, currency));
    } catch {
      setOffers([]);
    }
  }, [userId, currency]);

  useEffect(() => {
    void load();
  }, [load]);

  const claim = async (offer: tEarnedOffer) => {
    if (claiming) return;
    setClaiming(offer.id);
    try {
      await apiClaimEarnedOffer(offer.id);
      toast.success(t("claimed", { name: offer.promotion.name }));
    } catch (ex) {
      const data = axios.isAxiosError(ex) ? (ex.response?.data as { errorCode?: string; message?: unknown }) : undefined;
      const inner = data?.message as { errorCode?: string; message?: string } | string | undefined;
      const code = data?.errorCode ?? (typeof inner === "object" ? inner?.errorCode : undefined);
      toast.error(code === "PROMOTION_IN_PROGRESS" ? t("blocked") : t("claim_failed"));
    } finally {
      setClaiming(null);
      void load();
    }
  };

  if (!userId || offers.length === 0) return null;

  return (
    <section style={ACCENT} aria-labelledby="earned-offers-title" className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] text-[#0c1a25]">
          <Gift size={16} strokeWidth={2.4} />
        </span>
        <h2 id="earned-offers-title" className="text-[18px] font-extrabold text-white">
          {t("title")}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {offers.map((offer) => {
          const p = offer.promotion;
          const n = DEPOSIT_NUMBER[p.eligibility];
          const reward = [
            p.bonusAmount > 0 ? t("reward_bonus", { amount: money(p.bonusAmount) }) : "",
            p.freeSpins > 0 ? t("reward_spins", { count: String(p.freeSpins) }) : "",
          ]
            .filter(Boolean)
            .join(" + ");
          const blocked = !!offer.blockedReason;
          return (
            <div
              key={offer.id}
              className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--accent)_45%,transparent)] bg-[radial-gradient(120%_120%_at_100%_0%,color-mix(in_srgb,var(--accent)_22%,transparent),transparent_60%),#0f2230] p-4"
            >
              <div className="flex items-start gap-3">
                <Sparkles size={18} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                <div className="min-w-0">
                  <p className="text-[15px] font-extrabold text-white">{reward || p.name}</p>
                  <p className="mt-0.5 text-[13px] text-white/70">
                    {n
                      ? t("earned_with_nth", { n: String(n), amount: money(offer.depositAmount) })
                      : t("earned_with", { amount: money(offer.depositAmount) })}
                    <span className="ms-1.5 font-mono text-[12px] text-white/45">{p.code}</span>
                  </p>
                </div>
              </div>

              {blocked ? (
                <p className="flex items-start gap-1.5 rounded-lg bg-amber-400/10 px-2.5 py-2 text-[12px] text-amber-200">
                  <PauseCircle size={14} className="mt-px shrink-0" />
                  {t("blocked")}
                </p>
              ) : null}

              <button
                type="button"
                onClick={() => claim(offer)}
                disabled={claiming !== null}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] px-5 text-[14px] font-black text-[#0c1a25] transition-[filter,transform] hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {claiming === offer.id ? <Loader2 size={15} className="animate-spin" /> : null}
                {t("claim")}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
