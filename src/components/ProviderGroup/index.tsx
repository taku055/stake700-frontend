"use client";

import React, { useEffect, useState } from "preact/hooks";
import { useMediaQuery } from "usehooks-ts";
import { mobilePortraitMediaQuery } from "@/config/constants";
import { providerState } from "@/state/providerState";
import { Link } from "@/components/common";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Navigation } from "swiper/modules";
import { useTranslations } from "@/context/I18nContext";
import styles from "./ProviderGroup.module.scss";
import { tProvider } from "@/types/tProvider";
import { apiGetProviders } from "@/api/common/apiGetProviders";
import { Button } from "@heroui/react";
import { useSignal } from "@preact/signals";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";
import { ChevronLeft, ChevronRight, Users } from "lucide-preact";

interface IProviderGroupProps {
  category?: string;
}

export default function ProviderGroup({ category }: IProviderGroupProps) {
  const isMobilePortrait = useMediaQuery(mobilePortraitMediaQuery);
  const provider = useSignal(providerState.value);
  const [providerList, setProviderList] = useState<tProvider[]>([]);
  const [swiper, setSwiper] = useState<any>(null);
  const [isBeginning, setIsBeginning] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGetProviders();
        setProviderList(res.sort((a, b) => (a.order < b.order ? -1 : 1)));
      } catch (ex) {
        console.error(ex);
      }
    })();
  }, [category, provider]);

  const goToPrevSlide = () => {
    if (swiper) {
      // swiper.slideTo(0);
      swiper?.slidePrev();
      // setActiveAction("right");
    }
  };

  const goToNextSlide = () => {
    if (swiper) {
      // swiper.slideTo(swiper.slides.length - 1);
      // setActiveAction("left");
      swiper?.slideNext();
    }
  };

  const t = useTranslations("ProviderGroup");
  const isRTL = RTL_LANGUAGES.includes(localeState.value as string);

  return (
    <div className={styles.providerGroup} dir={isRTL ? "rtl" : "ltr"}>
      <div className={styles.titleBar}>
        <div className={styles.title}>
          <div className={styles.text}>
            <Users aria-hidden="true" className="w-[20px] h-[20px]" />
            {t("Publishers")}
          </div>
        </div>
        <div className={styles.action}>
          <Button onPress={goToPrevSlide} className={`${styles.moveButton} rounded-l-full ${!isBeginning ? "border-[#ffffff55] text-[#FFFFFF55]" : "border-[#ffffff22] text-[#FFFFFF22]"}`}>
            <ChevronLeft size={18} />
          </Button>
          <Button onPress={goToNextSlide} className={`${styles.moveButton} rounded-r-full ${!isEnd ? "border-[#ffffff55] text-[#FFFFFF55]" : "border-[#ffffff22] text-[#FFFFFF22]"}`}>
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>


      <Swiper
        onSwiper={setSwiper}
        modules={[Mousewheel, Navigation]}
        className={styles.providers}
        loop={false}
        loopAddBlankSlides={false}
        slidesPerView={isMobilePortrait ? 3 : 8}
        slidesPerGroup={isMobilePortrait ? 3 : 8}
        onSlideChange={() => {
          setIsBeginning(swiper?.isBeginning);
          setIsEnd(swiper?.isEnd);
        }}
      >
        {providerList.map((p) => (
          <SwiperSlide key={p.id} className={styles.providerSlider}>
            <Link
              href={`/casino/search?providerId=${p.id}`}
              className={styles.provider}
            >
              {p.img ? (
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              ) : (
                <span>{p.name}</span>
              )}
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
