"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { apiGetVipStatus } from "@/api/vip/apiGetVipStatus";
import { apiGetVipLevelList } from "@/api/vip/apiGetVipLevelList";
import type { tVipLevel, tVipStatusResponse } from "@/types/tVip";
import { VipGuestHero, VipHero } from "./components/VipHero";
import VipLadder from "./components/VipLadder";
import VipRewards from "./components/VipRewards";
import VipPerks from "./components/VipPerks";

export default function VipPage() {
  const t = useTranslations("VipClub");
  const userId = userState.value?.id;

  const [status, setStatus] = useState<tVipStatusResponse | null>(null);
  const [levels, setLevels] = useState<tVipLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setError(null);
    try {
      if (userId) {
        const vipStatus = await apiGetVipStatus();
        setStatus(vipStatus);
        setLevels(vipStatus.levels);
        if (userState.value) {
          userState.value = { ...userState.value, vipLevel: vipStatus.vipLevel, wagered: vipStatus.wagered };
        }
      } else {
        setStatus(null);
        setLevels(await apiGetVipLevelList());
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        t("Failed to load VIP data");
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [userId, t]);

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [loadData]);

  return (
    <div className="flex w-full flex-col gap-8 p-2 md:gap-10">
      {userId && status ? <VipHero status={status} /> : !userId ? <VipGuestHero /> : null}

      {loading && (
        <div className="space-y-6">
          {userId && <div className="h-[260px] animate-pulse rounded-3xl bg-[var(--bar-background-color)]" />}
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[250px] w-[190px] shrink-0 animate-pulse rounded-3xl bg-[var(--bar-background-color)]" />
            ))}
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-red-400/20 bg-red-500/[0.08] px-4 py-3 text-[14px] text-red-100/90">
          {error}
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              loadData();
            }}
            className="shrink-0 font-semibold underline underline-offset-4"
          >
            {t("Retry")}
          </button>
        </div>
      )}

      {!loading && status && <VipRewards status={status} onClaimed={loadData} />}
      {!loading && levels.length > 0 && <VipLadder levels={levels} currentLevel={status ? status.vipLevel : -1} />}
      <VipPerks />
    </div>
  );
}
