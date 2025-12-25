import { Modal, ModalContent } from "@/components/common";
import { Button } from "@heroui/react";
import { useTranslations } from "@/context/I18nContext";
import { BASE_URL, OFFICIAL_LINKS } from "@/config/constants";
import { walletDialogOpenedState } from "@/state/walletDialogState";

interface IWelcomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSetupWallet?: () => void;
  onSkip?: () => void;
}

export default function WelcomeDialog({
  isOpen,
  onClose,
  onSetupWallet,
  onSkip,
}: IWelcomeDialogProps) {
  const t = useTranslations("WelcomeDialog");

  const handleSetupWallet = () => {
    if (onSetupWallet) {
      // onSetupWallet();
      walletDialogOpenedState.value = true;
      onClose();
    }
    onClose();
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
    onClose();
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      classNames={{
        backdrop: "z-[10000000]",
        wrapper: "z-[10000000]",
      }}
    >
      <ModalContent className="bg-[var(--background)] w-[500px] max-w-[500px] h-[468px] max-h-[837px] rounded-[8px] overflow-hidden border-0 shadow-none">
        {/* Top Promotional Section */}
        <div className="relative rounded-t-[8px] overflow-hidden">
          {/* Decorative Glowing Shapes Background */}
          <img src={ `${BASE_URL}/images/others/Welcome image.png`} alt="Welcome Background" className="w-full h-full object-cover" />
            
        </div>

        {/* Bottom Content Section */}
        <div className="bg-[var(--background)] p-[16px] pt-[32px] gap-[16px] flex flex-col items-center justify-center rounded-b-[8px]">
          {/* Title */}
          <h2 className="text-white text-[20px] font-semibold leading-[28px] text-center">
            {t("Welcome to Betalarab!")}
          </h2>

          {/* Description */}
          <p className="text-white text-[16px] leading-[24px] text-center">
            {t("Ready to get started? Set up your wallet now to enjoy smooth, secure deposits and withdrawals.")}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-[8px] w-full">
            <Button
              className="flex-1 text-white text-[16px] font-medium bg-[var(--background-secondary)] hover:bg-[var(--background-secondary)]/80 w-full h-[44px] rounded-lg"
              onPress={handleSkip}
            >
              {t("Skip for Later")}
            </Button>
            <Button
              className="flex-1 text-white text-[16px] font-medium bg-[var(--green-color)] hover:opacity-90 w-full h-[44px] rounded-lg"
              onPress={handleSetupWallet}
            >
              {t("Setup Wallet")}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}