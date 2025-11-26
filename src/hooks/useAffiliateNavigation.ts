import { useLocation } from "preact-iso";
import { useMemo, useCallback } from "preact/hooks";
import { scrollToTop } from "@/helpers/scrollToTop";

export const REF_STORAGE_KEY = "ref";

function addRefToPath(path: string, refCode?: string): string {
  if (!refCode) return path;

  // Check if path already has query parameters
  const [basePath, existingQuery] = path.split("?");

  if (existingQuery) {
    // Path has existing query parameters, merge them
    const params = new URLSearchParams(existingQuery);
    // Don't override if ref already exists
    if (!params.has("ref")) {
      params.set("ref", refCode);
    }
    return `${basePath}?${params.toString()}`;
  } else {
    // No existing query parameters, just append ref
    return `${path}?ref=${encodeURIComponent(refCode)}`;
  }
}

export function useAffiliateNavigation() {
  const location = useLocation();
  const { route } = location;

  const refCode = useMemo(
    () => location.query?.[REF_STORAGE_KEY],
    [location.query?.[REF_STORAGE_KEY]]
  );

  const handleNavigate = useCallback(
    (path: string) => {
      scrollToTop();
      const urlWithRef = addRefToPath(path, refCode);
      route(urlWithRef, true);
      // Ensure scroll happens after navigation completes
      setTimeout(() => {
        scrollToTop();
      }, 100);
    },
    [refCode, route]
  );

  // Function to modify href for anchor tags
  const modifyHref = useCallback(
    (href: string): string => {
      return addRefToPath(href, refCode);
    },
    [refCode]
  );

  return { handleNavigate, refCode, modifyHref };
}
