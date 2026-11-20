import { tBanner } from "@/types/tBanner";
import { signal } from "@preact/signals-react";

export const bannerState = signal<tBanner[]>([]);

/** True once the banner request finished (with or without banners). */
export const bannersLoadedState = signal(false);
