"use client";

import type { ReactNode } from "react";
import { CategoryCountsContext } from "./hooks/useSectionCategories";

/** Lets server pages pass curated category counts down to client components. */
export default function CategoryCountsProvider({
  counts,
  children,
}: {
  counts?: Record<string, number>;
  children: ReactNode;
}) {
  return <CategoryCountsContext.Provider value={counts}>{children}</CategoryCountsContext.Provider>;
}
