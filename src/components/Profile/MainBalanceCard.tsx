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
    <div className="w-full flex flex-col p-4 gap-3 rounded-lg bg-[#213743]">
      <div className="flex flex-row justify-between items-start">
        <div className="flex flex-col gap-1">
          <span className="text-[#b1bad3] text-xs font-medium">
            {t("Main Balance")}
          </span>
          {hasAnyBalance ? (
            <div className="flex flex-col gap-0.5">
              {nonZeroBalances.map((cur) => {
                const cash = Number(balances[cur.code]?.cash?.balance ?? 0);
                return (
                  <span
                    key={cur.code}
                    className="text-white text-lg font-semibold leading-tight"
                  >
                    {isBalanceVisible
                      ? `${cash.toFixed(2)} ${cur.symbol}`
                      : `${BALANCE_MASK} ${cur.symbol}`}
                  </span>
                );
              })}
            </div>
          ) : (
            <span className="text-white text-lg font-semibold leading-tight">
              {isBalanceVisible
                ? `0.00 ${currencyState.value.symbol}`
                : `${BALANCE_MASK} ${currencyState.value.symbol}`}
            </span>
          )}
        </div>
        <button
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded-md bg-[#2f4553] text-[#b1bad3] hover:text-white transition-colors"
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
          className="flex flex-row rounded-md py-2 gap-2 justify-center items-center text-sm font-semibold text-white bg-[#1475e1] hover:bg-[#0f62c2] transition-colors"
        >
          <Wallet size={16} /> <span>{t("Deposit")}</span>
        </button>
        <button
          onClick={onWithdrawClick}
          className="flex flex-row rounded-md py-2 gap-2 justify-center items-center text-sm font-semibold text-white bg-[#2f4553] hover:bg-[#3d5564] transition-colors"
        >
          <BanknoteArrowDown size={16} /> <span>{t("Withdraw")}</span>
        </button>
      </div>
    </div>
  );
};

export default MainBalanceCard;
