import { signal } from "@preact/signals-react";

export const accessTokenState = signal<string | null | undefined>(null);
