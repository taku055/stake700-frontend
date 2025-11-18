import { Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./PromotionsGroup.module.scss";
import { useState } from "preact/hooks";
import { useMediaQuery } from "usehooks-ts";
import { mobilePortraitMediaQuery } from "@/config/constants";
import { Button } from "@heroui/react";
import { useTranslations } from "@/context/I18nContext";
import { promotionsData } from "./data";
import { ChevronLeft, ChevronRight } from "lucide-preact";
import PromotionCard from "../PromotionCard";

export default function PromotionsGroup() {
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
    <div className={styles.promotionsGroup}>
      <div className={styles.titleBar}>
        <div className={styles.title}>
          <div className={styles.text}>{t("Promotions")}</div>
        </div>

        <div className={styles.action}>
          <Button onPress={goToPrevSlide} className={styles.moveButton}>
            <ChevronLeft size={10} color="#CFD4D8" />
          </Button>
          <Button onPress={goToNextSlide} className={styles.moveButton}>
            <ChevronRight size={10} color="#CFD4D8" />
          </Button>
        </div>
      </div>
      <Swiper
        modules={[Mousewheel, Navigation]}
        className={styles.games}
        loop={true}
        loopAddBlankSlides={false}
        spaceBetween={isMobilePortrait ? 6 : 12}
        slidesPerView={isMobilePortrait ? 1 : 3}
        slidesPerGroup={1}
        onSwiper={setSwiper}
      >
        {promotionsData.map((e, index) => (
          <SwiperSlide key={index} className={styles.game}>
            <PromotionCard
              title={e.title}
              description={e.description}
              image={e.image}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
