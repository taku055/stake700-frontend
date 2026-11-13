import { signal } from "@preact/signals-react";

type tSidebarExpandedState =
  | null
  | "notification"
  | "favorite"
  | "setting"
  | "live-support"
  | "bet"
  | "more-tool";

export const sidebarExpandedState = signal<tSidebarExpandedState>(null);
