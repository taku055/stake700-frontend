import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "@/context/I18nContext";
import { balanceState } from "@/state/balanceState";
import { currencyState } from "@/state/currencyState";
import { userState } from "@/state/userState";
import { cashDetailAmountForUnit } from "@/helpers/multipleBalance";
import AcceptPromoCode from "../AcceptPromoCode";
import DepositPage from "../userbalance/DepositPage";
import WithdrawPage from "../userbalance/WithdrawPage";
import WithdrawStatusPage from "../userbalance/WithdrawStatusPage";
import { BonusPage } from "../userbalance/BonusPage";
import {
  HISTORY_TAB,
  WALLET_TAB,
  openAccountDialog,
  walletPanelState,
  type WalletTab,
} from "@/state/accountDialogs";
import SiteDialog from "./SiteDialog";

const BALANCE_MASK = "••••••";

const TABS: { key: WalletTab; labelKey: string }[] = [
  { key: WALLET_TAB.deposit, labelKey: "Deposit" },
  { key: WALLET_TAB.withdraw, labelKey: "Withdraw" },
  { key: WALLET_TAB.status, labelKey: "Withdraw Status" },
  { key: WALLET_TAB.bonus, labelKey: "Bonus" },
];

function readBalances() {
  const cur = currencyState.value;
  const user = userState.value;
  const symbol = cur?.symbol ?? "";
  if (!cur || !user) return { cash: 0, bonus: 0, symbol };

  if (user.role === "NORMAL") {
    return {
      cash: Number(balanceState.value?.[cur.code]?.cash?.balance ?? 0),
      bonus: Number(balanceState.value?.[cur.code]?.bonus?.balance ?? 0),
      symbol,
    };
  }

  return {
    cash: cashDetailAmountForUnit(user.cashDetails, cur.unit),
    bonus: 0,
    symbol,
  };
}

function formatAmount(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function WalletAccountDialog() {
  const panel = walletPanelState.value;
  const t = useTranslations("Profile");
  const tBalance = useTranslations("MainBalanceCard");
  const tBonus = useTranslations("BonusBalanceCard");
  const [visible, setVisible] = useState(true);
  const { cash, bonus, symbol } = readBalances();
  const isOpen = panel.isOpen && userState.value != null;

  const selectTab = (tab: WalletTab) => {
    walletPanelState.value = { ...walletPanelState.value, tab };
  };

  return (
    <SiteDialog
      isOpen={isOpen}
      onClose={() => {
        walletPanelState.value = { ...walletPanelState.value, isOpen: false };
      }}
      title={t("Wallet", undefined, "Wallet")}
      titleId="wallet-dialog-title"
      widthClass="md:max-w-5xl"
      headerExtra={
        <button
          type="button"
          onClick={() => openAccountDialog(HISTORY_TAB.transactions)}
          className="h-8 rounded-md px-3 text-sm font-semibold text-[#b1bad3] hover:bg-[#213743] hover:text-white"
        >
          {t("History", undefined, "History")}
        </button>
      }
    >
      <div className="flex items-center justify-between gap-4 border-b border-[#2f4553] bg-[#0f212e] px-4 py-3">
        <div className="flex min-w-0 flex-1 gap-6">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#7eb6ff]">
              {tBalance("Main Balance")}
            </p>
            <p className="mt-1 text-xl font-bold tabular-nums text-white">
              {visible ? `${symbol} ${formatAmount(cash)}` : `${symbol} ${BALANCE_MASK}`}
            </p>
          </div>
          <div className="min-w-0 border-s border-[#2f4553] ps-6">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#b1bad3]">
              {tBonus("Total Bonus Balance")}
            </p>
            <p className="mt-1 text-xl font-bold tabular-nums text-white">
              {visible ? `${symbol} ${formatAmount(bonus)}` : `${symbol} ${BALANCE_MASK}`}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Hide balance" : "Show balance"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#213743] text-[#b1bad3] hover:text-white"
        >
          {visible ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-[#2f4553] px-4 py-3">
        {TABS.map((tab) => {
          const selected = panel.tab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              aria-pressed={selected}
              onClick={() => selectTab(tab.key)}
              className={`h-9 shrink-0 rounded-md px-4 text-sm font-semibold ${
                selected
                  ? "bg-[#1475e1] text-white"
                  : "bg-[#0f212e] text-[#b1bad3] hover:bg-[#213743] hover:text-white"
              }`}
            >
              {t(tab.labelKey)}
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
        {isOpen && panel.tab === WALLET_TAB.deposit && <DepositPage />}
        {isOpen && panel.tab === WALLET_TAB.withdraw && <WithdrawPage />}
        {isOpen && panel.tab === WALLET_TAB.status && <WithdrawStatusPage />}
        {isOpen && panel.tab === WALLET_TAB.bonus && <BonusPage />}
      </div>

      {/* Promo codes only apply to deposits */}
      {isOpen && panel.tab === WALLET_TAB.deposit && (
        <div className="shrink-0 border-t border-[#2f4553] px-4 py-3">
          <AcceptPromoCode />
        </div>
      )}
    </SiteDialog>
  );
}
