import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { ChevronRight } from "lucide-preact";
import { navigationSidebarExpandedState } from "@/state/navigationSidebarState";
import { localeState } from "@/state/localeState";
import { useState, useMemo, useEffect } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import { useCasinoCategories } from "@/hooks/useCasinoCategories";
import { useLiveCasinoCategories } from "@/hooks/useLiveCasinoCategories";
import { selectedTabState } from "@/state/selectedTab";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { BASE_URL, RTL_LANGUAGES } from "@/config/constants";
import { Link } from "../common";
import LocaleSelection from "@/components/LocaleSelection";
import { useLocation } from "preact-iso";

const localeOptions = [
  { label: "Türkçe", value: "tr", flag: "tr" },
  { label: "Azərbaycanca", value: "az", flag: "az" },
  { label: "Русский", value: "ru", flag: "ru" },
  { label: "English", value: "en", flag: "us" },
  { label: "Ελληνικά", value: "el", flag: "gr" },
  { label: "Español", value: "es", flag: "es" },
  { label: "Português", value: "pt", flag: "pt" },
  { label: "Italiano", value: "it", flag: "it" },
  { label: "Deutsch", value: "de", flag: "de" },
  { label: "Français", value: "fr", flag: "fr" },
  // { label: "עברית", value: "he", flag: "il", dir: "rtl" },
  { label: "فارسی", value: "fa", flag: "ir", dir: "rtl" },
  { label: "العربية", value: "ar", flag: "sa", dir: "rtl" },
];

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
  categories,
}: CollapsedSidebarProps) {
  const { modifyHref, handleNavigate } = useAffiliateNavigation();
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const t = useTranslations("Header");
  const tCommon = useTranslations("Common");
  const selectedTab = selectedTabState.value;
  const { categories: casinoCategories } = useCasinoCategories();
  const { categories: liveCasinoCategories } = useLiveCasinoCategories();
  const location = useLocation();
  // Filter main nav items for top section (Casino, Live Casino, Sportsbook)
  // const topNavItems = mainNavItems.filter((item) =>
  //   ["slots", "live-casino", "sport", "promotions"].includes(item.key)
  // );
  const topNavItems = useMemo(() => {
    return mainNavItems;
  }, [mainNavItems]);

  // Get categories based on selected tab
  const categoriesWithIcons = useMemo(() => {
    // return selectedTab === "casino" ? casinoCategories : selectedTab === "live-casino" ? liveCasinoCategories : [];
    return selectedTabState.value === "casino" ? casinoCategories : [];
  }, [selectedTab, casinoCategories, liveCasinoCategories]);

  // useEffect(() => {
  //   if (location.path.includes("/casino")) {
  //     selectedTabState.value = "casino";
  //   } else if (location.path.includes("/live-casino")) {
  //     selectedTabState.value = "sports";
  //   } else {
  //     selectedTabState.value = null;
  //   }

  // }, [location.path]);

  return (
    <div className={`sticky top-0 md:flex w-[64px] bg-[var(--bar-background-color)] flex-col h-screen`}>
      {/* Expand Button */}
      <div className="flex flex-col items-center justify-center p-2  gap-2">
        <button
          className={`rounded-full h-full p-2 ratio-1/1 flex items-center justify-center`}
          onClick={() => {
            navigationSidebarExpandedState.value = true;
          }}
        >
          <img
            src={`${BASE_URL}/images/icons/menu.svg`}
            alt="sidebararrow"
            className={`w-[16px] h-[16px] duration-300 brightness-0 invert transition-transform ${isRTL ? 'scale-x-[-1]' : ''
              }`}
          />
        </button>
        <button
          className={`flex items-center rounded-[8px]  justify-center  min-w-[50px] min-h-[50px] ${selectedTabState.value === "casino" ? "bg-[url('/buffer/active-casino-mini.svg')]" : "bg-[url('/buffer/default-casino-mini.svg')]"} hover:bg-[url('/buffer/active-casino-mini.svg')] bg-cover`}
          onClick={() => {
            selectedTabState.value = "casino";
            // handleNavigate("/casino/slots?custom=1&category=slot-top-slots");
          }}
        >
          <img src={`${BASE_URL}/images/icons/casino.png`} alt="casino" className={`w-6 h-6 ${selectedTabState.value === "casino" ? "" : "brightness-80 hover:brightness-100"}`} />
        </button>
        <button
          className={`flex items-center rounded-[8px] justify-center min-w-[50px] min-h-[50px]  ${selectedTabState.value === "sports" ? "bg-[url('/buffer/active-sports-mini.svg')]" : "bg-[url('/buffer/default-sports-mini.svg')]"} hover:bg-[url('/buffer/active-sports-mini.svg')] bg-cover`}
          onClick={() => {
            selectedTabState.value = "sports";
            // handleNavigate("/sport");
          }}
        >
          <img src={`${BASE_URL}/images/icons/sportsbook.png`} alt="sports" className={`w-6 h-6 ${selectedTabState.value === "sports" ? "" : "brightness-80 hover:brightness-100"}`} />
        </button>

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
              {item.icon ? (item.icon) : (<img
                src={item.navIcon || `${BASE_URL}/images/icons/casino.svg`}
                alt={item.title}
                className="w-6 h-6 flex-shrink-0 object-contain"
              />)}
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
              {item.icon ? (item.icon) : (<img
                src={item.navIcon || `${BASE_URL}/images/icons/menu.png`}
                alt={item.title}
                className="w-6 h-6 flex-shrink-0 object-contain"
              />)}
            </Link>
          ))}
        </div>

        
      </div>

      {/* Locale Selection Button - Bottom */}
      {/* <div className="flex items-center justify-center p-2 border-t border-gray-700 flex-shrink-0">
        <Dropdown backdrop="blur" className="bg-[var(--background)]">
          <DropdownTrigger>
            <button
              className="flex items-center justify-center w-12 h-12 rounded-lg transition-colors text-gray-300 hover:bg-gray-700"
              aria-label={tCommon("Change language")}
              title={localeOptions.find((o) => o.value === localeState.value)?.label || tCommon("Language")}
            >
              <span
                className={`fi fi-${localeOptions.find((o) => o.value === localeState.value)?.flag || "us"}`}
                style={{ fontSize: "24px" }}
              ></span>
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label={tCommon("Change Locale")}>
            {localeOptions.map((lang) => (
              <DropdownItem
                key={lang.value}
                value={lang.value}
                onPress={() => {
                  localeState.value = lang.value;
                  window.localStorage.setItem("locale", lang.value);
                }}
              >
                <div className="flex items-center gap-2">
                  <span className={`fi fi-${lang.flag}`}></span>
                  {lang.label}
                </div>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div> */}
    </div>
  );
}

