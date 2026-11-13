import { signal } from "@preact/signals-react";

/** Full-screen blocking loader for explicit long operations. Off by default so pages render immediately. */
export const globalLoadingState = signal<boolean>(false);
