import { useState } from "preact/hooks";
import { BanknoteArrowDown, Eye, EyeOff, Wallet } from "lucide-preact";
import { useTranslations } from "@/context/I18nContext";
import { balanceState } from "@/state/balanceState";
import { currencyState } from "@/state/currencyState";
import { CURRENCY_LIST } from "@/config/constants";

const BALANCE_MASK = "••••••";

interface MainBalanceCardProps {
  onDepositClick?: () => void;
  onWithdrawClick?: () => void;
}
const MainBalanceCard = ({
  onDepositClick,
  onWithdrawClick,
}: MainBalanceCardProps) => {
  const t = useTranslations("MainBalanceCard");
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const balances = balanceState.value;
  const nonZeroBalances = CURRENCY_LIST.filter((cur) => {
    const cash = Number(balances[cur.code]?.cash?.balance ?? 0);
    return cash > 0;
  });
  const hasAnyBalance = nonZeroBalances.length > 0;

  return (
    <div className="w-full flex flex-col px-5 py-3 gap-2 relative bg-[var(--green-color)] rounded-sm bg-no-repeat shadow-[0_1px_4px_0_#1B1B1B80]">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-1">
          <span className="text-white text-[14px] leading-[20px]">
            {t("Main Balance")}
          </span>
          {hasAnyBalance ? (
            <div className="flex flex-col gap-0.5">
              {nonZeroBalances.map((cur) => {
                const cash = Number(balances[cur.code]?.cash?.balance ?? 0);
                return (
                  <span
                    key={cur.code}
                    className="text-white text-[20px] leading-[110%]"
                  >
                    {isBalanceVisible
                      ? `${cash.toFixed(2)} ${cur.symbol}`
                      : `${BALANCE_MASK} ${cur.symbol}`}
                  </span>
                );
              })}
            </div>
          ) : (
            <span className="text-white text-[20px] leading-[110%]">
              {isBalanceVisible
                ? `0.00 ${currencyState.value.symbol}`
                : `${BALANCE_MASK} ${currencyState.value.symbol}`}
            </span>
          )}
        </div>
        <button
          type="button"
          className="flex flex-row items-center rounded-sm p-3 bg-[#FFFFFF40] hover:bg-[#FFFFFF60] transition-all duration-300"
          onClick={() => setIsBalanceVisible((v) => !v)}
          aria-label={isBalanceVisible ? "Hide balance" : "Show balance"}
        >
          {isBalanceVisible ? (
            <Eye width={16} height={16} />
          ) : (
            <EyeOff width={16} height={16} />
          )}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onDepositClick}
          className="flex flex-row hover:text-white transition-all duration-300 uppercase rounded-md py-2 gap-2 justify-center items-center text-[14px] bg-[#FFFFFF40] hover:bg-[#FFFFFF60]"
        >
          <Wallet /> <span>{t("Deposit")}</span>
        </button>
        <button
          onClick={onWithdrawClick}
          className="flex flex-row hover:text-white transition-all duration-300 uppercase rounded-md py-2 gap-2 justify-center items-center text-[14px] bg-[#FFFFFF40] hover:bg-[#FFFFFF60]"
        >
          <BanknoteArrowDown /> <span>{t("Withdraw")}</span>
        </button>
      </div>
    </div>
  );
};

export default MainBalanceCard;
