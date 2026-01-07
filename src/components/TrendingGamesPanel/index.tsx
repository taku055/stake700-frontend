import { Autoplay, Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "preact/hooks";
import { useMediaQuery } from "usehooks-ts";
import { BASE_URL, mobilePortraitMediaQuery, RTL_LANGUAGES } from "@/config/constants";
import { tGame } from "@/types/tGame";
import GameCard from "@/components/GameCard";
import { customGamesState } from "@/state/customGamesState";
import { useTranslations } from "@/context/I18nContext";
import styles from "./TrendingGamesPanel.module.scss";
import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-preact";
import TrendingCard from "../TrendingCard";
import { localeState } from "@/state/localeState";
import { effect } from "@preact/signals";

export default function TrendingGamesPanel({ title }: { title: string }) {
  const isMobilePortrait = useMediaQuery(mobilePortraitMediaQuery);
  const [games, setGames] = useState<tGame[]>([]);
  const t = useTranslations("GameGroup");
  const [swiper, setSwiper] = useState<any>(null);
  const [activeAction, setActiveAction] = useState<"left" | "right" | null>("right");
  const [isBeginning, setIsBeginning] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [isRTL, setIsRTL] = useState(RTL_LANGUAGES.includes(localeState.value));
  
  useEffect(() => {
    const updateRTL = () => {
      setIsRTL(RTL_LANGUAGES.includes(localeState.value));
    };
    
    updateRTL();
    
    // Watch for locale changes
    const dispose = effect(() => {
      const _ = localeState.value;
      updateRTL();
    });
    
    return () => {
      dispose();
    };
  }, []);

  const imgList = [
    "/buffer/gameimg1.png",
    "/buffer/gameimg2.png",
    "/buffer/gameimg3.png",
    "/buffer/gameimg4.png",
    "/buffer/gameimg5.png",
    "/buffer/gameimg6.png",
    "/buffer/gameimg7.png",
    "/buffer/gameimg8.png",
    "/buffer/gameimg9.png",
    "/buffer/gameimg10.png",
  ];

  useEffect(() => {
    const updateGames = () => {
      // Fetch custom games with "trending" category
      const trendingGames = customGamesState.value
        .filter((c) => c.category === "trending")
        .slice(0, 20)
        .map((e) => e.Game as tGame);
      
      setGames(trendingGames);
    };
    
    updateGames();
    
    // Watch for customGamesState changes
    const dispose = effect(() => {
      const _ = customGamesState.value;
      updateGames();
    });
    
    return () => {
      dispose();
    };
  }, []);

  // Don't render if no games
  if (games.length === 0) {
    return null;
  }

  const goToStart = () => {
    if (swiper) {
      // swiper.slideTo(0);
      swiper.slidePrev();
      setActiveAction("right");
    }
  };

  const goToEnd = () => {
    if (swiper && swiper.slides) {
      // swiper.slideTo(swiper.slides.length - 1);
      swiper.slideNext();
      setActiveAction("left");
    }
  };

  return (
    <div className={styles.trendingPanel}>
      <div className={styles.titleBar}>
        <div className={styles.title}>
          <img src={`${BASE_URL}/images/icons/trending-game.png`} alt="Trending" className={styles.icon} />
          <div className={styles.text}>{title || t("Trending") || "Trending Games"}</div>
        </div>
        <div className={styles.action}>
          <Button onPress={goToStart} className={`${styles.moveButton} rounded-l-full ${!isBeginning ? "border-[#ffffff55] text-[#FFFFFF55]" : "border-[#ffffff22] text-[#FFFFFF22]"}`}>
            <ChevronLeft size={18}  />
          </Button>
          <Button onPress={goToEnd} className={`${styles.moveButton} rounded-r-full ${!isEnd ? "border-[#ffffff55] text-[#FFFFFF55]" : "border-[#ffffff22] text-[#FFFFFF22]"}`}>
            <ChevronRight size={18}  />
          </Button>
        </div>
      </div>
      <Swiper
        key={`trending-games-${isRTL ? "rtl" : "ltr"}-${localeState.value}`}
        onSwiper={setSwiper}
        modules={[Mousewheel, Navigation]}
        className={styles.games}
        dir={isRTL ? "rtl" : "ltr"}
        loop={false}
        loopAddBlankSlides={false}
        // spaceBetween={isMobilePortrait ? 6 : 8}
        slidesPerView={isMobilePortrait ? 3 : 8}
        slidesPerGroup={isMobilePortrait ? 3 : 8}
        onSlideChange={() => {
          setIsBeginning(swiper?.isBeginning);
          setIsEnd(swiper?.isEnd);
        }}
        // autoplay={{
        //   delay: 3000,
        //   disableOnInteraction: false,
        //   pauseOnMouseEnter: true,
        // }}
      >
        {games.map((e, index) => ( 
           <SwiperSlide key={`${e.id}-${index}`} className={styles.game}>
           <GameCard data={e} />
        {/* {games.map((e) => (
          <SwiperSlide key={e.id} className={styles.game}>
            <TrendingCard id={e.id} name={e.name} image={imgList[games.indexOf(e) % imgList.length]} link={`/game/${e.id}`} /> */}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

