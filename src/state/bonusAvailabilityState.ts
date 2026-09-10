import { signal } from "@preact/signals";
import { tBonusAvailabilityPublic } from "@/api/bonus/apiGetBonusAvailability";

export const bonusAvailabilityState = signal<tBonusAvailabilityPublic>({
  defaultLivecasino: true,
  defaultSlot: true,
  settings: {},
});
