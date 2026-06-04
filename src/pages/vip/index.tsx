import { useCallback, useEffect, useState } from "preact/hooks";
import ContentWrapper from "@/provider/ContentWrapper";
import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { apiGetVipStatus } from "@/api/vip/apiGetVipStatus";
import type { tVipStatusResponse } from "@/types/tVip";
import VipProgressHero from "./components/VipProgressHero";
import VipLevelsTable from "./components/VipLevelsTable";
import VipLevelUpBonusCards from "./components/VipLevelUpBonusCards";
import LoginRequest from "@/components/LoginRequest";
import { vipPageTitleClass, vipPageWrapClass } from "./vipTheme";

export default function VipPage() {
  const t = useTranslations("VipClub");
  const user = userState.value;

  const [status, setStatus] = useState<tVipStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setError(null);
    try {
      const vipStatus = await apiGetVipStatus();
      setStatus(vipStatus);

      if (userState.value) {
        userState.value = {
          ...userState.value,
          vipLevel: vipStatus.vipLevel,
          wagered: vipStatus.wagered,
        };
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? t("Failed to load VIP data");
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user?.id, t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!user?.id) {
    return (
      <ContentWrapper>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-12">
          <h1 className="text-2xl font-semibold text-white">{t("VIP")}</h1>
          <LoginRequest />
        </div>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper>
      <div className={vipPageWrapClass}>
        <header>
          <h1 className={vipPageTitleClass}>{t("VIP")}</h1>
          <p className="mt-1 text-sm text-white/45">
            {t("Your VIP Progress")}
          </p>
        </header>

        {loading && (
          <p className="text-center text-sm text-white/45">{t("Loading")}</p>
        )}

        {error && !loading && (
          <div className="rounded-xl border border-red-400/20 bg-red-500/[0.08] px-4 py-3 text-sm text-red-200/90 backdrop-blur-sm">
            {error}
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                loadData();
              }}
              className="ms-3 underline"
            >
              {t("Retry")}
            </button>
          </div>
        )}

        {status && !loading && (
          <>
            <VipProgressHero status={status} />
            <VipLevelsTable status={status} />
            <VipLevelUpBonusCards status={status} onClaimed={loadData} />
          </>
        )}
      </div>
    </ContentWrapper>
  );
}
