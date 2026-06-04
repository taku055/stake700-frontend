import { User } from "lucide-preact";
import { useTranslations } from "@/context/I18nContext";
import {
  DEFAULT_CURRENCY_SYMBOL,
  getVipLevelIconUrl,
  VIP_LOTTERY_IMAGE,
} from "@/config/constants";
import { userState } from "@/state/userState";
import type { tVipStatusResponse } from "@/types/tVip";
import { vipLabelClass, vipSectionClass } from "../vipTheme";

type VipProgressHeroProps = {
  status: tVipStatusResponse;
};

function UserAvatar({ avatar, userName }: { avatar: string | null; userName: string }) {
  return (
    <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--primary-color)]/35 bg-gradient-to-br from-white/10 to-white/[0.02] shadow-[0_0_28px_color-mix(in_srgb,var(--primary-color)_18%,transparent)] ring-2 ring-[var(--primary-color)]/15 md:h-20 md:w-20">
      {avatar ? (
        <img src={avatar} alt="" className="h-full w-full object-cover" />
      ) : userName ? (
        <span className="text-2xl font-semibold text-white/90">
          {userName.at(0)?.toUpperCase()}
        </span>
      ) : (
        <User className="h-9 w-9 text-white/40" aria-hidden />
      )}
    </div>
  );
}

export default function VipProgressHero({ status }: VipProgressHeroProps) {
  const t = useTranslations("VipClub");
  const user = userState.value;
  const { currentTier, nextTier, wagered, progressPercent } = status;
  const currentTitle = currentTier?.title ?? t("None");
  const nextTitle = nextTier?.title ?? t("Max level reached");
  const currentIconUrl = currentTier ? getVipLevelIconUrl(currentTier.id) : null;
  const nextIconUrl = nextTier ? getVipLevelIconUrl(nextTier.id) : null;
  const progress = Math.min(100, Math.max(0, progressPercent));

  return (
    <section
      className={`${vipSectionClass} relative overflow-hidden`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,var(--primary-color)_0%,transparent_55%)] opacity-[0.07]"
        aria-hidden
      />

      <div className="relative grid gap-0 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-0 md:flex-row md:items-stretch">
          {/* User identity — left of progress panel */}
          <div className="flex shrink-0 items-center gap-4 border-b border-white/[0.06] p-5 md:w-[min(100%,280px)] md:flex-col md:items-start md:justify-center md:border-b-0 md:border-e md:p-6 lg:w-[300px]">
            <UserAvatar
              avatar={user?.avatar ?? null}
              userName={user?.userName ?? ""}
            />
            <div className="min-w-0 flex-1 md:flex-initial">
              <p className="truncate text-base font-semibold text-white md:text-lg">
                {user?.userName ?? t("Guest")}
              </p>
              {user?.email ? (
                <p className="mt-0.5 truncate text-sm text-white/50">{user.email}</p>
              ) : null}
              <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--primary-color)]/25 bg-[var(--primary-color)]/10 px-3 py-1.5">
                {currentIconUrl ? (
                  <img
                    src={currentIconUrl}
                    alt=""
                    className="h-5 w-5 shrink-0 object-contain"
                  />
                ) : null}
                <div className="min-w-0">
                  <p className={vipLabelClass}>{t("Current level")}</p>
                  <p className="truncate text-sm font-semibold text-[var(--primary-color)]">
                    {currentTitle}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress panel */}
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-5 p-5 md:p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className={vipLabelClass}>{t("Your VIP Progress")}</p>
                <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-white md:text-4xl">
                  {progress.toFixed(1)}
                  <span className="ms-0.5 text-lg font-medium text-white/50">%</span>
                </p>
              </div>
            </div>

            <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/25 ring-1 ring-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-color)]/75 shadow-[0_0_12px_var(--primary-color)] transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2.5 text-white">
                {currentIconUrl && (
                  <img
                    src={currentIconUrl}
                    alt=""
                    className="h-8 w-8 shrink-0 object-contain opacity-90"
                  />
                )}
                <div>
                  <p className="text-xs text-white/45">{t("Current level")}</p>
                  <p className="font-medium">{currentTitle}</p>
                </div>
              </div>
              {nextTier ? (
                <div className="flex items-center gap-2.5 text-white md:text-end">
                  {nextIconUrl && (
                    <img
                      src={nextIconUrl}
                      alt=""
                      className="h-8 w-8 shrink-0 object-contain opacity-70"
                    />
                  )}
                  <div>
                    <p className="text-xs text-white/45">{t("Next level")}</p>
                    <p className="font-medium text-white/85">{nextTitle}</p>
                  </div>
                </div>
              ) : null}
            </div>

            <p className="text-sm text-white/50">
              <span className="text-white/40">{t("Total deposit")}: </span>
              <span className="font-medium tabular-nums text-white/80">
                {DEFAULT_CURRENCY_SYMBOL}
                {wagered.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              {nextTier?.wagered != null ? (
                <span className="text-white/40">
                  {" "}
                  / {DEFAULT_CURRENCY_SYMBOL}
                  {nextTier.wagered.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              ) : null}
            </p>
          </div>
        </div>

        <div className="relative flex items-center justify-center border-t border-white/[0.06] bg-gradient-to-t from-[var(--primary-color)]/[0.04] to-transparent px-6 py-5 lg:border-s lg:border-t-0 lg:bg-gradient-to-l lg:py-6">
          <img
            src={VIP_LOTTERY_IMAGE}
            alt=""
            className="max-h-[140px] w-full max-w-[200px] object-contain opacity-95 drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)] sm:max-h-[180px] lg:max-h-[200px] lg:max-w-[240px] xl:max-h-[220px]"
          />
        </div>
      </div>
    </section>
  );
}
