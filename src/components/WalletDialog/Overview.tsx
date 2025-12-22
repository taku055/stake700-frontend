import { Button } from "@heroui/react";
import { useTranslations } from "@/context/I18nContext";
import { BASE_URL } from "@/config/constants";

interface IOverviewProps {
  onDepositClick: () => void;
  onBuyCryptoClick: () => void;
}

const Overview = ({ onDepositClick, onBuyCryptoClick }: IOverviewProps) => {
  const t = useTranslations("WalletBox");

  return (
    <div className="flex flex-col  bg-[var(--background)] pt-4 gap-[16px] w-full h-full">
      {/* Wallet Graphic */}
      <div className="flex justify-center items-center mt-16px">
        <img src="/buffer/wallet-boost.png" alt="Wallet Boost" className="w-[500px] h-[220px] object-fill" />

      </div>
      {/* Empty Wallet Message */}
      <div className="flex flex-col justify-between px-4 gap-2">
        <h3 className="text-white text-[20px] leading-[28px] font-semibold">
          {t("Your Stake Wallet is Currently Empty")}
        </h3>
        <p className="text-white/70 text-[16px] leading-[24px]">
          {t("To get started, make a deposit using crypto or local currency (where available), or purchase crypto instantly through MoonPay or Swapped.")}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 px-4 h-[44px]">
        <Button
          className="flex-1 text-white h-[44px] items-center justify-center text-[16px] leading-[24px] font-semibold bg-[var(--green-color)] hover:opacity-90 rounded-lg"
          onPress={onDepositClick}
        >
          {t("Deposit")}
        </Button>
        <Button
          className="flex-1 text-white h-[44px] items-center justify-center text-[16px] font-medium bg-[var(--background-secondary)] hover:bg-[var(--background-secondary)]/80 rounded-lg border border-[var(--background-secondary)]"
          onPress={onBuyCryptoClick}
        >
          {t("Buy Crypto")}
        </Button>
      </div>

      {/* 2FA Security Section */}
      <div className="flex flex-col gap-3 p-4 bg-[var(--bar-background-color)] border-t border-[#FFFFFF0A]">
        <p className="text-white/70 text-[16px] text-center leading-[24px]">
          {t("Improve your account security with Two-Factor Authentication")}
        </p>
        <Button
          className="w-full text-white h-[44px] font-semibold items-center justify-center text-[16px] leading-[24px] bg-[var(--background-secondary)] hover:bg-[var(--background-secondary)]/80 rounded-lg border border-[var(--background-secondary)]"
          onPress={() => {
            // Navigate to 2FA settings
            console.log("Enable 2FA");
          }}
        >
          {t("Enable 2FA")}
        </Button>
      </div>
    </div>
  );
};

export default Overview;

