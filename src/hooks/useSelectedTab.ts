import { useLocation } from "@/router";

export function useSelectedTab() {
  const location = useLocation();

  if (location.path.startsWith("/sport")) {
    return "sports";
  }
  
  return "casino";
}
