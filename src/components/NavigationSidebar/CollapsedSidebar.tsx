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

  const railButton = (active: boolean) =>
    `relative flex items-center justify-center w-11 h-11 rounded-md transition-colors duration-150 ${
      active
        ? "bg-[#2f4553] text-white"
        : "bg-transparent text-[#b1bad3] hover:bg-[#213743] hover:text-white"
    }`;

  return (
    <div
      className="sticky top-0 md:flex w-[72px] bg-[var(--sidebar-background)] flex-col h-full"
    >
      <div className="flex-1 flex flex-col overflow-y-auto min-h-0 scrollbar-hide">
        <div className="flex flex-col items-center py-3 gap-2 flex-shrink-0">
          {topNavItems.map((item) => {
            const active = selectedMainNavKey === item.key;
            return (
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
                className={railButton(active)}
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
            );
          })}
        </div>

        <div className="mx-auto my-1 h-px w-8 flex-shrink-0 bg-[#2f4553]" />

        <div className="flex flex-col items-center py-3 gap-2 flex-shrink-0">
          {ExtraNavItems.map((item) => {
            const active = selectedMainNavKey === item.key;
            return (
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
                className={railButton(active)}
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
