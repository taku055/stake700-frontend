import { useState } from "preact/hooks";
import { Button } from "@heroui/react";
import { Switch } from "@/components/common";
import { useTranslations } from "@/context/I18nContext";

const fiatCurrencies = [
  { code: "USD" },
  { code: "EUR" },
  { code: "JPY" },
  { code: "INR" },
  { code: "CAD" },
  { code: "CNY" },
  { code: "IDR" },
  { code: "KRW" },
  { code: "PHP" },
  { code: "RUB" },
  { code: "MXN" },
  { code: "PLN" },
  { code: "TRY" },
  { code: "VND" },
  { code: "ARS" },
  { code: "PEN" },
  { code: "CLP" },
  { code: "NGN" },
  { code: "CRC" },
  { code: "KWD" },
  { code: "MAD" },
  { code: "MYR" },
  { code: "QAR" },
  { code: "SAR" },
  { code: "TND" },
  { code: "TWD" },
  { code: "GHS" },
  { code: "KES" },
  { code: "NZD" },
];

const Setting = () => {
  const t = useTranslations("WalletBox");
  const [hideZeroBalances, setHideZeroBalances] = useState(false);
  const [displayCryptoInFiat, setDisplayCryptoInFiat] = useState(false);
  const [selectedFiat, setSelectedFiat] = useState<string>("USD");

  return (
    <div className="flex flex-col p-6 gap-6 overflow-hidden">
      {/* Hide Zero Balances Toggle */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-3">
          <div className="pt-1">
            <Switch
              isSelected={hideZeroBalances}
              onValueChange={setHideZeroBalances}
            />
          </div>
          <div className="flex flex-col flex-1 gap-1">
            <span className="text-white text-[16px] font-medium">{t("Hide Zero Balances")}</span>
            <span className="text-white/60 text-[14px] leading-[20px]">
              {t("Your zero balances won't appear in your wallet")}
            </span>
          </div>
        </div>
      </div>

      {/* Display Crypto in Fiat Toggle */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-3">
          <div className="pt-1">
            <Switch
              isSelected={displayCryptoInFiat}
              onValueChange={setDisplayCryptoInFiat}
            />
          </div>
          <div className="flex flex-col flex-1 gap-1">
            <span className="text-white text-[16px] font-medium">{t("Display Crypto in Fiat")}</span>
            <span className="text-white/60 text-[14px] leading-[20px]">
              {t("All bets & transactions will be settled in the crypto equivalent")}
            </span>
          </div>
        </div>
      </div>

      {/* Fiat Currency Selection */}
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-4 gap-3 max-h-[400px] overflow-y-auto overflow-x-hidden">
          {fiatCurrencies.map((currency) => {
            const isSelected = selectedFiat === currency.code;
            return (
              <button
                key={currency.code}
                type="button"
                onClick={() => setSelectedFiat(currency.code)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg  transition-colors cursor-pointer"
              >
                {/* Radio Button Indicator */}
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isSelected
                    ? "border-white"
                    : "border-white/40"
                }`}>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-[#FFFFFF]"></div>
                  )}
                </div>
                
                {/* Currency Code */}
                <span className="text-white text-[14px] font-medium flex-1 text-left">{currency.code}</span>
                
                {/* Currency Symbol Icon */}
                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-[var(--green-color)] flex items-center justify-center shrink-0 overflow-hidden">
                    <img 
                      src={`/images/icons/currencies/${currency.code}.png`}
                      alt={currency.code}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <img 
                    src={`/images/icons/currencies/${currency.code}.png`}
                    alt={currency.code}
                    className="w-6 h-6 object-contain shrink-0"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2FA Security Section */}
      <div className="flex flex-col gap-3 pt-4 border-t border-[#FFFFFF0A]">
        <p className="text-white/70 text-[14px]">
          {t("Improve your account security with Two-Factor Authentication")}
        </p>
        <Button
          className="w-full text-white text-[16px] font-medium bg-[var(--bar-background-color)] hover:bg-[var(--bar-background-color)]/80 h-[48px] rounded-lg border border-[var(--background-secondary)]"
          onPress={() => {
            console.log("Enable 2FA");
          }}
        >
          {t("Enable 2FA")}
        </Button>
      </div>
    </div>
  );
};

export default Setting;