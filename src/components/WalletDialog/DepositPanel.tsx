import { useState, useEffect, useRef } from "preact/hooks";
import { Modal, ModalContent } from "@/components/common";
import { Button, Select, SelectItem, Input } from "@heroui/react";
import { useTranslations } from "@/context/I18nContext";
import { BASE_URL } from "@/config/constants";
import { ChevronDown, ChevronLeft, Copy, RefreshCw, Search } from "lucide-preact";
import { QRCodeSVG } from "qrcode.react";
import { allChains } from "@/config/chains";

interface ICryptoOption {
  symbol: string;
  name: string;
  icon: string;
}

// const cryptoOptions: ICryptoOption[] = [
//   { symbol: "BTC", name: "Bitcoin", icon: `${BASE_URL}/images/tockens/bitcoin-btc-logo.png` },
//   { symbol: "ETH", name: "Ethereum", icon: `${BASE_URL}/images/tockens/ethereum-eth-logo.png` },
//   { symbol: "LTC", name: "Litecoin", icon: `${BASE_URL}/images/tockens/litecoin-ltc-logo.png` },
//   { symbol: "USDT", name: "Tether", icon: `${BASE_URL}/images/tockens/usdt-logo.png` },
// ];

interface IDepositPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const DepositPanel = ({ isOpen, onClose }: IDepositPanelProps) => {
  const t = useTranslations("WalletBox");
  const [selectedCrypto, setSelectedCrypto] = useState<string>("BTC");
  const [walletAddress, setWalletAddress] = useState<string>("bc1qrlgzr8w5u2014a5nk3a93mdpqusm5kn7fzsk");
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmations, setConfirmations] = useState<number>(1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCryptoData = allChains.find((c) => c.symbol === selectedCrypto) || allChains[0];

  const filteredCryptoOptions = allChains.filter(
    (crypto) =>
      crypto.symbol?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCryptoDropdown(false);
      }
    }

    if (showCryptoDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCryptoDropdown]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    // You can add a toast notification here
  };
  
  const handleRefreshAddress = () => {
    // Generate new address logic here
    console.log("Refreshing address...");
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      classNames={{
        backdrop: "z-[10000001]",
        wrapper: "z-[10000001]",
      }}
    >
      <ModalContent className="bg-[var(--background)] w-[500px] max-w-[500px] rounded-[8px] overflow-hidden">
          <div className="flex justify-between items-center w-full h-[60px] min-h-[60px]  px-[16px]">
            <div className="flex items-center gap-[12px]">
              <img src="/images/icons/icons/wallet.svg" alt="Wallet Icon" className="w-[20px] h-[20px]" />
              <span className="text-white text-[18px] leading-[28px] font-semibold">{t("Wallet")}</span>
            </div>
          </div>

        <div className="w-full h-full flex flex-col max-h-[calc(85vh-60px)] overflow-y-auto">
          <div className="flex justify-between items-center w-full h-[60px] min-h-[60px] py-[10px] px-[16px]">
            <div className="flex items-center gap-[12px]">
              <ChevronLeft className="w-5 h-5 text-white" />
              <span className="text-white text-[18px] font-normal">{t("Deposit")}</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col p-4 gap-[16px]">
            {/* Currency Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-white/70 text-[14px]">{t("Currency")}</label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowCryptoDropdown(!showCryptoDropdown)}
                  className="w-full h-[70px] flex items-center gap-3 px-4 py-3 bg-[var(--background-secondary)] border-[2px] border-[var(--background-secondary)] rounded-lg transition-colors"
                >
                  <img
                    src={selectedCryptoData.icon}
                    alt={selectedCryptoData.symbol}
                    className="w-8 h-8"
                  />
                  <div className="flex flex-col items-start flex-1">
                    <span className="text-white text-[16px] font-medium">{selectedCryptoData.symbol}</span>
                    <span className="text-white/60 text-[12px]">{selectedCryptoData.name}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-white/60 transition-transform ${showCryptoDropdown ? "rotate-180" : ""}`} />
                </button>

                {showCryptoDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--background)] border-[2px] border-[var(--background-secondary)] rounded-lg z-10 max-h-[300px] overflow-y-auto">
                    {/* Search */}
                    <div className="border-b h-[44px] rounded-lg bg-[var(--bar-background-color)] border-[var(--background-secondary)]">
                      <div className="flex w-[full] items-center">
                        <Search className="w-4 h-4 text-white mx-3" />
                        <Input
                          type="text"
                          placeholder={t("Search")}
                          value={searchQuery}
                          onChange={(e: any) => setSearchQuery(e.target.value)}
                          classNames={{
                            inputWrapper: "bg-[var(--bar-background-color)] bg-transparent focus:bg-transparent focus:bg-[var(--bar-background-color)] border-none rounded-none h-[44px]",
                            input: "text-white text-[14px]",
                          }}
                        />
                      </div>
                    </div>

                    {/* Crypto List */}
                    <div className="p-2">
                      {filteredCryptoOptions.map((crypto) => (
                        <button
                          key={crypto.symbol}
                          type="button"
                          onClick={() => {
                            setSelectedCrypto(crypto.symbol || "");
                            setShowCryptoDropdown(false);
                            setSearchQuery("");
                          }}
                          className="w-full h-[70px] flex items-center gap-3 px-4 py-3 bg-[var(--background-secondary)] border-[2px] border-[var(--background-secondary)] rounded-lg transition-colors"
                        >
                          <img
                            src={crypto.icon}
                            alt={crypto.symbol}
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

            {/* Address Section */}
            <div className="flex flex-col gap-2">
              <label className="text-white/70 text-[14px]">{t("Address")}</label>
              <div className="flex items-center rounded-lg border-none h-[44px] bg-[var(--background-secondary)]">
                <Input
                  type="text"
                  value={walletAddress}
                  readOnly
                  classNames={{
                    inputWrapper: "flex-1 bg-transparent focus:bg-transparent focus:bg-[var(--background-secondary)] border-none h-[44px]",
                    input: "text-white text-[14px] font-mono",
                  }}
                />
                <button
                  type="button"
                  onClick={handleRefreshAddress}
                  className="p-2 border-none cursor-pointer transition-colors"
                  aria-label="Refresh Address"
                >
                  <RefreshCw className="w-5 h-5 text-white" />
                </button>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="p-2 border-none cursor-pointer transition-colors"
                  aria-label="Copy Address"
                >
                  <Copy className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex justify-center">
              <div className="bg-white p-2 rounded-lg">
                <QRCodeSVG value={walletAddress} width={120} height={120} />
              </div>
            </div>

            {/* Or Separator */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-[var(--bar-background-color)]"></div>
              <span className="text-white leading-[24px] text-[16px]">{t("Or")}</span>
              <div className="flex-1 h-px bg-[var(--bar-background-color)]"></div>
            </div>

            {/* Direct Deposit Button */}
            <Button
              className="w-full h-[48px] min-h-[44px] text-white text-[16px] font-medium bg-[var(--background-secondary)] hover:bg-[var(--bar-background-color)]/80 rounded-lg border border-[var(--background-secondary)]"
              onPress={() => {
                console.log("Direct Deposit");
              }}
            >
              <div className="flex items-center gap-2 w-full h-full py-2 px-4 justify-center">
                {t("Direct Deposit")}
                <img src={`images/icons/others/binance.png`} alt={selectedCryptoData.symbol} className="w-[18px] h-[18px]" />
                <img src={`images/icons/others/coin_base.png`} alt={selectedCryptoData.symbol} className="w-[18px] h-[18px]" />
                <img src={`images/icons/others/meta_mask.png`} alt={selectedCryptoData.symbol} className="w-[18px] h-[18px]" />
                <img src={`images/icons/others/trust_wallet.png`} alt={selectedCryptoData.symbol} className="w-[18px] h-[18px]" />
                <span className="ml-2 text-white/60 text-[14px]">+300</span>
              </div>
            </Button>

            {/* divider */}
            <div className="h-px w-full bg-[var(--bar-background-color)]"></div>

            {/* Confirmation Status */}
            <div className="flex justify-between items-center">
              <span className="text-white text-[16px]">{t("Credited")}</span>
              <span className="text-white text-[16px]">{confirmations} {t("Confirmation")}</span>
            </div>
          </div>
          {/* 2FA Security Section */}
          <div className="flex flex-col gap-3 p-4 bg-[var(--bar-background-color)]">
            <p className="text-white text-[16px] text-center">
              {t("Improve your account security with Two-Factor Authentication")}
            </p>
            <Button
              className="w-full text-white text-[16px] font-medium bg-[var(--background-secondary)] hover:bg-[var(--bar-background-color)]/80 h-[48px] rounded-lg border border-[var(--background-secondary)]"
              onPress={() => {
                console.log("Enable 2FA");
              }}
            >
              {t("Enable 2FA")}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default DepositPanel;

