import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { Users, Crown, ChartArea, Shield, Globe, Headphones, Handshake, MessageSquare, FileText, Trophy, Gift } from "lucide-preact";
import { useLocation } from "preact-iso";
import { useMemo } from "preact/hooks";
import { ASSET_BASE_URL } from "@/config/constants";
import { vipOpenedState } from "@/state/vipOpenedState";
import { liveSupportExpandedState } from "@/state/liveSupportExpandedState";

/** Sidebar + `/casino/live-casino` deep links — keep in sync with active-state logic in NavigationSidebar. */
export const SIDEBAR_EVOLUTION_PROVIDER_ID =
  "f66b7dcd21696a4242e1ff93608c405741802c92";
export const SIDEBAR_PLAYTECH_PROVIDER_ID =
  "8ada660e06b787f245667943dc948dafab997e25";

// Map navigation keys to sidebar SVG icons
const getNavIcon = (key: string): string => {
  const iconMap: Record<string, string> = {
    slots: "/images/sidebar/casino.svg",
    "live-casino": "/images/sidebar/live-casino.svg",
    sport: "/images/sidebar/sportsbook.svg",
    promotions: `${ASSET_BASE_URL}/images/icons/promotions.svg`,
    blog: "/images/sidebar/blog.svg",
    forum: "/images/sidebar/forum.svg",
    sponsorships: "/images/sidebar/sponsorships.svg",
    "responsible-gambling": "/images/sidebar/responsible-gambling.png",
    "live-support": "/images/sidebar/live-support.svg",
    language: "/images/sidebar/language.svg",
    "vip-club": "/images/sidebar/vip-club.svg",
    affiliate: "/images/sidebar/affiliate.svg",
    "superagent": "/images/sidebar/superagent.svg",
    "agent": "/images/sidebar/agent.svg",
    "users": "/images/sidebar/users.svg",
    "area-manager": "/images/sidebar/area-manager.svg",
    "dashboard": "/images/sidebar/dashboard.svg",
  };
  return iconMap[key] || "/images/sidebar/casino.svg";
};

export const useTablist = () => {
  const t = useTranslations("Header");
  const tc = useTranslations("CasinoPage");
  const pathname = useLocation();
  const tabList = useMemo(() => {
    if (!userState.value?.isAgent) {
      return [
        {
          title: t("Home"),
          href: "/",
          key: "home",
          navIcon: "/images/sidebar/home.png",
        },
        {
          title: t("Promotions"),
          href: "/promotions",
          key: "promotions",
          navIcon: "/images/sidebar/promotions.png",
        },
        {
          title: t("Casino"),
          key: "slots",
          navIcon: "/images/sidebar/casino.png",
          expandable: true,
          expandableItems: [
            { title: tc("Lobby"), href: "/?page=lobby-casino", icon: "/images/category_logo/lobby.png" },
            { title: tc("Top"), href: "/casino-category?page=top-casino", icon: "/images/category_logo/top.png" },
            { title: tc("New"), href: "/casino-category?page=new-casino", icon: "/images/category_logo/new.png" },
            { title: tc("Popular"), href: "/casino-category?page=popular-casino", icon: "/images/category_logo/popular.png" },
            { title: tc("Jackpots"), href: "/casino-category?page=jackpots-casino", icon: "/images/category_logo/jackpots.png" },
            { title: tc("Megaways"), href: "/casino-category?page=megaways-casino", icon: "/images/category_logo/megaways.png" },
          ],
        },
        {
          title: t("Live Casino"),
          key: "live-casino",
          navIcon: "/images/sidebar/live-casino.png",
          expandable: true,
          expandableItems: [
            { title: tc("Lobby"), href: "/?page=lobby-live-casino", icon: "/images/category_logo/lobby.png" },
            { title: tc("Top Live Games"), href: "/casino-category?page=top-livecasino", icon: "/images/category_logo/top-live-games.png" },
            { title: tc("Roulette"), href: "/casino-category?page=roulette-livecasino", icon: "/images/category_logo/roulette.png" },
            { title: tc("Blackjack"), href: "/casino-category?page=blackjack-livecasino", icon: "/images/category_logo/blackjack.png" },
            { title: tc("Baccarat"), href: "/casino-category?page=baccarat-livecasino", icon: "/images/category_logo/baccarat.png" },
            { title: tc("Shows"), href: "/casino-category?page=shows-livecasino", icon: "/images/category_logo/shows.png" },
          ],
        },
        {
          title: t("Evolution Live"),
          href: `/casino/live-casino?providerId=${SIDEBAR_EVOLUTION_PROVIDER_ID}`,
          key: "evolution-live",
          navIcon: "/images/sidebar/evolution-live.png",
        },
        {
          title: t("Playtech Live"),
          href: `/casino/live-casino?providerId=${SIDEBAR_PLAYTECH_PROVIDER_ID}`,
          key: "playtech-live",
          navIcon: "/images/sidebar/playtech-live.png",
        },
        {
          title: t("Table Games"),
          href: "/casino/live-casino?custom=1&category=tablegames",
          key: "table-games",
          navIcon: "/images/sidebar/table-games.png",
        },
        {
          title: t("Jackpots"),
          href: "/casino/slots?custom=1&category=slot-new",
          key: "jackpots",
          navIcon: "/images/category_logo/jackpots.png",
        },
        {
          title: t("Language") || "Language",
          href: "#",
          key: "language",
          // icon: <Globe aria-hidden="true" className="w-5 h-5" />,
          navIcon: "/images/sidebar/language.png",
          expandable: true,
        },
      ];
    } else {
      if (userState.value?.role === "AREA_MANAGER") {
        return [
          {
            title: t("Area Manager"),
            href: "/area_manager",
            key: "superagent",
            icon: <Crown />,
            navIcon: getNavIcon("superagent"),
          },
        ];
      } else if (userState.value?.role === "SUPERAGENT") {
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
  }, [userState.value, t, tc]);

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
