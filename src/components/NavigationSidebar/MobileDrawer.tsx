import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { Search } from "lucide-preact";
import { navigationSidebarOpenState } from "@/state/navigationSidebarState";
import { useTranslations } from "@/context/I18nContext";
import CategoryItems from "./CategoryItems";
import { useState, useMemo } from "preact/hooks";
import { Input } from "@/components/common";
import LocaleSelection from "@/components/LocaleSelection";
import { getNavIcon, processCategories } from "./categoryData";

interface MobileDrawerProps {
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

export default function MobileDrawer({
  mainNavItems,
  selectedMainNavKey,
  categories,
  selectedMainNavTitle,
}: MobileDrawerProps) {
  const t = useTranslations("Header");
  const [searchQuery, setSearchQuery] = useState("");
  const { modifyHref } = useAffiliateNavigation();

  // Filter main nav items for top section (Casino, Live Casino, Sportsbook)
  const topNavItems = useMemo(() => {
    return mainNavItems.filter((item) =>
      ["slots", "live-casino", "sport"].includes(item.key)
    );
  }, [mainNavItems]);

  // Process categories with icons
  const categoriesWithIcons = useMemo(() => {
    return processCategories(categories);
  }, [categories]);

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
        className="absolute inset-y-0 left-0 bg-[var(--bar-background-color)] shadow-2xl flex flex-col transition-transform duration-300 ease-out will-change-transform w-80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search and Locale Selection Row */}
        <div className="bg-[var(--background-secondary)] flex flex-row items-center gap-2 p-3 pr-10 relative">
          <div className="flex-1">
            <Input
              type="text"
              label={t("Search") || "Search"}
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
              variant="bordered"
              startContent={<Search size={16} color="#FFFFFF7D" />}
              classNames={{
                inputWrapper:
                  "bg-[#fff1] border-none rounded-sm! hover:bg-[#fff2] focus-within:hover:bg-[#fff2]",
                input: "text-white text-[14px]",
                label: "text-[#FFFFFF80]",
              }}
            />
          </div>
          <div className="flex-shrink-0">
            <LocaleSelection headerMode={false} />
          </div>
          <button
            className="absolute border-none right-0 top-1/2 rotate-180 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full bg-[var(--background)] p-2 ratio-1/1 flex items-center justify-center"
            onClick={() => {
              navigationSidebarOpenState.value = false;
            }}
          >
            <img src="/images/sidebar/expand.svg" alt="sidebararrow" className="rotate-180" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Top Navigation Items (Casino, Live Casino, Sportsbook) */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex flex-col gap-2">
              {topNavItems.map((item) => (
                <a
                  key={item.key}
                  href={modifyHref(item.href)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    selectedMainNavKey === item.key
                      ? "bg-[var(--pink-color)] text-white"
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

          {/* Categories Section */}
          {categoriesWithIcons.length > 0 && (
            <CategoryItems
              categories={categoriesWithIcons}
              title={selectedMainNavTitle || t("Categories")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

