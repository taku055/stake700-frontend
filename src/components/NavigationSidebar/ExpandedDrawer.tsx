import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { ChevronLeft, ChevronRight, Search } from "lucide-preact";
import { navigationSidebarExpandedState } from "@/state/navigationSidebarState";
import { useTranslations } from "@/context/I18nContext";
import NavigationItems from "./NavigationItems";
import CategoryItems from "./CategoryItems";
import { useState, useMemo, useEffect } from "preact/hooks";
import { Input } from "@/components/common";
import LocaleSelection from "@/components/LocaleSelection";
import { getNavIcon, processCategories, initializeCategoryCounts, getCachedCategoryCount } from "./categoryData";
import { localeState } from "@/state/localeState";

const RTL_LANGUAGES = ["ar", "he", "fa"];

interface ExpandedDrawerProps {
  mainNavItems: Array<{
    title: string;
    href: string;
    key: string;
    icon: any;
  }>;
  selectedMainNavKey?: string;
  categories: Array<{
    name: string;
    path: string;
    icon?: string;
  }>;
  selectedMainNavTitle?: string;
}

export default function ExpandedDrawer({
  mainNavItems,
  selectedMainNavKey,
  categories,
  selectedMainNavTitle,
}: ExpandedDrawerProps) {
  const t = useTranslations("Header");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesWithCounts, setCategoriesWithCounts] = useState<Array<{
    name: string;
    path: string;
    icon: string;
    count?: number;
  }>>([]);
  const { modifyHref } = useAffiliateNavigation();
  const isRTL = RTL_LANGUAGES.includes(localeState.value);

  // Filter main nav items for top section (Casino, Live Casino, Sportsbook)
  const topNavItems = useMemo(() => {
    return mainNavItems.filter((item) =>
      ["slots", "live-casino", "sport"].includes(item.key)
    );
  }, [mainNavItems]);

  // Initialize category counts once and use cached values
  useEffect(() => {
    const loadCategoryCounts = async () => {
      // Initialize counts if not already loaded
      await initializeCategoryCounts(categories);
      
      // Use cached values
      const categoriesWithIcons = processCategories(categories);
      const categoriesWithCountsData = categoriesWithIcons.map((cat) => ({
        ...cat,
        count: getCachedCategoryCount(cat.path),
      }));
      setCategoriesWithCounts(categoriesWithCountsData);
    };
    loadCategoryCounts();
  }, [categories]);

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        type="button"
        aria-hidden="true"
        onClick={() => {
          navigationSidebarExpandedState.value = false;
        }}
        className="absolute inset-0 bg-black/50 transition-opacity duration-300 ease-out"
      />

      {/* Panel */}
      <div
        className={`absolute inset-y-0 ${isRTL ? 'right-0' : 'left-0'} bg-[var(--bar-background-color)] shadow-2xl flex flex-col transition-transform duration-300 ease-out will-change-transform w-80`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search and Locale Selection Row */}
        <div className={`bg-[var(--background-secondary)] flex flex-row items-center gap-2 p-3 ${isRTL ? 'pl-10' : 'pr-10'} relative`}>
          <div className="flex-1">
            <Input
              label={"Search"}
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
              variant="bordered"
              endContent={<Search size={16} color="var(--text-transparent-color)" />}
              classNames={{
                inputWrapper:
                  "bg-[var(--background)] border-none rounded-sm!",
                input: "text-white text-[14px]",
                label: "text-[#FFFFFF]",
              }}
            />
          </div>
          <div className="flex-shrink-0">
            <LocaleSelection headerMode={false} />
          </div>
          <button
            className={`absolute border-none ${isRTL ? 'left-0 translate-x-[-50%]' : 'right-0 translate-x-1/2'} top-1/2 rotate-180 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--background)] p-2 ratio-1/1 flex items-center justify-center`}
            onClick={() => {
              navigationSidebarExpandedState.value = false;
            }}
          >
            <img src="/images/sidebar/expand.svg" alt="sidebararrow" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto sidebar-scrollbar">
          {/* Top Navigation Items (Casino, Live Casino, Sportsbook) */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex flex-col gap-2">
              {topNavItems.map((item) => (
                <a
                  key={item.key}
                  href={modifyHref(item.href)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    selectedMainNavKey === item.key
                      ? "bg-[#134077] text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <img
                    src={getNavIcon(item.key)}
                    alt={item.title}
                    className="w-6 h-6 flex-shrink-0 object-contain"
                  />
                  <span className="flex-1">{item.title}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-b border-gray-700" />

          {/* Categories Section - Always shown */}
          <CategoryItems
            categories={categoriesWithCounts}
            title={selectedMainNavTitle || t("Categories")}
            onCategoryClick={() => {
              navigationSidebarExpandedState.value = false;
            }}
          />
        </div>
      </div>
    </div>
  );
}
