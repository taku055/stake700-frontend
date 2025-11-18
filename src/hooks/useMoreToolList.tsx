import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { Users, Crown, ChartArea } from "lucide-preact";
import { useLocation } from "preact-iso";
import { useMemo } from "preact/hooks";

type tMoreToolList = {
  title: string;
  items: {
    title: string;
    href: string;
    key: string;
    icon: string;
  }[];
}[];

export const useMoreToolList = () => {
  const t = useTranslations("MoreToolDialog");
  const pathname = useLocation();

  const tabList = useMemo<tMoreToolList>(() => {
    if (!userState.value?.isAgent) {
      return [
        {
          title: t("Sport"),
          items: [
            {
              title: t("Live"),
              href: "/live?sportsBookPath=%2Flive",
              key: "live",
              icon: "/images/mobile-menu/live.png",
            },
            {
              title: t("Sport"),
              href: "/sport",
              key: "sport",
              icon: "/images/mobile-menu/sport.png",
            },
            {
              title: t("Esports"),
              href: "/sport",
              key: "esports",
              icon: "/images/mobile-menu/esports.png",
            },
            {
              title: t("Virtual Sports"),
              href: "/casino/virtual-sports",
              key: "virtual-sports",
              icon: "/images/mobile-menu/virtual-sports.png",
            },
          ],
        },
        {
          title: t("Slot"),
          items: [
            {
              title: t("Slot"),
              href: "/casino/slots",
              key: "slot",
              icon: "/images/mobile-menu/slot.png",
            },
            {
              title: t("Live Casino"),
              href: "/casino/live-casino",
              key: "live-casino",
              icon: "/images/mobile-menu/live-casino.png",
            },
            {
              title: t("Games"),
              href: "/casino/games",
              key: "games",
              icon: "/images/mobile-menu/games.png",
            },
            {
              title: t("Live Racing"),
              href: "/casino/live-racing?sportsBookPath=/horse-racing",
              key: "live-racing",
              icon: "/images/icons/live-racing.svg",
            },
            {
              title: t("BetGames TV"),
              href: "/casino/tv-games",
              key: "tv-games",
              icon: "/images/mobile-menu/betgames-tv.png",
            },
            {
              title: t("Tombala"),
              href: "/tombala",
              key: "tombala",
              icon: "/images/mobile-menu/tombala.png",
            },
          ],
        },
        {
          title: t("Autre"),
          items: [
            {
              title: t("Jackpots"),
              href: "/casino/jackpot",
              key: "jackpots",
              icon: "/images/mobile-menu/jackpots.png",
            },
            {
              title: t("Tournaments"),
              href: "/casino/slots/tournaments",
              key: "tournament",
              icon: "/images/mobile-menu/tournaments.png",
            },
          ],
        },
      ];
    }

    return [];
  }, [userState.value, t]);

  return { tabList };
};
