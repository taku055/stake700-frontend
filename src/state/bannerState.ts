import { tBanner } from "@/types/tBanner";
import { signal } from "@preact/signals";

export const bannerState = signal<tBanner[]>([]);
