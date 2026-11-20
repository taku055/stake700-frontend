import { useLocation } from "@/router";
import { useMemo, useCallback } from "react";
import { scrollToTop } from "@/helpers/scrollToTop";

export const REF_STORAGE_KEY = "ref";

function addRefToPath(path: string, refCode?: string): string {
  if (!refCode) return path;

  // The query must go before any #hash, or the hash link breaks
  const hashAt = path.indexOf("#");
  const hash = hashAt >= 0 ? path.slice(hashAt) : "";
  const withoutHash = hashAt >= 0 ? path.slice(0, hashAt) : path;
  const [basePath, existingQuery] = withoutHash.split("?");

  if (existingQuery) {
    // Path has existing query parameters, merge them
    const params = new URLSearchParams(existingQuery);
    // Don't override if ref already exists
    if (!params.has("ref")) {
      params.set("ref", refCode);
    }
    return `${basePath}?${params.toString()}${hash}`;
  }
  // No existing query parameters, just append ref
  return `${basePath}?ref=${encodeURIComponent(refCode)}${hash}`;
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
