import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Modal, ModalContent } from "@/components/common";
import { useTranslations } from "@/context/I18nContext";
import { RTL_LANGUAGES } from "@/config/constants";
import { localeState } from "@/state/localeState";

interface SiteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  titleId: string;
  widthClass: string;
  headerExtra?: ReactNode;
  children: ReactNode;
}

export default function SiteDialog({
  isOpen,
  onClose,
  title,
  titleId,
  widthClass,
  headerExtra,
  children,
}: SiteDialogProps) {
  const t = useTranslations("Profile");
  const isRTL = RTL_LANGUAGES.includes(localeState.value);

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      scrollBehavior="inside"
      classNames={{ backdrop: "z-[100]", wrapper: "z-[100]" }}
    >
      <ModalContent
        noCloseButton
        dir={isRTL ? "rtl" : "ltr"}
        aria-labelledby={titleId}
        className={`flex max-h-[85vh] w-full flex-col overflow-hidden rounded-lg border border-[#2f4553] bg-[#1a2c38] shadow-[0_18px_60px_rgba(0,0,0,0.55)] ${widthClass}`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[#2f4553] bg-[#1a2c38] px-4">
          <h2 id={titleId} className="truncate text-base font-semibold text-white">
            {title}
          </h2>
          <div className="flex shrink-0 items-center gap-2">
            {headerExtra}
            <button
              type="button"
              onClick={onClose}
              aria-label={t("Close", undefined, "Close")}
              className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>
        {children}
      </ModalContent>
    </Modal>
  );
}
