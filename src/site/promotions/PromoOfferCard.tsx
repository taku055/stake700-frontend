"use client";

import { useState, type CSSProperties } from "react";
import { ArrowRight, CalendarDays, Check, Copy, Lock } from "lucide-react";
import { Link } from "@/components/common/Link";
import { routes } from "@/config/routes";
import { useTranslations } from "@/context/I18nContext";
import { isDepositPromoType } from "@/config/promoConstants";
import { localeState } from "@/state/localeState";
import type { tLedgerPromotion } from "@/types/tUserLedger";
import { KIND_LOOK, money, promoBonusValue, promoKind, promoMaxBonus, weekdayName } from "./promoDisplay";

/** Copyable promo code chip. */
export function PromoCode({ code, className = "" }: { code: string; className?: string }) {
  const t = useTranslations("PromotionsPage");
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      title={t("copy_code")}
      className={`group/code inline-flex h-11 min-w-0 items-center justify-between gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.04] px-3 font-mono text-[13px] font-bold tracking-wider text-white transition-colors hover:border-[var(--accent)] hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] ${className}`}
    >
      <span className="truncate">{code}</span>
      {copied ? (
        <Check size={15} className="shrink-0 text-[var(--green-color)]" />
      ) : (
        <Copy size={15} className="shrink-0 text-white/45 transition-colors group-hover/code:text-[var(--accent)]" />
      )}
    </button>
  );
}

type T = (k: string, v?: Record<string, string>) => string;

/** Translated reason an offer can't be claimed (the backend reason is English-only). */
function ineligibleNote(p: tLedgerPromotion, t: T): string {
  switch (p.eligibility) {
    case "FIRST_DEPOSIT":
    case "FIRST_CRYPTO_DEPOSIT":
      return t("reason_first_deposit");
    case "SECOND_DEPOSIT":
      return t("reason_second_deposit");
    case "THIRD_DEPOSIT":
      return t("reason_third_deposit");
    case "WEEKLY_ONCE":
      return t("reason_weekly_used");
  }
  if ((p.minVipLevel ?? 0) > 0 || p.eligibility === "VIP") return t("reason_vip");
  return t("reason_generic");
}

/** Headline figure: "200 / free spins", "50% / bonus · up to $1,000"… */
function bigValue(p: tLedgerPromotion, t: T) {
  const value = promoBonusValue(p);
  const max = promoMaxBonus(p);
  if (value > 0 && p.isPercentBonus) {
    return { big: `${value}%`, label: t("stub_bonus"), sub: max > 0 ? t("stub_upto", { amount: money(max) }) : null };
  }
  if (value > 0) return { big: money(value), label: t("stub_bonus"), sub: null };
  if (p.freeSpins > 0) return { big: String(p.freeSpins), label: t("stub_spins"), sub: null };
  return { big: "★", label: "", sub: null };
}

/**
 * Offer card: artwork on top, one big number, name + one-line pitch, code and
 * deposit button. Full rules live on the bonus terms page.
 */
export default function PromoOfferCard({ promo, onClaim }: { promo: tLedgerPromotion; onClaim: () => void }) {
  const t = useTranslations("PromotionsPage");
  const kind = promoKind(promo);
  const { Icon, accent, accent2 } = KIND_LOOK[kind];
  const canClaim = promo.available && isDepositPromoType(promo.type);
  const v = bigValue(promo, t);
  const extraSpins = promoBonusValue(promo) > 0 && promo.freeSpins > 0 ? promo.freeSpins : 0;
  const days = (promo.validDays ?? []).map((d) => weekdayName(d, String(localeState.value)));
  // Day-limited offer outside its day: show when it opens instead of "not eligible"
  const todayKey = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][new Date().getUTCDay()];
  const closedToday = !promo.available && days.length > 0 && !promo.validDays.includes(todayKey);
  const note = closedToday
    ? t("opens_on", { days: days.join(", ") })
    : !promo.available
      ? ineligibleNote(promo, t)
      : null;

  return (
    <article
      style={{ "--accent": accent, "--accent-2": accent2 } as CSSProperties}
      className="group relative isolate flex h-full flex-col rounded-[26px] p-[1.5px] transition-transform duration-300 hover:-translate-y-1.5"
    >
      {/* animated gradient border */}
      <span aria-hidden className="absolute inset-0 -z-10 overflow-hidden rounded-[26px] bg-white/[0.07]">
        <span className="absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 animate-[spin_7s_linear_infinite] motion-reduce:animate-none bg-[conic-gradient(from_0deg,transparent_0deg,var(--accent)_50deg,transparent_110deg,transparent_180deg,var(--accent-2)_230deg,transparent_290deg)] opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
      </span>
      {/* outer glow */}
      <span
        aria-hidden
        className="absolute inset-x-8 -bottom-2 -z-20 h-1/2 rounded-full bg-[var(--accent)] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
      />

      <div className="relative flex flex-1 flex-col overflow-hidden rounded-[24.5px] bg-[#0c1a25]">
        {/* Artwork */}
        <div className="relative h-[180px] shrink-0 overflow-hidden">
          {promo.imageUrl ? (
            <img
              src={promo.imageUrl}
              alt=""
              loading="lazy"
              className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                promo.available || closedToday ? "" : "grayscale-[0.6]"
              }`}
            />
          ) : (
            // No artwork uploaded: a branded backdrop in the offer's own colours
            <span
              aria-hidden
              className={`absolute inset-0 overflow-hidden bg-[radial-gradient(120%_90%_at_85%_0%,color-mix(in_srgb,var(--accent)_45%,transparent),transparent_60%),radial-gradient(90%_80%_at_0%_100%,color-mix(in_srgb,var(--accent-2)_35%,transparent),transparent_65%),#0f2230] ${
                promo.available || closedToday ? "" : "grayscale-[0.6]"
              }`}
            >
              <Icon
                size={170}
                strokeWidth={1.25}
                className="absolute -bottom-6 -end-6 rotate-[-12deg] text-white/[0.09] transition-transform duration-700 group-hover:rotate-0 group-hover:scale-110"
              />
            </span>
          )}
          <span className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(12,26,37,0.15),rgba(12,26,37,0.55)_55%,#0c1a25)]" />
          <span
            aria-hidden
            className="absolute -start-10 -top-16 h-44 w-44 rounded-full bg-[var(--accent)] opacity-30 mix-blend-screen blur-3xl"
          />

          <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 py-1 pe-3 ps-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white backdrop-blur-md">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] text-[#0c1a25]">
                <Icon size={13} strokeWidth={2.6} />
              </span>
              {t(`kind_${kind}`)}
            </span>
            {!promo.available && !closedToday ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white/80 backdrop-blur-md">
                <Lock size={11} />
                {t("not_eligible")}
              </span>
            ) : days.length > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold text-white/90 backdrop-blur-md">
                <CalendarDays size={12} className="text-[var(--accent)]" />
                {days.join(" · ")}
              </span>
            ) : null}
          </div>
        </div>

        {/* Value + text */}
        <div className="relative -mt-16 flex flex-col px-5">
          <p className="flex items-end gap-2.5">
            <span className="bg-[linear-gradient(180deg,#ffffff_35%,var(--accent))] bg-clip-text text-[68px] font-black leading-[0.82] tracking-[-0.045em] text-transparent drop-shadow-[0_6px_24px_color-mix(in_srgb,var(--accent)_55%,transparent)]">
              {v.big}
            </span>
            {v.label && (
              <span className="mb-1 max-w-[6.5rem] text-[13px] font-black uppercase leading-[1.1] tracking-[0.12em] text-white">
                {v.label}
              </span>
            )}
          </p>
          {(v.sub || extraSpins > 0) && (
            <p className="mt-2 text-[13px] font-extrabold text-[var(--accent)]">
              {[v.sub, extraSpins > 0 ? t("stub_plus_spins", { count: String(extraSpins) }) : null].filter(Boolean).join(" · ")}
            </p>
          )}

          <h3 className="mt-4 text-[17px] font-extrabold leading-snug text-white">{promo.name}</h3>
          {promo.description && (
            <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-white/55">{promo.description}</p>
          )}
        </div>

        {/* Tear line */}
        <div aria-hidden className="relative mt-auto pt-5">
          <span className="absolute -start-3 top-5 h-6 w-6 -translate-y-1/2 rounded-full bg-[var(--background)]" />
          <span className="absolute -end-3 top-5 h-6 w-6 -translate-y-1/2 rounded-full bg-[var(--background)]" />
          <span className="mx-5 block border-t-2 border-dashed border-white/10" />
        </div>

        {/* Code + action */}
        <div className="flex flex-col gap-3 p-5 pt-4">
          <div className="flex gap-2.5">
            <PromoCode code={promo.code} className="flex-1" />
            {isDepositPromoType(promo.type) && (
              <button
                type="button"
                disabled={!canClaim}
                onClick={onClaim}
                className="group/cta inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] px-5 text-[14px] font-black text-[#0c1a25] shadow-[0_10px_26px_-10px_var(--accent)] transition-[filter,transform] hover:brightness-110 active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-none disabled:bg-white/[0.07] disabled:text-white/35 disabled:shadow-none"
              >
                {t("cta_deposit")}
                <ArrowRight size={15} strokeWidth={2.6} className="transition-transform group-hover/cta:translate-x-0.5 rtl:rotate-180" />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between gap-3 text-[12px]">
            {note ? (
              <span className="min-w-0 truncate text-amber-200/80" title={note}>
                {note}
              </span>
            ) : (
              <span />
            )}
            <Link
              href={routes.promotionOffer(promo.code)}
              className="shrink-0 font-semibold text-white/45 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              {t("terms_apply")}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
