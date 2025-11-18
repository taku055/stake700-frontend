import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { tBanner } from "@/types/tBanner";

interface PromotionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion: tBanner | null;
}

export default function PromotionDetailModal({
  isOpen,
  onClose,
  promotion,
}: PromotionDetailModalProps) {
  if (!promotion) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalContent className="bg-[var(--background)]">
        <ModalHeader className="flex flex-col gap-1 mt-4">
          {promotion.buttonTitle || "Promotion"}
        </ModalHeader>
        <ModalBody className="flex flex-col gap-4 pb-6">
          {promotion.img && (
            <img
              src={promotion.img}
              alt={promotion.buttonTitle || "Promotion"}
              className="w-full rounded-sm"
            />
          )}
          {promotion.description && (
            <div className="text-white whitespace-pre-wrap">
              <div
                dangerouslySetInnerHTML={{ __html: promotion.description }}
              />
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
