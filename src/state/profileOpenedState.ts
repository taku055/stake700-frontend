import { signal } from "@preact/signals";

export interface ProfileOpenedState {
  isOpen: boolean;
  defaultTab?: string;
  bonusId?: string;
}

export const profileOpenedState = signal<ProfileOpenedState>({ isOpen: false });
