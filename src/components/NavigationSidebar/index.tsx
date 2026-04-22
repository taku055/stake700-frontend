import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { useMemo, useState, useEffect } from "preact/hooks";
import {
  navigationSidebarExpandedState,
} from "@/state/navigationSidebarState";
import { useLocation } from "preact-iso";
import { useTablist } from "@/hooks/useTablist";
import { tPageType } from "@/pages/casino/data";
import CollapsedSidebar from "./CollapsedSidebar";
import ExpandedDrawer from "./ExpandedDrawer";
import MobileDrawer from "./MobileDrawer";
import { userState } from "@/state/userState";
import { useSelectedTab } from "@/hooks/useSelectedTab";

interface NavigationItem {
  title: string;
  href: string;
  key: string;
  icon: any;
  onclick?: () => void;
  pageType?: tPageType;
  navIcon?: string;
  expandable?: boolean;
  expandableItems?: Array<{
    title: string;
    href?: string;
    icon: string;
  }>;
}

export default function NavigationSidebar() {
  const isMobile = useMediaQuery(mobileMediaQuery);
  const [isExpanded, setIsExpanded] = useState(
    navigationSidebarExpandedState.value
  );
  const { tabList } = useTablist();
  const location = useLocation();
  const hideSidebar = useMemo(
    () => userState.value?.role && userState.value?.role !== "NORMAL",
    [userState.value?.role]
  );
  const selectedTab = useSelectedTab();

  if (hideSidebar) {
    return null;
  }

  // Sync with signal state
  useEffect(() => {
    navigationSidebarExpandedState.value = !isMobile;
    const unsubscribeExpanded = navigationSidebarExpandedState.subscribe(
      (value) => {
        setIsExpanded(value);
      }
    );

    return () => {
      unsubscribeExpanded();
    };
  }, [isMobile]);

  // Filter main navigation items
  const mainNavItems: NavigationItem[] = useMemo(() => {
    return tabList
      .filter((item) =>
        ["home", "promotions", "missions", "slots", "live-casino", "evolution-live", "playtech-live", "table-games", "jackpots"].includes(
          item.key
        )
      )
      .map((item: any) => {
        return {
          title: item.title,
          href: item.href || "",
          key: item.key,
          icon: item.icon,
          navIcon: item.navIcon,
          onclick: item.onclick,
          expandable: item.expandable,
          expandableItems: item.expandableItems || [],
        };
      });
  }, [tabList]);

  const ExtraNavItems: Array<{
    title: string;
    href: string;
    key: string;
    icon: any;
    navIcon?: string;
    onclick?: () => void;
    pageType?: tPageType;
    expandable?: boolean;
    expandableItems?: Array<{
      title: string;
      href?: string;
      icon: string;
    }>;
  }> = useMemo(() => {
    return tabList
      .filter((item) =>
        [
          "language",
        ].includes(item.key)
      )
      .map((item: any) => ({
        title: item.title,
        href: item.href || "",
        key: item.key,
        icon: item.icon,
        navIcon: item.navIcon,
        onclick: item.onclick,
        pageType: undefined,
        expandable: item.expandable,
        expandableItems: item.expandableItems || [],
      }));
  }, [tabList]);

  // Determine selected main nav item
  const selectedMainNav = useMemo(() => {
    return mainNavItems.find((item) => {
      const path = location.path.split("?")[0];
      if (item.key === "home") return path === "/" || path === "";
      if (item.key === "slots") return path.startsWith("/casino");
      if (item.key === "live-casino") return path.startsWith("/live-casino");
      if (item.key === "promotions") return path.startsWith("/promotions");
      if (item.key === "missions") return path.startsWith("/missions");
      if (item.href) return path.startsWith(item.href.split("?")[0]);
      return false;
    });
  }, [mainNavItems, location.path]);

  // Mobile: Show drawer when open
  if (isMobile) {
    if (!isExpanded) {
      return null;
    }

    return (
      <MobileDrawer
        mainNavItems={mainNavItems}
        ExtraNavItems={ExtraNavItems}
        selectedMainNavKey={selectedMainNav?.key}
        categories={[]}
        selectedMainNavTitle={selectedMainNav?.title || "Categories"}
      />
    );
  }

  // Desktop: Show collapsed sidebar (always visible) and expanded drawer (when expanded)
  return (
    <>
      <div className="bg-[var(--bar-background-color)] relative top-0 p-0 m-0">
        {navigationSidebarExpandedState.value ? (
          <ExpandedDrawer
            mainNavItems={mainNavItems}
            ExtraNavItems={ExtraNavItems}
            selectedMainNavKey={selectedMainNav?.key}
            categories={[]}
            selectedMainNavTitle={selectedMainNav?.title || "Categories"}
          />
        ) : (
          !isMobile && (
            <CollapsedSidebar
              mainNavItems={mainNavItems}
              ExtraNavItems={ExtraNavItems}
              selectedMainNavKey={selectedMainNav?.key}
              categories={[]}
            />
          )
        )}
      </div>
    </>
  );
}
