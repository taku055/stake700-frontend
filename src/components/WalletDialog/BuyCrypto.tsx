import { useState } from "preact/hooks";
import { Button, Select, SelectItem, Input } from "@heroui/react";
import { useTranslations } from "@/context/I18nContext";
import { BASE_URL } from "@/config/constants";
import { ChevronDown, Search } from "lucide-preact";
import { allChains } from "@/config/chains";
import { CURRENCY_LIST } from "@/config/constants";

interface ICryptoOption {
  symbol: string;
  name: string;
  icon: string;
}

// const cryptoOptions: ICryptoOption[] = [
//   { symbol: "BTC", name: "Bitcoin", icon: `${BASE_URL}/images/tokens/bitcoin-btc-logo.png` },
//   { symbol: "ETH", name: "Ethereum", icon: `${BASE_URL}/images/tokens/ethereum-eth-logo.png` },
//   { symbol: "LTC", name: "Litecoin", icon: `${BASE_URL}/images/tokens/litecoin-ltc-logo.png` },
//   { symbol: "USDT", name: "Tether", icon: `${BASE_URL}/images/tokens/tether-usdt-logo.png` },
//   { symbol: "SOL", name: "Solana", icon: `${BASE_URL}/images/tokens/solana-sol-logo.png` },
//   { symbol: "BNB", name: "Binance Coin", icon: `${BASE_URL}/images/tokens/bnb-bnb-logo.png` },
//   { symbol: "AVAX", name: "Avalanche", icon: `${BASE_URL}/images/tokens/avalanche-avax-logo.png` },
//   { symbol: "FTM", name: "Fantom", icon: `${BASE_URL}/images/tokens/fantom-ftm-logo.png` },
//   { symbol: "POL", name: "Polygon", icon: `${BASE_URL}/images/tokens/polygon-matic-logo.png` },
//   { symbol: "BASE", name: "Base", icon: `${BASE_URL}/images/tokens/base-logo.svg` },
//   { symbol: "ARB", name: "Arbitrum", icon: `${BASE_URL}/images/tokens/arbitrum-arb-logo.png` },
//   { symbol: "OP", name: "Optimism", icon: `${BASE_URL}/images/tokens/optimism-ethereum-op-logo.png` },
//   { symbol: "TRX", name: "Tron", icon: `${BASE_URL}/images/tokens/tron-trx-logo.png` },
//   { symbol: "DOGE", name: "Dogecoin", icon: `${BASE_URL}/images/tokens/dogecoin-doge-logo.png` },
//   { symbol: "SHIB", name: "Shiba Inu", icon: `${BASE_URL}/images/tokens/shiba-inu-shib-logo.png` },
//   { symbol: "PEPE", name: "Pepe", icon: `${BASE_URL}/images/tokens/pepe-pepe-logo.png` },
//   { symbol: "USDC", name: "USD Coin", icon: `${BASE_URL}/images/tokens/usd-coin-usdc-logo.png` },
//   { symbol: "BUSD", name: "Binance USD", icon: `${BASE_URL}/images/tokens/binance-usd-busd-logo.png` },
//   { symbol: "DAI", name: "Dai", icon: `${BASE_URL}/images/tokens/multi-collateral-dai-dai-logo.png` },
//   { symbol: "XRP", name: "Ripple", icon: `${BASE_URL}/images/tokens/xrp.png` },
//   { symbol: "SUI", name: "Sui", icon: `${BASE_URL}/images/tokens/sui-sui-logo.png` },
//   { symbol: "GNO", name: "Gnosis", icon: `${BASE_URL}/images/tokens/gnosis-gno-gno-logo.png` },
// ];

const currencyOptions = [
  { value: "USD", label: "USD", icon: `/images/icons/currencies/USD.png` },
  { value: "EUR", label: "EUR", icon: `/images/icons/currencies/EUR.png` },
  { value: "JPY", label: "JPY", icon: `/images/icons/currencies/JPY.png` },
  { value: "INR", label: "INR", icon: `/images/icons/currencies/INR.png` },
  { value: "CAD", label: "CAD", icon: `/images/icons/currencies/CAD.png` },
  { value: "CNY", label: "CNY", icon: `/images/icons/currencies/CNY.png` },
  { value: "IDR", label: "IDR", icon: `/images/icons/currencies/IDR.png` },
  { value: "KRW", label: "KRW", icon: `/images/icons/currencies/KRW.png` },
  { value: "PHP", label: "PHP", icon: `/images/icons/currencies/PHP.png` },
  { value: "RUB", label: "RUB", icon: `/images/icons/currencies/RUB.png` },
  { value: "MXN", label: "MXN", icon: `/images/icons/currencies/MXN.png` },
  { value: "PLN", label: "PLN", icon: `/images/icons/currencies/PLN.png` },
  { value: "TRY", label: "TRY", icon: `/images/icons/currencies/TRY.png` },
  { value: "VND", label: "VND", icon: `/images/icons/currencies/VND.png` },
  { value: "ARS", label: "ARS", icon: `/images/icons/currencies/ARS.png` },
  { value: "PEN", label: "PEN", icon: `/images/icons/currencies/PEN.png` },
  { value: "CLP", label: "CLP", icon: `/images/icons/currencies/CLP.png` },
  { value: "NGN", label: "NGN", icon: `/images/icons/currencies/NGN.png` },
  { value: "CRC", label: "CRC", icon: `/images/icons/currencies/CRC.png` },
  { value: "KWD", label: "KWD", icon: `/images/icons/currencies/KWD.png` },
  { value: "MAD", label: "MAD", icon: `/images/icons/currencies/MAD.png` },
  { value: "MYR", label: "MYR", icon: `/images/icons/currencies/MYR.png` },
  { value: "QAR", label: "QAR", icon: `/images/icons/currencies/QAR.png` },
  { value: "SAR", label: "SAR", icon: `/images/icons/currencies/SAR.png` },
  { value: "TND", label: "TND", icon: `/images/icons/currencies/TND.png` },
  { value: "TWD", label: "TWD", icon: `/images/icons/currencies/TWD.png` },
  { value: "GHS", label: "GHS", icon: `/images/icons/currencies/GHS.png` },
  { value: "KES", label: "KES", icon: `/images/icons/currencies/KES.png` },
  { value: "NZD", label: "NZD", icon: `/images/icons/currencies/NZD.png` },
];

const BuyCrypto = () => {
  const t = useTranslations("WalletBox");
  const [selectedCrypto, setSelectedCrypto] = useState<string>("BTC");
  const [amount, setAmount] = useState<string>("0");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCryptoData = allChains.find((c) => c.symbol === selectedCrypto) || allChains[0];
  const selectedCurrencyData = currencyOptions.find((c) => c.value === selectedCurrency) || currencyOptions[0];

  const filteredCryptoOptions = allChains.filter(
    (chain) =>
      chain.symbol?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chain.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col p-2 md:p-6 gap-6">
        {/* Buy Section Header */}
        <h3 className="text-white text-[16px] font-semibold">{t("Buy")}</h3>

        {/* Crypto Selection */}
        <div className="flex flex-col gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCryptoDropdown(!showCryptoDropdown)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--background-secondary)] border-[2px] border-[var(--background-secondary)] rounded-lg transition-colors"
            >
              <img
                src={selectedCryptoData.icon}
                alt={selectedCryptoData.name}
                className="w-8 h-8"
              />
              <div className="flex flex-col items-start flex-1">
                <span className="text-white text-[16px] font-medium">{selectedCryptoData.name}</span>
                <span className="text-white/60 text-[12px]">{selectedCryptoData.name}</span>
              </div>
              <ChevronDown className="w-5 h-5 text-white/60" />
            </button>

            {showCryptoDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--background-secondary)] border-[2px] border-[var(--background-secondary)] rounded-lg z-10 max-h-[300px] overflow-y-auto">
                {/* Search */}
                <div className="border-b h-[44px] rounded-lg bg-[var(--bar-background-color)] border-[var(--background-secondary)]">
                  <div className="flex items-center">
                    <Search className="w-4 h-4 text-white mx-3" />
                    <Input
                      type="text"
                      placeholder={t("Search")}
                      value={searchQuery}
                      onChange={(e: any) => setSearchQuery(e.target.value)}
                      classNames={{
                        inputWrapper: "bg-[var(--bar-background-color)] border-none rounded-none h-[44px]",
                        input: "text-white text-[14px]",
                      }}
                    />
                  </div>
                </div>

                {/* Crypto List */}
                <div className="p-2">
                  {filteredCryptoOptions.map((crypto) => (
                    <button
                      key={crypto.chainId}
                      type="button"
                      onClick={() => {
                        setSelectedCrypto(crypto.symbol || "");
                        setShowCryptoDropdown(false);
                        setSearchQuery("");
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[var(--background-secondary)] rounded-lg transition-colors"
                    >
                      <img
                        src={crypto.icon}
                        alt={crypto.name}
                        className="w-8 h-8"
                      />
                      <div className="flex flex-col items-start flex-1">
                        <span className="text-white text-[14px] font-medium">{crypto.symbol}</span>
                        <span className="text-white/60 text-[12px]">{crypto.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Amount Input */}
        <div className="flex flex-col gap-2">
          <label className="text-white/70 text-[14px] leading-[20px]">
            {t("Amount")} <span className="text-[var(--pink-color)]">*</span>
          </label>
          <div className="flex w-full h-[44px] items-center">
            <input
              type="number"
              value={amount}
              onChange={(e: any) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full h-full bg-[var(--bar-background-color)] border-0 rounded-l-lg rounded-r-none text-white text-[16px]"
            />
            <Select
              selectedKeys={[selectedCurrency]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys as Set<string>)[0];
                if (selected) {
                  setSelectedCurrency(selected);
                }
              }}
              className="w-[120px] max-w-[120px] h-full bg-[var(--background-secondary)] border-r-[2px] border-[var(--background-secondary)] rounded-r-lg rounded-l-none  "
              classNames={{
                trigger: "w-[120px] h-[44px] rounded-0 bg-[var(--background-secondary)] border-none",
                value: "text-white text-[16px] bg-[var(--background-secondary)] rounded-0 border-none",
                popoverContent: "bg-[var(--background-secondary)] rounded-0 border-none",
              }}
              startContent={
                <img
                  src={selectedCurrencyData.icon}
                  alt={selectedCurrencyData.value}
                  className="w-5 h-5"
                />
              }
            >
              {CURRENCY_LIST.map((currency) => (
                <SelectItem
                  key={currency.unit}
                  startContent={
                    <img
                      src={`${BASE_URL}/images/currencies/${currency.code}.png`}
                      alt={currency.unit}
                      className="w-5 h-5"
                    />
                  }
                >
                  {currency.unit}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        {/* Buy Button */}
        <Button
          className="w-full text-white text-[16px] font-medium bg-[var(--green-color)] hover:opacity-90 h-[44px] rounded-lg"
          onPress={() => {
            console.log("Buy crypto:", { crypto: selectedCrypto, amount, currency: selectedCurrency });
          }}
        >
          {t("Buy")}
        </Button>

        {/* 2FA Security Section */}

      </div>
      {/* <div className="flex flex-col gap-3 p-4 bg-[var(--bar-background-color)]">
        <p className="text-white/70 text-[16px] text-center">
          {t("Improve your account security with Two-Factor Authentication")}
        </p>
        <Button
          className="w-full text-white text-[16px] font-medium bg-[var(--background-secondary)] hover:bg-[var(--bar-background-color)]/80 h-[44px] rounded-lg border border-[var(--background-secondary)]"
          onPress={() => {
            console.log("Enable 2FA");
          }}
        >
          {t("Enable 2FA")}
        </Button>
      </div> */}
    </>
  );
};

export default BuyCrypto;

