import { Autoplay, Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./GameGroup.module.scss";
import { useState } from "preact/hooks";
import { useMediaQuery } from "usehooks-ts";
import { mobilePortraitMediaQuery } from "@/config/constants";
import { tGame } from "@/types/tGame";
import GameCard from "@/components/GameCard";
import { Button } from "@heroui/react";
import { useTranslations } from "@/context/I18nContext";
import { ChevronLeft, ChevronRight } from "lucide-preact";

interface IStaticGameGroup {
  title: string;
  viewallLink?: string;
  bigMode?: boolean;
  animated?: boolean;
  gamelist: tGame[];
}

export default function StaticGameGroup({
  title,
  viewallLink,
  bigMode,
  animated,
  gamelist,
}: IStaticGameGroup) {
  const isMobilePortrait = useMediaQuery(mobilePortraitMediaQuery);
  const t = useTranslations("GameGroup");
  const [swiper, setSwiper] = useState<any>(null);

  const goToNextSlide = () => {
    swiper?.slideNext();
  };

  const goToPrevSlide = () => {
    swiper?.slidePrev();
  };

  return (
    <div className={styles.gameGroup}>
      <div className={styles.titleBar}>
        <div className={styles.title}>
          <div className={styles.text}>{title}</div>
        </div>

        <div className={styles.action}>
          <Button onPress={goToPrevSlide} className={styles.moveButton}>
            <ChevronLeft size={10} color="#CFD4D8" />
          </Button>
          <Button onPress={goToNextSlide} className={styles.moveButton}>
            <ChevronRight size={10} color="#CFD4D8" />
          </Button>
          <a href={viewallLink || "#"} className={styles.view}>
            {t("More")}
          </a>
        </div>
      </div>
      <Swiper
        modules={[Mousewheel, Navigation, Autoplay]}
        className={styles.games}
        loop={true}
        loopAddBlankSlides={false}
        spaceBetween={isMobilePortrait ? 6 : 8}
        slidesPerView={
          isMobilePortrait ? (bigMode ? 2.2 : 3) : bigMode ? 6 : "auto"
        }
        slidesPerGroup={isMobilePortrait ? 2 : 4}
        onSwiper={setSwiper}
      >
        {(isMobilePortrait ? gamelist.slice(0, 7) : gamelist).map((e) => (
          <SwiperSlide key={e.id} className={styles.game}>
            <GameCard data={e} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
