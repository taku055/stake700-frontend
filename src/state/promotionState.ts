import { signal } from "@preact/signals";
import { tPromotion } from "@/types/tPromotion";

export const promotionState = signal<tPromotion[]>([]);
