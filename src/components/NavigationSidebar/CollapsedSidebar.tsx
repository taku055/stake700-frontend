import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { ChevronRight } from "lucide-preact";
import { navigationSidebarExpandedState } from "@/state/navigationSidebarState";
import { localeState } from "@/state/localeState";
import { useState, useMemo } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import { useCasinoCategories } from "@/hooks/useCasinoCategories";
import { useLiveCasinoCategories } from "@/hooks/useLiveCasinoCategories";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { RTL_LANGUAGES } from "@/config/constants";

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
  const t = useTranslations("Header");
  const [selectedTab, setSelectedTab] = useState<"casino" | "live-casino">("casino");
  const { categories: casinoCategories } = useCasinoCategories();
  const { categories: liveCasinoCategories } = useLiveCasinoCategories();

  // Filter main nav items for top section (Casino, Live Casino, Sportsbook)
  const topNavItems = mainNavItems.filter((item) =>
    ["slots", "live-casino", "sport", "promotions"].includes(item.key)
  );

  // Get categories based on selected tab
  const categoriesWithIcons = useMemo(() => {
    return selectedTab === "casino" ? casinoCategories : liveCasinoCategories;
  }, [selectedTab, casinoCategories, liveCasinoCategories]);

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
          <img 
            src="/images/sidebar/expand.svg" 
            alt="sidebararrow" 
            className={`w-6 h-6 transition-transform duration-300 ${
              isRTL ? 'scale-x-[-1]' : ''
            }`}
          />
        </button>
      </div>

      {/* Tab Selector (Casino / Live Casino) */}
      {/* <div className="flex flex-col items-center gap-1 p-2 border-b border-gray-700 flex-shrink-0">
        <button
          onClick={() => setSelectedTab("casino")}
          className={`w-10 h-8 rounded text-xs transition-colors ${
            selectedTab === "casino"
              ? "bg-[#134077] text-white"
              : "bg-[var(--background-secondary)] text-gray-300 hover:bg-gray-700"
          }`}
          title={t("Casino") || "Casino"}
        >
          C
        </button>
        <button
          onClick={() => setSelectedTab("live-casino")}
          className={`w-10 h-8 rounded text-xs transition-colors ${
            selectedTab === "live-casino"
              ? "bg-[#134077] text-white"
              : "bg-[var(--background-secondary)] text-gray-300 hover:bg-gray-700"
          }`}
          title={t("Live Casino") || "Live Casino"}
        >
          L
        </button>
      </div> */}

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
                src={item.navIcon || "/images/sidebar/casino.svg"}
                alt={item.title}
                className="w-10 h-10 object-contain"
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
              className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors text-gray-300 hover:bg-gray-700 flex-shrink-0"
              title={category.name}
            >
              <img
                src={category.icon}
                alt={category.name}
                className="w-8 h-8 object-contain"
              />
            </a>
          ))}
        </div>
      </div>

      {/* Locale Selection Button - Bottom */}
      <div className="flex items-center justify-center p-2 border-t border-gray-700 flex-shrink-0">
        <Dropdown backdrop="blur" className="bg-[var(--background)]">
          <DropdownTrigger>
            <button
              className="flex items-center justify-center w-12 h-12 rounded-lg transition-colors text-gray-300 hover:bg-gray-700"
              aria-label="Change language"
              title={localeOptions.find((o) => o.value === localeState.value)?.label || "Language"}
            >
              <span
                className={`fi fi-${localeOptions.find((o) => o.value === localeState.value)?.flag || "us"}`}
                style={{ fontSize: "24px" }}
              ></span>
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Change Locale">
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
      </div>
    </div>
  );
}

