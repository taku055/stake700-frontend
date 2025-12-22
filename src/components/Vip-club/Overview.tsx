import { useState } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { vipData } from "@/config/vipData";
import { ChevronUp, ChevronDown, Star, Info } from "lucide-preact";

const Overview = () => {
  const t = useTranslations("VipClub");
  const [vipBenefitsExpanded, setVipBenefitsExpanded] = useState(true);
  const [vipHostExpanded, setVipHostExpanded] = useState(false);

  const user = userState.value;
  const currentVipLevel = user?.vipLevel || 0;
  const wagered = user?.wagered || 0;
  const username = user?.userName || "Guest";

  // Get current and next VIP level
  const currentLevelData = vipData.find(v => v.level === currentVipLevel) || vipData[0];
  const nextLevelData = vipData.find(v => v.level === currentVipLevel + 1);

  // Calculate progress percentage
  const progressPercentage = nextLevelData
    ? ((wagered / nextLevelData.wagerAmount) * 100).toFixed(2)
    : 0;

  // VIP Benefits tiers data (based on images)
  const vipBenefitsTiers = [
    {
      name: "Bronze",
      level: 1,
      icon: <Star className="w-4 h-4" strokeWidth={2} fill="none" stroke="white" />,
      benefits: [
        t("Bonus from Support in currency of your choice"),
        t("Rakeback enabled"),
        t("Weekly bonuses"),
        t("Monthly bonuses"),
        t("VIP Telegram channel access")
      ]
    },
    {
      name: "Silver",
      level: 2,
      icon: <Star className="w-4 h-4" strokeWidth={2} fill="none" stroke="white" />,
      benefits: [
        t("Bonus from Support in currency of your choice"),
        t("Monthly bonus increased")
      ]
    },
    {
      name: "Gold",
      level: 3,
      icon: <Star className="w-4 h-4" fill="#FDCB35" stroke="#FDCB35" />,
      benefits: [
        t("Bonus from Support in currency of your choice"),
        t("Monthly bonus increased")
      ]
    },
    {
      name: "Platinum I - III",
      level: 4,
      icon: <Star className="w-4 h-4" fill="#59B0F3" stroke="#59B0F3" />,
      benefits: [
        t("Bonus from Support in currency of your choice"),
        t("Monthly bonus increased"),
        t("14 - 42 day, daily bonus (Reload)")
      ]
    },
    {
      name: "Platinum IV - VI",
      level: 5,
      icon: <Star className="w-4 h-4" fill="#59B0F3" stroke="#59B0F3" />,
      benefits: [
        t("Dedicated VIP host"),
        t("Unlimited Reloads while maintaining a VIP host"),
        t("Bonus from VIP host in currency of your choice"),
        t("Weekly & monthly bonuses increased")
      ]
    },
    {
      name: "Diamond I - V",
      level: 6,
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <path d="M8 0L10.5 5.5L16 8L10.5 10.5L8 16L5.5 10.5L0 8L5.5 5.5L8 0Z" fill="#AE8BFA" />
        </svg>
      ),
      benefits: [
        t("Bonus from VIP host in currency of your choice"),
        t("Exclusively customised benefits"),
        t("Weekly & monthly bonuses increased")
      ]
    }
  ];

  return (
    <div className="flex flex-col py-4 gap-4">
      {/* VIP Progress Section */}
      <div className="flex flex-col items-center justify-center gap-3 p-4 bg-[var(--background-secondary)]">
        <div className="flex flex-col gap-3 p-4 w-[384px] h-[216px] rounded-lg bg-[var(--green-color)]">
          <div className="flex items-center justify-between">
            <span className="text-white text-[16px] font-medium">{username}</span>
            <Star className="w-5 h-5 text-[var(--bar-background-color)]" strokeWidth={2} fill="none" stroke="black" />
          </div>

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
              <span className="text-[var(--bar-background-color)] text-[14px]">{currentVipLevel === 0 ? t("None") : currentLevelData.vipTitle}</span>
            </div>
            {nextLevelData && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" strokeWidth={2} fill="none" stroke="black" />
                <span className="text-[var(--bar-background-color)] text-[14px]">{nextLevelData.vipTitle}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full px-4 items-center justify-center gap-[10px]">
        {/* VIP Benefits Section */}
        <div className="flex flex-col w-full bg-[var(--background-secondary)] rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setVipBenefitsExpanded(!vipBenefitsExpanded)}
            className="flex items-center justify-between p-4 hover:bg-[var(--background-secondary)] transition-colors"
          >
            <h3 className="text-white text-[16px] font-medium">{t("VIP Benefits")}</h3>
            {vipBenefitsExpanded ? (
              <ChevronUp className="w-5 h-5 text-white/60" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white/60" />
            )}
          </button>

          {vipBenefitsExpanded && (
            <div className="px-4 pb-4 flex flex-col gap-4 border-t border-[#FFFFFF0A]">
              {vipBenefitsTiers.map((tier, index) => (
                <div key={tier.level} className={index > 0 ? "border-t border-[#FFFFFF0A] pt-4" : "pt-2"}>
                  <div className="flex items-center gap-2 mb-2">
                    {tier.icon}
                    <span className="text-white text-[14px] font-medium">{tier.name}</span>
                  </div>
                  {tier.benefits.length > 0 && (
                    <ul className="list-disc list-inside ml-6 flex flex-col gap-1">
                      {tier.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-white/70 text-[14px]">{benefit}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* VIP Host Section */}
        <div className="flex flex-col w-full bg-[var(--background-text-box)] rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setVipHostExpanded(!vipHostExpanded)}
            className="flex items-center justify-between p-4 hover:bg-[var(--background-secondary)] transition-colors"
          >
            <h3 className="text-white text-[16px] font-medium">{t("VIP Host")}</h3>
            {vipHostExpanded ? (
              <ChevronUp className="w-5 h-5 text-white/60" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white/60" />
            )}
          </button>

          {vipHostExpanded && (
            <div className="px-4 pb-4 flex flex-col gap-3 border-t border-[#FFFFFF0A] pt-4">
              <p className="text-white/70 text-[14px] leading-[20px]">
                {t("Reach Platinum IV or above and receive your own dedicated VIP host who will support and cater to your betting needs.")}
              </p>

              <div className="flex flex-col gap-2">
                <h4 className="text-white text-[14px] font-medium">{t("VIP Host benefits")}</h4>
                <p className="text-white/70 text-[14px] leading-[20px]">
                  {t("VIP Hosts cater to your needs and ensure your time at Stake is safe, entertaining and rewarding. Enjoy:")}
                </p>

                <ul className="flex flex-col gap-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-white/70 text-[14px]">{t("Your personal point of contact at Stake")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white/70 text-[14px]">{t("Tailored bonuses and sports betting limits")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white/70 text-[14px]">{t("Insight into gameplay statistics")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white/70 text-[14px]">{t("Exclusive promotions and events")}</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
        <button className="text-[#FFFFFF] text-[14px] font-medium hover:underline py-4 text-left">
          {t("Learn more about being a Stake VIP")}
        </button>
      </div>
    </div>
  );
};

export default Overview;
