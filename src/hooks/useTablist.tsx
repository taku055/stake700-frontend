import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { Users, Crown, ChartArea } from "lucide-preact";
import { useLocation } from "preact-iso";
import { useMemo } from "preact/hooks";

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
              src="/images/icons/live-icon.svg"
              alt="Live"
              className="w-[24px] h-[24px]"
            />
          ),
        },
        {
          title: t("Sports"),
          href: "/sport",
          key: "sport",
          icon: <img src="/images/icons/sport-icon.svg" alt="Sport" />,
        },
        {
          title: t("Slot"),
          href: "/casino/slots?custom=1&category=slot-top-slots",
          key: "slots",
          extra: ["/casino/tournaments"],
          icon: <img src="/images/icons/slot-icon.svg" alt="Slot" />,
        },
        {
          title: t("Live Casino"),
          href: "/casino/live-casino",
          key: "live-casino",
          icon: (
            <img src="/images/icons/livecasino-icon.svg" alt="Live Casino" />
          ),
        },
        {
          title: t("Games"),
          href: "/casino/games",
          key: "games",
          icon: <img src="/images/icons/games-icon.svg" alt="Games" />,
        },
        {
          title: t("Live Racing"),
          href: "/casino/live-racing?sportsBookPath=/horse-racing",
          key: "live-racing",
          icon: <img src="/images/icons/live-racing.svg" alt="Live Racing" />,
        },
        {
          title: t("Virtual Sports"),
          href: "/casino/virtual-sports",
          key: "virtual-sports",
          icon: (
            <img
              src="/images/icons/virtualsports-icon.svg"
              alt="Virtual Sports"
            />
          ),
        },
        {
          title: t("Jackpot"),
          href: "/casino/jackpot",
          key: "jackpot",
          icon: <img src="/images/icons/jackpot-icon.svg" alt="Jackpot" />,
        },
        {
          title: t("Promotions"),
          href: "/promotions",
          key: "promotions",
          icon: (
            <img src="/images/icons/promotions-icon.svg" alt="Promotions" />
          ),
        },
        {
          title: t("TV Games"),
          href: "/casino/tv-games",
          key: "tv-games",
        },
        {
          title: t("Trebuchet"),
          href: "/trebuchet",
          key: "trebuchet",
        },
      ];
    } else {
      if (userState.value?.isSuperAgent) {
        return [
          {
            title: t("Dashboard"),
            href: "/superagent",
            key: "superagent",
            icon: <Crown />,
          },
        ];
      } else {
        return [
          {
            title: t("Dashboard"),
            href: "/agent",
            key: "agent",
            icon: <ChartArea />,
          },
          {
            title: t("Users"),
            href: "/agent/users",
            key: "users",
            icon: <Users />,
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
        pathname.path === t.href.split("?")[0] ||
        pathname.path?.startsWith(`${t.href.split("?")[0]}/`)
    );

    if (!current) {
      return "home";
    }
    return current?.key;
  }, [pathname, tabList]);

  return { tabList, selectedKey };
};
