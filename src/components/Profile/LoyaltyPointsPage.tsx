import { Info } from "lucide-preact";
import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";

const VIPLevel = [
  {
    level: 0,
    name: "Bronze",
    points: 0,
    logo: "/images/vip/bronze.png",
  },
  {
    level: 1,
    name: "Silver",
    points: 20001,
    logo: "/images/vip/silver.png",
  },
  {
    level: 2,
    name: "Gold",
    points: 100001,
    logo: "/images/vip/gold.png",
  },
  {
    level: 3,
    name: "Platin",
    points: 500001,
    logo: "/images/vip/platin.png",
  },
  {
    level: 4,
    name: "Diamond",
    points: 1000001,
    logo: "/images/vip/diamond.png",
  },
]

type VIP = typeof VIPLevel[number];

const getVIPLevel = (points: number): VIP => {
  // Return the highest level whose threshold is <= points (nearest below or equal)
  for (let i = VIPLevel.length - 1; i >= 0; i--) {
    if (points >= VIPLevel[i].points) return VIPLevel[i];
  }
  // Fallback (in case of negative points)
  return VIPLevel[0];
};

const getNextLevel = (points: number): VIP | null => {
  const current = getVIPLevel(points);
  const idx = VIPLevel.findIndex(l => l.level === current.level);
  return VIPLevel[idx + 1] ?? null; // null if already at top level
};

const LoyaltyPointsPage = () => {
  const t = useTranslations("LoyaltyPoints");
  const vipLevel = getVIPLevel(userState.value?.vipLevel || 0);
  const nextLevel = getNextLevel(userState.value?.vipLevel || 0);

  return (
    <div className="flex flex-col h-full">
      <div className="w-full p-5 boder-b border-[#FFFFFF1A] bg-[#FFFFFF1A]">{t("Loyalty Points")}</div>
      <div className="flex flex-col p-5 gap-5">
        <div className="w-full p-5 flex-1 flex flex-col gap-3 bg-[#FFFFFF0D] p-5 rounded-sm">
          <div className="flex flex-row gap-3">
            <div>
              <img src={vipLevel.logo} />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <span className="text-[22px] text-[#FFFFFFCC]">{t(vipLevel.name)}</span>
              <span className="text-[14px] text-[#A3906F]">{t("Your Current Plan")}</span>
              <div className="flex flex-row md:grid md:grid-cols-3 w-full">
                <div className="flex flex-row justify-between gap-1 pr-3 border-r-2 border-[#FFFFFF1C]">
                  <span className="text-[14px] text-[#FFFFFFCC]">{t("Next Status Update")}</span>
                  <span className="text-[14px] text-[#FFFFFFCC]">{t(nextLevel?.name || "")}</span>
                </div>
                <div className="flex flex-row justify-between gap-1 px-3 border-r-2 border-[#FFFFFF1C]">
                  <span className="text-[14px] text-[#FFFFFFCC]">{t("Total Points")}</span>
                  <span className="text-[14px] text-[#FFFFFFCC]">{userState.value?.vipLevel || 0}</span>
                </div>
                <div className="flex flex-col gap-1 pl-3">
                  <div className="flex flex-row justify-between items-center gap-1">
                    <span className="text-[14px] text-[#FFFFFFCC]">{t("All Time")}</span>
                    <span className="text-[14px] text-[#FFFFFFCC]">0</span>
                  </div>
                  <div className="flex flex-row justify-between items-center gap-1">
                    <span className="text-[14px] text-[#FFFFFFCC]">{t("Exchangable")}</span>
                    <span className="text-[14px] text-[#FFFFFFCC]">0</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-between gap-3 py-7">
                <button className="border border-[#FFFFFF99] text-[16px] px-5 py-1 uppercase hover:bg-[#FFFFFF26] hover:text-[#FFFFFF] transition-all duration-300 text-[#FFFFFFE5] px-[20px] rounded-sm text-[12px]">
                  {t("Exchange")}
                </button>
                <button className="border border-[#FFFFFF99]  text-[16px] flex flex-row items-center gap-3 px-5 py-1 uppercase hover:bg-[#FFFFFF26] hover:text-[#FFFFFF] transition-all duration-300 text-[#FFFFFFE5] px-[20px] rounded-sm text-[12px]">
                  {t("what_is_a_loyalty_point_title")} <Info size={16} color="#FFFFFFE5" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col  gap-1">
            <div className="flex flex-row justify-between">
              <span className="text-[14px] leading-[150%] bg-[#A3906F] px-[8px] rounded-sm text-black">0</span>
              <span className="text-[14px] leading-[150%] bg-[#A3906F] px-[8px] rounded-sm text-black">{nextLevel?.points} points to {t(nextLevel?.name || "")}</span>
            </div>
            <div className="flex flex-row bg-[#FFFFFF0D] h-[5px] rounded-sm">
              <div className={`bg-[#A3906F] h-[5px] rounded-sm w-[${userState.value?.vipLevel ? userState.value?.vipLevel / (nextLevel?.points || 0) : 0}%]`}></div>
            </div>
            <div className="flex flex-row justify-between">
              <span className="text-[14px] text-[#FFFFFF80]">{userState.value?.vipLevel || 0}</span>
              <span className="text-[14px] text-[#FFFFFF80]">1000001</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-5 gap-2">
          {
            VIPLevel.map((level) => (
              <div className="flex flex-col  items-center justify-center bg-gradient-to-b from-black/0 to-black/50 bg-[#FFFFFF0D] p-5 rounded-sm">
                <img src={level.logo} className="w-[65px] object-cover pb-3" />
                <span className="text-[18px] text-[#FFFFFFCC] mt-auto">{t(level.name)}</span>
                <span className="text-[14px] text-[#A3906F]">{level.points}+/Month</span>
              </div>
            ))
          }
        </div>
      </div>

    </div>
  )
}

export default LoyaltyPointsPage;