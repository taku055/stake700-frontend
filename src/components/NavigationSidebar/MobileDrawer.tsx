import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-preact";
import { Link } from "../common";
import { navigationSidebarExpandedState } from "@/state/navigationSidebarState";
import { useTranslations } from "@/context/I18nContext";
import CategoryItems from "./CategoryItems";
import { useState, useMemo } from "preact/hooks";
import { localeState } from "@/state/localeState";
import {
  ASSET_BASE_URL,
  RTL_LANGUAGES,
} from "@/config/constants";
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
  selectedMainNavTitle,
}: MobileDrawerProps) {
  const t = useTranslations("Header");
  const selectedTab = useSelectedTab();
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});
  const { modifyHref, handleNavigate } = useAffiliateNavigation();
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const casinoCategoriesWithCounts = sidebarDataState.value;

  const currentCategories = useMemo(
    () => (selectedTab === "casino" ? casinoCategoriesWithCounts : []),
    [selectedTab, casinoCategoriesWithCounts]
  );

  const topNavItems = useMemo(() => mainNavItems, [mainNavItems]);

  const renderIcon = (item: { icon?: any; navIcon?: string; title: string }) =>
    item.icon ? (
      item.icon
    ) : (
      <img
        src={item.navIcon || `${ASSET_BASE_URL}/images/icons/casino.svg`}
        alt={item.title}
        className="w-6 h-6 shrink-0 object-contain"
      />
    );

  const itemCard = (active: boolean) =>
    `flex items-center gap-3 px-4 py-[13px] rounded-xl transition-colors w-full text-left ${active
      ? "bg-[var(--sidebar-card-active)] text-white"
      : "bg-[var(--sidebar-card-bg)] text-white hover:bg-[var(--sidebar-card-hover)]"
    }`;

  const close = () => { navigationSidebarExpandedState.value = false; };

  return (
    <div
      className={`fixed ${isRTL ? "right-0" : "left-0"} top-0 z-5500 h-full w-full bg-(--sidebar-background) overflow-y-auto scrollbar-hide overflow-x-hidden`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-15 bg-(--sidebar-background) sticky top-0 z-10">
        <button
          onClick={close}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-(--sidebar-card-bg) hover:bg-(--sidebar-card-hover) transition-colors shrink-0"
        >
          {isRTL
            ? <ChevronRight size={18} className="text-white" />
            : <ChevronLeft size={18} className="text-white" />}
        </button>
        <Link href="/" className="flex items-center" onClick={close}>
          <img
            src={`${ASSET_BASE_URL}/images/icons/logo.svg`}
            alt="Logo"
            className="h-8 object-contain"
            onError={(e: any) => { e.currentTarget.src = `${ASSET_BASE_URL}/logo-mini.png`; }}
          />
        </Link>
      </div>

      {/* Content */}
      <div className="px-3 flex flex-col gap-2 pt-2 pb-20">
        {/* Categories */}


        {/* Main nav items */}
        {topNavItems.map((item) => (
          <div key={item.key} className="flex flex-col gap-1">
            {item.expandable ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsExpanded((prev) => ({ ...prev, [item.key]: !prev[item.key] }));
                }}
                className={itemCard(selectedMainNavKey === item.key)}
              >
                {renderIcon(item)}
                <span className="flex-1 text-sm font-medium">{item.title}</span>
                {isExpanded[item.key]
                  ? <ChevronUp size={16} className="text-[#8a8070] shrink-0" />
                  : <ChevronDown size={16} className="text-[#8a8070] shrink-0" />}
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  item.onclick?.();
                  handleNavigate(item.href || "");
                  close();
                }}
                className={itemCard(selectedMainNavKey === item.key)}
              >
                {renderIcon(item)}
                <span className="text-sm font-medium">{item.title}</span>
              </button>
            )}

            {item.expandable && isExpanded[item.key] && item.key !== "language" && (
              <div className="flex flex-col gap-1 pl-2">
                {item.expandableItems?.map((subItem, index) => (
                  <Link
                    key={index}
                    href={modifyHref(subItem.href || "")}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleNavigate(modifyHref(subItem.href || ""));
                      close();
                    }}
                    className="flex items-center gap-3 px-4 py-2.75 rounded-xl bg-(--sidebar-card-bg) hover:bg-(--sidebar-card-hover) transition-colors text-white"
                  >
                    <img src={subItem.icon} alt={subItem.title} className="w-5 h-5 shrink-0 object-contain" />
                    <span className="flex-1 text-sm">{subItem.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Extra nav items */}
        {ExtraNavItems.map((item) => (
          <div key={item.key} className="flex flex-col gap-1">
            {item.expandable ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsExpanded((prev) => ({ ...prev, [item.key]: !prev[item.key] }));
                }}
                className={itemCard(selectedMainNavKey === item.key)}
              >
                {renderIcon(item)}
                <span className="flex-1 text-sm font-medium">{item.title}</span>
                {isExpanded[item.key]
                  ? <ChevronUp size={16} className="text-[#8a8070] shrink-0" />
                  : <ChevronDown size={16} className="text-[#8a8070] shrink-0" />}
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  item.onclick?.();
                  handleNavigate(modifyHref(item.href || ""));
                  close();
                }}
                className={itemCard(selectedMainNavKey === item.key)}
              >
                {renderIcon(item)}
                <span className="text-sm font-medium">{item.title}</span>
              </button>
            )}

            {item.expandable && isExpanded[item.key] && item.key !== "language" && (
              <div className="flex flex-col gap-1 pl-2">
                {item.expandableItems?.map((subItem, index) => (
                  <Link
                    key={index}
                    href={modifyHref(subItem.href || "")}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      item.onclick?.();
                      handleNavigate(modifyHref(subItem.href || ""));
                      close();
                    }}
                    className="flex items-center gap-3 px-4 py-2.75 rounded-xl bg-(--sidebar-card-bg) hover:bg-(--sidebar-card-hover) transition-colors text-white"
                  >
                    <img src={subItem.icon} alt={subItem.title} className="w-5 h-5 shrink-0 object-contain" />
                    <span className="flex-1 text-sm">{subItem.title}</span>
                  </Link>
                ))}
              </div>
            )}

            {item.expandable && isExpanded[item.key] && item.key === "language" && (
              <div className="flex flex-col gap-1 pl-2">
                {options.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => {
                      localeState.value = lang.value;
                      window.localStorage.setItem("locale", lang.value);
                    }}
                    className={`flex items-center gap-3 px-4 py-2.75 rounded-xl transition-colors w-full text-left ${localeState.value === lang.value
                      ? "bg-(--sidebar-card-active) text-white"
                      : "bg-(--sidebar-card-bg) text-white hover:bg-(--sidebar-card-hover)"
                      }`}
                  >
                    <span className={`fi fi-${lang.flag}`}></span>
                    <span className="flex-1 text-sm">{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

