import { Autoplay, Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "preact/hooks";
import { useMediaQuery } from "usehooks-ts";
import { mobilePortraitMediaQuery } from "@/config/constants";
import { useTranslations } from "@/context/I18nContext";
import styles from "./TrendingSports.module.scss";
import TrendingCard from "@/components/TrendingCard";
import { sportsState } from "@/state/sportsState";
import { tSport } from "@/types/tSport";
import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-preact";

export default function TrendingSports() {
  const isMobilePortrait = useMediaQuery(mobilePortraitMediaQuery);
  const t = useTranslations("GameGroup");
  const [sports, setSports] = useState<tSport[]>([]);
  const [swiper, setSwiper] = useState<any>(null);
  const [activeAction, setActiveAction] = useState<"left" | "right" | null>("right");

  useEffect(() => {
    setSports(sportsState.value);
  }, [sportsState.value]);

  const goToStart = () => {
    if (swiper) {
      swiper.slideTo(0);
      setActiveAction("right");
    }
  };

  const goToEnd = () => {
    if (swiper && swiper.slides) {
      swiper.slideTo(swiper.slides.length - 1);
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
          <div className={styles.text}>{t("Trending Sports") || "Trending Sports"}</div>
        </div>
        <div className={styles.action}>
          <Button onPress={goToStart} className={`${styles.moveButton} rounded-l-full ${activeAction === "left" ? "border-[#ffffff55] text-[#FFFFFF55]" : "border-[#ffffff22] text-[#FFFFFF22]"}`}>
            <ChevronLeft size={18}  />
          </Button>
          <Button onPress={goToEnd} className={`${styles.moveButton} rounded-r-full ${activeAction === "right" ? "border-[#ffffff55] text-[#FFFFFF55]" : "border-[#ffffff22] text-[#FFFFFF22]"}`}>
            <ChevronRight size={18}  />
          </Button>
        </div>
      </div>
      <Swiper
        modules={[Mousewheel, Navigation, Autoplay]}
        className={styles.games}
        loop={false}
        loopAddBlankSlides={false}
        // spaceBetween={isMobilePortrait ? 6 : 8}
        slidesPerView={isMobilePortrait ? 2.2 : 8}
        slidesPerGroup={isMobilePortrait ? 2 : 8}
        onSwiper={setSwiper}
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

