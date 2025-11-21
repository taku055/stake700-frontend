import { userState } from "@/state/userState";
import { depositDialogState } from "@/state/depositDialogState";
import { DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";
import { Plus } from "lucide-preact";

export default function WalletBox() {
  const handleDepositClick = (e: Event) => {
    e.stopPropagation();
    depositDialogState.value = {
      isOpen: true,
      defaultTab: "Deposit",
    };
  };

  return (
    <div className="flex flex-row gap-2 items-center select-none bg-[var(--bar-background-color)] rounded-full px-3 py-2 transition-all duration-300">
      <button
        onClick={handleDepositClick}
        className="w-[20px] h-[20px] rounded-full bg-[var(--primary-color)] flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
        aria-label="Deposit"
      >
        <Plus size={14} color="white" />
      </button>
      <span className="text-[12px] font-bold md:text-[14px] text-white">
        {DEFAULT_CURRENCY_SYMBOL}
        {(
          parseFloat(userState.value?.cash?.toFixed(2) || "0.00") +
          parseFloat(
            userState.value?.PromotionInstance?.bonus?.toFixed(2) || "0.00"
          )
        ).toFixed(2)}
      </span>
    </div>
  );
}
