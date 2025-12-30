import { FunctionalComponent } from "preact";
import { useState, useMemo, useEffect } from "preact/hooks";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@/components/common/Dropdown";
import { useTranslations } from "@/context/I18nContext";
import { tProvider } from "@/types/tProvider";
import { Filter, ChevronUp, ChevronDown } from "lucide-preact";
import { apiGetGames } from "@/api/common/apiGetGames";
import { useLocation } from "preact-iso";
import { useCategoryParams } from "@/hooks/useCategoryParams";
import { customGamesState } from "@/state/customGamesState";

interface ProviderSelectionProps {
  providers: tProvider[];
  selectedProviders: string[];
  allProvidersId: string;
  isAllProvidersSelected: boolean;
  onToggleProvider: (providerId: string) => void;
  onResetProviders: () => void;
  selectedCategory?: string;
}

export const ProviderSelection: FunctionalComponent<ProviderSelectionProps> = ({
  providers,
  selectedProviders,
  allProvidersId,
  isAllProvidersSelected,
  onToggleProvider,
  onResetProviders,
  selectedCategory,
}) => {
  const t = useTranslations("CasinoDetailPage");
  const location = useLocation();
  const { getCategoryParams } = useCategoryParams();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [providerCounts, setProviderCounts] = useState<Record<string, number>>({});

  // Get individual providers (excluding ALL_PROVIDERS_ID)
  const individualProviders = useMemo(() => {
    return selectedProviders.filter(id => id !== allProvidersId);
  }, [selectedProviders, allProvidersId]);

  // Count of selected providers
  const selectedCount = useMemo(() => {
    return individualProviders.length;
  }, [individualProviders]);

  // Load provider counts
  useEffect(() => {
    const loadProviderCounts = async () => {
      const counts: Record<string, number> = {};
      
      // For live casino page (when selectedCategory is not provided), use location.query.category directly
      // For casino pages, use selectedCategory
      let categoryPath = selectedCategory;
      let categoryToUseDirect = null;
      
      if (!categoryPath) {
        // Live casino page - use location.query.category directly
        categoryToUseDirect = location.query.category || "livecasino";
      } else {
        // Casino page - parse the categoryPath
        const categoryParams = getCategoryParams(categoryPath);
        
        // For custom=1 categories (slots custom categories), use customGamesState
        // Live casino uses custom=2, so it should use API (not customGamesState)
        const isCustomCategory = categoryParams.custom && categoryParams.category;
        const isSlotsCustomCategory = categoryPath.includes("/casino/slots") && isCustomCategory;
      
        if (isSlotsCustomCategory) {
          // Wait for customGamesState to be populated (max 5 seconds)
          let attempts = 0;
          while (customGamesState.value.length === 0 && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
          }
          
          // Count from customGamesState for each provider
          const categoryGames = customGamesState.value.filter(
            (c) => c.category === categoryParams.category
          );
          
          providers.forEach((provider) => {
            const providerGames = categoryGames.filter(
              (c) => c.Game?.providerId === provider.id
            );
            counts[provider.id] = providerGames.length;
          });
        } else {
          // Regular category or live casino (custom=2) - use API
          // Determine the category to use - match logic from useCasinoGames
          if (categoryPath.includes("/casino/slots") && !categoryParams.category) {
            categoryToUseDirect = "slots";
          } else if (categoryPath.includes("/casino/live-casino") && !categoryParams.category) {
            categoryToUseDirect = "livecasino";
          } else if (categoryParams.category) {
            categoryToUseDirect = categoryParams.category;
          } else {
            // Fallback to location.query.category
            categoryToUseDirect = location.query.category || "livecasino";
          }
        }
      }
      
      // Use API to load counts (unless we already counted from customGamesState above)
      if (categoryToUseDirect !== null) {
        // Load count for each provider from API
        await Promise.all(
          providers.map(async (provider) => {
            try {
              const result = await apiGetGames({
                category: categoryToUseDirect,
                limit: 1,
                provider: provider.id,
              });
              counts[provider.id] = result.total || 0;
            } catch (error) {
              console.error(`Error loading count for provider ${provider.id}:`, error);
              counts[provider.id] = 0;
            }
          })
        );
      }
      
      setProviderCounts(counts);
    };

    if (providers.length > 0) {
      loadProviderCounts();
    }
  }, [providers, selectedCategory, location.query.category, getCategoryParams, location]);

  const handleToggleProvider = (providerId: string) => {
    onToggleProvider(providerId);
  };

  const handleClearAll = () => {
    onResetProviders();
  };

  return (
    <div className="flex items-center gap-3 z-105">
      {/* Filter Label with Icon */}
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-gray-300" />
        <span className="text-gray-300 text-sm font-semibold">
          {t("Filter") || "Filter"}
        </span>
      </div>

      {/* Publishers Dropdown Button */}
      <Dropdown open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownTrigger>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-[var(--background-secondary)] hover:bg-[var(--background-btn-hover)] text-gray-300 rounded-lg transition-colors font-semibold"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>{t("Publishers") || "Publishers"}</span>
            {selectedCount > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-blue-600 text-white text-xs font-semibold">
                {selectedCount}
              </span>
            )}
            {isDropdownOpen ? (
              <ChevronUp size={16} className="text-gray-300" />
            ) : (
              <ChevronDown size={16} className="text-gray-300" />
            )}
          </button>
        </DropdownTrigger>
        <DropdownMenu
          className="!bg-white min-w-[240px] max-h-[400px] z-2000 overflow-y-auto rounded-lg shadow-lg"
          ariaLabel="Provider selection"
        >
          {/* Provider Items */}
          {providers.map((provider) => {
            const isSelected = individualProviders.includes(provider.id);
            const count = providerCounts[provider.id] || 0;
            
            return (
              <div
                key={provider.id}
                role="menuitem"
                tabIndex={0}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleProvider(provider.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleToggleProvider(provider.id);
                  }
                }}
                className="cursor-pointer select-none outline-none px-3 py-2.5 hover:bg-gray-50 bg-white"
              >
                <div className="flex items-center justify-between w-full gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="w-4 h-4 cursor-pointer flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleProvider(provider.id);
                      }}
                    />
                    <span className="text-gray-800 text-sm font-normal truncate">{provider.name}</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${
                      isSelected
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {count}
                  </span>
                </div>
              </div>
            );
          })}
          
          {/* Clear All Button */}
          <div className="border-t border-gray-200 mt-1">
            <DropdownItem
              onPress={handleClearAll}
              className="!px-3 !py-2.5 text-center hover:!bg-gray-50 !bg-white"
            >
              <span className="text-gray-800 text-sm font-semibold">
                {t("Clear All") || "Clear All"}
              </span>
            </DropdownItem>
          </div>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

