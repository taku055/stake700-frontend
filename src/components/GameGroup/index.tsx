import { Autoplay, Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./GameGroup.module.scss";
import { useEffect, useState, useCallback } from "preact/hooks";
import { useMediaQuery } from "usehooks-ts";
import { mobilePortraitMediaQuery } from "@/config/constants";
import { apiGetGames } from "@/api/common/apiGetGames";
import { tGame } from "@/types/tGame";
import GameCard from "@/components/GameCard";
import { Button } from "@heroui/react";
import { customGamesState } from "@/state/customGamesState";
import { useTranslations } from "@/context/I18nContext";
import { ChevronLeft, ChevronRight } from "lucide-preact";

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
}

export default function GameGroup({
  title,
  category,
  isCustom,
  viewallLink,
  provider,
  exceptGameId,
  bigMode,
  animated,
  template = 0
}: IGameGroupProps) {
  const isMobilePortrait = useMediaQuery(mobilePortraitMediaQuery);
  const [games, setGames] = useState<tGame[]>([]);
  const t = useTranslations("GameGroup");
  const [swiper, setSwiper] = useState<any>(null);

  const goToNextSlide = useCallback(() => {
    console.log("goToNextSlide", swiper);
    swiper?.slideNext();
  }, [swiper]);

  const goToPrevSlide = useCallback(() => {
    swiper?.slidePrev();
  }, [swiper]);

  useEffect(() => {
    (async () => {
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
  }, [category, isCustom, customGamesState.value, provider, exceptGameId]);

  return (
    <div className={styles.gameGroup}>
      <div className={styles.titleBar}>
        {
          template == 0 && (
            <>
              <div className={styles.title}>
                <div className={styles.text}>{title}</div>
              </div>

              <div className={styles.action}>
                <Button
                  onPress={goToPrevSlide}
                  size="sm"
                  isIconOnly
                  className={styles.moveButton}
                >
                  <ChevronLeft color="#FFFFFF99" size={16} />
                </Button>
                <Button
                  onPress={goToNextSlide}
                  size="sm"
                  isIconOnly
                  className={styles.moveButton}
                >
                  <ChevronRight color="#FFFFFF99" size={16} />
                </Button>
                <a href={viewallLink || "#"} className={styles.view}>
                  {t("More")}
                </a>
              </div>
            </>
          )
        }
        {
          template == 1 && (
            <>
              <Button
                onPress={goToPrevSlide}
                size="sm"
                isIconOnly
                className={styles.moveButton}
              >
                <ChevronLeft color="#FFFFFF99" size={16} />
              </Button>
              <div className={styles.title}>
                <div className={styles.text}>{title}</div>
                <a href={viewallLink || "#"} className={styles.view}>
                  {t("More")}
                </a>
              </div>
              <Button
                onPress={goToNextSlide}
                size="sm"
                isIconOnly
                className={styles.moveButton}
              >
                <ChevronRight color="#FFFFFF99" size={16} />
              </Button>
            </>
          )
        }

      </div>
      <Swiper
        modules={[Mousewheel, Navigation]}
        className={styles.games}
        loop={false}
        loopAddBlankSlides={false}
        spaceBetween={isMobilePortrait ? 6 : 8}
        slidesPerView={
          isMobilePortrait ? (bigMode ? 1 : 2) : bigMode ? 6 : "auto"
        }
        slidesPerGroup={isMobilePortrait ? 2 : 4}
        onSwiper={setSwiper}
        autoplay={
          animated ? { delay: 5000, disableOnInteraction: false } : undefined
        }
      >
        {games.map((e) => (
          <SwiperSlide key={e.id} className={styles.game}>
            <GameCard data={e} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
