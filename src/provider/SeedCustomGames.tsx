"use client";

import type { ReactNode } from "react";
import type { tCustomGame } from "@/types/tCustomGame";
import { customGamesState } from "@/state/customGamesState";

/**
 * Seeds the curated-games state with server-fetched data before children render,
 * so lobby rows are in the server HTML and hydrate without a flash.
 * The data is public and identical for every visitor, so seeding the shared
 * signal on the server is safe. The client bootstrap later replaces it with the
 * full list.
 */
export default function SeedCustomGames({ entries, children }: { entries: tCustomGame[]; children: ReactNode }) {
  if (entries.length && (typeof window === "undefined" || customGamesState.peek().length === 0)) {
    customGamesState.value = entries;
  }
  return <>{children}</>;
}
