import { Modal, ModalContent } from "@/components/common";
import { useState } from "preact/hooks";
import DepositPanel from "./DepositPanel";
import WithdrawalPanel from "./WithdrawalPanel";
// import HistoryPanel from "./HistoryPanel";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { useTranslations } from "@/context/I18nContext";
import styles from "./DepositDialogFull.module.scss";

const tabList = ["Deposit", "Withdraw"];

export default function DepositDialogFull({
  isOpen,
  onClose,
  tab = tabList[0],
}: {
  isOpen: boolean;
  onClose: () => void;
  tab?: string;
}) {
  const isMobile = useMediaQuery(mobileMediaQuery);
  const t = useTranslations("DepositDialogFull");

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" placement="center">
      <ModalContent className="max-w-4xl! h-[90%] md:h-[80%] bg-[var(--background)] text-white rounded-2xl p-0 bg-gradient-to-r from-[#FFFFFF1D] to-[#FFFFFF0A] overflow-y-auto">
        <div className="relative">
          <img
            src={`https://tekio.s3.eu-north-1.amazonaws.com/${(
              import.meta.env.VITE_SITE_NAME as string
            ).toLowerCase()}/logo.png`}
            alt={import.meta.env.VITE_SITE_NAME as string}
            className="absolute md:left-[20px] left-[10px] md:top-[20px] top-[10px] md:w-[144px] w-[92px] z-[60]"
          />

          <div className="p-0 md:p-[20px]">
            {tab === "Deposit" && <DepositPanel />}
            {tab === "Withdraw" && <WithdrawalPanel />}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
