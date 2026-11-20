"use client";

import type { CSSProperties } from "react";
import { Check, ChevronLeft, ChevronRight, Gift, Lock, Sparkles } from "lucide-react";
import { useTranslations } from "@/context/I18nContext";
import { useScrollArrows } from "@/hooks/useScrollArrows";
import type { tVipLevel } from "@/types/tVip";
import { money } from "@/site/promotions/promoDisplay";
import { tierLook } from "../vipTiers";

const HEX = "[clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]";

/** Layered hexagon rank emblem in the tier's colours. */
function TierEmblem({ Icon, dim }: { Icon: ReturnType<typeof tierLook>["Icon"]; dim: boolean }) {
  return (
    <div
      className={`relative h-[112px] w-[98px] transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:scale-105 ${
        dim ? "opacity-45 grayscale" : ""
      }`}
    >
      <span aria-hidden className="absolute -inset-5 rounded-full bg-[var(--c1)] opacity-25 blur-2xl transition-opacity duration-500 group-hover:opacity-50" />
      <span className={`absolute inset-0 ${HEX} bg-[linear-gradient(160deg,var(--c1),var(--c2))]`} />
      <span className={`absolute inset-[5px] ${HEX} bg-[linear-gradient(160deg,#0b1720,color-mix(in_srgb,var(--c1)_30%,#0b1720))]`} />
      <span
        className={`absolute inset-[12px] ${HEX} flex items-center justify-center overflow-hidden bg-[linear-gradient(160deg,var(--c1),var(--c2))] shadow-[inset_0_2px_0_rgba(255,255,255,0.4)]`}
      >
        <span aria-hidden className="absolute inset-x-0 top-0 h-1/2 bg-white/20" />
        <span
          aria-hidden
          className="absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)] transition-transform duration-700 group-hover:translate-x-[400%]"
        />
        <Icon size={34} strokeWidth={2.2} className="relative text-[#0b1720] drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]" />
      </span>
    </div>
  );
}

/** VIP tiers as rank emblem cards. `currentLevel` < 0 = guest. */
export default function VipLadder({ levels, currentLevel }: { levels: tVipLevel[]; currentLevel: number }) {
  const t = useTranslations("VipClub");
  const { ref, atStart, atEnd, canScroll, scroll } = useScrollArrows<HTMLOListElement>([levels.length]);
  const navBtn =
    "flex h-9 w-9 items-center justify-center rounded-full border border-[var(--background-secondary)] bg-[var(--bar-background-color)] text-[var(--text-muted-color)] transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-30";

  return (
    <section aria-labelledby="vip-ladder">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-6 w-1 shrink-0 rounded-full bg-[#ffc83d] shadow-[0_0_12px_#ffc83d]" />
        <h2 id="vip-ladder" className="text-[20px] font-extrabold text-white">
          {t("ladder_title")}
        </h2>
        {canScroll && (
          <div className="ms-auto flex gap-1.5">
            <button type="button" aria-label="Previous" className={navBtn} disabled={atStart} onClick={() => scroll(false)}>
              <ChevronLeft size={17} className="rtl:rotate-180" />
            </button>
            <button type="button" aria-label="Next" className={navBtn} disabled={atEnd} onClick={() => scroll(true)}>
              <ChevronRight size={17} className="rtl:rotate-180" />
            </button>
          </div>
        )}
      </div>

      <ol
        ref={ref}
        className="-mx-2 flex snap-x gap-4 overflow-x-auto px-2 pb-4 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {levels.map((level) => {
          const { Icon, color, color2 } = tierLook(level.title);
          const done = currentLevel >= 0 && level.id < currentLevel;
          const current = level.id === currentLevel;
          const locked = currentLevel >= 0 && level.id > currentLevel;
          const reward = level.levelUpBonus ?? 0;
          const spins = level.levelUpFreeSpins ?? 0;

          return (
            <li key={level.id} className="w-[236px] shrink-0 snap-start">
              <div
                style={{ "--c1": color, "--c2": color2 } as CSSProperties}
                className="group relative isolate h-full rounded-[24px] p-[1.5px] transition-transform duration-300 hover:-translate-y-1"
              >
                {/* border: animated on the current tier */}
                <span aria-hidden className="absolute inset-0 -z-10 overflow-hidden rounded-[24px] bg-white/[0.06]">
                  {current ? (
                    <span className="absolute left-1/2 top-1/2 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2 animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,var(--c1)_70deg,transparent_140deg,transparent_180deg,var(--c2)_250deg,transparent_320deg)] motion-reduce:animate-none" />
                  ) : (
                    <span className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--c1)_55%,transparent),transparent_45%,transparent_70%,color-mix(in_srgb,var(--c2)_30%,transparent))] opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
                  )}
                </span>

                <div className="relative flex h-full flex-col items-center overflow-hidden rounded-[22.5px] bg-[#0c1a25] px-4 pb-4 pt-6 text-center">
                  {/* backdrop */}
                  <span aria-hidden className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_srgb,var(--c1)_32%,transparent),transparent_70%)]" />
                  <span aria-hidden className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.025)_0_1px,transparent_1px_10px)]" />
                  <span
                    aria-hidden
                    className="absolute end-4 top-3.5 select-none font-mono text-[13px] font-bold tracking-[0.1em] text-white/25"
                  >
                    #{String(level.id).padStart(2, "0")}
                  </span>

                  <div className="relative">
                    <TierEmblem Icon={Icon} dim={locked} />
                    {done && (
                      <span className="absolute -bottom-1 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[#0c1a25] bg-[var(--green-color)] text-white">
                        <Check size={14} strokeWidth={3.2} />
                      </span>
                    )}
                    {locked && (
                      <span className="absolute -bottom-1 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[#0c1a25] bg-[#2a3d4b] text-white/80">
                        <Lock size={13} strokeWidth={2.6} />
                      </span>
                    )}
                  </div>

                  <p className="relative mt-4 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[var(--c1)]">
                    {t("level_n", { n: String(level.id) })}
                  </p>
                  <p className="relative mt-1 bg-[linear-gradient(180deg,#fff_40%,var(--c1))] bg-clip-text text-[21px] font-black uppercase leading-tight tracking-[0.02em] text-transparent">
                    {level.title}
                  </p>
                  <p className="relative mt-1 text-[12px] font-semibold text-[var(--text-muted-color)]">
                    {level.id === 0 ? t("starting_tier") : t("deposit_threshold", { amount: money(level.wagered ?? 0) })}
                  </p>

                  {/* rewards */}
                  <div className="relative mt-4 flex w-full flex-col gap-1.5">
                    {reward > 0 || spins > 0 ? (
                      <>
                        {reward > 0 && (
                          <span className="flex items-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2 text-start text-[13px] font-bold text-white ring-1 ring-inset ring-white/[0.06]">
                            <Gift size={15} className="shrink-0 text-[var(--c1)]" />
                            {t("reward_cash", { amount: money(reward) })}
                          </span>
                        )}
                        {spins > 0 && (
                          <span className="flex items-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2 text-start text-[13px] font-bold text-white ring-1 ring-inset ring-white/[0.06]">
                            <Sparkles size={15} className="shrink-0 text-[var(--c2)]" />
                            {t("reward_spins", { count: String(spins) })}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="rounded-xl bg-white/[0.03] px-3 py-2 text-[13px] font-bold text-white/30">—</span>
                    )}
                  </div>

                  {/* status */}
                  <div className="relative mt-auto w-full pt-4">
                    {current ? (
                      <span className="flex h-8 items-center justify-center gap-1.5 rounded-full bg-[linear-gradient(90deg,var(--c1),var(--c2))] text-[11px] font-black uppercase tracking-[0.14em] text-[#0b1720]">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0b1720]" />
                        {t("you_are_here")}
                      </span>
                    ) : done ? (
                      <span className="flex h-8 items-center justify-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--green-color)_14%,transparent)] text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--green-color)]">
                        <Check size={13} strokeWidth={3} />
                        {t("tier_unlocked")}
                      </span>
                    ) : locked ? (
                      <span className="flex h-8 items-center justify-center gap-1.5 rounded-full bg-white/[0.04] text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/40">
                        <Lock size={12} />
                        {t("Locked")}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
