import { userState } from "@/state/userState";
import PromotionBox from "./PromotionBox";
import RewardCard from "../RewardCard";
import RewardGuideCard from "./RewardGuideCard";
import { FaAngleDoubleDown, FaAngleDoubleRight } from "react-icons/fa";
import { mobileMediaQuery, DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";
import { useMediaQuery } from "usehooks-ts";
import {
  apiGetReferredUsersCount,
  tReferredUsersTotal,
} from "@/api/referral/apiGetReferredUsersCount";
import { useTranslations } from "@/context/I18nContext";
import { useState, useEffect } from "preact/hooks";

export default function Overview() {
  const isMobile = useMediaQuery(mobileMediaQuery);
  const [total, setTotal] = useState<tReferredUsersTotal>({
    userCount: 0,
    totalDailyBonus: 0,
    totalMonthlyBonus: 0,
    totalBonus: 0,
  });
  const t = useTranslations("Affiliate");

  useEffect(() => {
    if (userState.value?.id) {
      (async () => {
        try {
          const total1 = await apiGetReferredUsersCount();
          setTotal(total1);
        } catch (ex) {
          console.error(ex);
        }
      })();
    }
  }, [userState.value?.id]);

  return (
    <div className="w-full md:p-[24px]">
      <PromotionBox />
      <div className="grid md:grid-cols-4 grid-cols-1 gap-[18px] mt-[27px]">
        <RewardCard
          title="Total referrals"
          value={(total.userCount || 0).toString()}
          color="#ffffff"
        />
        <RewardCard
          title="Total Reward"
          value={DEFAULT_CURRENCY_SYMBOL + (total.totalBonus || 0).toFixed(2)}
          color="#00cc00"
        />
        <RewardCard
          title="Daily Reward"
          value={DEFAULT_CURRENCY_SYMBOL + (total.totalDailyBonus || 0).toFixed(2)}
          color="#00cc00"
        />
        <RewardCard
          title="Monthly Reward"
          value={DEFAULT_CURRENCY_SYMBOL + (total.totalMonthlyBonus || 0).toFixed(2)}
          color="#00cc00"
        />
      </div>
      <div className="mt-[28px] bg-[#1C202A] border-1 border-[#FFFFFF0A] rounded-[18px] flex flex-col">
        <h2 className="text-[20px] leading-[27px] text-[#ffffff] pt-[22px] pb-[19px] px-[22px] border-b-1 border-[#FFFFFF0A] font-semibold">
          {t("How to Get your Referral Reward")}
        </h2>
        <div className="flex justify-between items-center py-[31px] px-[22px] md:flex-row flex-col md:gap-0 gap-[12px]">
          <RewardGuideCard
            no={1}
            title="Share with friends"
            description="Share your referral link or code with your friends"
          />
          {isMobile ? (
            <FaAngleDoubleDown size={24} color="#2B3344" />
          ) : (
            <FaAngleDoubleRight size={36} color="#2B3344" />
          )}
          <RewardGuideCard
            no={2}
            title="Receive"
            description="Your rewards will be locked until your friends level up"
          />
          {isMobile ? (
            <FaAngleDoubleDown size={24} color="#2B3344" />
          ) : (
            <FaAngleDoubleRight size={36} color="#2B3344" />
          )}
          <RewardGuideCard
            no={3}
            title="Level up and Unlock"
            description="Your friend's VIP level upgrade unlocks your rewards"
          />
        </div>
      </div>
    </div>
  );
}
