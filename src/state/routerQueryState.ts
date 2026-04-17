import { signal } from "@preact/signals";

export const routerQueryState = signal<Record<string, string | undefined>>({});
