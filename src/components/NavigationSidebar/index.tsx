import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { useMemo, useState, useEffect, useCallback } from "preact/hooks";
import { navigationSidebarExpandedState } from "@/state/navigationSidebarState";
import { useLocation } from "preact-iso";
import {
  useTablist,
  SIDEBAR_EVOLUTION_PROVIDER_ID,
  SIDEBAR_PRAGMATIC_PROVIDER_ID,
} from "@/hooks/useTablist";
import { tPageType } from "@/pages/casino/data";
import CollapsedSidebar from "./CollapsedSidebar";
import ExpandedDrawer from "./ExpandedDrawer";
import MobileDrawer from "./MobileDrawer";
import { userState } from "@/state/userState";
import { useSelectedTab } from "@/hooks/useSelectedTab";
import { useTranslations } from "@/context/I18nContext";
import {
  LIVE_CATEGORY_PAGES,
  SLOTS_CATEGORY_PAGES,
  CASINO_CATEGORY_PAGE_QUERY_KEY,
  type CasinoCategoryPageKey,
} from "@/pages/casino-category/data";

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
        ["home", "promotions", "vip", "slots", "live-casino", "evolution-live", "pragmatic-live", "table-games", "live-racing", "jackpots"].includes(
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

  // Determine selected main nav item (most specific routes first — avoids /casino/live-casino matching "slots")
  const selectedMainNav = useMemo(() => {
    const path = (location.path.split("?")[0] || "").replace(/\/$/, "") || "/";
    const q = location.query ?? {};
    const queryVal = (key: string) => {
      const v = q[key];
      return (Array.isArray(v) ? v[0] : v) as string | undefined;
    };

    const categoryPage = (queryVal(CASINO_CATEGORY_PAGE_QUERY_KEY) ||
      "") as CasinoCategoryPageKey;
    const isSlotsCategoryPath =
      path === "/casino-category" &&
      SLOTS_CATEGORY_PAGES.includes(categoryPage);
    const isLiveCategoryPath =
      path === "/casino-category" &&
      LIVE_CATEGORY_PAGES.includes(categoryPage);

    const homePageMode = queryVal("page");
    const byKey = (key: string) => mainNavItems.find((i) => i.key === key);

    if (path === "/" || path === "") {
      if (homePageMode === "lobby-casino") return byKey("slots");
      if (homePageMode === "lobby-live-casino") return byKey("live-casino");
      return byKey("home");
    }

    if (path.startsWith("/promotions")) return byKey("promotions");

    if (path.startsWith("/vip")) return byKey("vip");

    if (path === "/casino-category") {
      if (isSlotsCategoryPath) return byKey("slots");
      if (isLiveCategoryPath) return byKey("live-casino");
    }

    if (path.startsWith("/casino/live-casino")) {
      const providerId = queryVal("providerId");
      if (providerId === SIDEBAR_EVOLUTION_PROVIDER_ID)
        return byKey("evolution-live");
      if (providerId === SIDEBAR_PRAGMATIC_PROVIDER_ID)
        return byKey("pragmatic-live");
      const custom = queryVal("custom");
      const category = queryVal("category");
      if (custom === "1" && category === "tablegames")
        return byKey("table-games");
      return byKey("live-casino");
    }

    if (path.startsWith("/casino/slots")) {
      const custom = queryVal("custom");
      const category = queryVal("category");
      if (custom === "1" && (category === "jackpots" || category === "slot-jackpots"))
        return byKey("jackpots");
      return byKey("slots");
    }

    if (path.startsWith("/sports/racing")) return byKey("live-racing");

    return mainNavItems.find((item) => {
      if (!item.href) return false;
      const base = item.href.split("?")[0];
      return path === base || path.startsWith(`${base}/`);
    });
  }, [mainNavItems, location.path, location.query]);

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
      <div className="bg-[var(--bar-background-color)] relative top-0 p-0 m-0">
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
