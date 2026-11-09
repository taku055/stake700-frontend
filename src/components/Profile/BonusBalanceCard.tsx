import { useTranslations } from "@/context/I18nContext";
import { balanceState } from "@/state/balanceState";
import { currencyState } from "@/state/currencyState";

const BonusBalanceCard = (props: { onClick?: () => void }) => {
  const { onClick } = props;
  const t = useTranslations("BonusBalanceCard");

  return (
    <button
      type="button"
      className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-[#213743] text-start"
      onClick={onClick}
    >
      <span className="text-[#b1bad3] text-sm">{t("Total Bonus Balance")}</span>
      <span className="text-white text-sm font-semibold">
        {balanceState.value[currencyState.value.code]?.bonus.balance}{" "}
        {currencyState.value.symbol}
      </span>
    </button>
  );
};

export default BonusBalanceCard;
