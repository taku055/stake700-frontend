import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { Users, Crown, ChartArea, Shield, Globe, Headphones, Handshake, MessageSquare, FileText, Trophy, Gift } from "lucide-preact";
import { useLocation } from "preact-iso";
import { useMemo } from "preact/hooks";
import { ASSET_BASE_URL } from "@/config/constants";
import { vipOpenedState } from "@/state/vipOpenedState";
import { liveSupportExpandedState } from "@/state/liveSupportExpandedState";

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
          title: "Missions",
          href: "/missions",
          key: "missions",
          navIcon: "/images/sidebar/missions.png",
        },
        {
          title: t("Casino"),
          key: "slots",
          navIcon: "/images/sidebar/casino.png",
          expandable: true,
          expandableItems: [
            { title: "Lobby", href: "/casino", icon: "/images/category_logo/lobby.png" },
            { title: "Top", href: "/casino/top", icon: "/images/category_logo/top.png" },
            { title: "New", href: "/casino/new", icon: "/images/category_logo/new.png" },
            { title: "Popular", href: "/casino/popular", icon: "/images/category_logo/popular.png" },
            { title: "Jackpots", href: "/casino/jackpots", icon: "/images/category_logo/jackpots.png" },
            { title: "Megaways", href: "/casino/megaways", icon: "/images/category_logo/megaways.png" },
            { title: "Buy Bonus", href: "/casino/buy-bonus", icon: "/images/category_logo/buy-bonus.png" },
          ],
        },
        {
          title: t("Live Casino"),
          key: "live-casino",
          navIcon: "/images/sidebar/live-casino.png",
          expandable: true,
          expandableItems: [
            { title: "Lobby", href: "/live-casino", icon: "/images/category_logo/lobby.png" },
            { title: "Top Live Games", href: "/live-casino/top", icon: "/images/category_logo/top-live-games.png" },
            { title: "Roulette", href: "/live-casino/roulette", icon: "/images/category_logo/roulette.png" },
            { title: "Blackjack", href: "/live-casino/blackjack", icon: "/images/category_logo/blackjack.png" },
            { title: "Baccarat", href: "/live-casino/baccarat", icon: "/images/category_logo/baccarat.png" },
            { title: "Shows", href: "/live-casino/shows", icon: "/images/category_logo/shows.png" },
          ],
        },
        {
          title: "Evolution Live",
          href: "/live-casino/evolution",
          key: "evolution-live",
          navIcon: "/images/sidebar/evolution-live.png",
        },
        {
          title: "Playtech Live",
          href: "/live-casino/playtech",
          key: "playtech-live",
          navIcon: "/images/sidebar/playtech-live.png",
        },
        {
          title: t("Table Games"),
          href: "/live-casino/table-games",
          key: "table-games",
          navIcon: "/images/sidebar/table-games.png",
        },
        {
          title: t("Jackpots"),
          href: "/casino/jackpots",
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
            title: "Area Manager",
            href: "/area_manager",
            key: "superagent",
            icon: <Crown />,
            navIcon: getNavIcon("superagent"),
          },
        ];
      } else if (userState.value?.role === "SUPERAGENT") {
        return [
          {
            title: "Superagent",
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
  }, [userState.value, t]);

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
