import { signal } from "@preact/signals";

/** When true, the wide sidebar drawer is shown; when false, only the narrow icon rail. */
export const navigationSidebarExpandedState = signal<boolean>(false);

export const navigationSidebarOpenState = signal<boolean>(false); // For mobile drawer

