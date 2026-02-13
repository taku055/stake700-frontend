import { userState } from "@/state/userState";
import { walletDialogOpenedState } from "@/state/walletDialogState";
import { currencyState } from "@/state/currencyState";
import { ASSET_BASE_URL, CURRENCY_LIST } from "@/config/constants";
import { ChevronDown, Wallet } from "lucide-preact";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/common/Dropdown";
import { useTranslations } from "@/context/I18nContext";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";

export default function WalletBox() {
  const t = useTranslations("Header");
  const isMobile = useMediaQuery(mobileMediaQuery);
  const balance =
    userState.value?.cashDetails?.find(
      (c) => c.currency === currencyState.value.unit
    )?.amount || 0;

  const handleWalletClick = () => {
    walletDialogOpenedState.value = true;
  };

  return (
    <div className="flex items-center h-[48px] bg-[var(--bar-background-color)] rounded-lg overflow-hidden">
      {/* Balance and Currency Dropdown */}
      <Dropdown
        backdrop="blur"
        className="flex h-[full] justify-center items-center py-3 px-5 overflow-y-auto bg-[var(--bar-background-color)]"
      >
        <DropdownTrigger>
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
            {/* Balance Amount */}
            <span className="text-white text-[14px] font-medium">
              {balance.toFixed(2)}
            </span>

            {/* Currency Icon (Orange Circle with Bitcoin Symbol) */}
            <img
              src={`${ASSET_BASE_URL}/images/currencies/${currencyState.value.code}.png`}
              alt="Currency"
              className="w-6 h-6"
            />

            {/* Dropdown Chevron */}
            <ChevronDown size={14} color="white" />
          </div>
        </DropdownTrigger>
        <DropdownMenu
          aria-label={t("Select Currency")}
          align="end"
          className="bg-[var(--bar-background-color)]"
        >
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
      {isMobile ? (
        <button
          onClick={handleWalletClick}
          className="px-4 h-full bg-[var(--green-color)] text-white font-medium text-[16px] leading-[24px] hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          <img
            src={`${ASSET_BASE_URL}/images/icons/wallet.svg`}
            alt="Wallet"
            className="w-5 h-5"
          />
        </button>
      ) : (
        <button
          onClick={handleWalletClick}
          className="px-5 py-3 h-full bg-[var(--green-color)] text-white font-medium text-[16px] leading-[24px] hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          {t("Wallet")}
        </button>
      )}
    </div>
  );
}
