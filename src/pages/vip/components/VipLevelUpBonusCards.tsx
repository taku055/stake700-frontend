import { useEffect, useMemo, useState } from "preact/hooks";
import { apiGetGameById } from "@/api/common/apiGetGameById";
import { apiClaimVipLevelUpReward } from "@/api/vip/apiClaimVipLevelUpReward";
import { useTranslations } from "@/context/I18nContext";
import {
  DEFAULT_CURRENCY_SYMBOL,
  getVipLevelIconUrl,
  placeholderGameImage,
} from "@/config/constants";
import { toast } from "@/helpers/toast";
import type {
  tVipLevel,
  tVipLevelUpReward,
  tVipRewardGame,
  tVipStatusResponse,
} from "@/types/tVip";
import { Check, Gift, Lock } from "lucide-preact";
import { vipCardClass, vipSectionHeadingClass } from "../vipTheme";

type VipLevelUpBonusCardsProps = {
  status: tVipStatusResponse;
  onClaimed: () => void;
};

type LevelBonusState = "locked" | "claimable" | "blocked" | "claimed";

function getLevelBonusState(
  levelId: number,
  vipLevel: number,
  pendingByLevel: Map<number, tVipLevelUpReward>
): LevelBonusState {
  const pending = pendingByLevel.get(levelId);
  if (pending) {
    return pending.claimable ? "claimable" : "blocked";
  }
  if (levelId > vipLevel) {
    return "locked";
  }
  return "claimed";
}

function formatBonusAmount(
  level: tVipLevel,
  reward: tVipLevelUpReward | undefined,
  t: (key: string, values?: Record<string, string>) => string
) {
  const cash = reward?.cashAmount ?? level.levelUpBonus ?? 0;
  const fs = reward?.freeSpins ?? level.levelUpFreeSpins ?? 0;
  const parts: string[] = [];
  if (cash > 0) {
    parts.push(`${DEFAULT_CURRENCY_SYMBOL}${cash.toLocaleString()}`);
  }
  if (fs > 0) {
    parts.push(`${fs} ${t("free spins")}`);
  }
  return parts.join(" + ") || "—";
}

function getRewardBlockedMessage(
  reward: tVipLevelUpReward,
  t: (key: string, values?: Record<string, string>) => string
) {
  if (reward.claimable) {
    return null;
  }
  if (reward.claimBlockedReason === "ACTIVE_FREESPIN_EXISTS") {
    const gameName = reward.game?.name ?? t("this game");
    if (reward.activeFreespinRemaining > 0) {
      return t(
        "Finish {remaining} free spins on {game} before claiming this reward.",
        {
          remaining: String(reward.activeFreespinRemaining),
          game: gameName,
        }
      );
    }
    return t(
      "Finish your active free spins on {game} before claiming this reward.",
      { game: gameName }
    );
  }
  return t("This reward cannot be claimed right now.");
}

function resolveGameImage(
  level: tVipLevel,
  reward: tVipLevelUpReward | undefined,
  gameByGameId: Map<string, NonNullable<tVipRewardGame>>
): string {
  const game =
    reward?.game ??
    level.levelUpFreeSpinGame ??
    (level.levelUpFreeSpinGameId
      ? gameByGameId.get(level.levelUpFreeSpinGameId)
      : null);
  return game?.img_custom || game?.img || getVipLevelIconUrl(level.id);
}

export default function VipLevelUpBonusCards({
  status,
  onClaimed,
}: VipLevelUpBonusCardsProps) {
  const t = useTranslations("VipClub");
  const { levels, vipLevel, wagered, pendingRewards } = status;
  const [claimingLevel, setClaimingLevel] = useState<number | null>(null);
  const [fetchedGamesById, setFetchedGamesById] = useState<
    Record<string, NonNullable<tVipRewardGame>>
  >({});

  const pendingByLevel = useMemo(() => {
    const map = new Map<number, tVipLevelUpReward>();
    for (const reward of pendingRewards?.rewards ?? []) {
      map.set(reward.vipLevel, reward);
    }
    return map;
  }, [pendingRewards?.rewards]);

  const bonusLevels = useMemo(
    () =>
      levels.filter(
        (l) => (l.levelUpBonus ?? 0) > 0 || (l.levelUpFreeSpins ?? 0) > 0
      ),
    [levels]
  );

  const gameByGameId = useMemo(() => {
    const map = new Map<string, NonNullable<tVipRewardGame>>();
    for (const reward of pendingRewards?.rewards ?? []) {
      if (reward.game) map.set(reward.game.id, reward.game);
    }
    for (const [id, game] of Object.entries(fetchedGamesById)) {
      map.set(id, game);
    }
    return map;
  }, [pendingRewards?.rewards, fetchedGamesById]);

  useEffect(() => {
    const missingIds = [
      ...new Set(
        bonusLevels
          .filter(
            (l) =>
              (l.levelUpFreeSpins ?? 0) > 0 &&
              l.levelUpFreeSpinGameId &&
              !gameByGameId.has(l.levelUpFreeSpinGameId)
          )
          .map((l) => l.levelUpFreeSpinGameId as string)
      ),
    ];
    if (missingIds.length === 0) return;

    let cancelled = false;
    (async () => {
      const results = await Promise.all(
        missingIds.map(async (id) => {
          try {
            const game = await apiGetGameById(id);
            return {
              id,
              game: {
                id: game.id,
                name: game.name,
                img: game.img ?? null,
                img_custom: game.img_custom ?? null,
                providerId: game.providerId,
                gameSource: game.gameSource,
              } satisfies NonNullable<tVipRewardGame>,
            };
          } catch {
            return null;
          }
        })
      );
      if (cancelled) return;
      const next: Record<string, NonNullable<tVipRewardGame>> = {};
      for (const entry of results) {
        if (entry) next[entry.id] = entry.game;
      }
      if (Object.keys(next).length > 0) {
        setFetchedGamesById((prev) => ({ ...prev, ...next }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [bonusLevels, gameByGameId]);

  const handleClaim = async (reward: tVipLevelUpReward) => {
    setClaimingLevel(reward.vipLevel);
    try {
      const res = await apiClaimVipLevelUpReward(reward.vipLevel);
      toast.success(res.message);
      onClaimed();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? t("Claim failed");
      toast.error(message);
    } finally {
      setClaimingLevel(null);
    }
  };

  if (bonusLevels.length === 0) {
    return null;
  }

  return (
    <section className="flex w-full min-w-0 flex-col gap-4">
      <h2 className={vipSectionHeadingClass}>{t("Level up bonus")}</h2>
      <div className="horizontal-scrollbar grid w-full min-w-0 auto-cols-[minmax(260px,1fr)] grid-flow-col gap-4 overflow-x-auto pb-2 md:auto-cols-[minmax(280px,320px)]">
        {bonusLevels.map((level) => {
          const state = getLevelBonusState(level.id, vipLevel, pendingByLevel);
          const pending = pendingByLevel.get(level.id);
          const wagerRequired = level.wagered ?? 0;
          const wagerRemaining = Math.max(0, wagerRequired - wagered);
          const imageUrl = resolveGameImage(level, pending, gameByGameId);
          const blockedMessage = pending
            ? getRewardBlockedMessage(pending, t)
            : null;

          return (
            <article
              key={level.id}
              className={`flex min-w-[260px] max-w-[320px] flex-col p-4 ${vipCardClass} ${
                state === "locked"
                  ? "opacity-95"
                  : state === "blocked"
                    ? "border-amber-400/20 bg-amber-500/[0.04]"
                    : state === "claimable"
                      ? "border-[var(--primary-color)]/25"
                      : ""
              }`}
            >
              <div className="mb-3 flex items-start gap-3">
                <img
                  src={imageUrl}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      getVipLevelIconUrl(level.id);
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">{level.title}</h3>
                    {state === "locked" && (
                      <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/55">
                        {wagerRemaining > 0
                          ? t("Deposit {amount} to unlock", {
                              amount: `${DEFAULT_CURRENCY_SYMBOL}${wagerRemaining.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
                            })
                          : t("Deposit to unlock")}
                      </span>
                    )}
                    {state === "claimed" && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
                        <Check className="h-3 w-3" aria-hidden />
                        {t("Claimed")}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-white/50">
                    {t("Level up bonus")}
                  </p>
                </div>
              </div>

              <p className="mb-4 text-lg font-semibold text-white">
                {formatBonusAmount(level, pending, t)}
              </p>

              {blockedMessage && (
                <p className="mb-3 text-xs leading-relaxed text-amber-400/90">
                  {blockedMessage}
                </p>
              )}

              <div className="mt-auto">
                {state === "locked" && (
                  <button
                    type="button"
                    disabled
                    className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/40"
                  >
                    <Lock className="h-4 w-4 shrink-0" aria-hidden />
                    {t("Locked")}
                  </button>
                )}

                {state === "claimed" && (
                  <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white/45">
                    <Check className="h-4 w-4 shrink-0 text-emerald-400/80" aria-hidden />
                    {t("Claimed")}
                  </div>
                )}

                {(state === "claimable" || state === "blocked") && pending && (
                  <button
                    type="button"
                    disabled={
                      state === "blocked" || claimingLevel === level.id
                    }
                    onClick={() => handleClaim(pending)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-color)]/85 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_color-mix(in_srgb,var(--primary-color)_35%,transparent)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                  >
                    {claimingLevel === level.id ? (
                      t("Claiming...")
                    ) : state === "claimable" ? (
                      <>
                        <Gift className="h-4 w-4 shrink-0" aria-hidden />
                        {t("Claim")}
                      </>
                    ) : (
                      t("Unavailable")
                    )}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
