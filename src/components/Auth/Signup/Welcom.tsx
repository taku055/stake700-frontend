import { Modal, ModalContent } from "@/components/common";
import { useTranslations } from "@/context/I18nContext";
import { BASE_URL } from "@/config/constants";

interface IWelcomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeDialog({
  isOpen,
  onClose,
}: IWelcomeDialogProps) {
  const t = useTranslations("WelcomeDialog");

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
          <img src={ `${BASE_URL}/images/others/Welcome_image.jpg`} alt="Welcome Background" className="w-full h-full object-cover" />
            
        </div>

        {/* Bottom Content Section */}
        <div className="bg-[var(--background)] p-[16px] pt-[32px] gap-[16px] flex flex-col items-center justify-center rounded-b-[8px]">
          {/* Title */}
          <h2 className="text-white text-[20px] font-semibold leading-[28px] text-center">
            {t("Welcome to Betalarab!")}
          </h2>

          {/* Description */}
          <p className="text-white text-[16px] leading-[24px] text-center">
            {t("We're thrilled to have you here! Get ready to explore amazing games and exciting opportunities.")}
          </p>
        </div>
      </ModalContent>
    </Modal>
  );
}