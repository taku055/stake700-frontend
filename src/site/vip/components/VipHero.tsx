"use client";

import type { CSSProperties } from "react";
import { Crown, LogIn, UserPlus } from "lucide-react";
import { useTranslations } from "@/context/I18nContext";
import { loginOpenedState } from "@/state/loginOpenedState";
import { registerOpenedState } from "@/state/registerOpenedState";
import type { tVipLevel, tVipStatusResponse } from "@/types/tVip";
import { money } from "@/site/promotions/promoDisplay";
import { tierLook } from "../vipTiers";

const RING = 2 * Math.PI * 70;

function TierMedal({ tier, size = 64 }: { tier: tVipLevel | null; size?: number }) {
  const { Icon, color, color2 } = tierLook(tier?.title);
  return (
    <span
      style={{ "--c1": color, "--c2": color2, width: size, height: size } as CSSProperties}
      className="relative flex shrink-0 items-center justify-center rounded-[28%] bg-[linear-gradient(135deg,var(--c1),var(--c2))] text-[#0f212e] shadow-[0_14px_32px_-12px_var(--c1),inset_0_1px_0_rgba(255,255,255,0.5)]"
    >
      <span className="absolute inset-0 rounded-[28%] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.45),transparent_60%)]" />
      <Icon size={size * 0.46} strokeWidth={2.2} className="relative" />
    </span>
  );
}

/** Logged-in hero: medal, progress ring and what's needed for the next tier. */
export function VipHero({ status }: { status: tVipStatusResponse }) {
  const t = useTranslations("VipClub");
  const { currentTier, nextTier, wagered } = status;
  const progress = Math.min(100, Math.max(0, status.progressPercent));
  const look = tierLook(currentTier?.title);
  const remaining = nextTier?.wagered != null ? Math.max(0, nextTier.wagered - wagered) : 0;

  return (
    <section
      style={{ "--c1": look.color } as CSSProperties}
      className="relative overflow-hidden rounded-3xl border border-[var(--background-secondary)] bg-[var(--bar-background-color)]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -start-20 -top-24 h-80 w-80 rounded-full bg-[var(--c1)] opacity-20 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      </div>

      <div className="relative flex flex-col items-center gap-8 p-6 md:flex-row md:p-10">
        {/* Ring */}
        <div className="relative h-[180px] w-[180px] shrink-0">
          <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
            <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12" />
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="var(--c1)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={RING}
              strokeDashoffset={RING * (1 - progress / 100)}
              className="drop-shadow-[0_0_10px_var(--c1)] transition-[stroke-dashoffset] duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <TierMedal tier={currentTier} size={58} />
            <span className="text-[22px] font-extrabold tabular-nums text-white">{progress.toFixed(0)}%</span>
          </div>
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1 text-center md:text-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white/85">
            <Crown size={13} className="text-[var(--c1)]" />
            {t("kicker")}
          </span>
          <h1 className="mt-3 text-[32px] font-extrabold leading-[1.05] tracking-[-0.02em] text-white md:text-[42px]">
            {currentTier?.title ?? t("None")}
          </h1>
          <p className="mt-2 text-[15px] text-[var(--text-muted-color)]">
            {nextTier
              ? t("to_next", { amount: money(remaining), tier: nextTier.title })
              : t("Max level reached")}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md md:mx-0 mx-auto">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-start">
              <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted-color)]">
                {t("Total deposit")}
              </span>
              <span className="mt-1 block text-[20px] font-extrabold tabular-nums text-white">{money(wagered)}</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-start">
              <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted-color)]">
                {t("Next level")}
              </span>
              <span className="mt-1 flex items-center gap-2 text-[20px] font-extrabold text-white">
                {nextTier ? (
                  <>
                    <TierMedal tier={nextTier} size={22} />
                    <span className="truncate">{nextTier.title}</span>
                  </>
                ) : (
                  "—"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Guest hero: invites to sign in / sign up. */
export function VipGuestHero() {
  const t = useTranslations("VipClub");
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--background-secondary)] bg-[var(--bar-background-color)]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -end-16 -top-24 h-80 w-80 rounded-full bg-[#ffc83d] opacity-[0.16] blur-[110px]" />
        <div className="absolute -bottom-28 start-10 h-72 w-72 rounded-full bg-[#ff5c8a] opacity-[0.12] blur-[110px]" />
      </div>
      <div className="relative flex flex-col items-center gap-8 p-6 text-center md:flex-row md:p-10 md:text-start">
        <div className="relative flex h-[150px] w-[150px] shrink-0 items-center justify-center">
          {["#d98b4a", "#c7d0de", "#ffc83d"].map((c, i) => (
            <span
              key={c}
              style={{ background: `linear-gradient(135deg, ${c}, ${c}aa)`, transform: `translate(${(i - 1) * 34}px, ${i === 1 ? -14 : 8}px) rotate(${(i - 1) * 12}deg)` }}
              className={`absolute flex h-[78px] w-[78px] items-center justify-center rounded-[28%] text-[#0f212e] shadow-[0_14px_30px_-12px_rgba(0,0,0,0.8)] ${i === 1 ? "z-10 scale-110" : ""}`}
            >
              {i === 1 ? <Crown size={36} /> : null}
            </span>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white/85">
            <Crown size={13} className="text-[#ffc83d]" />
            {t("kicker")}
          </span>
          <h1 className="mt-3 text-[30px] font-extrabold leading-[1.1] tracking-[-0.02em] text-white md:text-[40px]">
            {t("guest_title")}
          </h1>
          <p className="mt-2 max-w-xl text-[15px] text-[var(--text-muted-color)]">{t("guest_subtitle")}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
            <button
              type="button"
              onClick={() => (registerOpenedState.value = true)}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--primary-color)] px-5 text-[14px] font-bold text-white shadow-[0_10px_24px_-12px_var(--primary-color)] transition-colors hover:bg-[var(--primary-hover-color)]"
            >
              <UserPlus size={17} />
              {t("join")}
            </button>
            <button
              type="button"
              onClick={() => (loginOpenedState.value = true)}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 text-[14px] font-bold text-white transition-colors hover:bg-white/[0.08]"
            >
              <LogIn size={17} />
              {t("sign_in")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export { TierMedal };
