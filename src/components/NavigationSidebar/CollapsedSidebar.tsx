import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { ChevronRight } from "lucide-preact";
import { navigationSidebarExpandedState } from "@/state/navigationSidebarState";
import { getNavIcon, processCategories } from "./categoryData";
import { localeState } from "@/state/localeState";

const RTL_LANGUAGES = ["ar", "he", "fa"];

interface CollapsedSidebarProps {
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
}

export default function CollapsedSidebar({
  mainNavItems,
  selectedMainNavKey,
  categories,
}: CollapsedSidebarProps) {
  const { modifyHref } = useAffiliateNavigation();
  const isRTL = RTL_LANGUAGES.includes(localeState.value);

  // Filter main nav items for top section (Casino, Live Casino, Sportsbook)
  const topNavItems = mainNavItems.filter((item) =>
    ["slots", "live-casino", "sport"].includes(item.key)
  );

  // Process categories with icons
  const categoriesWithIcons = processCategories(categories);

  return (
    <div className={`md:flex w-[64px] bg-[var(--bar-background-color)] ${isRTL ? 'border-l' : 'border-r'} border-gray-700 flex-col h-screen sticky top-0`}>
      {/* Expand Button */}
      <div className="flex items-center justify-center p-2 border-b border-gray-700 flex-shrink-0">
        <button
          onClick={() => {
            navigationSidebarExpandedState.value = true;
          }}
          className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-700 transition-colors text-white"
          aria-label="Expand sidebar"
        >
          <img src="/images/sidebar/expand.svg" alt="sidebararrow" className="w-6 h-6" />
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto min-h-0 sidebar-scrollbar">
        {/* Navigation Icons */}
        <div className="flex flex-col items-center py-4 gap-2 flex-shrink-0">
          {topNavItems.map((item) => (
            <a
              key={item.key}
              href={modifyHref(item.href)}
              className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors ${
                selectedMainNavKey === item.key
                  ? "bg-[#134077] text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
              title={item.title}
            >
              <img
                src={getNavIcon(item.key)}
                alt={item.title}
                className="w-6 h-6 object-contain"
              />
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="border-b border-gray-700 mx-2 flex-shrink-0" />

        {/* Category Icons */}
        <div className="flex flex-col items-center py-4 gap-2">
          {categoriesWithIcons.map((category, index) => (
            <a
              key={index}
              href={modifyHref(category.path)}
              className="flex items-center justify-center w-12 h-12 rounded-lg transition-colors text-gray-300 hover:bg-gray-700 flex-shrink-0"
              title={category.name}
            >
              <img
                src={category.icon}
                alt={category.name}
                className="w-6 h-6 object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

