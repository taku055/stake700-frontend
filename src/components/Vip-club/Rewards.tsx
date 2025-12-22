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
        <div className="w-12 h-12 rounded-lg bg-[#1E3A5F] flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#FF9500" strokeWidth="2" fill="none" />
          </svg>
        </div>
      )
    },
    {
      id: "rakeback",
      title: t("Rakeback"),
      shortDescription: "",
      unlockCondition: t("Unlocked at Bronze VIP."),
      unlockedAtLevel: 1,
      icon: (
        <div className="w-12 h-12 rounded-lg bg-[#2B3344] flex items-center justify-center">
          <ChevronUp className="w-6 h-6 text-white" />
        </div>
      )
    },
    {
      id: "weekly-boost",
      title: t("Weekly Boost"),
      shortDescription: "",
      unlockCondition: t("Unlocked at Bronze VIP."),
      unlockedAtLevel: 1,
      icon: (
        <div className="w-12 h-12 rounded-lg bg-[#2B3344] flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill="none" stroke="white" strokeWidth="2" />
          </svg>
        </div>
      )
    },
    {
      id: "reload",
      title: t("Reload"),
      shortDescription: "",
      unlockCondition: t("Unlocked at Platinum VIP."),
      unlockedAtLevel: 4,
      icon: (
        <div className="w-12 h-12 rounded-lg bg-[#2B3344] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="4" y="6" width="12" height="8" rx="1" stroke="white" strokeWidth="2" fill="none" />
            <rect x="6" y="9" width="2" height="4" fill="white" />
            <rect x="9" y="9" width="2" height="4" fill="white" />
            <rect x="12" y="9" width="2" height="4" fill="white" />
            <path d="M7 6V4C7 2.89543 7.89543 2 9 2H11C12.1046 2 13 2.89543 13 4V6" stroke="white" strokeWidth="2" />
          </svg>
        </div>
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
              className={`flex items-center gap-3 p-4 transition-colors ${!canExpand && !isExpanded ? "cursor-not-allowed opacity-60" : "cursor-pointer"
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
                  {!unlocked && (
                    <Lock className="w-4 h-4 text-white/60" />
                  )}
                </div>
                {reward.shortDescription && (
                  <span className="text-white text-[14px]">{reward.shortDescription}</span>
                )}
                {reward.unlockCondition && !unlocked && (
                  <span className="text-white text-[14px]">{reward.unlockCondition}</span>
                )}
              </div>

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