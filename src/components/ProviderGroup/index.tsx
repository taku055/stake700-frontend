"use client";

import React, { useEffect, useState } from "preact/hooks";
import { useMediaQuery } from "usehooks-ts";
import { BASE_URL, mobilePortraitMediaQuery } from "@/config/constants";
import { providerState } from "@/state/providerState";
import { Link } from "@/components/common";
import MySwiper from "../TekioSwiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Navigation } from "swiper/modules";
import { useTranslations } from "@/context/I18nContext";
import styles from "./ProviderGroup.module.scss";
import { tProvider } from "@/types/tProvider";
import { apiGetProviders } from "@/api/common/apiGetProviders";
import { Button, Image } from "@heroui/react";
import { FaThLarge } from "react-icons/fa";
import { useSignal } from "@preact/signals";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";
import { ChevronLeft, ChevronRight } from "lucide-preact";
interface IProviderGroupProps {
  category?: string;
}

export default function ProviderGroup({ category }: IProviderGroupProps) {
  const isMobilePortrait = useMediaQuery(mobilePortraitMediaQuery);
  const provider = useSignal(providerState.value);
  const [providerList, setProviderList] = useState<tProvider[]>([]);
  const [swiper, setSwiper] = useState<any>(null);
  const [activeAction, setActiveAction] = useState<"left" | "right" | null>("right");
  const [isBeginning, setIsBeginning] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    (async () => {
      if (category) {
        try {
          const res = await apiGetProviders();
          setProviderList(res.sort((a, b) => (a.order < b.order ? -1 : 1)));
        } catch (ex) {
          console.error(ex);
        }
      } else {
        setProviderList(
          [...provider.value.array].sort((a, b) => (a.order < b.order ? -1 : 1))
        );
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
            <img src={`${BASE_URL}/images/icons/providers.png`} alt="Publishers" width={20} height={20} />
            {t("Publishers")}</div>
        </div>
        {/* <Link className={styles.view} href="/">
          <FaThLarge size={18} />
        </Link> */}
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
              // href={`/gallery/all?providerId=${p.id}`}
              href="#"
              className={styles.provider}
            >
              {p.img ? (
                <Image
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-contain brightness-0 invert"
                  classNames={{ wrapper: "w-full h-full" }}
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
