import { Autoplay, Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "preact/hooks";
import { useMediaQuery } from "usehooks-ts";
import { mobilePortraitMediaQuery } from "@/config/constants";
import { tGame } from "@/types/tGame";
import GameCard from "@/components/GameCard";
import { customGamesState } from "@/state/customGamesState";
import { useTranslations } from "@/context/I18nContext";
import styles from "./TrendingGamesPanel.module.scss";

export default function TrendingGamesPanel() {
  const isMobilePortrait = useMediaQuery(mobilePortraitMediaQuery);
  const [games, setGames] = useState<tGame[]>([]);
  const t = useTranslations("GameGroup");

  useEffect(() => {
    // Fetch custom games with "trending" category
    const trendingGames = customGamesState.value
      .filter((c) => c.category === "slot-top-slots")
      .slice(0, 20)
      .map((e) => e.Game as tGame);
    
    setGames(trendingGames);
  }, [customGamesState.value]);

  // Don't render if no games
  if (games.length === 0) {
    return null;
  }

  return (
    <div className={styles.trendingPanel}>
      <div className={styles.titleBar}>
        <div className={styles.title}>
          <div className={styles.text}>{t("Trending Games") || "Trending Games"}</div>
        </div>
      </div>
      <Swiper
        modules={[Mousewheel, Navigation, Autoplay]}
        className={styles.games}
        loop={true}
        loopAddBlankSlides={false}
        spaceBetween={isMobilePortrait ? 6 : 8}
        slidesPerView={isMobilePortrait ? 2.2 : 6}
        slidesPerGroup={isMobilePortrait ? 2 : 4}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
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

