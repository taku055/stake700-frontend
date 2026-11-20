"use client";

import { useState, type CSSProperties } from "react";
import { Gift, Hourglass, PartyPopper } from "lucide-react";
import { apiClaimVipLevelUpReward } from "@/api/vip/apiClaimVipLevelUpReward";
import { useTranslations } from "@/context/I18nContext";
import { toast } from "@/helpers/toast";
import type { tVipLevelUpReward, tVipStatusResponse } from "@/types/tVip";
import { money } from "@/site/promotions/promoDisplay";
import { tierLook } from "../vipTiers";
import { TierMedal } from "./VipHero";

function rewardText(r: tVipLevelUpReward, t: (k: string, v?: Record<string, string>) => string) {
  const parts: string[] = [];
  if (r.cashAmount > 0) parts.push(t("reward_cash", { amount: money(r.cashAmount) }));
  if (r.freeSpins > 0) parts.push(t("reward_spins", { count: String(r.freeSpins) }));
  return parts.join(" + ");
}

/** Pending level-up rewards the player can claim now. */
export default function VipRewards({ status, onClaimed }: { status: tVipStatusResponse; onClaimed: () => void }) {
  const t = useTranslations("VipClub");
  const [claiming, setClaiming] = useState<number | null>(null);
  const rewards = status.pendingRewards?.rewards ?? [];
  const next = status.nextTier;

  const claim = async (reward: tVipLevelUpReward) => {
    setClaiming(reward.vipLevel);
    try {
      const res = await apiClaimVipLevelUpReward(reward.vipLevel);
      toast.success(res.message);
      onClaimed();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? t("Claim failed");
      toast.error(message);
    } finally {
      setClaiming(null);
    }
  };

  return (
    <section aria-labelledby="vip-rewards">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-6 w-1 shrink-0 rounded-full bg-[var(--green-color)] shadow-[0_0_12px_var(--green-color)]" />
        <h2 id="vip-rewards" className="text-[20px] font-extrabold text-white">
          {t("rewards_title")}
        </h2>
      </div>

      {rewards.length === 0 ? (
        <div className="flex items-center gap-4 rounded-3xl border border-dashed border-[var(--background-secondary)] p-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.04] text-[var(--text-muted-color)]">
            <Hourglass size={22} />
          </span>
          <p className="text-[14px] leading-relaxed text-[var(--text-muted-color)]">
            {next && ((next.levelUpBonus ?? 0) > 0 || (next.levelUpFreeSpins ?? 0) > 0)
              ? t("no_rewards_next", {
                  tier: next.title,
                  reward:
                    (next.levelUpBonus ?? 0) > 0
                      ? t("reward_cash", { amount: money(next.levelUpBonus ?? 0) })
                      : t("reward_spins", { count: String(next.levelUpFreeSpins ?? 0) }),
                })
              : t("no_rewards")}
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {rewards.map((r) => {
            const look = tierLook(r.title);
            const blocked = !r.claimable;
            return (
              <li
                key={r.id}
                style={{ "--c1": look.color } as CSSProperties}
                className="flex items-center gap-4 rounded-3xl border border-[color-mix(in_srgb,var(--c1)_40%,var(--background-secondary))] bg-[color-mix(in_srgb,var(--c1)_7%,var(--bar-background-color))] p-4"
              >
                <TierMedal tier={{ id: r.vipLevel, title: r.title }} size={52} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--c1)]">
                    <PartyPopper size={13} />
                    {t("reached_tier", { tier: r.title })}
                  </p>
                  <p className="mt-0.5 text-[17px] font-extrabold text-white">{rewardText(r, t)}</p>
                  {blocked && (
                    <p className="mt-1 text-[12px] leading-relaxed text-amber-300/90">
                      {r.claimBlockedReason === "ACTIVE_FREESPIN_EXISTS"
                        ? t("reward_blocked_spins", {
                            game: r.game?.name ?? t("this game"),
                          })
                        : t("reward_blocked")}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  disabled={blocked || claiming === r.vipLevel}
                  onClick={() => claim(r)}
                  className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[var(--green-color)] px-4 text-[14px] font-bold text-white shadow-[0_10px_24px_-12px_var(--green-color)] transition-[filter] hover:brightness-110 disabled:cursor-not-allowed disabled:bg-white/[0.06] disabled:text-white/35 disabled:shadow-none"
                >
                  <Gift size={16} />
                  {claiming === r.vipLevel ? t("claiming") : t("Claim")}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
