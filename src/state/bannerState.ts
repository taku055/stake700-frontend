import { tBanner } from "@/types/tBanner";
import { signal } from "@preact/signals-react";

export const bannerState = signal<tBanner[]>([]);
