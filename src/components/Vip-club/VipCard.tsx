import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { vipData } from "@/config/vipData";
import { Star, Info } from "lucide-preact";


export default function VipCard() {

  const t = useTranslations("VipClub");

  const user = userState.value;
  const currentVipLevel = user?.vipLevel || 0;
  const wagered = user?.wagered || 0;
  const username = user?.userName || t("Guest");

  // Get current and next VIP level
  const currentLevelData = vipData.find(v => v.level === currentVipLevel) || vipData[0];
  const nextLevelData = vipData.find(v => v.level === currentVipLevel + 1);

  // Calculate progress percentage
  const progressPercentage = nextLevelData
    ? ((wagered / nextLevelData.wagerAmount) * 100).toFixed(2)
    : 0;


  return (
    <div className="flex flex-col items-center justify-center gap-3 p-4 md:px-0 w-full bg-[var(--background-secondary)]">
      <div className="flex flex-col gap-3 items-between justify-between w-full md:w-[380px] h-[216px] py-5 px-6 rounded-lg bg-[var(--green-color)]">
        <div className="flex items-center justify-between pb-6">
          <span className="text-white text-[16px] font-medium">{username}</span>
          <Star className="w-5 h-5 text-[var(--bar-background-color)]" strokeWidth={2} fill="none" stroke="black" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-white text-[14px]">{t("Your VIP Progress")}</span>
            <div className="flex items-center gap-1">
              <span className="text-white text-[14px] font-medium">{progressPercentage}%</span>
              <Info className="w-4 h-4 text-[var(--bar-background-color)]" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-[var(--bar-background-color)] rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${Math.min(Number(progressPercentage), 100)}%` }}
            />
          </div>

          {/* Current and Next VIP Levels */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" strokeWidth={2} fill="none" stroke="black" />
              <span className="text-[var(--bar-background-color)] text-[14px]">{currentVipLevel === 0 ? t("None") : t(currentLevelData.vipTitle)}</span>
            </div>
            {nextLevelData && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" strokeWidth={2} fill="none" stroke="black" />
                <span className="text-[var(--bar-background-color)] text-[14px]">{t(nextLevelData.vipTitle)}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}