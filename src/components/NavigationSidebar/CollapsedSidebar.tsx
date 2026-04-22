import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";
import { useMemo } from "preact/hooks";
import { ASSET_BASE_URL } from "@/config/constants";
import { Link } from "../common";
interface CollapsedSidebarProps {
  mainNavItems: Array<{
    title: string;
    href: string;
    key: string;
    icon: any;
    navIcon?: string;
    expandable?: boolean;
  }>;
  ExtraNavItems: Array<{
    title: string;
    href: string;
    key: string;
    icon: any;
    navIcon?: string;
    expandable?: boolean;
  }>;
  selectedMainNavKey?: string;
  categories: Array<{
    name: string;
    path: string;
    icon?: string;
  }>;
  /** Expandable rail icons: parent expands the drawer and opens this nav accordion. */
  onExpandableNavClick?: (navKey: string) => void;
}

export default function CollapsedSidebar({
  mainNavItems,
  ExtraNavItems,
  selectedMainNavKey,
  onExpandableNavClick,
}: CollapsedSidebarProps) {
  const { modifyHref, handleNavigate } = useAffiliateNavigation();

  const topNavItems = useMemo(() => {
    return mainNavItems;
  }, [mainNavItems]);

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
              href={modifyHref(item.href || "#")}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (item.expandable) {
                  onExpandableNavClick?.(item.key);
                  return;
                }
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
              href={modifyHref(item.href || "#")}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (item.expandable) {
                  onExpandableNavClick?.(item.key);
                  return;
                }
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
