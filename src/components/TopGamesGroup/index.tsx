import { Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./TopGamesGroup.module.scss";
import { useEffect, useState, useCallback } from "preact/hooks";
import { useMediaQuery } from "usehooks-ts";
import { ASSET_BASE_URL, mobilePortraitMediaQuery } from "@/config/constants";
import { apiGetGames } from "@/api/common/apiGetGames";
import { tGame } from "@/types/tGame";
import GameCard from "@/components/GameCard";
import { Button } from "@heroui/react";
import { customGamesState } from "@/state/customGamesState";
import { useTranslations } from "@/context/I18nContext";
import { ChevronLeft, ChevronRight, Group } from "lucide-preact";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";

interface IGameGroupProps {
  title: string;
  category?: string;
  isCustom?: boolean;
  viewallLink?: string;
  provider?: string;
  exceptGameId?: string;
  bigMode?: boolean;
  animated?: boolean;
  template?: number;
  icon?: string;
  gameList?: tGame[];
}


export default function TopGamesGroup({
  title,
  category,
  isCustom,
  viewallLink,
  provider,
  exceptGameId,
  bigMode,
  animated,
  icon,
  template = 0,
  gameList,
}: IGameGroupProps) {
  const isMobilePortrait = useMediaQuery(mobilePortraitMediaQuery);
  const [games, setGames] = useState<tGame[]>([]);
  const t = useTranslations("GameGroup");
  const [swiper, setSwiper] = useState<any>(null);
  const isRTL = RTL_LANGUAGES.includes(localeState.value);

  const goToNextSlide = useCallback(() => {
    console.log("goToNextSlide", swiper);
    swiper?.slideNext();
  }, [swiper]);

  const goToPrevSlide = useCallback(() => {
    swiper?.slidePrev();
  }, [swiper]);

  useEffect(() => {
    (async () => {
      if (gameList) {
        setGames(gameList);
        return;
      }
      const data = isCustom
        ? customGamesState.value
          .filter((c) => c.category === category)
          .slice(0, 30)
          .map((e) => e.Game as tGame)
        : (
          await apiGetGames({
            category: category,
            limit: 30,
            provider: provider,
            randomOrderby: true,
          })
        ).data;
      setGames(data.filter((e) => e.id !== exceptGameId));
    })();
  }, [category, isCustom, customGamesState.value, provider, exceptGameId, gameList]);

  const groupedGames = [];
  for (let i = 0; i < games.length; i += 5) {
    groupedGames.push(games.slice(i, i + 5));
  }

  return (
    <div className={styles.gameGroup}>
      <div className={styles.titleBar}>
        <div className={styles.title}>
          <img
            src={icon || `${ASSET_BASE_URL}/images/icons/trending-game.png`}
            alt={title}
            className={styles.icon}
          />
          <div className={styles.text}>{title}</div>
        </div>
        <div className={styles.action}>
          {isRTL ? (
            <>
              <Button
                onPress={goToNextSlide}
                size="sm"
                isIconOnly
                className={styles.moveButton + " rounded-lg"}
              >
                <ChevronRight color="white" size={16} />
              </Button>
              <Button
                onPress={goToPrevSlide}
                size="sm"
                isIconOnly
                className={styles.moveButton + " rounded-lg"}
              >
                <ChevronLeft color="white" size={16} />
              </Button>
            </>
          ) : (
            <>
              <Button
                onPress={goToPrevSlide}
                size="sm"
                isIconOnly
                className={styles.moveButton + " rounded-lg"}
              >
                <ChevronLeft color="white" size={16} />
              </Button>
              <Button
                onPress={goToNextSlide}
                size="sm"
                isIconOnly
                className={styles.moveButton + " rounded-r-lg"}
              >
                <ChevronRight color="white" size={16} />
              </Button>
            </>
          )}
          <a href={viewallLink || "#"} className={styles.view}>
            {t("More")} <ChevronRight color="white" size={16} />
          </a>
        </div>
      </div>
      <Swiper
        key={`game-group-${isRTL ? "rtl" : "ltr"}-${localeState.value}`}
        modules={[Mousewheel, Navigation]}
        className={styles.games}
        dir={isRTL ? "rtl" : "ltr"}
        loop={false}
        loopAddBlankSlides={false}
        spaceBetween={isMobilePortrait ? 6 : 12}
        slidesPerView={
          isMobilePortrait ? (bigMode ? 1.2 : 1) : bigMode ? 1.1 : 1.75
        }
        slidesPerGroup={1}
        onSwiper={setSwiper}
        autoplay={animated ? { delay: 5000, disableOnInteraction: false } : undefined}
      >
        {groupedGames.map((games) => (
          <SwiperSlide key={games[0].id} className={styles.gameSlide}>
            <div className={styles.groupedGames}>
              {games.map((game) => (
                <div className={styles.gameCard} key={game.id}>
                  <GameCard data={game} />
                </div>
              ))}
            </div>
          </SwiperSlide>))}
      </Swiper>
    </div>
  );
}