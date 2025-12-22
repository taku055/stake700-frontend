import { useState } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { ChevronUp, ChevronDown, Lock } from "lucide-preact";
import { VNode } from "preact";

interface IReward {
  id: string;
  title: string;
  shortDescription?: string;
  detailedDescription?: string;
  unlockCondition?: string;
  unlockedAtLevel: number;
  icon: VNode;
}

const Rewards = () => {
  const t = useTranslations("VipClub");
  const [expandedReward, setExpandedReward] = useState<string | null>("monthly-bonus");

  const user = userState.value;
  const currentVipLevel = user?.vipLevel || 0;

  const rewards: IReward[] = [
    {
      id: "monthly-bonus",
      title: t("Monthly Bonus"),
      shortDescription: t("Released once a month."),
      detailedDescription: t("The Monthly Bonus is randomly released. Eligible players will be notified via email. Your bonus is based on your game play throughout the month. The more you play, the bigger the bonus."),
      unlockedAtLevel: 0,
      icon: (
        <img src="/images/icons/others/monthly.png" alt="monthly-bonus" className="w-[55px] h-[64px]" />
      )
    },
    {
      id: "rakeback",
      title: t("Rakeback"),
      shortDescription: "",
      unlockCondition: t("Unlocked at Bronze VIP."),
      unlockedAtLevel: 1,
      icon: (
        <img src="/images/icons/others/rakeback.png" alt="rakeback" className="w-[55px] h-[64px]" />
      )
    },
    {
      id: "weekly-boost",
      title: t("Weekly Boost"),
      shortDescription: "",
      unlockCondition: t("Unlocked at Bronze VIP."),
      unlockedAtLevel: 1,
      icon: (
        <img src="/images/icons/others/weekly-boost.png" alt="weekly-boost" className="w-[55px] h-[64px]" />
      )
    },
    {
      id: "reload",
      title: t("Reload"),
      shortDescription: "",
      unlockCondition: t("Unlocked at Platinum VIP."),
      unlockedAtLevel: 4,
      icon: (
        <img src="/images/icons/others/reload.png" alt="reload" className="w-[55px] h-[64px]" />
      )
    }
  ];

  const isUnlocked = (reward: IReward) => {
    return currentVipLevel >= reward.unlockedAtLevel;
  };

  const toggleReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return;

    // Only allow expansion if unlocked or if it's already expanded
    if (isUnlocked(reward) || expandedReward === rewardId) {
      setExpandedReward(expandedReward === rewardId ? null : rewardId);
    }
  };

  return (
    <div className="flex flex-col p-6 gap-3">
      {rewards.map((reward) => {
        const unlocked = isUnlocked(reward);
        const isExpanded = expandedReward === reward.id;
        const canExpand = unlocked;

        return (
          <div
            key={reward.id}
            className="flex flex-col bg-[var(--background-secondary)] rounded-lg overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleReward(reward.id)}
              disabled={!canExpand && !isExpanded}
              className={`flex items-center gap-3 p-4 transition-colors ${!canExpand && !isExpanded ? "cursor-not-allowed" : "cursor-pointer"
                }`}
            >
              {/* Icon */}
              <div className="shrink-0">
                {reward.icon}
              </div>

              {/* Title and Description */}
              <div className="flex-1 flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-white text-[16px] font-medium">{reward.title}</span>
                </div>
                {reward.shortDescription && (
                  <span className="text-white text-[14px]">{reward.shortDescription}</span>
                )}
                {reward.unlockCondition && !unlocked && (
                  <span className="text-white text-[14px]">{reward.unlockCondition}</span>
                )}
              </div>
              {!unlocked && (
                <Lock className="w-4 h-4" />
              )}

              {/* Expand/Collapse Icon */}
              {canExpand && (
                <div className="shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-white" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white" />
                  )}
                </div>
              )}
            </button>
            {/* Expanded Content */}
            {isExpanded && reward.detailedDescription && (
              <div className="mx-4 pb-4 pt-4 border-t-[2px] border-t-[var(--bar-background-color)] border-b-0 border-l-0 border-r-0">
                <p className="text-white text-[14px] leading-[20px]">
                  {reward.detailedDescription}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Rewards;