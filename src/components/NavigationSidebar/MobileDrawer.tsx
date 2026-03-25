import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { ChevronUp, ChevronDown } from "lucide-preact";
import { Link } from "../common";
import { navigationSidebarExpandedState } from "@/state/navigationSidebarState";
import { useTranslations } from "@/context/I18nContext";
import CategoryItems from "./CategoryItems";
import { useState, useMemo } from "preact/hooks";
import { localeState } from "@/state/localeState";
import {
  ASSET_BASE_URL,
  mobileMediaQuery,
  RTL_LANGUAGES,
} from "@/config/constants";
import { useLocation } from "preact-iso";
import { options } from "@/components/LocaleSelection";
import { useSelectedTab } from "@/hooks/useSelectedTab";
import { sidebarDataState } from "@/state/sidebarData";

interface MobileDrawerProps {
  mainNavItems: Array<{
    title: string;
    href?: string;
    key: string;
    icon: any;
    navIcon?: string;
    expandable?: boolean;
    onclick?: () => void;
    expandableItems?: Array<{
      title: string;
      href?: string;
      icon: string;
    }>;
  }>;
  ExtraNavItems: Array<{
    title: string;
    href?: string;
    key: string;
    icon: any;
    navIcon?: string;
    expandable?: boolean;
    onclick?: () => void;
    expandableItems?: Array<{
      title: string;
      href?: string;
      icon: string;
    }>;
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
  const selectedTab = useSelectedTab();
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});
  const { modifyHref, handleNavigate } = useAffiliateNavigation();
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const casinoCategoriesWithCounts = sidebarDataState.value;
  const location = useLocation();

  // Get categories based on selected tab
  const currentCategories = useMemo(() => {
    return selectedTab === "casino" ? casinoCategoriesWithCounts : [];
  }, [selectedTab, casinoCategoriesWithCounts]);

  // Filter main nav items for top section (Casino, Live Casino, Sportsbook)
  const topNavItems = useMemo(() => {
    return mainNavItems;
  }, [mainNavItems]);

  return (
    <div
      className={`fixed ${
        isRTL ? "right-0" : "left-0"
      } top-0 pt-16  z-5500 h-full overflow-y-auto scrollbar-hide w-full bg-[var(--sidebar-background)] overflow-x-hidden px-[16px]`}
    >
      {/* Backdrop */}
      <div className={` z-55 flex w-full h-[70px] items-center`}>
        <div className="flex bg-[#ffffff02] w-full h-full items-center justify-between gap-2">
          <button
            className={`flex flex-1 items-center rounded-[8px] justify-center h-[50px] ${
              selectedTab === "casino"
                ? "bg-[url('/buffer/active-casino.svg')]"
                : "bg-[url('images/icons/icons/default-casino.svg')]"
            } hover:bg-[url('/buffer/active-casino.svg')] bg-cover`}
            onClick={() => {
              location.route("/");
            }}
          >
            <span className="text-white text-[14px]">Casino</span>
          </button>
          <button
            className={`flex flex-1 items-center rounded-[8px] justify-center h-[50px] ${
              selectedTab === "sports"
                ? "bg-[url('/buffer/active-sports.svg')]"
                : "bg-[url('images/icons/icons/default-sports.svg')]"
            } hover:bg-[url('/buffer/active-sports.svg')] bg-cover`}
            onClick={() => {
              location.route("/sports");
              navigationSidebarExpandedState.value = false;
            }}
          >
            <span className="text-white text-[14px]">Sports</span>
          </button>
        </div>
      </div>

      {/* Panel */}
      <div
        className={`sticky inset-y-0 rounded-[10px] ${
          isRTL ? "right-0" : "left-0"
        } bg-[var(--background-secondary)] shadow-2xl flex flex-col transition-transform duration-300 ease-out will-change-transform pb-[60px]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content */}
        <div className="flex-1 overflow-y-auto sidebar-scrollbar">
          {/* Categories Section - Always shown */}
          <CategoryItems
            categories={currentCategories}
            title={selectedMainNavTitle || t("Categories")}
            onCategoryClick={() => {
              navigationSidebarExpandedState.value = false;
            }}
          />

          {/* Top Navigation Items (Casino, Live Casino, Sportsbook) */}

          <div className="flex flex-col gap-2">
            {topNavItems.map((item) => {
              return (
                <div key={item.key} className="flex flex-col">
                  {item.expandable ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsExpanded((prev) => ({
                          ...prev,
                          [item.key]: !prev[item.key],
                        }));
                      }}
                      className={`flex items-center gap-3 px-4 py-2 transition-colors w-full text-left ${
                        selectedMainNavKey === item.key
                          ? "bg-[var(--background-btn-hover)] text-white"
                          : "text-gray-300 hover:bg-[var(--background-btn-hover)]"
                      }`}
                    >
                      {item.icon ? (
                        item.icon
                      ) : (
                        <img
                          src={
                            item.navIcon ||
                            `${ASSET_BASE_URL}/images/icons/casino.svg`
                          }
                          alt={item.title}
                          className="w-6 h-6 flex-shrink-0 object-contain"
                        />
                      )}
                      <span className="flex-1">{item.title}</span>
                      {isExpanded[item.key] ? (
                        <ChevronUp
                          size={16}
                          className="transition-transform duration-200"
                        />
                      ) : (
                        <ChevronDown
                          size={16}
                          className="transition-transform duration-200"
                        />
                      )}
                    </button>
                  ) : (
                    <button
                      // href={modifyHref(item.href)}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        item.onclick?.();
                        handleNavigate(item.href || "");
                        navigationSidebarExpandedState.value = false;
                      }}
                      className={`flex items-center justify-start gap-3 px-4 py-2 transition-colors ${
                        selectedMainNavKey === item.key
                          ? "bg-[var(--background-btn-hover)] text-white"
                          : "text-gray-300 hover:bg-[var(--background-btn-hover)]"
                      }`}
                    >
                      {item.icon ? (
                        item.icon
                      ) : (
                        <img
                          src={
                            item.navIcon ||
                            `${ASSET_BASE_URL}/images/icons/casino.svg`
                          }
                          alt={item.title}
                          className="w-6 h-6 flex-shrink-0 object-contain"
                        />
                      )}
                      <span>{item.title}</span>
                    </button>
                  )}

                  {/* Expandable Sub-items */}
                  {item.expandable &&
                    isExpanded[item.key] &&
                    item.key !== "language" && (
                      <div className="ml-7 mt-1 flex flex-col gap-1 border-l-[2px] border-[var(--bar-background-color)] ">
                        {item.expandableItems?.map((subItem, index) => (
                          <Link
                            key={index}
                            href={modifyHref(subItem.href || "")}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleNavigate(modifyHref(subItem.href || ""));
                              navigationSidebarExpandedState.value = false;
                            }}
                            className="flex items-center gap-3 px-3 py-2 transition-colors text-gray-300 hover:bg-[var(--background-btn-hover)]"
                          >
                            <img
                              src={subItem.icon}
                              alt={subItem.title}
                              className="w-5 h-5 flex-shrink-0 object-contain"
                            />
                            <span className="flex-1 text-sm">
                              {subItem.title}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                </div>
              );
            })}
          </div>
          {/* Divider */}
          {/* <div className="border-b-2 border-[var(--bar-background-color)] w-[calc(100% - 46px)] mx-4" /> */}
          <div className="flex flex-col gap-2 pb-4">
            {ExtraNavItems.map((item) => {
              return (
                <div key={item.key} className="flex flex-col">
                  {item.expandable ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsExpanded((prev) => ({
                          ...prev,
                          [item.key]: !prev[item.key],
                        }));
                      }}
                      className={`flex items-center gap-3 px-4 py-2 transition-colors w-full text-left ${
                        selectedMainNavKey === item.key
                          ? "bg-[var(--background-btn-hover)] text-white"
                          : "text-gray-300 hover:bg-[var(--background-btn-hover)]"
                      }`}
                    >
                      {item.icon ? (
                        item.icon
                      ) : (
                        <img
                          src={
                            item.navIcon ||
                            `${ASSET_BASE_URL}/images/icons/casino.svg`
                          }
                          alt={item.title}
                          className="w-6 h-6 flex-shrink-0 object-contain"
                        />
                      )}
                      <span className="flex-1">{item.title}</span>
                      {isExpanded[item.key] ? (
                        <ChevronUp
                          width={16}
                          height={16}
                          className="min-w-[16px]!important min-h-[16px]!important transition-transform duration-200"
                        />
                      ) : (
                        <ChevronDown
                          width={16}
                          height={16}
                          className="min-w-[16px]!important min-h-[16px]!important transition-transform duration-200"
                        />
                      )}
                    </button>
                  ) : (
                    <button
                      // href={modifyHref(item.href || "")}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        item.onclick?.();
                        handleNavigate(modifyHref(item.href || ""));
                        navigationSidebarExpandedState.value = false;
                      }}
                      className={`flex items-center justify-start gap-3 px-4 py-2 transition-colors ${
                        selectedMainNavKey === item.key
                          ? "bg-[var(--background-btn-hover)] text-white"
                          : "text-gray-300 hover:bg-[var(--background-btn-hover)]"
                      }`}
                    >
                      {item.icon ? (
                        item.icon
                      ) : (
                        <img
                          src={
                            item.navIcon ||
                            `${ASSET_BASE_URL}/images/icons/casino.svg`
                          }
                          alt={item.title}
                          className="w-6 h-6 flex-shrink-0 object-contain"
                        />
                      )}
                      <span>{item.title}</span>
                    </button>
                  )}

                  {/* Expandable Sub-items */}
                  {item.expandable &&
                    isExpanded[item.key] &&
                    item.key !== "language" && (
                      <div className="ml-7 mt-1 flex flex-col gap-1 border-l-[2px] border-[var(--bar-background-color)] ">
                        {item.expandableItems?.map((subItem, index) => (
                          <Link
                            key={index}
                            href={modifyHref(subItem.href || "")}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              item.onclick?.();
                              handleNavigate(modifyHref(subItem.href || ""));
                              navigationSidebarExpandedState.value = false;
                            }}
                            className="flex items-center gap-3 px-3 py-2 transition-colors text-gray-300 hover:bg-[var(--background-btn-hover)]"
                          >
                            <img
                              src={subItem.icon}
                              alt={subItem.title}
                              className="w-6 h-6 flex-shrink-0 object-contain"
                            />
                            <span className="flex-1 text-sm">
                              {subItem.title}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  {/* Language Selection */}
                  {item.expandable &&
                    isExpanded[item.key] &&
                    item.key === "language" && (
                      <div className="ml-7 mt-1 flex flex-col gap-1 border-l-[2px] border-[var(--bar-background-color)] ">
                        {options.map((lang) => (
                          <button
                            key={lang.value}
                            onClick={() => {
                              localeState.value = lang.value;
                              window.localStorage.setItem("locale", lang.value);
                              isExpanded[item.key] = false;
                            }}
                            className={`flex items-center ${
                              localeState.value === lang.value
                                ? "bg-[var(--background-btn-hover)] text-white"
                                : "text-gray-300 hover:bg-[var(--background-btn-hover)]"
                            } gap-3 px-3 py-2 transition-colors w-full text-left`}
                          >
                            <span className={`fi fi-${lang.flag}`}></span>
                            <span className="flex-1 text-sm">{lang.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              );
            })}
          </div>
          {/* <div className="border-b-2 border-[var(--bar-background-color)] w-[calc(100% - 46px)] mx-4" /> */}
        </div>
      </div>
    </div>
  );
}
