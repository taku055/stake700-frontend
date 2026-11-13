import { X } from "lucide-react";
import { Modal, ModalContent } from "@/components/common";
import { useTranslations } from "@/context/I18nContext";
import { RTL_LANGUAGES } from "@/config/constants";
import { localeState } from "@/state/localeState";
import { userState } from "@/state/userState";
import TransactionHistoryPage from "../userbalance/TransactionHistoryPage";
import CasinoHistoryPage from "../bethistory/CasinoHistoryPage";
import SportsbookHistoryPage from "../bethistory/SportsbookHistoryPage";
import {
  HISTORY_TAB,
  WALLET_TAB,
  historyPanelState,
  openAccountDialog,
  type HistoryTab,
} from "@/state/accountDialogs";

const TABS: { key: HistoryTab; labelKey: string }[] = [
  { key: HISTORY_TAB.transactions, labelKey: "Transaction History" },
  { key: HISTORY_TAB.casino, labelKey: "Casino" },
  { key: HISTORY_TAB.sports, labelKey: "Sports" },
];

export default function HistoryAccountDialog() {
  const panel = historyPanelState.value;
  const t = useTranslations("Profile");
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const isOpen = panel.isOpen && userState.value != null;

  const selectTab = (tab: HistoryTab) => {
    historyPanelState.value = { ...historyPanelState.value, tab };
  };

  const onClose = () => {
    historyPanelState.value = { ...historyPanelState.value, isOpen: false };
  };

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
        aria-labelledby="history-dialog-title"
        className="flex max-h-[85vh] w-full flex-col overflow-hidden rounded-lg border border-[#2f4553] bg-[#1a2c38] shadow-[0_18px_60px_rgba(0,0,0,0.55)] md:max-w-5xl md:flex-row"
      >
        <aside className="flex shrink-0 flex-col border-b border-[#2f4553] bg-[#0f212e] md:w-[220px] md:border-b-0 md:border-e">
          <div className="flex items-center justify-between gap-2 px-4 py-4">
            <h2 id="history-dialog-title" className="text-base font-semibold text-white">
              {t("History", undefined, "History")}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={t("Close", undefined, "Close")}
              className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex md:flex-col">
            {TABS.map((tab) => {
              const selected = panel.tab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => selectTab(tab.key)}
                  className={`flex-1 border-b-2 px-4 py-3 text-start text-sm font-semibold md:border-b-0 md:border-s-2 ${
                    selected
                      ? "border-[#1475e1] bg-[#1a2c38] text-white"
                      : "border-transparent text-[#b1bad3] hover:bg-[#213743] hover:text-white"
                  }`}
                >
                  {t(tab.labelKey)}
                </button>
              );
            })}
          </nav>
          <div className="mt-auto hidden items-center justify-between p-4 md:flex">
            <button
              type="button"
              onClick={() => openAccountDialog(WALLET_TAB.deposit)}
              className="text-sm font-semibold text-[#b1bad3] hover:text-white"
            >
              {t("Wallet", undefined, "Wallet")}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label={t("Close", undefined, "Close")}
              className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </aside>

        <section className="min-h-[420px] min-w-0 flex-1 overflow-auto">
          {isOpen && panel.tab === HISTORY_TAB.transactions && (
            <TransactionHistoryPage />
          )}
          {isOpen && panel.tab === HISTORY_TAB.casino && <CasinoHistoryPage />}
          {isOpen && panel.tab === HISTORY_TAB.sports && (
            <SportsbookHistoryPage />
          )}
        </section>
      </ModalContent>
    </Modal>
  );
}
