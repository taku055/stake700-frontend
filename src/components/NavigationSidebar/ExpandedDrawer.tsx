import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-preact";
import { Link } from "../common";
import { navigationSidebarExpandedState } from "@/state/navigationSidebarState";
import { useTranslations } from "@/context/I18nContext";
import CategoryItems from "./CategoryItems";
import { useState, useMemo } from "preact/hooks";
import { localeState } from "@/state/localeState";
import { ASSET_BASE_URL, RTL_LANGUAGES } from "@/config/constants";
import { options } from "@/components/LocaleSelection";
import { useSelectedTab } from "@/hooks/useSelectedTab";
import { sidebarDataState } from "@/state/sidebarData";

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
  selectedMainNavTitle,
}: ExpandedDrawerProps) {
  const t = useTranslations("Header");
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});
  const { modifyHref, handleNavigate } = useAffiliateNavigation();
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const casinoCategoriesWithCounts = sidebarDataState.value;
  const selectedTab = useSelectedTab();

  const topNavItems = useMemo(() => mainNavItems, [mainNavItems]);

  const currentCategories = useMemo(() => {
    return selectedTab === "casino" ? casinoCategoriesWithCounts : [];
  }, [selectedTab, casinoCategoriesWithCounts]);

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

  return (
    <div
      className={`relative z-100 h-full overflow-y-auto scrollbar-hide w-65 overflow-x-hidden bg-(--sidebar-background) pb-15`}
    >
      {/* Nav content */}
      <div className="px-3 flex flex-col gap-2 pt-3">
        {/* Main nav items */}
        {topNavItems.map((item) => (
          <div key={item.key} className="flex flex-col">
            {item.expandable ? (
              <div className="rounded-xl bg-(--sidebar-card-bg) overflow-hidden">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsExpanded((prev) => ({ ...prev, [item.key]: !prev[item.key] }));
                  }}
                  className="flex items-center gap-3 px-4 py-[13px] w-full text-left text-white hover:bg-(--sidebar-card-hover) transition-colors"
                >
                  {renderIcon(item)}
                  <span className="flex-1 text-sm font-medium">{item.title}</span>
                  {isExpanded[item.key]
                    ? <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-(--sidebar-card-hover) shrink-0"><ChevronUp size={14} className="text-[#8a8070]" /></div>
                    : <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-(--sidebar-card-hover) shrink-0"><ChevronDown size={14} className="text-[#8a8070]" /></div>}
                </button>

                {/* Sub-items */}
                {isExpanded[item.key] && item.key !== "language" && (
                  <div className="flex flex-col border-t border-dashed border-[#8a807040]">
                    {item.expandableItems?.map((subItem, index) => (
                      <Link
                        key={index}
                        href={modifyHref(subItem.href || "")}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleNavigate(modifyHref(subItem.href || ""));
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-(--sidebar-card-hover) transition-colors text-white"
                      >
                        <img src={subItem.icon} alt={subItem.title} className="w-5 h-5 shrink-0 object-contain" />
                        <span className="flex-1 text-sm">{subItem.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  item.onclick?.();
                  handleNavigate(item.href || "");
                }}
                className={itemCard(selectedMainNavKey === item.key)}
              >
                {renderIcon(item)}
                <span className="text-sm font-medium">{item.title}</span>
              </button>
            )}
          </div>
        ))}

        {/* Extra nav items */}
        {ExtraNavItems.map((item) => (
          <div key={item.key} className="flex flex-col">
            {item.expandable ? (
              <div className="rounded-xl bg-(--sidebar-card-bg) overflow-hidden">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsExpanded((prev) => ({ ...prev, [item.key]: !prev[item.key] }));
                  }}
                  className={`flex items-center gap-3 px-4 py-[13px] w-full text-left text-white hover:bg-(--sidebar-card-hover) transition-colors`}
                >
                  {renderIcon(item)}
                  <span className="flex-1 text-sm font-medium">
                    {item.key === "language"
                      ? (options.find((o) => o.value === localeState.value)?.label || item.title)
                      : item.title}
                  </span>
                  {isExpanded[item.key]
                    ? <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-(--sidebar-card-hover) shrink-0"><ChevronUp size={14} className="text-[#8a8070]" /></div>
                    : <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-(--sidebar-card-hover) shrink-0"><ChevronDown size={14} className="text-[#8a8070]" /></div>}
                </button>

                {/* Language options */}
                {item.key === "language" && isExpanded[item.key] && (
                  <div className="flex flex-col border-t border-dashed border-[#8a807040]">
                    {options
                      .filter((lang) => ["ar", "en"].includes(lang.value))
                      .map((lang) => (
                        <button
                          key={lang.value}
                          onClick={() => {
                            localeState.value = lang.value;
                            window.localStorage.setItem("locale", lang.value);
                          }}
                          className={`flex items-center gap-3 px-4 py-3 transition-colors w-full text-left ${localeState.value === lang.value
                            ? "text-white bg-(--sidebar-card-active)"
                            : "text-white hover:bg-(--sidebar-card-hover)"
                            }`}
                        >
                          <span className="flex-1 text-sm">{lang.label}</span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  item.onclick?.();
                  handleNavigate(modifyHref(item.href || ""));
                }}
                className={itemCard(selectedMainNavKey === item.key)}
              >
                {renderIcon(item)}
                <span className="text-sm font-medium">{item.title}</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
