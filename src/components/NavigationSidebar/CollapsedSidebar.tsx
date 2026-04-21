import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { navigationSidebarExpandedState } from "@/state/navigationSidebarState";
import { localeState } from "@/state/localeState";
import { useMemo } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import { ASSET_BASE_URL, RTL_LANGUAGES } from "@/config/constants";
import { Link } from "../common";
import { useSelectedTab } from "@/hooks/useSelectedTab";
import { sidebarDataState } from "@/state/sidebarData";
import { Menu } from "lucide-preact";

interface CollapsedSidebarProps {
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
}

export default function CollapsedSidebar({
  mainNavItems,
  ExtraNavItems,
  selectedMainNavKey,
}: CollapsedSidebarProps) {
  const { modifyHref, handleNavigate } = useAffiliateNavigation();
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const selectedTab = useSelectedTab();

  const topNavItems = useMemo(() => {
    return mainNavItems;
  }, [mainNavItems]);

  // Get categories based on selected tab
  const categoriesWithIcons = useMemo(() => {
    // return selectedTab === "casino" ? casinoCategories : selectedTab === "live-casino" ? liveCasinoCategories : [];
    return selectedTab === "casino" ? sidebarDataState.value : [];
  }, [selectedTab, sidebarDataState.value]);

  return (
    <div
      className={`sticky top-0 md:flex w-[64px] bg-[var(--bar-background-color)] flex-col h-full`}
    >
      {/* Scrollable Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto min-h-0 scrollbar-hide">
        {/* Navigation Icons */}
        <div className="flex flex-col items-center py-2 gap-1 flex-shrink-0">
          {topNavItems.map((item) => (
            <Link
              key={item.key}
              href={modifyHref(item.href)}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNavigate(modifyHref(item.href));
              }}
              className={`flex items-center justify-center w-10 h-10 p-2 rounded-lg transition-colors ${selectedMainNavKey === item.key
                ? "bg-[var(--bar-background-color-hover)] text-white"
                : "text-gray-300 hover:bg-[var(--bar-background-color-hover)]"
                }`}
              title={item.title}
            >
              {item.icon ? (
                item.icon
              ) : (
                <img
                  src={item.navIcon || `${ASSET_BASE_URL}/images/icons/casino.svg`}
                  alt={item.title}
                  className="w-6 h-6 flex-shrink-0 object-contain"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="border-b-2 border-[var(--bar-background-color)] flex-shrink-0" />

        <div className="flex flex-col items-center py-2 gap-1 flex-shrink-0">
          {ExtraNavItems.map((item) => (
            <Link
              key={item.key}
              href={modifyHref(item.href)}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNavigate(modifyHref(item.href));
              }}
              className={`flex items-center justify-center w-10 h-10 p-2 rounded-lg transition-colors ${selectedMainNavKey === item.key
                ? "bg-[var(--bar-background-color-hover)] text-white"
                : "text-gray-300 hover:bg-[var(--bar-background-color-hover)]"
                }`}
              title={item.title}
            >
              {item.icon ? (
                item.icon
              ) : (
                <img
                  src={item.navIcon || `${ASSET_BASE_URL}/images/icons/menu.svg`}
                  alt={item.title}
                  className="w-6 h-6 flex-shrink-0 object-contain"
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
