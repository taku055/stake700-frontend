import { signal } from "@preact/signals";

export const accessTokenState = signal<string | null | undefined>(null);
