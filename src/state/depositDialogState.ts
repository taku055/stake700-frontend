import { signal } from "@preact/signals";

type tDepositDialogState = {
  isOpen: boolean;
  defaultTab?: string;
}

export const depositDialogState = signal<tDepositDialogState>({
  isOpen: false,
  defaultTab: "Deposit",
});
