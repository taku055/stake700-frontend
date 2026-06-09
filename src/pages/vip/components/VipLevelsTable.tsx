import { useEffect, useMemo, useState } from "preact/hooks";
import { apiGetGameById } from "@/api/common/apiGetGameById";
import { useTranslations } from "@/context/I18nContext";
import {
  DEFAULT_CURRENCY_SYMBOL,
  getVipLevelIconUrl,
  placeholderGameImage,
} from "@/config/constants";
import type { tVipLevel, tVipRewardGame, tVipStatusResponse } from "@/types/tVip";
import { Check, Lock } from "lucide-preact";
import { vipSectionHeadingClass, vipTableWrapClass } from "../vipTheme";

type VipLevelsTableProps = {
  status: tVipStatusResponse;
};

function levelStatus(
  levelId: number,
  userLevel: number
): "completed" | "current" | "locked" {
  if (levelId < userLevel) return "completed";
  if (levelId === userLevel) return "current";
  return "locked";
}

function resolveFreeSpinGame(
  level: tVipLevel,
  gameByLevel: Map<number, NonNullable<tVipRewardGame>>,
  gameByGameId: Map<string, NonNullable<tVipRewardGame>>
): tVipRewardGame | null {
  if (level.levelUpFreeSpinGame) {
    return level.levelUpFreeSpinGame;
  }
  const fromLevel = gameByLevel.get(level.id);
  if (fromLevel) {
    return fromLevel;
  }
  if (level.levelUpFreeSpinGameId) {
    return gameByGameId.get(level.levelUpFreeSpinGameId) ?? null;
  }
  return null;
}

function LevelUpBonusCell({
  level,
  gameByLevel,
  gameByGameId,
}: {
  level: tVipLevel;
  gameByLevel: Map<number, NonNullable<tVipRewardGame>>;
  gameByGameId: Map<string, NonNullable<tVipRewardGame>>;
}) {
  const hasCash = (level.levelUpBonus ?? 0) > 0;
  const hasFs = (level.levelUpFreeSpins ?? 0) > 0;

  if (!hasCash && !hasFs) {
    return <span className="text-white/80">—</span>;
  }

  const game = hasFs ? resolveFreeSpinGame(level, gameByLevel, gameByGameId) : null;
  const imgSrc = game?.img_custom || game?.img || placeholderGameImage;

  return (
    <div className="flex flex-wrap items-center gap-1.5 text-white/80">
      {hasCash && (
        <span>
          {DEFAULT_CURRENCY_SYMBOL}
          {level.levelUpBonus!.toLocaleString()}
        </span>
      )}
      {hasCash && hasFs && <span className="text-white/50">+</span>}
      {hasFs && (
        <span className="inline-flex items-center gap-1.5">
          <img
            src={imgSrc}
            alt={game?.name ?? ""}
            title={game?.name}
            className="h-7 w-7 shrink-0 rounded-md object-cover"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = placeholderGameImage;
            }}
          />
          <span>{level.levelUpFreeSpins} FS</span>
        </span>
      )}
    </div>
  );
}

export default function VipLevelsTable({ status }: VipLevelsTableProps) {
  const t = useTranslations("VipClub");
  const { levels, vipLevel, pendingRewards } = status;

  const [fetchedGamesById, setFetchedGamesById] = useState<
    Record<string, NonNullable<tVipRewardGame>>
  >({});

  const gameByLevel = useMemo(() => {
    const byLevel = new Map<number, NonNullable<tVipRewardGame>>();
    for (const reward of pendingRewards?.rewards ?? []) {
      if (!reward.game) continue;
      byLevel.set(reward.vipLevel, reward.game);
    }
    return byLevel;
  }, [pendingRewards?.rewards]);

  const gameByGameId = useMemo(() => {
    const byGameId = new Map<string, NonNullable<tVipRewardGame>>();

    for (const reward of pendingRewards?.rewards ?? []) {
      if (!reward.game) continue;
      byGameId.set(reward.game.id, reward.game);
    }

    for (const [id, game] of Object.entries(fetchedGamesById)) {
      byGameId.set(id, game);
    }

    return byGameId;
  }, [pendingRewards?.rewards, fetchedGamesById]);

  useEffect(() => {
    const missingIds = [
      ...new Set(
        levels
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
  }, [levels, gameByGameId]);

  return (
    <section className="flex flex-col gap-4">
      <h2 className={vipSectionHeadingClass}>{t("VIP Levels")}</h2>
      <div className={vipTableWrapClass}>
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.07] bg-white/[0.02] text-white/50">
              <th className="px-4 py-3 font-medium">{t("Level")}</th>
              <th className="px-4 py-3 font-medium">{t("Deposit required")}</th>
              <th className="px-4 py-3 font-medium">{t("Level up bonus")}</th>
              <th className="px-4 py-3 font-medium">{t("Status")}</th>
            </tr>
          </thead>
          <tbody>
            {levels.slice(1).map((level) => {
              const state = levelStatus(level.id, vipLevel);
              const iconUrl = getVipLevelIconUrl(level.id);
              return (
                <tr
                  key={level.id}
                  className={`border-b border-white/[0.04] transition-colors last:border-0 hover:bg-white/[0.02] ${
                    state === "current"
                      ? "bg-[var(--primary-color)]/[0.08]"
                      : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-white">
                      <img
                        src={iconUrl}
                        alt=""
                        className="h-7 w-7 shrink-0 object-contain"
                      />
                      <span className="font-medium">{level.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/80">
                    {DEFAULT_CURRENCY_SYMBOL}
                    {(level.wagered ?? 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <LevelUpBonusCell
                      level={level}
                      gameByLevel={gameByLevel}
                      gameByGameId={gameByGameId}
                    />
                  </td>
                  <td className="px-4 py-3">
                    {state === "completed" && (
                      <span className="inline-flex items-center gap-1 text-emerald-400">
                        <Check className="h-4 w-4" />
                        {t("Completed")}
                      </span>
                    )}
                    {state === "current" && (
                      <span className="rounded-full border border-[var(--primary-color)]/30 bg-[var(--primary-color)]/15 px-2.5 py-0.5 text-xs font-semibold text-[var(--primary-color)]">
                        {t("Current")}
                      </span>
                    )}
                    {state === "locked" && (
                      <span className="inline-flex items-center gap-1 text-white/40">
                        <Lock className="h-4 w-4" />
                        {t("Locked")}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
