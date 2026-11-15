import { useCallback, useEffect, useRef, useState } from "react";

/**
 * State and actions for prev/next buttons on a horizontal scroller.
 * Works in LTR and RTL (scrollLeft is negative in RTL).
 */
export function useScrollArrows<T extends HTMLElement = HTMLDivElement>(deps: unknown[] = []) {
  const ref = useRef<T>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft);
    setEdges({ start: pos <= 4, end: pos >= max - 4 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    for (const child of Array.from(el.children)) ro.observe(child);
    el.addEventListener("scroll", sync, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sync, ...deps]);

  /** Scroll roughly one viewport toward the end (true) or the start (false). */
  const scroll = useCallback((towardEnd: boolean) => {
    const el = ref.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    const step = el.clientWidth * 0.8 * (towardEnd ? 1 : -1) * (rtl ? -1 : 1);
    el.scrollBy({ left: step, behavior: "smooth" });
  }, []);

  return { ref, atStart: edges.start, atEnd: edges.end, canScroll: !(edges.start && edges.end), scroll };
}
