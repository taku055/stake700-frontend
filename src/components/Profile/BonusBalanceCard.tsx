import { DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";
import { useTranslations } from "@/context/I18nContext";

const BonusBalanceCard = () => {
  const t = useTranslations("BonusBalanceCard");

  return (
    <div className="w-full flex flex-col px-5 py-3 gap-2 relative bg-[var(--background-secondary)] rounded-sm bg-no-repeat shadow-[0_1px_4px_0_#1B1B1B80]">
      <div className="flex flex-col gap-1 border-b border-white/30 pb-2">
        <span className="text-white text-[14px] leading-[20px]">{t("Total Bonus Balance")} <span className="text-white/50 text-[12px] leading-[18px]">({t("coming soon")})</span></span>
        <span className="text-white text-[20px] leading-[110%]">0.00 {DEFAULT_CURRENCY_SYMBOL}</span>
      </div>
      <div className="flex flex-row justify-between items-center">
        <span>{t("Bonus")}</span>
        <span>0.00 {DEFAULT_CURRENCY_SYMBOL}</span>
      </div>
    </div>
  )
}

export default BonusBalanceCard;