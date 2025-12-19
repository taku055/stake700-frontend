import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { Search } from "lucide-preact";
import { navigationSidebarOpenState } from "@/state/navigationSidebarState";
import { useTranslations } from "@/context/I18nContext";
import CategoryItems from "./CategoryItems";
import { useState, useMemo, useEffect } from "preact/hooks";
import { Input } from "@/components/common";
import LocaleSelection from "@/components/LocaleSelection";
import { localeState } from "@/state/localeState";
import { useCasinoCategories } from "@/hooks/useCasinoCategories";
import { useLiveCasinoCategories } from "@/hooks/useLiveCasinoCategories";
import { RTL_LANGUAGES } from "@/config/constants";
import { Link } from "../common";

interface MobileDrawerProps {
  mainNavItems: Array<{
    title: string;
    href: string;
    key: string;
    icon: any;
    navIcon?: string;
  }>;
  ExtraNavItems: Array<{
    title: string;
    href: string;
    key: string;
    icon: any;
    navIcon?: string;
  }>;
  selectedMainNavKey?: string;
  categories: Array<{
    name: string;
    path: string;
    icon?: string;
  }>;
  selectedMainNavTitle?: string;
}

export default function MobileDrawer({
  mainNavItems,
  ExtraNavItems,
  selectedMainNavKey,
  categories,
  selectedMainNavTitle,
}: MobileDrawerProps) {
  const t = useTranslations("Header");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"casino" | "live-casino">("casino");
  const [categoriesWithCounts, setCategoriesWithCounts] = useState<Array<{
    name: string;
    path: string;
    icon: string;
    count?: number;
  }>>([]);
  const { modifyHref, handleNavigate } = useAffiliateNavigation();
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const { categories: casinoCategories, getCachedCategoryCount, getCategoryGameCount } = useCasinoCategories();
  const { categories: liveCasinoCategories } = useLiveCasinoCategories();

  // Get categories based on selected tab
  const currentCategories = useMemo(() => {
    return selectedTab === "casino" ? casinoCategories : liveCasinoCategories;
  }, [selectedTab, casinoCategories, liveCasinoCategories]);

  // Filter main nav items for top section (Casino, Live Casino, Sportsbook)
  const topNavItems = useMemo(() => {
    return mainNavItems.filter((item) =>
      ["slots", "live-casino", "sport", "promotions"].includes(item.key)
    );
  }, [mainNavItems]);

  // Show categories immediately (without waiting for counts)
  useEffect(() => {
    setCategoriesWithCounts(currentCategories.map((cat) => ({
      ...cat,
      count: getCachedCategoryCount(cat.path),
    })));
  }, [currentCategories, getCachedCategoryCount]);

  // Load counts asynchronously and update as they become available
  useEffect(() => {
    // Load counts for each category in parallel and update state as each completes
    currentCategories.forEach((cat) => {
      getCategoryGameCount(cat.path).then((count) => {
        setCategoriesWithCounts((prev) => {
          return prev.map((c) => (c.path === cat.path ? { ...c, count } : c));
        });
      }).catch((error) => {
        console.error(`Error loading count for ${cat.path}:`, error);
      });
    });
  }, [currentCategories, getCategoryGameCount]);

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        type="button"
        aria-hidden="true"
        onClick={() => {
          navigationSidebarOpenState.value = false;
        }}
        className="absolute inset-0 bg-black/50 transition-opacity duration-300 ease-out rotate-180"
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
            className={`absolute border-none ${isRTL ? 'left-0 translate-x-[-50%]' : 'right-0 translate-x-1/2'} top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--background)] p-2 ratio-1/1 flex items-center justify-center`}
            onClick={() => {
              navigationSidebarOpenState.value = false;
            }}
          >
            <img 
              src="/images/sidebar/expand.svg" 
              alt="sidebararrow" 
              className={`transition-transform duration-300 rotate-180 ${
                isRTL ? 'scale-x-[-1]' : ''
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto sidebar-scrollbar">
          {/* Tab Selector (Casino / Live Casino) */}
          {/* <div className="p-4 border-b border-gray-700">
            <div className="flex flex-row gap-2">
              <button
                onClick={() => setSelectedTab("casino")}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  selectedTab === "casino"
                    ? "bg-[#134077] text-white"
                    : "bg-[var(--background-secondary)] text-gray-300 hover:bg-gray-700"
                }`}
              >
                {t("Casino") || "Casino"}
              </button>
              <button
                onClick={() => setSelectedTab("live-casino")}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  selectedTab === "live-casino"
                    ? "bg-[#134077] text-white"
                    : "bg-[var(--background-secondary)] text-gray-300 hover:bg-gray-700"
                }`}
              >
                {t("Live Casino") || "Live Casino"}
              </button>
            </div>
          </div> */}

          {/* Top Navigation Items (Casino, Live Casino, Sportsbook) */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex flex-col gap-2">
              {topNavItems.map((item) => (
                <Link
                  key={item.key}
                  href={modifyHref(item.href)}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNavigate(modifyHref(item.href));
                    navigationSidebarOpenState.value = false;
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    selectedMainNavKey === item.key
                      ? "bg-[var(--background-btn-hover)] text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <img
                    src={item.navIcon || "/images/sidebar/casino.svg"}
                    alt={item.title}
                    className="w-6 h-6 flex-shrink-0 object-contain"
                  />
                  <span className="flex-1">{item.title}</span>
                </Link>
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
              navigationSidebarOpenState.value = false;
            }}
          />
        </div>
      </div>
    </div>
  );
}

