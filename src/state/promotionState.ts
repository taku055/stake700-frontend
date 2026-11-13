import { signal } from "@preact/signals-react";
import { tPromotion } from "@/types/tPromotion";

export const promotionState = signal<tPromotion[]>([]);
