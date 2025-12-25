import { useState } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { vipData } from "@/config/vipData";
import { ChevronUp, ChevronDown, Star, Info } from "lucide-preact";
import { BASE_URL } from "@/config/constants";
import VipCard from "./VipCard";

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
      icon: <Star className="w-4 h-4" strokeWidth={2} fill="none" stroke="#D7B689" />,
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
      icon: <Star className="w-4 h-4" strokeWidth={2} fill="none" stroke="#CECECE" />,
      benefits: [
        t("Bonus from Support in currency of your choice"),
        t("Monthly bonus increased")
      ]
    },
    {
      name: "Gold",
      level: 3,
      icon: <Star className="w-4 h-4" fill="none" stroke="#D7B689" />,
      benefits: [
        t("Bonus from Support in currency of your choice"),
        t("Monthly bonus increased")
      ]
    },
    {
      name: "Platinum I - III",
      level: 4,
      icon: <img src={`${BASE_URL}/images/icons/platinum1.png`} alt="platinum" className="w-4 h-4" />,
      benefits: [
        t("Bonus from Support in currency of your choice"),
        t("Monthly bonus increased"),
        t("14 - 42 day, daily bonus (Reload)")
      ]
    },
    {
      name: "Platinum IV - VI",
      level: 5,
      icon: <img src={`${BASE_URL}/images/icons/platinum4.png`} alt="platinum" className="w-4 h-4" />,
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
      icon: <img src={`${BASE_URL}/images/icons/diamond.png`} alt="diamond" className="w-4 h-4" />,
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
      <VipCard />

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
                  {tier.benefits && tier.benefits.length > 0 && (
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
            className="flex items-center justify-between p-4 transition-colors"
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
                  {t("VIP Hosts cater to your needs and ensure your time at Betalarab is safe, entertaining and rewarding. Enjoy:")}
                </p>

                <ul className="flex flex-col gap-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-white/70 text-[14px]">{t("Your personal point of contact at Betalarab")}</span>
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
          {t("Learn more about being a Betalarab VIP")}
        </button>
      </div>
    </div>
  );
};

export default Overview;
