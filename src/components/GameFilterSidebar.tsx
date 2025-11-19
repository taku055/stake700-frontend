import { useState, useMemo } from "preact/hooks";
import { Input } from "@heroui/react";
import { Search, ChevronDown, X } from "lucide-preact";
import { providerState } from "@/state/providerState";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, useDropdown } from "@/components/common/Dropdown";
import { useTranslations } from "@/context/I18nContext";
import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { STATIC_CATEGORIES, processCategories } from "@/components/NavigationSidebar/categoryData";

interface GameFilterSidebarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedProviders?: string[];
  onProvidersChange?: (providers: string[]) => void;
}

// Custom DropdownItem that doesn't close the dropdown
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
    // Don't close the dropdown - comment out or remove the close() call
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
}: GameFilterSidebarProps) {
  const t = useTranslations("HomePage");
  const [providerSearch, setProviderSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { modifyHref } = useAffiliateNavigation();
  const isMobile = useMediaQuery(mobileMediaQuery);

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
    const newProviders = selectedProviders.includes(providerId)
      ? selectedProviders.filter((id) => id !== providerId)
      : [...selectedProviders, providerId];
    onProvidersChange?.(newProviders);
    // Keep dropdown open - don't close it
  };

  const removeProvider = (providerId: string) => {
    const newProviders = selectedProviders.filter((id) => id !== providerId);
    onProvidersChange?.(newProviders);
  };

  // Limit display of selected providers
  const displayedProviders = useMemo(() => {
    if (selectedProviders.length <= 3) {
      return selectedProviders;
    }
    return selectedProviders.slice(0, 2);
  }, [selectedProviders]);

  const remainingCount = selectedProviders.length - displayedProviders.length;

  // Process categories with icons from navigation sidebar
  const categoriesWithIcons = useMemo(() => {
    return processCategories(STATIC_CATEGORIES);
  }, []);

  // Categories section - displayed in a row
  const categoriesSection = (
    <div className="flex flex-col gap-2">
      <label className="text-[#FFFFFF7D] text-[12px] uppercase font-medium">
        {t("Categories") || "Categories"}
      </label>
      <div className={`flex ${isMobile ? 'flex-row overflow-x-auto gap-2 pb-2' : 'flex-col gap-2'}`}>
        {categoriesWithIcons.map((category, index) => (
          <a
            key={index}
            href={modifyHref(category.path)}
            className={`flex items-center gap-2 px-3 py-2 rounded-sm text-[#FFFFFF7D] hover:bg-[#fff2] transition-colors whitespace-nowrap ${
              isMobile ? 'flex-shrink-0' : ''
            }`}
          >
            {category.icon && (
              <img
                src={category.icon}
                alt={category.name}
                className="w-5 h-5 flex-shrink-0 object-contain"
              />
            )}
            <span className="text-[14px]">{category.name}</span>
          </a>
        ))}
      </div>
    </div>
  );

  // Search section
  const searchSection = (
    <div className="flex flex-col gap-2">
      <Input
        size="sm"
        startContent={<Search size={16} color="#FFFFFF7D" />}
        placeholder={t("Search Games") || "Search Games"}
        value={searchQuery}
        variant="bordered"
        classNames={{
          inputWrapper:
            "bg-[#fff1] border-none rounded-sm! hover:bg-[#fff2] focus-within:hover:bg-[#fff2]",
          input: "text-[#FFFFFF7D] text-[16px]",
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
      <label className="text-[#FFFFFF7D] text-[12px] uppercase font-medium">
        {t("Providers") || "Providers"}
      </label>
      <Dropdown open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownTrigger>
          <button className="w-full bg-[#fff1] border-none rounded-sm hover:bg-[#fff2] px-3 py-2 flex items-center justify-between text-left text-[#FFFFFF7D] text-[14px]">
            <span className="truncate">
              {selectedProviders.length === 0
                ? t("Select Providers") || "Select Providers"
                : `${selectedProviders.length} ${t("Selected") || "Selected"}`}
            </span>
            <ChevronDown size={16} color="#FFFFFF7D" />
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
                  "bg-[#fff1] border-none rounded-sm! hover:bg-[#fff2]",
                input: "text-[#FFFFFF7D] text-[14px]",
              }}
              onChange={(e) => {
                const target = e.target as HTMLInputElement | null;
                setProviderSearch(target?.value ?? "");
              }}
            />
          </div>
          {filteredProviders.map((provider) => (
            <ProviderDropdownItem
              key={provider.id}
              provider={provider}
              isSelected={selectedProviders.includes(provider.id)}
              onToggle={() => toggleProvider(provider.id)}
            />
          ))}
        </DropdownMenu>
      </Dropdown>

      {/* Selected Providers Tags - Limited Display */}
      {selectedProviders.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {displayedProviders.map((providerId) => {
            const provider = availableProviders.find((p) => p.id === providerId);
            if (!provider) return null;
            return (
              <div
                key={providerId}
                className="flex items-center gap-1 bg-[var(--background-color-active)] px-2 py-1 rounded text-[12px] text-[#FFFFFF7D]"
              >
                <span>{provider.name}</span>
                <button
                  onClick={() => removeProvider(providerId)}
                  className="hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
          {remainingCount > 0 && (
            <div className="flex items-center gap-1 bg-[var(--background-color-active)] px-2 py-1 rounded text-[12px] text-[#FFFFFF7D]">
              <span>+{remainingCount} more</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className={`${isMobile ? 'w-full' : 'w-[280px]'} ${isMobile ? '' : 'flex-shrink-0'} flex flex-col gap-4`}>
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