import { signal } from "@preact/signals-react";

type tDepositDialogState = {
  isOpen: boolean;
  defaultTab?: string;
}

export const depositDialogState = signal<tDepositDialogState>({
  isOpen: false,
  defaultTab: "Deposit",
});
