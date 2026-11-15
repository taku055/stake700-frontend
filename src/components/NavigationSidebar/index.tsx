import { useMediaQuery } from "@/hooks/useMediaQuery";
import { mobileMediaQuery } from "@/config/constants";
import { useMemo, useState, useEffect, useCallback } from "react";
import { navigationSidebarExpandedState } from "@/state/navigationSidebarState";
import { useLocation } from "@/router";
import { useTablist } from "@/hooks/useTablist";
import { routes } from "@/config/routes";
import { tPageType } from "@/site/casino/data";
import CollapsedSidebar from "./CollapsedSidebar";
import ExpandedDrawer from "./ExpandedDrawer";
import MobileDrawer from "./MobileDrawer";
import { userState } from "@/state/userState";
import { useSelectedTab } from "@/hooks/useSelectedTab";
import { useTranslations } from "@/context/I18nContext";

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
  const t = useTranslations("Header");
  const isMobile = useMediaQuery(mobileMediaQuery);
  const [isExpanded, setIsExpanded] = useState(
    navigationSidebarExpandedState.value
  );
  const [accordionIntent, setAccordionIntent] = useState<string | null>(null);

  const handleExpandableFromCollapsedNav = useCallback((navKey: string) => {
    setAccordionIntent(navKey);
    navigationSidebarExpandedState.value = true;
  }, []);
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

  // Sync local state with signal; on mobile, drawer stays closed until opened from header/footer
  useEffect(() => {
    if (isMobile) {
      navigationSidebarExpandedState.value = false;
    }
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
        ["home", "favorites", "slots", "live-casino", "evolution-live", "pragmatic-live", "table-games", "providers", "promotions", "vip"].includes(
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
      .filter(() => false)
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

  // Determine selected main nav item from the clean, locale-less path
  const selectedMainNav = useMemo(() => {
    const path = (location.path.split("?")[0] || "").replace(/\/$/, "") || "/";
    const byKey = (key: string) => mainNavItems.find((i) => i.key === key);
    const isUnder = (base: string) => path === base || path.startsWith(`${base}/`);

    if (path === "/") return byKey("home");

    // Provider shortcuts (Evolution / Pragmatic Live) before the generic providers entry
    const providerItem = mainNavItems.find(
      (i) => (i.key === "evolution-live" || i.key === "pragmatic-live") && i.href && isUnder(i.href),
    );
    if (providerItem) return providerItem;

    if (isUnder(routes.category("live-casino", "table-games"))) return byKey("table-games");
    if (isUnder(routes.liveCasino())) return byKey("live-casino");
    if (isUnder(routes.casino())) return byKey("slots");

    return mainNavItems.find((item) => {
      if (!item.href) return false;
      const base = item.href.split("?")[0];
      return base !== "/" && isUnder(base);
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
        selectedMainNavTitle={selectedMainNav?.title || t("Categories")}
      />
    );
  }

  // Desktop: Show collapsed sidebar (always visible) and expanded drawer (when expanded)
  return (
    <>
      <div className="relative top-0 h-full p-0 m-0 bg-[var(--sidebar-background)]">
        {navigationSidebarExpandedState.value ? (
          <ExpandedDrawer
            mainNavItems={mainNavItems}
            ExtraNavItems={ExtraNavItems}
            selectedMainNavKey={selectedMainNav?.key}
            categories={[]}
            selectedMainNavTitle={selectedMainNav?.title || t("Categories")}
            accordionIntent={accordionIntent}
            onAccordionIntentApplied={() => setAccordionIntent(null)}
          />
        ) : (
          !isMobile && (
            <CollapsedSidebar
              mainNavItems={mainNavItems}
              ExtraNavItems={ExtraNavItems}
              selectedMainNavKey={selectedMainNav?.key}
              categories={[]}
              onExpandableNavClick={handleExpandableFromCollapsedNav}
            />
          )
        )}
      </div>
    </>
  );
}
