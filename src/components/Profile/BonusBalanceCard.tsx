import { useTranslations } from "@/context/I18nContext";
import { balanceState } from "@/state/balanceState";
import { currencyState } from "@/state/currencyState";
import { ASSET_BASE_URL, CURRENCY_LIST } from "@/config/constants";

const BonusBalanceCard = (props: { onClick?: () => void }) => {
  const { onClick } = props;
  const t = useTranslations("BonusBalanceCard");

  return (
    <div
      className="w-full flex flex-col px-5 py-3 gap-2 relative bg-[var(--green-color-transparent)] rounded-sm bg-no-repeat shadow-[0_1px_4px_0_#1B1B1B80]"
      onClick={onClick}
    >
      <div className="flex flex-col gap-1 border-b border-white/30 pb-2">
        <span className="text-white text-[14px] leading-[20px]">
          {t("Total Bonus Balance")}{" "}
        </span>
        <span className="text-white text-[20px] leading-[110%]">
          {balanceState.value[currencyState.value.code]?.bonus.balance}{" "}
          {currencyState.value.symbol}
        </span>
      </div>
      <div className="flex flex-row justify-between items-center">
        <span>{t("Bonus")}</span>
        <span>
          {balanceState.value[currencyState.value.code]?.bonus.balance}{" "}
          {currencyState.value.symbol}
        </span>
      </div>
    </div>
  );
};

export default BonusBalanceCard;
