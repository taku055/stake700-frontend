import { useState, useMemo, useEffect } from "preact/hooks";
import { Input } from "@heroui/react";
import { Search, ChevronDown, X } from "lucide-preact";
import { providerState } from "@/state/providerState";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, useDropdown } from "@/components/common/Dropdown";
import { useTranslations } from "@/context/I18nContext";
import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery, RTL_LANGUAGES } from "@/config/constants";
import { useCasinoCategories } from "@/hooks/useCasinoCategories";
import { localeState } from "@/state/localeState";

const ALL_PROVIDERS_ID = "__ALL_PROVIDERS__";

interface GameFilterSidebarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedProviders?: string[];
  onProvidersChange?: (providers: string[]) => void;
  selectedCategory?: string | null;
  onCategoryChange?: (category: string | null) => void;
}

function ProviderDropdownItem({
  provider,
  isSelected,
  onToggle,
}: {
  provider: { id: string; name: string };
  isSelected: boolean;
  onToggle: () => void;
}) {
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle();
  };

  return (
    <div
      role="menuitem"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      className={`cursor-pointer select-none outline-none px-3 py-2 rounded-sm hover:bg-[#041e52] focus:bg-[#041e52] ${
        isSelected ? "bg-[var(--background-color-active)]" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {}}
          className="w-4 h-4"
        />
        <span>{provider.name}</span>
      </div>
    </div>
  );
}

export default function GameFilterSidebar({
  searchQuery = "",
  onSearchChange,
  selectedProviders = [],
  onProvidersChange,
  selectedCategory = null,
  onCategoryChange,
}: GameFilterSidebarProps) {
  const t = useTranslations("HomePage");
  const [providerSearch, setProviderSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { modifyHref } = useAffiliateNavigation();
  const isMobile = useMediaQuery(mobileMediaQuery);
  const [categoriesWithCounts, setCategoriesWithCounts] = useState<Array<{
    name: string;
    path: string;
    icon: string;
    count?: number;
  }>>([]);
  const { categories, getCachedCategoryCount, getCategoryGameCount } = useCasinoCategories();
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  // Check if "All Providers" is selected
  const isAllProvidersSelected = useMemo(() => {
    return selectedProviders.length === 0 || selectedProviders.includes(ALL_PROVIDERS_ID);
  }, [selectedProviders]);

  // Get individual providers (excluding ALL_PROVIDERS_ID)
  const individualProviders = useMemo(() => {
    return selectedProviders.filter(id => id !== ALL_PROVIDERS_ID);
  }, [selectedProviders]);

  // Get available providers
  const availableProviders = useMemo(() => {
    return providerState.value.array.filter((p) => p.added_slot);
  }, [providerState.value.array]);

  // Filter providers based on search
  const filteredProviders = useMemo(() => {
    return availableProviders.filter((p) =>
      p.name.toLowerCase().includes(providerSearch.toLowerCase())
    );
  }, [availableProviders, providerSearch]);

  const toggleProvider = (providerId: string) => {
    if (providerId === ALL_PROVIDERS_ID) {
      // Toggle "All Providers"
      if (isAllProvidersSelected) {
        // Deselect "All Providers" - clear all selections
        onProvidersChange?.([]);
      } else {
        // Select "All Providers" - clear individual selections
        onProvidersChange?.([ALL_PROVIDERS_ID]);
      }
    } else {
      // Toggle individual provider
      if (isAllProvidersSelected) {
        // If "All Providers" is selected, replace it with this provider
        onProvidersChange?.([providerId]);
      } else {
        // Toggle individual provider
        const newProviders = individualProviders.includes(providerId)
          ? individualProviders.filter((id) => id !== providerId)
          : [...individualProviders, providerId];
        
        // If no providers selected, default to "All Providers"
        if (newProviders.length === 0) {
          onProvidersChange?.([]);
        } else {
          onProvidersChange?.(newProviders);
        }
      }
    }
  };

  const removeProvider = (providerId: string) => {
    const newProviders = individualProviders.filter((id) => id !== providerId);
    
    // If no providers selected, default to "All Providers"
    if (newProviders.length === 0) {
      onProvidersChange?.([]);
    } else {
      onProvidersChange?.(newProviders);
    }
  };

  // Get display content for dropdown trigger
  const getProviderDisplayContent = useMemo(() => {
    if (isAllProvidersSelected) {
      return <div className="text-[#FFFFFF] text-[14px]">{t("All Providers") || "All Providers"}</div>;
    }
    
    if (individualProviders.length === 1) {
      const provider = availableProviders.find((p) => p.id === individualProviders[0]);
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[var(--background-secondary)] px-2 py-1 rounded-md">
            <span className="text-[#FFFFFF] text-[14px]">{provider?.name || ""}</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeProvider(individualProviders[0]);
              }}
              className="ml-1 hover:opacity-70 transition-opacity"
            >
              <X size={14} color="#FFFFFF" />
            </button>
          </div>
        </div>
      );
    }
    // More than 1 selection: show first provider with X + "+X more" badge
    const firstProvider = availableProviders.find((p) => p.id === individualProviders[0]);
    const remainingCount = individualProviders.length - 1;
    
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 bg-[var(--background-secondary)] px-2 py-1 rounded-md">
          <span className="text-[#FFFFFF] text-[14px]">{firstProvider?.name || ""}</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeProvider(individualProviders[0]);
            }}
            className="ml-1 hover:opacity-70 transition-opacity"
          >
            <X size={14} color="#FFFFFF" />
          </button>
        </div>
        {remainingCount > 0 && (
          <div className="bg-[var(--background-secondary)] px-2 py-1 rounded-md">
            <span className="text-[#FFFFFF] text-[14px]">+{remainingCount}</span>
          </div>
        )}
      </div>
    );
  }, [isAllProvidersSelected, individualProviders, availableProviders]);

  // Load category counts once and use cached values
  useEffect(() => {
    const loadCategoryCounts = async () => {
      // Use cached values initially
      const categoriesWithCountsData = categories.map((cat) => ({
        ...cat,
        count: getCachedCategoryCount(cat.path),
      }));
      setCategoriesWithCounts(categoriesWithCountsData);
      
      // Load counts asynchronously
      categories.forEach((cat) => {
        getCategoryGameCount(cat.path).then((count) => {
          setCategoriesWithCounts((prev) => {
            return prev.map((c) => (c.path === cat.path ? { ...c, count } : c));
          });
        }).catch((error) => {
          console.error(`Error loading count for ${cat.path}:`, error);
        });
      });
    };
    loadCategoryCounts();
  }, [categories, getCachedCategoryCount, getCategoryGameCount]);

  // Categories section - displayed in a row
  const categoriesSection = (
    <div className="flex flex-col gap-2 bg-[var(--bar-background-color)] rounded-sm p-2 text-white">
      <div className={`flex ${isMobile ? 'flex-row overflow-x-auto gap-2 pb-2' : 'flex-col gap-2'}`}>
        {categoriesWithCounts.map((category, index) => {
          const isSelected = selectedCategory === category.path;
          return (
            <button
              key={index}
              onClick={() => {
                if (onCategoryChange) {
                  onCategoryChange(isSelected ? null : category.path);
                }
              }}
              className={`flex items-center gap-2 px-2 py-2 rounded-lg text-[#FFFFFF] hover:bg-[#fff2] transition-colors whitespace-nowrap ${
                isMobile ? 'flex-shrink-0' : ''
              } ${
                isSelected ? 'bg-[var(--background-secondary)]' : ''
              }`}
            >
              {category.icon && (
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-6 h-6 flex-shrink-0 object-contain"
                />
              )}
              <span className="text-[18px] text-ellipsis overflow-hidden whitespace-nowrap">{category.name}</span>
              {category.count !== undefined && (
                <span className={`bg-[var(--background-secondary)] text-[#FFFFFF] text-xs px-1.5 py-0.5 rounded-full ${isRTL ? 'mr-auto' : 'ml-auto'}`}>
                  {category.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  // Search section
  const searchSection = (
    <div className="flex flex-col gap-2">
      <Input
        endContent={<Search size={16} color="var(--text-transparent-color)" />}
        placeholder={t("Search Games") || "Search Games"}
        value={searchQuery}
        variant="bordered"
        className="mb-4"
        classNames={{
          inputWrapper:
            "bg-[#122543] border-none rounded-sm! hover:bg-[#fff2] focus-within:hover:bg-[#fff2]",
          input: "text-[#ffffff] text-[16px]",
        }}
        onChange={(e) => {
          const target = e.target as HTMLInputElement | null;
          onSearchChange?.(target?.value ?? "");
        }}
      />
    </div>
  );

  // Providers section
  const providersSection = (
    <div className="flex flex-col gap-2">
      <Dropdown open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownTrigger>
          <button className="w-full bg-[var(--bar-background-color)] border-none rounded-sm hover:bg-[var(--background-secondary)] px-3 py-3 flex items-center justify-between text-left text-[#ffffff] text-[16px]">
            <span className="truncate flex items-center gap-2">
              {getProviderDisplayContent}
            </span>
            <ChevronDown size={16} color="var(--text-transparent-color)" />
          </button>
        </DropdownTrigger>
        <DropdownMenu
          className="bg-[var(--bar-background-color)] max-h-[300px] overflow-y-auto"
          widthMatchTrigger={true}
        >
          {/* Provider Search inside dropdown */}
          <div className="p-2 sticky top-0 bg-[var(--bar-background-color)] z-10">
            <Input
              size="sm"
              placeholder={t("Search Providers") || "Search Providers"}
              value={providerSearch}
              variant="bordered"
              classNames={{
                inputWrapper:
                  "bg-[var(--bar-background-color)] border-none rounded-sm! hover:bg-[var(--background-secondary)]",
                input: "text-[#ffffff] text-[14px] px-2 py-4",
              }}
              onChange={(e) => {
                const target = e.target as HTMLInputElement | null;
                setProviderSearch(target?.value ?? "");
              }}
            />
          </div>
          
          {/* All Providers Option */}
          <ProviderDropdownItem
            provider={{ id: ALL_PROVIDERS_ID, name: t("All Providers") || "All Providers" }}
            isSelected={isAllProvidersSelected}
            onToggle={() => toggleProvider(ALL_PROVIDERS_ID)}
          />
          
          {/* Divider */}
          <div className="h-px bg-[#FFFFFF1A] my-1" />
          
          {/* Individual Providers */}
          {filteredProviders.map((provider) => (
            <ProviderDropdownItem
              key={provider.id}
              provider={provider}
              isSelected={individualProviders.includes(provider.id)}
              onToggle={() => toggleProvider(provider.id)}
            />
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );

  return (
    <div className={`${isMobile ? 'w-full' : 'w-[16%]'} ${isMobile ? '' : 'flex-shrink-0'} flex flex-col gap-4`}>
      {/* Mobile: Categories → Search → Providers */}
      {/* Desktop: Search → Providers → Categories */}
      {isMobile ? (
        <>
          {categoriesSection}
          {searchSection}
          {providersSection}
        </>
      ) : (
        <>
          {searchSection}
          {providersSection}
          {categoriesSection}
        </>
      )}
    </div>
  );
}