import { signal } from "@preact/signals-react";

export const routerQueryState = signal<Record<string, string | undefined>>({});
