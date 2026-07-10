import { Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./TwoRowGameGroup.module.scss";
import { useEffect, useState, useCallback } from "preact/hooks";
import { useMediaQuery } from "usehooks-ts";
import { ASSET_BASE_URL, mobilePortraitMediaQuery } from "@/config/constants";
import { apiGetGames } from "@/api/common/apiGetGames";
import { tGame } from "@/types/tGame";
import GameCard from "@/components/GameCard";
import { Button } from "@heroui/react";
import { customGamesState } from "@/state/customGamesState";
import { useTranslations } from "@/context/I18nContext";
import { matchesCustomCategory } from "@/config/customGameCategories";
import { ChevronLeft, ChevronRight } from "lucide-preact";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";
import TwoRowMosaic4Games from "./TwoRowMosaic4Games";

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

export default function TwoRowGameGroup({
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
          .filter((c) => matchesCustomCategory(c.category, category ?? ""))
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
  for (let i = 0; i < games.length; i += 4) {
    groupedGames.push(games.slice(i, i + 4));
  }

  return (
    <div className={styles.gameGroup}>
      <div className={styles.titleBar}>
        <div className={styles.title}>
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
        slidesPerView={"auto"}
        slidesPerGroup={1}
        onSwiper={setSwiper}
        autoplay={animated ? { delay: 5000, disableOnInteraction: false } : undefined}
      >
        {groupedGames.map((group) => (
          <SwiperSlide key={group[0].id} className={styles.gameSlide}>
            <TwoRowMosaic4Games games={group} />
          </SwiperSlide>))}
      </Swiper>
    </div>
  );
}
