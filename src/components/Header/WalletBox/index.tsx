import { userState } from "@/state/userState";
import { depositDialogState } from "@/state/depositDialogState";
import { currencyState } from "@/state/currencyState";
import { CURRENCY_LIST } from "@/config/constants";
import { Plus, ChevronDown } from "lucide-preact";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/common/Dropdown";

export default function WalletBox() {
  const handleDepositClick = (e: Event) => {
    e.stopPropagation();
    depositDialogState.value = {
      isOpen: true,
      defaultTab: "Deposit",
    };
  };

  return (
    <div className="flex flex-row max-w-[100px] max-h-[500px] gap-2 items-center select-none bg-[var(--bar-background-color)] rounded-full px-3 py-2 transition-all duration-300">
      {userState.value?.role === "NORMAL" && (
        <button
          onClick={handleDepositClick}
          className="w-[20px] h-[20px] rounded-full bg-[var(--primary-color)] flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
          aria-label="Deposit"
        >
          <Plus size={14} color="white" />
        </button>
      )}
      <Dropdown backdrop="blur" className="max-h-[500px] overflow-y-auto bg-[var(--bar-background-color)]">
        <DropdownTrigger>
          <div className="flex items-center gap-1 cursor-pointer hover:opacity-90 transition-opacity">
            <span className="text-[12px] font-bold md:text-[14px] text-white">
              {currencyState.value.symbol}
              {(
                userState.value?.cashDetails?.find(
                  (c) => c.currency === currencyState.value.unit
                )?.amount || 0
              ).toFixed(2)}
            </span>
            <ChevronDown size={14} color="white" />
          </div>
        </DropdownTrigger>
        <DropdownMenu aria-label="Select Currency" align="end">
          {CURRENCY_LIST.map((currency) => (
            <DropdownItem
              key={currency.unit}
              value={currency.unit}
              onPress={() => {
                currencyState.value = currency;
                window.localStorage.setItem(
                  "currency",
                  JSON.stringify(currency)
                );
              }}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold">{currency.symbol}</span>
                <span>
                  {(
                    userState.value?.cashDetails?.find(
                      (c) => c.currency === currency.unit
                    )?.amount || 0
                  ).toFixed(2)}
                </span>
              </div>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
