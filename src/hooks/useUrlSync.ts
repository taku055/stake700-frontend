import { useState, useEffect } from "preact/hooks";
import { useLocation } from "preact-iso";

const ALL_PROVIDERS_ID = "__ALL_PROVIDERS__";

export function useUrlSync() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);

  // Sync providers and search query from URL query parameters
  useEffect(() => {
    // Update selected providers from URL
    if (location.query.provider) {
      const providerParam = location.query.provider;
      const providers = Array.isArray(providerParam) 
        ? providerParam 
        : providerParam.split(",").filter(p => p);
      setSelectedProviders(providers);
    } else {
      // If no provider in URL, reset to "All Providers"
      setSelectedProviders([]);
    }

    // Update search query from URL
    if (location.query.keyword) {
      setSearchQuery(String(location.query.keyword));
    } else {
      setSearchQuery("");
    }
  }, [location.query]);

  return {
    searchQuery,
    setSearchQuery,
    selectedProviders,
    setSelectedProviders,
  };
}

