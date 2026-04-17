import { signal } from "@preact/signals";

export const navigationSidebarExpandedState = signal<boolean>(true); // Default to collapsed on desktop
export const navigationSidebarOpenState = signal<boolean>(true); // For mobile drawer

