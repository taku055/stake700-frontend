
import { Autoplay, Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "preact/hooks";
import { useMediaQuery } from "usehooks-ts";
import { BASE_URL, mobilePortraitMediaQuery } from "@/config/constants";
import { tGame } from "@/types/tGame";
import GameCard from "@/components/GameCard";
import { customGamesState } from "@/state/customGamesState";
import { useTranslations } from "@/context/I18nContext";
import styles from "./TrendingCategory.module.scss";
import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-preact";

interface TrendingCategoryProps {
  category?: string;
  name?: string;
  icon?: string | null;
}

export default function TrendingCategory({ category = "", name = "", icon = null }: TrendingCategoryProps) {
  const isMobilePortrait = useMediaQuery(mobilePortraitMediaQuery);
  const [games, setGames] = useState<tGame[]>([]);
  const t = useTranslations("GameGroup");
  const [swiper, setSwiper] = useState<any>(null);
  const [activeAction, setActiveAction] = useState<"left" | "right" | null>("right");
  const [isBeginning, setIsBeginning] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  // const [trendingGames, setTrendingGames] = useState<tGame[]>([]);
  // useEffect(() => {
  //   const trendingGamesData = customGamesState.value
  //   .filter((c) => c.category === category)
  //     .slice(0, 20)
  //     .map((e) => e.Game as tGame);
  //   setTrendingGames(trendingGamesData);
  // }, [customGamesState.value, category]);


  useEffect(() => {
    // Fetch custom games with "trending" category
    if(category === "live-casino") {
      const trendingGames = customGamesState.value
        .filter((c) => c.category === category)
        .slice(0, 20)
        .map((e) => e.Game as tGame);
      setGames(trendingGames);
      return;
    }
    const trendingGames = customGamesState.value
      .filter((c) => c.category === category)
      .slice(0, 20)
      .map((e) => e.Game as tGame);

    setGames(trendingGames);
  }, [customGamesState.value, category]);

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
          <div className={styles.text}>{name}</div>
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
        onSwiper={setSwiper}
        modules={[Mousewheel, Navigation]}
        className={styles.games}
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
        {/* {[...games, ...games].map((e, index) => ( */}
           {/* <SwiperSlide key={`${e.id}-${index}`} className={styles.game}> */}
            {/* <GameCard data={e} /> */}
        {games.map((e) => (
          <SwiperSlide key={e.id} className={styles.game}>
            <GameCard data={e} />
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
}

