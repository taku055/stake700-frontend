import { Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./PromotionsGroup.module.scss";
import { useState } from "preact/hooks";
import { useMediaQuery } from "usehooks-ts";
import { BASE_URL, mobilePortraitMediaQuery } from "@/config/constants";
import { Button } from "@heroui/react";
import { useTranslations } from "@/context/I18nContext";
import { promotionsData } from "./data";
import { ChevronLeft, ChevronRight } from "lucide-preact";
import PromotionCard from "../PromotionCard";

export default function PromotionsGroup() {
  const isMobilePortrait = useMediaQuery(mobilePortraitMediaQuery);
  const t = useTranslations("GameGroup");
  const tPromo = useTranslations("PromotionCard");
  const [swiper, setSwiper] = useState<any>(null);
  const [activeAction, setActiveAction] = useState<"left" | "right" | null>("right");
  const [isBeginning, setIsBeginning] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  const goToNextSlide = () => {
    swiper?.slideNext();
  };

  const goToPrevSlide = () => {
    swiper?.slidePrev();
  };

  const goToStart = () => {
    if (swiper) {
      // swiper.slideTo(0);
      swiper.slidePrev();
      // setActiveAction("right");
    }
  };

  const goToEnd = () => {
    if (swiper && swiper.slides) {
      // swiper.slideTo(swiper.slides.length - 1);
      swiper.slideNext();
      // setActiveAction("left");
    }
  };

  return (
    <div className={styles.promotionsGroup}>
      <div className={styles.titleBar}>
        <div className={styles.title}>
          <img src={`${BASE_URL}/images/icons/promotions.svg`} alt="Promotions" className={styles.icon} />
          <div className={styles.text}>{t("Promotions")}</div>
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
        slidesPerView={isMobilePortrait ? 1 : 3}
        slidesPerGroup={isMobilePortrait ? 1 : 3}
        onSlideChange={() => {
          setIsBeginning(swiper?.isBeginning);
          setIsEnd(swiper?.isEnd);
        }}
      >
        {promotionsData.map((e, index) => (
          <SwiperSlide key={index} className={styles.game}>
            <PromotionCard
              title={tPromo(e.title) || e.title}
              description={e.description}
              image={e.image}
              label={e.label ? (tPromo(e.label) || e.label) : undefined}
              readMoreLink={e.readMoreLink}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
