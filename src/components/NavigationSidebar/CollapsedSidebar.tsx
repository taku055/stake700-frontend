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
      className={`sticky top-0 md:flex w-[64px] bg-[var(--bar-background-color)] flex-col h-screen`}
    >
      {/* Expand Button */}
      <div className="flex flex-col items-center justify-center p-2  gap-2">
        <button
          className={`rounded-full h-full p-2 ratio-1/1 flex items-center justify-center`}
          onClick={() => {
            navigationSidebarExpandedState.value = true;
          }}
        >
          <img src={`/images/icons/menu.svg`} alt="Expand" className={`w-6 h-6 ${isRTL ? "scale-x-[-1]" : ""}`} />
        </button>
        <Link
          href="/"
          className={`flex items-center rounded-[8px]  justify-center  min-w-[50px] min-h-[50px] ${selectedTab === "casino"
            ? "bg-[url('/buffer/active-casino-mini.svg')]"
            : "bg-[url('/buffer/default-casino-mini.svg')]"
            } hover:bg-[url('/buffer/active-casino-mini.svg')] bg-cover`}
        >
          <img
            src={`${ASSET_BASE_URL}/images/icons/casino.png`}
            alt="casino"
            className={`w-6 h-6 ${selectedTab === "casino"
              ? ""
              : "brightness-80 hover:brightness-100"
              }`}
          />
        </Link>
        <Link
          href="/sports"
          className={`flex items-center rounded-[8px] justify-center min-w-[50px] min-h-[50px]  ${selectedTab === "sports"
            ? "bg-[url('/buffer/active-sports-mini.svg')]"
            : "bg-[url('/buffer/default-sports-mini.svg')]"
            } hover:bg-[url('/buffer/active-sports-mini.svg')] bg-cover`}
        >
          <img
            src={`${ASSET_BASE_URL}/images/icons/sportsbook.png`}
            alt="sports"
            className={`w-6 h-6 ${selectedTab === "sports"
              ? ""
              : "brightness-80 hover:brightness-100"
              }`}
          />
        </Link>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto min-h-0 scrollbar-hide">
        {/* Category Icons */}
        <div className="flex flex-col items-center py-4 gap-2">
          {categoriesWithIcons.map((category, index) => (
            <Link
              key={index}
              href={modifyHref(category.path)}
              className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors text-gray-300 hover:bg-gray-700 flex-shrink-0"
              title={category.name}
            >
              <img
                src={category.icon}
                alt={category.name}
                className="w-6 h-6 object-contain grayscale"
              />
            </Link>
          ))}
        </div>

        {/* Navigation Icons */}
        <div className="flex flex-col items-center py-4 gap-2 flex-shrink-0">
          {topNavItems.map((item) => (
            <Link
              key={item.key}
              href={modifyHref(item.href)}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNavigate(modifyHref(item.href));
              }}
              className={`flex items-center justify-center w-6 h-6 py-4 rounded-lg transition-colors ${selectedMainNavKey === item.key
                ? "bg-[var(--bar-background-color-hover)] text-white"
                : "text-gray-300 hover:bg-[var(--bar-background-color-hover)]"
                }`}
              title={item.title}
            >
              {item.icon ? (
                item.icon
              ) : (
                <img
                  src={
                    item.navIcon || `${ASSET_BASE_URL}/images/icons/casino.svg`
                  }
                  alt={item.title}
                  className="w-6 h-6 flex-shrink-0 object-contain"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="border-b-2 border-[var(--bar-background-color)] flex-shrink-0" />

        <div className="flex flex-col items-center py-4 gap-2 flex-shrink-0">
          {ExtraNavItems.map((item) => (
            <Link
              key={item.key}
              href={modifyHref(item.href)}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNavigate(modifyHref(item.href));
              }}
              className={`flex items-center justify-center w-6 h-6 py-4 rounded-lg transition-colors ${selectedMainNavKey === item.key
                ? "bg-[var(--bar-background-color-hover)] text-white"
                : "text-gray-300 hover:bg-[var(--bar-background-color-hover)]"
                }`}
              title={item.title}
            >
              {item.icon ? (
                item.icon
              ) : (
                <img
                  src={
                    item.navIcon || `${ASSET_BASE_URL}/images/icons/menu.svg`
                  }
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
