import { Autoplay, Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "preact/hooks";
import { useMediaQuery } from "usehooks-ts";
import { BASE_URL, mobilePortraitMediaQuery, RTL_LANGUAGES } from "@/config/constants";
import { useTranslations } from "@/context/I18nContext";
import styles from "./TrendingSports.module.scss";
import TrendingCard from "@/components/TrendingCard";
import { sportsState } from "@/state/sportsState";
import { tSport } from "@/types/tSport";
import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-preact";
import { localeState } from "@/state/localeState";
import { effect } from "@preact/signals";

export default function TrendingSports({ title }: { title: string }) {
  const isMobilePortrait = useMediaQuery(mobilePortraitMediaQuery);
  const t = useTranslations("GameGroup");
  const [sports, setSports] = useState<tSport[]>([]);
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

  useEffect(() => {
    setSports(sportsState.value);
    
    // Watch for sports state changes
    const dispose = effect(() => {
      const _ = sportsState.value;
      setSports(sportsState.value);
    });
    
    return () => {
      dispose();
    };
  }, []);

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

  if (sports.length === 0) {
    return null;
  }

  return (
    <div className={styles.trendingPanel}>
      <div className={styles.titleBar}>
        <div className={styles.title}>
          <img src={`${BASE_URL}/images/icons/sportsbook.png`} alt="Trending" className={styles.icon} />
          <div className={styles.text}>{title || t("Trending Sports") || "Trending Sports"}</div>
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
        key={`trending-sports-${isRTL ? "rtl" : "ltr"}-${localeState.value}`}
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
      >
        {sports.map((e, index) => (
          <SwiperSlide key={`${e.id}-${index}`} className={styles.game}>
            <TrendingCard id={e.id} name={e.name} image={e.image} link={e.link} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

