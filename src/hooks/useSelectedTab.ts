import { useLocation } from "preact-iso";

export function useSelectedTab() {
  const location = useLocation();

  if (location.path.startsWith("/sport")) {
    return "sports";
  }
  
  return "casino";
}
