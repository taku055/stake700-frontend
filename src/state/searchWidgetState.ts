import { signal } from "@preact/signals-react";

/** Whether the search dialog is open. */
export const searchWidgetState = signal<boolean>(false);

export type SearchScope = "all" | "SLOT" | "LIVECASINO";

/** Which game type the search dialog is filtered to. */
export const searchScopeState = signal<SearchScope>("all");

/** Open the search dialog, optionally pre-filtered (e.g. "LIVECASINO" from the live casino pages). */
export function openSearch(scope: SearchScope = "all") {
  searchScopeState.value = scope;
  searchWidgetState.value = true;
}
