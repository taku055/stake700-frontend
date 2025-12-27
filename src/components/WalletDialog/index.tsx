import { useState, useCallback, useEffect, useMemo } from "preact/hooks";
import { Modal, ModalContent } from "@/components/common";
import { BASE_URL, mobileMediaQuery } from "@/config/constants";
import { useMediaQuery } from "usehooks-ts";
import { useTranslations } from "@/context/I18nContext";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";
import Overview from "./Overview";
import BuyCrypto from "./BuyCrypto";
import Setting from "./Setting";
import SwapCrypto from "./SwapCrypto";
import { depositDialogOpenedState } from "@/state/walletDialogState";
import { Button } from "@heroui/react";

interface IWalletDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: string;
}

const WalletDialog = ({ isOpen, onClose, defaultTab }: IWalletDialogProps) => {
  const t = useTranslations("WalletBox");
  const isMobile = useMediaQuery(mobileMediaQuery);
  const [selectedTab, setSelectedTab] = useState<string>(defaultTab || "overview");
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const isRTL = RTL_LANGUAGES.includes(localeState.value);

  useEffect(() => {
    if (isOpen && defaultTab) {
      setSelectedTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  const onModalClose = useCallback(() => {
    if (isMobile && selectedTab !== "overview") {
      setSelectedTab("overview");
    } else {
      onClose();
    }
  }, [isMobile, selectedTab, onClose]);

  const handleDepositClick = useCallback(() => {
    depositDialogOpenedState.value = true;
  }, []);

  const handleDepositClose = useCallback(() => {
    depositDialogOpenedState.value = false;
  }, []);

  const tabs = useMemo(
    () => [
      {
        key: "overview",
        title: t("Overview"),
        content: <Overview onDepositClick={handleDepositClick} onBuyCryptoClick={() => setSelectedTab("buy-crypto")} />,
      },
      {
        key: "buy-crypto",
        title: t("Buy Crypto"),
        content: <BuyCrypto />,
      },
      {
        key: "swap-crypto",
        title: t("Swap Crypto"),
        content: <SwapCrypto />,
      },
      {
        key: "settings",
        title: t("Settings"),
        content: <Setting />,
      },
    ],
    [t, handleDepositClick]
  );

  const currentTab = tabs.find((tab) => tab.key === selectedTab) || tabs[0];

  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onModalClose}
        placement="center"
        scrollBehavior="inside"
        classNames={{
          backdrop: "z-[10000000]",
          wrapper: "z-[10000000]",
        }}
      >
        <ModalContent className="bg-[var(--background)] w-[500px] max-w-[500px] rounded-[8px] overflow-hidden scrollbar-hide">
          {/* Header */}
          <div className="flex justify-between items-center w-full h-[60px] min-h-[60px] py-[10px] md:px-[16px] px-2">
            <div className="flex items-center gap-[12px]">
              <img src={`${BASE_URL}/images/icons/wallet.svg`} alt="Wallet Icon" className="w-[20px] h-[20px]" />
              <span className="text-white text-[18px] leading-[28px] font-semibold">{t("Wallet")}</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex h-[60px] md:h-[56px] mx-1 md:mx-4 items-center border-none gap-2 p-[6px] rounded-md md:rounded-full bg-[var(--bar-background-color)] ">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedTab(tab.key)}
                className={`flex flex-1 items-center justify-center border-none h-full md:h-[44px] px-1 md:px-0 md:rounded-full rounded-md text-[16px] leading-[24px] font-semibold transition-colors ${selectedTab === tab.key
                  ? "text-white bg-[var(--background-secondary)]"
                  : "text-white/60 hover:text-white/80"
                  }`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex flex-col overflow-y-auto max-h-[calc(80vh-120px)]">
            {currentTab.content}
          </div>
          {/* 2FA Security Section */}
          <div className="flex flex-col gap-3 p-4 mt-4 bg-[var(--bar-background-color)]">
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
        </ModalContent>
      </Modal>

      {/* Deposit Dialog */}
    </>
  );
};

export default WalletDialog;
