import { userState } from "@/state/userState";
import { BanknoteArrowDown, Eye, EyeOff, Wallet } from "lucide-preact";
import { useTranslations } from "@/context/I18nContext";
import { DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";

interface MainBalanceCardProps {
  onDepositClick?: () => void;
  onWithdrawClick?: () => void;
}
const MainBalanceCard = ({ onDepositClick, onWithdrawClick }: MainBalanceCardProps) => {
  const t = useTranslations("MainBalanceCard");

  return (
    <div className="w-full flex flex-col px-5 py-3 gap-2 relative bg-[var(--background-secondary)] rounded-sm bg-no-repeat shadow-[0_1px_4px_0_#1B1B1B80]">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-1">
          <span className="text-white text-[14px] leading-[20px]">{t("Main Balance")}</span>
          <span className="text-white text-[20px] leading-[110%]">{(
            parseFloat(userState.value?.cash?.toFixed(2) || "0.00") +
            parseFloat(
              userState.value?.PromotionInstance?.bonus?.toFixed(2) || "0.00"
            )
          ).toFixed(2)} {DEFAULT_CURRENCY_SYMBOL}</span>
        </div>
        <button className="flex flex-row items-center rounded-sm p-3 bg-[#FFFFFF40] hover:bg-[#FFFFFF60] transition-all duration-300">
          {true ? <Eye width={16} height={16} /> : <EyeOff width={16} height={16} />}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onDepositClick}
          className="flex flex-row hover:text-white transition-all duration-300 uppercase rounded-md py-2 gap-2 justify-center items-center text-[14px] bg-[#FFFFFF40] hover:bg-[#FFFFFF60]">
          <Wallet /> <span>{t("Deposit")}</span>
        </button>
        <button
          onClick={onWithdrawClick}
          className="flex flex-row hover:text-white transition-all duration-300 uppercase rounded-md py-2 gap-2 justify-center items-center text-[14px] bg-[#FFFFFF40] hover:bg-[#FFFFFF60]">
          <BanknoteArrowDown /> <span>{t("Withdraw")}</span>
        </button>
      </div>
    </div>
  )
}

export default MainBalanceCard;