import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { Users, Crown, ChartArea } from "lucide-react";
import { useLocation } from "@/router";
import { useMemo } from "react";

/** Sidebar + `/casino/live-casino` deep links — keep in sync with active-state logic in NavigationSidebar. */
export const SIDEBAR_EVOLUTION_PROVIDER_ID =
  "18b8a984dcf16829f687eb35990662a06aa8a12f";
  export const SIDEBAR_PRAGMATIC_PROVIDER_ID =
    "8c1aacd4d9947ac06c4513af1743842f5fa962f3";

// Map navigation keys to sidebar SVG icons
const getNavIcon = (key: string): string => {
  const iconMap: Record<string, string> = {
    slots: "/images/sidebar/casino.webp",
    "live-casino": "/images/sidebar/live-casino.webp",
    promotions: "/images/sidebar/promotions.webp",
    blog: "/images/sidebar/blog.svg",
    forum: "/images/sidebar/forum.svg",
    sponsorships: "/images/sidebar/sponsorships.svg",
    "responsible-gambling": "/images/sidebar/responsible-gambling.png",
    "live-support": "/images/sidebar/support.webp",
    language: "/images/sidebar/language.webp",
    "vip-club": "/images/sidebar/vip-club.svg",
    affiliate: "/images/sidebar/affiliate.svg",
    "superagent": "/images/sidebar/superagent.svg",
    "agent": "/images/sidebar/agent.svg",
    "users": "/images/sidebar/users.svg",
    "area-manager": "/images/sidebar/area-manager.svg",
    "dashboard": "/images/sidebar/dashboard.svg",
  };
  return iconMap[key] || "/images/sidebar/casino.webp";
};

export const useTablist = () => {
  const t = useTranslations("Header");
  const tc = useTranslations("CasinoPage");
  const pathname = useLocation();
  const user = userState.value;
  const tabList = useMemo(() => {
    if (!user?.isAgent) {
      return [
        {
          title: t("Home"),
          href: "/",
          key: "home",
          navIcon: "/images/sidebar/home.webp",
        },
        {
          title: t("Favorites"),
          href: "/favorites",
          key: "favorites",
          navIcon: "/images/sidebar/favorites.webp",
        },
        {
          title: t("Casino"),
          key: "slots",
          navIcon: "/images/sidebar/casino.webp",
          expandable: true,
          expandableItems: [
            { title: tc("Lobby"), href: "/?page=lobby-casino", icon: "/images/category_logo/lobby.webp" },
            { title: tc("Popular"), href: "/casino-category?page=popular-casino", icon: "/images/category_logo/popular.webp" },
            { title: tc("Megaways"), href: "/casino-category?page=megaways-casino", icon: "/images/category_logo/megaways.webp" },
            { title: tc("Jackpots"), href: "/casino-category?page=jackpots-casino", icon: "/images/category_logo/jackpots.webp" },
            { title: tc("New"), href: "/casino-category?page=new-casino", icon: "/images/category_logo/new.webp" },
            { title: tc("Top"), href: "/casino-category?page=top-casino", icon: "/images/category_logo/top.webp" },
          ],
        },
        {
          title: t("Live Casino"),
          key: "live-casino",
          navIcon: "/images/sidebar/live-casino.webp",
          expandable: true,
          expandableItems: [
            { title: tc("Lobby"), href: "/?page=lobby-live-casino", icon: "/images/category_logo/lobby.webp" },
            { title: tc("Roulette"), href: "/casino-category?page=roulette-livecasino", icon: "/images/category_logo/roulette.webp" },
            { title: tc("Blackjack"), href: "/casino-category?page=blackjack-livecasino", icon: "/images/category_logo/blackjack.webp" },
            { title: tc("Baccarat"), href: "/casino-category?page=baccarat-livecasino", icon: "/images/category_logo/baccarat.webp" },
            { title: tc("Shows"), href: "/casino-category?page=shows-livecasino", icon: "/images/category_logo/shows.webp" },
            { title: tc("Top Live Games"), href: "/casino-category?page=top-livecasino", icon: "/images/category_logo/top-live-games.webp" },
          ],
        },
        {
          title: t("Evolution Live"),
          href: `/casino/live-casino?providerId=${SIDEBAR_EVOLUTION_PROVIDER_ID}`,
          key: "evolution-live",
          navIcon: "/images/sidebar/evolution-live.webp",
        },
        {
          title: t("Pragmatic Live"),
          href: `/casino/live-casino?providerId=${SIDEBAR_PRAGMATIC_PROVIDER_ID}`,
          key: "pragmatic-live",
          navIcon: "/images/sidebar/pragmatic-live.webp",
        },
        {
          title: t("Table Games"),
          href: "/casino/live-casino?custom=1&category=tablegames",
          key: "table-games",
          navIcon: "/images/sidebar/table-games.webp",
        },
        {
          title: t("Promotions"),
          href: "/promotions",
          key: "promotions",
          navIcon: "/images/sidebar/promotions.webp",
        },
        {
          title: t("VIP"),
          href: "/vip",
          key: "vip",
          navIcon: "/images/sidebar/vip.webp",
        },
        {
          title: t("Language") || "Language",
          href: "#",
          key: "language",
          // icon: <Globe aria-hidden="true" className="w-5 h-5" />,
          navIcon: "/images/sidebar/language.webp",
          expandable: true,
        },
      ];
    } else {
      if (user?.role === "AREA_MANAGER") {
        return [
          {
            title: t("Area Manager"),
            href: "/area_manager",
            key: "superagent",
            icon: <Crown />,
            navIcon: getNavIcon("superagent"),
          },
        ];
      } else if (user?.role === "SUPERAGENT") {
        return [
          {
            title: t("Superagent"),
            href: "/superagent",
            key: "superagent",
            icon: <Crown />,
            navIcon: getNavIcon("superagent"),
          },
        ];
      } else {
        return [
          {
            title: t("Dashboard"),
            href: "/agent",
            key: "agent",
            icon: <ChartArea />,
            navIcon: getNavIcon("agent"),
          },
          {
            title: t("Users"),
            href: "/agent/users",
            key: "users",
            icon: <Users />,
            navIcon: getNavIcon("users"),
          },
        ];
      }
    }
  }, [user, t, tc]);

  const selectedKey = useMemo(() => {
    // if you use i18n like /en/..., strip the locale prefix here if needed
    const current = [...tabList].reverse().find(
      (t) =>
        // startsWith is safer when routes have deeper paths
        pathname.path === t.href?.split("?")[0] ||
        pathname.path?.startsWith(`${t.href?.split("?")[0]}/`)
    );

    if (!current) {
      return "home";
    }
    return current?.key;
  }, [pathname, tabList]);

  return { tabList, selectedKey };
};
