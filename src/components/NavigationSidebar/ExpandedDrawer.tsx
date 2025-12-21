import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { ChevronLeft, ChevronRight, Search, ChevronUp, ChevronDown } from "lucide-preact";
import { Link } from "../common";
import { navigationSidebarExpandedState } from "@/state/navigationSidebarState";
import { useTranslations } from "@/context/I18nContext";
import NavigationItems from "./NavigationItems";
import CategoryItems from "./CategoryItems";
import { useState, useMemo, useEffect } from "preact/hooks";
import { Input } from "@/components/common";
import LocaleSelection from "@/components/LocaleSelection";
import { localeState } from "@/state/localeState";
import { useCasinoCategories } from "@/hooks/useCasinoCategories";
import { useLiveCasinoCategories } from "@/hooks/useLiveCasinoCategories";
import { RTL_LANGUAGES } from "@/config/constants";
import { useLocation } from "preact-iso";
import { options } from "@/components/LocaleSelection";

interface ExpandedDrawerProps {
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

export default function ExpandedDrawer({
  mainNavItems,
  ExtraNavItems,
  selectedMainNavKey,
  categories,
  selectedMainNavTitle,
}: ExpandedDrawerProps) {
  const t = useTranslations("Header");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"casino" | "live-casino" | null>(null);
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});
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
  useEffect(() => {
    if (location.path.includes("/casino")) {
      setSelectedTab("casino");
    } else if (location.path.includes("/live-casino")) {
      setSelectedTab("live-casino");
    } else {
      setSelectedTab(null);
    }
 
  }, [location.path]);


  // Get categories based on selected tab
  const currentCategories = useMemo(() => {
    return selectedTab === "casino" ? casinoCategories : liveCasinoCategories;
  }, [selectedTab, casinoCategories, liveCasinoCategories]);

  // Filter main nav items for top section (Casino, Live Casino, Sportsbook)
  const topNavItems = useMemo(() => {
    return mainNavItems;
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
    <div className="relative inset-0 z-50 h-full overflow-y-auto scrollbar-hide w-[260px] overflow-x-hidden px-[16px]">
      {/* Backdrop */}
      <div className={`fixed ${isRTL ? 'right-0' : 'left-0'} top-0 z-55 flex bg-[var(--sidebar-background)] w-[260px] h-[60px] items-center`}>
        <div className="flex bg-[#ffffff02] w-full h-full px-[16px] items-center justify-between">
          <button
            className={`rounded-full h-full p-2 ratio-1/1 flex items-center justify-center`}
            onClick={() => {
              navigationSidebarExpandedState.value = false;
            }}
          >
            <img
              src="/images/icons/menu.png"
              alt="sidebararrow"
              className={`w-[13px] h-[13px] duration-300 brightness-0 invert transition-transform ${isRTL ? 'scale-x-[-1]' : ''
                }`}
            />
          </button>
          <button
            className={`flex items-center rounded-[8px] justify-center w-[88px] h-[40px] ${selectedTab === "casino" ? "bg-[url('/buffer/active-casino.svg')]" : "bg-[url('images/icons/icons/default-casino.svg')]"} hover:bg-[url('/buffer/active-casino.svg')] bg-cover`}
            onClick={() => { setSelectedTab("casino")
              handleNavigate("/casino/slots?custom=1&category=slot-top-slots");
             }}
          >
            <span className="text-white text-[14px]">Casino</span>
          </button>
          <button
            className={`flex items-center rounded-[8px] justify-center w-[88px] h-[40px] ${selectedTab === "live-casino" ? "bg-[url('/buffer/active-sports.svg')]" : "bg-[url('images/icons/icons/default-sports.svg')]"} hover:bg-[url('/buffer/active-sports.svg')] bg-cover`}
            onClick={() => { setSelectedTab("live-casino")
              handleNavigate("/live-casino");
             }}
          >
            <span className="text-white text-[14px]">Live Casino</span>
          </button>
        </div>

      </div>


      {/* Panel */}
      <div
        className={`sticky inset-y-0 rounded-[10px] mt-[60px] ${isRTL ? 'right-0' : 'left-0'} bg-[var(--background-secondary)] shadow-2xl flex flex-col transition-transform duration-300 ease-out will-change-transform`}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Content */}
        <div className="flex-1 overflow-y-auto sidebar-scrollbar">

          {/* Top Navigation Items (Casino, Live Casino, Sportsbook) */}
          <div className="py-4">
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
                        className={`flex items-center gap-3 px-4 py-2 transition-colors w-full text-left ${selectedMainNavKey === item.key
                          ? "bg-[var(--background-btn-hover)] text-white"
                          : "text-gray-300 hover:bg-[var(--background-btn-hover)]"
                          }`}
                      >{item.icon ? item.icon : (
                        <img
                          src={item.navIcon || "/images/sidebar/casino.svg"}
                          alt={item.title}
                          className="w-6 h-6 flex-shrink-0 object-contain"
                        />
                      )}
                        <span className="flex-1">{item.title}</span>
                        {isExpanded[item.key] ? (
                          <ChevronUp size={16} className="transition-transform duration-200" />
                        ) : (
                          <ChevronDown size={16} className="transition-transform duration-200" />
                        )}
                      </button>
                    ) : (
                      <button
                        // href={modifyHref(item.href)}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('item.onclick, item.href', item.onclick, item.key, item.onclick?.toString());
                          item.onclick?.();
                          handleNavigate(modifyHref(item.href || ""));
                        }}
                        className={`flex items-center justify-start gap-3 px-4 py-2 transition-colors ${selectedMainNavKey === item.key
                          ? "bg-[var(--background-btn-hover)] text-white"
                          : "text-gray-300 hover:bg-[var(--background-btn-hover)]"
                          }`}
                      >
                        {item.icon ? (item.icon) : (<img
                          src={item.navIcon || "/images/sidebar/casino.svg"}
                          alt={item.title}
                          className="w-6 h-6 flex-shrink-0 object-contain"
                        />)}
                        <span>{item.title}</span>
                      </button>
                    )}

                    {/* Expandable Sub-items */}
                    {item.expandable && isExpanded[item.key] && item.key !== "language" && (
                      <div className="ml-7 mt-1 flex flex-col gap-1 border-l-[2px] border-[var(--bar-background-color)] ">
                        {item.expandableItems?.map((subItem, index) => (
                          <Link
                            key={index}
                            href={modifyHref(subItem.href || "")}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleNavigate(modifyHref(subItem.href || ""));
                            }}
                            className="flex items-center gap-3 px-3 py-2 transition-colors text-gray-300 hover:bg-[var(--background-btn-hover)]"
                          >
                            <img
                              src={subItem.icon}
                              alt={subItem.title}
                              className="w-6 h-6 flex-shrink-0 object-contain"
                            />
                            <span className="flex-1 text-sm">{subItem.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Divider */}
          <div className="border-b-2 border-[var(--bar-background-color)] w-[calc(100% - 46px)] mx-4" />
          <div className="py-4">
            <div className="flex flex-col gap-2">
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
                        className={`flex items-center gap-3 px-4 py-2 transition-colors w-full text-left ${selectedMainNavKey === item.key
                          ? "bg-[var(--background-btn-hover)] text-white"
                          : "text-gray-300 hover:bg-[var(--background-btn-hover)]"
                          }`}
                      >{item.icon ? item.icon : (
                        <img
                          src={item.navIcon || "/images/sidebar/casino.svg"}
                          alt={item.title}
                          className="w-6 h-6 flex-shrink-0 object-contain"
                        />
                      )}
                        <span className="flex-1">{item.title}</span>
                        {isExpanded[item.key] ? (
                          <ChevronUp width={16} height={16} className="min-w-[16px]!important min-h-[16px]!important transition-transform duration-200" />
                        ) : (
                          <ChevronDown width={16} height={16} className="min-w-[16px]!important min-h-[16px]!important transition-transform duration-200" />
                        )}
                      </button>
                    ) : (
                      <button
                        // href={modifyHref(item.href || "")}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('item.onclick, item.href', item.onclick, item.key);
                          item.onclick?.();
                          handleNavigate(modifyHref(item.href || ""));
                        }}
                        className={`flex items-center gap-3 px-4 py-2 transition-colors ${selectedMainNavKey === item.key
                          ? "bg-[var(--background-btn-hover)] text-white"
                          : "text-gray-300 hover:bg-[var(--background-btn-hover)]"
                          }`}
                      >
                        {item.icon ? (item.icon) : (<img
                          src={item.navIcon || "/images/sidebar/casino.svg"}
                          alt={item.title}
                          className="w-6 h-6 flex-shrink-0 object-contain"
                        />)}
                        <span className="flex-1">{item.title}</span>
                      </button>
                    )}

                    {/* Expandable Sub-items */}
                    {item.expandable && isExpanded[item.key] && item.key !== "language" && (
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
                            }}
                            className="flex items-center gap-3 px-3 py-2 transition-colors text-gray-300 hover:bg-[var(--background-btn-hover)]"
                          >
                            <img
                              src={subItem.icon}
                              alt={subItem.title}
                              className="w-6 h-6 flex-shrink-0 object-contain"
                            />
                            <span className="flex-1 text-sm">{subItem.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                    {/* Language Selection */}
                    {item.expandable && isExpanded[item.key] && item.key === "language" && (
                      <div className="ml-7 mt-1 flex flex-col gap-1 border-l-[2px] border-[var(--bar-background-color)] ">
                        {options.map((lang) => (
                          <button 
                            key={lang.value} 
                            onClick={() => { 
                              localeState.value = lang.value; 
                              window.localStorage.setItem("locale", lang.value); 
                            }} 
                            className="flex items-center gap-3 px-3 py-2 transition-colors text-gray-300 hover:bg-[var(--background-btn-hover)] w-full text-left"
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



          {/* Categories Section - Always shown */}
          {/* <CategoryItems
            categories={categoriesWithCounts}
            title={selectedMainNavTitle || t("Categories")}
            onCategoryClick={() => {
              navigationSidebarExpandedState.value = false;
            }}
          /> */}
        </div>
      </div>
    </div>
  );
}
