import { signal } from "@preact/signals";

export const registerOpenedState = signal<boolean>(false);

export const signupStep1OpenedState = signal<boolean>(false);
export const signupStep2OpenedState = signal<boolean>(false);
export const signupStep3OpenedState = signal<boolean>(false);

export const welcomeDialogOpenedState = signal<boolean>(false);

export const walletDialogOpenedState = signal<boolean>(false);