import { signal } from "@preact/signals";

export const selectedTabState = signal<"casino" | "sports" | null>(null);