"use client";

import { useState, type ReactNode } from "react";

/**
 * Collapses long SEO copy to a short preview. The full text is always in the
 * HTML (only clipped with CSS), so crawlers index all of it.
 */
export default function SeoCollapse({
  children,
  moreLabel,
  lessLabel,
}: {
  children: ReactNode;
  moreLabel: string;
  lessLabel: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div
        className={`relative overflow-hidden transition-[max-height] duration-300 ${open ? "max-h-none" : "max-h-[180px]"}`}
      >
        {children}
        {!open && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--bar-background-color)] to-transparent"
          />
        )}
      </div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-3 text-[13px] font-semibold text-[var(--primary-color)] hover:underline"
      >
        {open ? lessLabel : moreLabel}
      </button>
    </div>
  );
}
