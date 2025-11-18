import { signal } from "@preact/signals";

export const navigationSidebarExpandedState = signal<boolean>(false); // Default to collapsed on desktop
export const navigationSidebarOpenState = signal<boolean>(false); // For mobile drawer

