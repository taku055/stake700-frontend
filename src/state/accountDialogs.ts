import { signal } from "@preact/signals-react";

export const WALLET_TAB = {
  deposit: "/balance-management/deposit",
  withdraw: "/balance-management/withdraw",
  status: "/balance-management/withdraw-status",
  bonus: "/balance-management/bonus",
} as const;

export const PROFILE_TAB = {
  details: "/my-profile/personal-details",
  password: "/my-profile/change-password",
} as const;

export const HISTORY_TAB = {
  transactions: "/balance-management/transaction-history",
  casino: "/bet-history/casino",
  sports: "/bet-history/sports",
} as const;

export type AccountDialogId = "wallet" | "profile" | "history";
export type WalletTab = (typeof WALLET_TAB)[keyof typeof WALLET_TAB];
export type ProfileTab = (typeof PROFILE_TAB)[keyof typeof PROFILE_TAB];
export type HistoryTab = (typeof HISTORY_TAB)[keyof typeof HISTORY_TAB];

type PanelState<T extends string> = {
  isOpen: boolean;
  tab: T;
  bonusId?: string;
};

export const walletPanelState = signal<PanelState<WalletTab>>({
  isOpen: false,
  tab: WALLET_TAB.deposit,
});

export const profilePanelState = signal<PanelState<ProfileTab>>({
  isOpen: false,
  tab: PROFILE_TAB.details,
});

export const historyPanelState = signal<PanelState<HistoryTab>>({
  isOpen: false,
  tab: HISTORY_TAB.transactions,
});

const WALLET_TABS = new Set<string>(Object.values(WALLET_TAB));
const PROFILE_TABS = new Set<string>(Object.values(PROFILE_TAB));
const HISTORY_TABS = new Set<string>(Object.values(HISTORY_TAB));

export function isWalletTab(tab?: string): tab is WalletTab {
  return !!tab && WALLET_TABS.has(tab);
}

export function isProfileTab(tab?: string): tab is ProfileTab {
  return !!tab && PROFILE_TABS.has(tab);
}

export function isHistoryTab(tab?: string): tab is HistoryTab {
  return !!tab && HISTORY_TABS.has(tab);
}

export function accountDialogForTab(tab?: string): AccountDialogId {
  if (!tab || tab.startsWith("/my-profile")) return "profile";
  if (tab.startsWith("/bet-history") || tab.includes("transaction-history")) {
    return "history";
  }
  return "wallet";
}

export function openAccountDialog(defaultTab?: string, bonusId?: string) {
  const dialog = accountDialogForTab(defaultTab);

  walletPanelState.value = {
    isOpen: dialog === "wallet",
    tab: isWalletTab(defaultTab) ? defaultTab : WALLET_TAB.deposit,
    bonusId: dialog === "wallet" ? bonusId : undefined,
  };
  profilePanelState.value = {
    isOpen: dialog === "profile",
    tab: isProfileTab(defaultTab) ? defaultTab : PROFILE_TAB.details,
  };
  historyPanelState.value = {
    isOpen: dialog === "history",
    tab: isHistoryTab(defaultTab) ? defaultTab : HISTORY_TAB.transactions,
  };
}

export function closeAccountDialogs() {
  if (walletPanelState.value.isOpen) {
    walletPanelState.value = { ...walletPanelState.value, isOpen: false };
  }
  if (profilePanelState.value.isOpen) {
    profilePanelState.value = { ...profilePanelState.value, isOpen: false };
  }
  if (historyPanelState.value.isOpen) {
    historyPanelState.value = { ...historyPanelState.value, isOpen: false };
  }
}
