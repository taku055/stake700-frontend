import { useCallback, useSyncExternalStore } from "react";

/**
 * SSR-safe media query. While hydrating server HTML it reports `false` (the
 * server can't know the screen size), so the first client render matches the
 * server and React doesn't throw a hydration error; it then updates to the real
 * value. Components mounted later (client navigation) get the real value
 * immediately, with no flash.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
