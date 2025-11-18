import { signal } from "@preact/signals";

type tSidebarExpandedState =
  | null
  | "notification"
  | "favorite"
  | "setting"
  | "live-support"
  | "bet"
  | "more-tool";

export const sidebarExpandedState = signal<tSidebarExpandedState>(null);
