import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { ChevronUp, ChevronDown } from "lucide-preact";
import { Link } from "../common";
import { useState, useMemo, useLayoutEffect, useEffect } from "preact/hooks";
import { localeState } from "@/state/localeState";
import { ASSET_BASE_URL, RTL_LANGUAGES } from "@/config/constants";

const supportedLanguageOptions = [
  { label: "English", value: "en", flag: "us" },
  { label: "العربية", value: "ar", flag: "ae" },
  { label: "Deutsch", value: "de", flag: "de" },
  { label: "Français", value: "fr", flag: "fr" },
  { label: "Русский", value: "ru", flag: "ru" },
];

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
  /** When the user taps an expandable item on the collapsed rail, open this accordion after expand. */
  accordionIntent?: string | null;
  onAccordionIntentApplied?: () => void;
}

export default function ExpandedDrawer({
  mainNavItems,
  ExtraNavItems,
  selectedMainNavKey,
  selectedMainNavTitle: _selectedMainNavTitle,
  accordionIntent = null,
  onAccordionIntentApplied,
}: ExpandedDrawerProps) {
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});

  useLayoutEffect(() => {
    if (!accordionIntent) return;
    setIsExpanded((prev) => ({ ...prev, [accordionIntent]: true }));
  }, [accordionIntent]);

  useEffect(() => {
    if (!accordionIntent || !onAccordionIntentApplied) return;
    const id = window.setTimeout(() => onAccordionIntentApplied(), 0);
    return () => window.clearTimeout(id);
  }, [accordionIntent, onAccordionIntentApplied]);

  const { modifyHref, handleNavigate } = useAffiliateNavigation();
  const isRTL = RTL_LANGUAGES.includes(localeState.value);

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
    `relative flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors duration-150 w-full ${isRTL ? "flex-row-reverse text-right" : "text-left"} ${active
      ? "bg-[#2f4553] text-white"
      : "bg-transparent text-[#b1bad3] hover:bg-[#213743] hover:text-white"
    }`;

  const iconChip = (_active: boolean) =>
    "flex h-5 w-5 shrink-0 items-center justify-center";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="relative z-100 h-full overflow-y-auto scrollbar-hide w-[240px] overflow-x-hidden bg-(--sidebar-background) pb-15"
    >
      <div className="px-3 flex flex-col gap-1.5 pt-4">
        {topNavItems.map((item) => {
          const active = selectedMainNavKey === item.key;
          return (
          <div key={item.key} className="flex flex-col gap-1">
            {item.expandable ? (
              <div className="flex flex-col gap-1">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsExpanded((prev) => ({ ...prev, [item.key]: !prev[item.key] }));
                  }}
                  className={itemCard(active)}
                >
                  <span className={iconChip(active)}>{renderIcon(item)}</span>
                  <span className="flex-1 text-sm font-semibold">{item.title}</span>
                  {isExpanded[item.key]
                    ? <ChevronUp size={16} className="text-[#b1bad3] shrink-0" />
                    : <ChevronDown size={16} className="text-[#b1bad3] shrink-0" />}
                </button>

                {isExpanded[item.key] && item.key !== "language" && (
                  <div className="ms-5 flex flex-col gap-0.5 border-s border-[#2f4553] ps-2">
                    {item.expandableItems?.map((subItem, index) => (
                      <Link
                        key={index}
                        href={modifyHref(subItem.href || "")}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleNavigate(modifyHref(subItem.href || ""));
                        }}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-[#b1bad3] hover:bg-[#213743] hover:text-white ${isRTL ? "flex-row-reverse text-right" : ""}`}
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
                className={itemCard(active)}
              >
                <span className={iconChip(active)}>{renderIcon(item)}</span>
                <span className="flex-1 text-sm font-medium">{item.title}</span>
              </button>
            )}
          </div>
          );
        })}

        <div className="my-2 h-px bg-[#2f4553]" />

        {ExtraNavItems.map((item) => {
          const active = selectedMainNavKey === item.key;
          return (
          <div key={item.key} className="flex flex-col gap-1">
            {item.expandable ? (
              <div className="flex flex-col gap-1">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsExpanded((prev) => ({ ...prev, [item.key]: !prev[item.key] }));
                  }}
                  className={itemCard(active)}
                >
                  <span className={iconChip(active)}>{renderIcon(item)}</span>
                  <span className="flex-1 text-sm font-semibold">
                    {item.key === "language"
                      ? (supportedLanguageOptions.find((o) => o.value === localeState.value)?.label || item.title)
                      : item.title}
                  </span>
                  {isExpanded[item.key]
                    ? <ChevronUp size={16} className="text-[#b1bad3] shrink-0" />
                    : <ChevronDown size={16} className="text-[#b1bad3] shrink-0" />}
                </button>

                {item.key === "language" && isExpanded[item.key] && (
                  <div className="ms-5 flex flex-col gap-0.5 border-s border-[#2f4553] ps-2">
                    {supportedLanguageOptions.map((lang) => (
                        <button
                          key={lang.value}
                          onClick={() => {
                            localeState.value = lang.value;
                            window.localStorage.setItem("locale", lang.value);
                          }}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors w-full ${isRTL ? "flex-row-reverse text-right" : "text-left"} ${localeState.value === lang.value
                            ? "text-white bg-[#2f4553]"
                            : "text-[#b1bad3] hover:text-white hover:bg-[#213743]"
                            }`}
                        >
                          <span className={`fi fi-${lang.flag}`} />
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
                className={itemCard(active)}
              >
                <span className={iconChip(active)}>{renderIcon(item)}</span>
                <span className="flex-1 text-sm font-medium">{item.title}</span>
              </button>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}
