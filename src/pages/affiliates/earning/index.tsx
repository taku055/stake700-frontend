import { userState } from "@/state/userState";
import RewardCard from "../RewardCard";
import { tRewardResponse } from "@/types/tRewardResponse";
import { apiGetCalculatedReward } from "@/api/referral/apiGetCalculatedReward";
import { Button } from "@heroui/react";
import { toast } from "@/helpers/toast";
import {
  apiGetDailyReferralBonus,
  tDailyReferralBonus,
} from "@/api/referral/apiGetDailyReferralBonus";
import {
  apiGetMonthlyReferralBonus,
  tMonthlyReferralBonus,
} from "@/api/referral/apiGetMonthlyReferralBonus";
import { apiClaimDailyReferralBonus } from "@/api/referral/apiClaimDailyReferralBonus";
import { apiClaimMonthlyReferralBonus } from "@/api/referral/apiClaimMonthlyReferralBonus";
import { useTranslations } from "@/context/I18nContext";
import { useState, useEffect } from "preact/hooks";
import { DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";

export default function Earning() {
  const [, setReward] = useState<tRewardResponse>();
  const [loading, setLoading] = useState(false);
  const [dailyReferralBonus, setDailyReferralBonus] =
    useState<tDailyReferralBonus>({ totalCount: 0, totalBonus: 0 });
  const [monthlyReferralBonus, setMonthlyReferralBonus] =
    useState<tMonthlyReferralBonus>({ totalCount: 0, totalBonus: 0 });
  const t = useTranslations("Affiliate");
  const toastT = useTranslations("ToastMessages");

  useEffect(() => {
    if (userState.value?.id) {
      (async () => {
        try {
          const reward1 = await apiGetCalculatedReward();
          setReward(reward1);

          const [dailyBonus, monthlyBonus] = await Promise.all([
            apiGetDailyReferralBonus(),
            apiGetMonthlyReferralBonus(),
          ]);
          setDailyReferralBonus(dailyBonus);
          setMonthlyReferralBonus(monthlyBonus);
        } catch (ex) {
          console.error(ex);
        }
      })();
    }
  }, [userState.value?.id]);

  const onClaimDailyBonus = async () => {
    if (!userState.value?.id) {
      toast.error(toastT("error.login_claim_bonus"));
      return;
    }

    if (dailyReferralBonus.totalCount === 0) {
      toast.error(toastT("error.no_daily_bonus"));
      return;
    }
    if (dailyReferralBonus.totalBonus <= 0) {
      toast.error(toastT("error.no_daily_bonus"));
      return;
    }

    setLoading(true);

    try {
      const res = await apiClaimDailyReferralBonus();
      if (!res) {
        toast.error(toastT("error.something_wrong"));
        setLoading(false);
        return;
      }

      if (!res.user) {
        toast.error(res.message);
        setLoading(false);
        return;
      }

      userState.value = {
        ...userState.value,
        cash: res.user?.cash || 0,
        bonus: res.user?.bonus || 0,
        locked: res.user?.locked || 0,
      };

      setDailyReferralBonus({ totalBonus: 0, totalCount: 0 });
    } catch (ex) {
      toast.error(toastT("error.something_wrong"));
    }
    setLoading(false);
  };

  const onClaimMonthlyBonus = async () => {
    if (!userState.value?.id) {
      toast.error(toastT("error.login_claim_bonus"));
      return;
    }

    if (monthlyReferralBonus.totalCount === 0) {
      toast.error(toastT("error.no_monthly_bonus"));
      return;
    }
    if (monthlyReferralBonus.totalBonus <= 0) {
      toast.error(toastT("error.no_monthly_bonus"));
      return;
    }
    setLoading(true);

    try {
      const res = await apiClaimMonthlyReferralBonus(); // Assuming the same API is used for monthly bonus
      if (!res) {
        toast.error(toastT("error.something_wrong"));
        setLoading(false);
        return;
      }

      if (!res.user) {
        toast.error(res.message);
        setLoading(false);
        return;
      }

      userState.value = {
        ...userState.value,
        cash: res.user?.cash || 0,
        bonus: res.user?.bonus || 0,
        locked: res.user?.locked || 0,
      };

      setMonthlyReferralBonus({ totalBonus: 0, totalCount: 0 });
    } catch (ex) {
      toast.error(toastT("error.something_wrong"));
    }
    setLoading(false);
  };

  return (
    <div className={`w-full md:p-[24px] flex flex-col gap-[16px]`}>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-[18px]">
        <RewardCard
          title="Total Reward"
          value={
            (
              (dailyReferralBonus.totalBonus || 0) +
              (monthlyReferralBonus.totalBonus || 0)
            ).toFixed(2) + " " + DEFAULT_CURRENCY_SYMBOL
          }
          color="var(--primary-color)"
        />
        <RewardCard
          title="Daily Reward"
          value={(dailyReferralBonus.totalBonus || 0).toFixed(2) + " " + DEFAULT_CURRENCY_SYMBOL}
          color="var(--primary-color)"
        />
        <RewardCard
          title="Monthly Reward"
          value={(monthlyReferralBonus.totalBonus || 0).toFixed(2) + " " + DEFAULT_CURRENCY_SYMBOL}
          color="var(--primary-color)"
        />
      </div>
      {userState.value?.id && !userState.value?.isAgent && (
        <div className="flex gap-2 justify-end">
          <Button
            className="bg-[var(--primary-color)] text-[#0B0E1D] text-[14px] font-bold rounded-full flex items-center pt-[4px] w-full md:w-[200px]"
            onClick={onClaimDailyBonus}
            isLoading={loading}
          >
            {t("Claim Daily Bonus")}
          </Button>
          <Button
            className="bg-[var(--primary-color)] text-[#0B0E1D] text-[14px] font-bold rounded-full flex items-center pt-[4px] w-full md:w-[200px]"
            onClick={onClaimMonthlyBonus}
            isLoading={loading}
          >
            {t("Claim Monthly Bonus")}
          </Button>
        </div>
      )}
    </div>
  );
}
