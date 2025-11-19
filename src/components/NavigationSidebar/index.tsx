import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { useMemo, useState, useEffect } from "preact/hooks";
import { navigationSidebarExpandedState, navigationSidebarOpenState } from "@/state/navigationSidebarState";
import { useLocation } from "preact-iso";
import { useTablist } from "@/hooks/useTablist";
import { CATEGORY_DATA, tPageType } from "@/pages/casino/data";
import CollapsedSidebar from "./CollapsedSidebar";
import ExpandedDrawer from "./ExpandedDrawer";
import MobileDrawer from "./MobileDrawer";
import { STATIC_CATEGORIES } from "./categoryData";

interface NavigationItem {
  title: string;
  href: string;
  key: string;
  icon: any;
  pageType?: tPageType;
}

export default function NavigationSidebar() {
  const isMobile = useMediaQuery(mobileMediaQuery);
  const [isExpanded, setIsExpanded] = useState(navigationSidebarExpandedState.value);
  const [isOpen, setIsOpen] = useState(navigationSidebarOpenState.value);
  const { tabList } = useTablist();
  const location = useLocation();

  // Sync with signal state
  useEffect(() => {
    const unsubscribeExpanded = navigationSidebarExpandedState.subscribe((value) => {
      setIsExpanded(value);
    });
    const unsubscribeOpen = navigationSidebarOpenState.subscribe((value) => {
      setIsOpen(value);
    });
    
    return () => {
      unsubscribeExpanded();
      unsubscribeOpen();
    };
  }, []);

  // Filter main navigation items (Casino, Live Casino, Sports, etc.)
  const mainNavItems: NavigationItem[] = useMemo(() => {
    return tabList
      .filter((item) => 
        ["slots", "live-casino", "sport", "live"].includes(item.key)
      )
      .map((item) => {
        let pageType: tPageType | undefined;
        if (item.key === "slots") pageType = "slots";
        else if (item.key === "live-casino") pageType = "live-casino";
        
        return {
          title: item.title,
          href: item.href,
          key: item.key,
          icon: item.icon,
          pageType,
        };
      });
  }, [tabList]);

  // Determine selected main nav item
  const selectedMainNav = useMemo(() => {
    return mainNavItems.find((item) => {
      const path = location.path.split("?")[0];
      if (item.key === "slots") {
        return path.startsWith("/casino/slots");
      } else if (item.key === "live-casino") {
        return path.startsWith("/casino/live-casino");
      } else if (item.key === "sport") {
        return path.startsWith("/sport");
      } else if (item.key === "live") {
        return path.startsWith("/live");
      }
      return false;
    });
  }, [mainNavItems, location.path]);

  // Always show static categories - don't change based on selected nav
  const categories = useMemo(() => {
    // Always return static categories for consistent sidebar icons
    return STATIC_CATEGORIES;
  }, []); // Empty dependency array - categories never change

  // Mobile: Show drawer when open
  if (isMobile) {
    if (!isOpen) {
      return null;
    }
    return (
      <MobileDrawer
        mainNavItems={mainNavItems}
        selectedMainNavKey={selectedMainNav?.key}
        categories={categories}
        selectedMainNavTitle={selectedMainNav?.title || "Categories"}
      />
    );
  }

  // Desktop: Show collapsed sidebar (always visible) and expanded drawer (when expanded)
  return (
    <>
      {/* Collapsed Sidebar - Always visible on desktop */}
      <CollapsedSidebar
        mainNavItems={mainNavItems}
        selectedMainNavKey={selectedMainNav?.key}
        categories={categories}
      />

      {/* Expanded Drawer - Overlays when expanded */}
      {isExpanded && (
        <ExpandedDrawer
          mainNavItems={mainNavItems}
          selectedMainNavKey={selectedMainNav?.key}
          categories={categories}
          selectedMainNavTitle={selectedMainNav?.title || "Categories"}
        />
      )}
    </>
  );
}
