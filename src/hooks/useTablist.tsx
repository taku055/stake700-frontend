import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { Users, Crown, ChartArea, Shield, Globe, Headphones, Handshake, MessageSquare, FileText, Trophy } from "lucide-preact";
import { useLocation } from "preact-iso";
import { useMemo } from "preact/hooks";
import {ASSET_BASE_URL} from "@/config/constants";
import { vipOpenedState } from "@/state/vipOpenedState";
import { liveSupportExpandedState } from "@/state/liveSupportExpandedState";

// Map navigation keys to sidebar SVG icons
const getNavIcon = (key: string): string => {
  const iconMap: Record<string, string> = {
    slots: "/images/sidebar/casino.svg",
    "live-casino": "/images/sidebar/live-casino.svg",
    sport: "/images/sidebar/sportsbook.svg",
    promotions: "/images/sidebar/promotions.png",
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
          title: t("Live"),
          href: "/live?sportsBookPath=%2Flive",
          key: "live",
          icon: (
            <img
              src={`${ASSET_BASE_URL}/images/icons/live-icon.svg`}
              alt="Live"
              className="w-[24px] h-[24px]"
            />
          ),
          navIcon: getNavIcon("live"),
        },
        {
          title: t("Sports"),
          href: "/sport",
          key: "sport",
          icon: <img src={`${ASSET_BASE_URL}/images/icons/sport-icon.svg`} alt="Sport" />,
          navIcon: getNavIcon("sport"),
        },
        {
          title: t("Casino"),
          key: "slots",
          extra: ["/casino"],
          icon: <img src={`${ASSET_BASE_URL}/images/icons/slot-icon.svg`} alt="Slot" />,
          navIcon: getNavIcon("slots"),
        },
        {
          title: t("Live Casino"),
          key: "live-casino",
          icon: (
            <img src={`${ASSET_BASE_URL}/images/icons/livecasino-icon.svg`} alt="Live Casino" />
          ),
          navIcon: getNavIcon("live-casino"),
        },
        // {
        //   title: t("Promotions"),
        //   href: "/promotions",
        //   key: "promotions",
        //   icon: (
        //     <img src={`${ASSET_BASE_URL}/images/icons/promotions.svg`} alt="Promotions" />
        //   ),
        //   navIcon: getNavIcon("promotions"),
        //   expandable: true,
        //   expandableItems: [
        //     {
        //       title: "Sorteo Semanal d...",
        //       // href: "/promotions/15",
        //       icon: `${ASSET_BASE_URL}/images/icons/reward.svg`,
        //     },
        //     {
        //       title: "Carrera de $100k",
        //       // href: "/promotions/12",
        //       icon: `${ASSET_BASE_URL}/images/icons/live-icon.svg`,
        //     },
        //     {
        //       title: "Pragmatic Drops ...",
        //       // href: "/promotions/13",
        //       icon: `${ASSET_BASE_URL}/images/icons/promotions.svg`,
        //     },
        //   ],
        // },
        {
          title: t("Games"),
          href: "/casino/games",
          key: "games",
          icon: <img src={`${ASSET_BASE_URL}/images/icons/games-icon.svg`} alt="Games" />,
          navIcon: getNavIcon("games"),
        },
        {
          title: t("Live Racing"),
          href: "/casino/live-racing?sportsBookPath=/horse-racing",
          key: "live-racing",
          icon: <img src={`${ASSET_BASE_URL}/images/icons/live-racing.svg`} alt="Live Racing" />,
          navIcon: getNavIcon("live-racing"),
        },
        {
          title: t("Virtual Sports"),
          href: "/casino/virtual-sports",
          key: "virtual-sports",
          icon: (
            <img
              src={`${ASSET_BASE_URL}/images/icons/virtualsports-icon.svg`}
              alt="Virtual Sports"
            />
          ),
          navIcon: getNavIcon("virtual-sports"),
        },
        {
          title: t("Jackpot"),
          href: "/casino/jackpot",
          key: "jackpot",
          icon: <img src={`${ASSET_BASE_URL}/images/icons/jackpot-icon.svg`} alt="Jackpot" />,
          navIcon: getNavIcon("jackpot"),
        },
        {
          title: t("TV Games"),
          href: "/casino/tv-games",
          key: "tv-games",
          icon: <img src={`${ASSET_BASE_URL}/images/icons/tv-games.svg`} alt="TV Games" />,
          navIcon: getNavIcon("tv-games"),
        },
        {
          title: t("Trebuchet"),
          href: "/trebuchet",
          key: "trebuchet",
          icon: <img src={`${ASSET_BASE_URL}/images/icons/trebuchet.svg`} alt="Trebuchet" />,
          navIcon: getNavIcon("trebuchet"),
        },
        // {
        //   title: t("Affiliate") || "Affiliate",
        //   href: "/affiliate",
        //   key: "affiliate",
        //   icon: <img src={`${ASSET_BASE_URL}/images/icons/affiliate.svg`} alt="Affiliate"/>,
        //   navIcon: getNavIcon("affiliate"),
        // },
        // {
        //   title: t("VIP Club") || "VIP Club",
        //   href: "",
        //   key: "vip-club",
        //   icon: <img src={`${ASSET_BASE_URL}/images/icons/vip-club.svg`} alt="VIP-Club"/>,
        //   navIcon: getNavIcon("vip-club"),
        //   onclick: () => {
        //     vipOpenedState.value = true;
        //     console.log("vipOpenedState", vipOpenedState.value);
        //   },
        // },
        // {
        //   title: t("Blog") || "Blog",
        //   href: "/blog",
        //   key: "blog",
        //   icon: <img src={`${ASSET_BASE_URL}/images/icons/blog.svg`} alt="Blog"/>,
        //   navIcon: getNavIcon("blog"),
        // },
        // {
        //   title: t("Forum") || "Forum",
        //   href: "/forum",
        //   key: "forum",
        //   icon: <img src={`${ASSET_BASE_URL}/images/icons/forum.svg`} alt="Forum"/>,
        //   navIcon: getNavIcon("forum"),
        // },
        // {
        //   title: t("Sponsorships") || "Sponsorships",
        //   href: "/sponsorships",
        //   key: "sponsorships",
        //   icon: <img src={`${ASSET_BASE_URL}/images/icons/sponsorships.svg`} alt="sponsorships"/>,
        //   navIcon: getNavIcon("sponsorships"),
        //   expandable: true,
        //   expandableItems: [
            
        //   ],
        // },
        {
          title: t("Responsible Gambling") || "Responsible Gambling",
          href: "/support/responsible-gambling",
          key: "responsible-gambling",
          icon: <img src={`${ASSET_BASE_URL}/images/icons/responsible-gambling.png`} alt="Responsible-gambling"/>,
          navIcon: getNavIcon("responsible-gambling"),
        },
        {
          title: t("Live Support") || "Live Support",
          key: "live-support",
          icon: <img src={`${ASSET_BASE_URL}/images/icons/live-support.svg`} alt="Live Support"/>,
          navIcon: getNavIcon("live-support"),
          onclick: () => {
            liveSupportExpandedState.value = !liveSupportExpandedState.value;
          },
        },
        {
          title: t("Language") || "Language",
          href: "#",
          key: "language",
          icon: <img src={`${ASSET_BASE_URL}/images/icons/language.svg`} alt="Language"/>,
          navIcon: getNavIcon("language"),
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
