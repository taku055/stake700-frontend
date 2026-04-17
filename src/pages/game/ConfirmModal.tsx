import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Button } from "@heroui/react";
import { useTranslations } from "@/context/I18nContext";
import { eTransactionCurrency } from "@/types/tTransaction";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentCurrency?: eTransactionCurrency;
  newCurrency?: eTransactionCurrency;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  currentCurrency,
  newCurrency,
}: ConfirmModalProps) {
  const t = useTranslations("GamePlay");

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
    >
      <ModalContent className="max-w-md bg-[var(--background)] text-white rounded-2xl">
        <ModalHeader>{t("confirm-currency-change")}</ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-2">
            <p className="text-white/80">{t("currency-change-message")}</p>
            {currentCurrency && newCurrency && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="px-3 py-1 bg-[#fff1] rounded-md font-semibold">
                  {currentCurrency}
                </span>
                <span className="text-white/60">→</span>
                <span className="px-3 py-1 bg-[var(--primary-color)] rounded-md font-semibold">
                  {newCurrency}
                </span>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="light"
            onPress={onClose}
            className="text-white/80"
          >
            {t("stay-here")}
          </Button>
          <Button
            color="primary"
            onPress={handleConfirm}
            className="bg-[var(--primary-color)]"
          >
            {t("reload-with-current-currency", { currency_symbol: newCurrency })}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
