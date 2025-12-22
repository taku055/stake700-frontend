import { userState } from "@/state/userState";
import { walletDialogOpenedState } from "@/state/registerOpenedState";
import { currencyState } from "@/state/currencyState";
import { CURRENCY_LIST } from "@/config/constants";
import { ChevronDown } from "lucide-preact";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/common/Dropdown";
import { useTranslations } from "@/context/I18nContext";

export default function WalletBox() {
  const t = useTranslations("Header");
  const balance = (
    userState.value?.cashDetails?.find(
      (c) => c.currency === currencyState.value.unit
    )?.amount || 0
  );

  const handleWalletClick = () => {
    walletDialogOpenedState.value = true;
  };

  return (
    <div className="flex items-center h-[48px] bg-[var(--bar-background-color)] rounded-lg overflow-hidden">
      {/* Balance and Currency Dropdown */}
      <Dropdown backdrop="blur" className="flex h-[full] w-[184px] justify-center items-center py-3 px-5 overflow-y-auto bg-[var(--bar-background-color)]">
        <DropdownTrigger>
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
            {/* Balance Amount */}
            <span className="text-white text-[14px] font-medium">
              {balance.toFixed(8)}
            </span>
            
            {/* Currency Icon (Orange Circle with Bitcoin Symbol) */}
            <div className="w-6 h-6 rounded-full bg-[#FF9500] flex items-center justify-center">
              <span className="text-white text-[12px] font-bold">₿</span>
            </div>
            
            {/* Dropdown Chevron */}
            <ChevronDown size={14} color="white" />
          </div>
        </DropdownTrigger>
        <DropdownMenu aria-label={t("Select Currency")} align="end">
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

      {/* Wallet Button */}
      <button
        onClick={handleWalletClick}
        className="px-4 py-2 h-full w-[85px] bg-[var(--green-color)] text-white font-medium text-[14px] hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        {t("Wallet")}
      </button>
    </div>
  );
}