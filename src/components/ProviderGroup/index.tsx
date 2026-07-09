"use client";

import { useEffect, useState, useRef } from "preact/hooks";
import type { Swiper as SwiperInstance } from "swiper";
import { providerState } from "@/state/providerState";
import { Link } from "@/components/common";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Navigation } from "swiper/modules";
import { useTranslations } from "@/context/I18nContext";
import styles from "./ProviderGroup.module.scss";
import { tProvider } from "@/types/tProvider";
import { apiGetProviders } from "@/api/common/apiGetProviders";
import { useSignal } from "@preact/signals";
import { localeState } from "@/state/localeState";
import { mobileMediaQuery, RTL_LANGUAGES } from "@/config/constants";
import { ChevronLeft, ChevronRight, Users, ArrowLeft } from "lucide-preact";
import { useMediaQuery } from "usehooks-ts";

interface IProviderGroupProps {
  category?: string;
}

function ProviderTile({
  p,
  tileClassName,
}: {
  p: tProvider;
  tileClassName: string;
}) {
  return (
    <Link
      href={`/casino/search?providerId=${p.id}`}
      className={tileClassName}
      aria-label={p.name}
      title={p.name}
    >
      <span className={styles.logoWrap}>
        {p.img ? (
          <img
            src={p.img}
            alt=""
            className={styles.logoImg}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className={styles.providerName}>{p.name}</span>
        )}
      </span>
    </Link>
  );
}

export default function ProviderGroup({ category }: IProviderGroupProps) {
  const provider = useSignal(providerState.value);
  const [providerList, setProviderList] = useState<tProvider[]>([]);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [navLocked, setNavLocked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const isMobile = useMediaQuery(mobileMediaQuery);

  const syncNavState = (instance: SwiperInstance) => {
    setIsBeginning(instance.isBeginning);
    setIsEnd(instance.isEnd);
    setNavLocked(!!instance.isLocked);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGetProviders(
          category === "live-casino"
            ? "LIVECASINO"
            : category === "slots"
              ? "SLOT"
              : undefined,
        );
        setProviderList(res.sort((a, b) => (a.order < b.order ? -1 : 1)));
      } catch (ex) {
        console.error(ex);
      }
    })();
  }, [category, provider]);

  useEffect(() => {
    if (providerList.length === 0) return;
    const id = requestAnimationFrame(() => {
      const s = swiperRef.current;
      if (!s || (s as unknown as { destroyed?: boolean }).destroyed) return;
      s.update();
      syncNavState(s);
    });
    return () => cancelAnimationFrame(id);
  }, [providerList]);

  useEffect(() => {
    const onResize = () => {
      const s = swiperRef.current;
      if (!s || (s as unknown as { destroyed?: boolean }).destroyed) return;
      s.update();
      syncNavState(s);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const goToPrevSlide = () => swiperRef.current?.slidePrev();
  const goToNextSlide = () => swiperRef.current?.slideNext();

  const t = useTranslations("CasinoPage");
  const isRTL = RTL_LANGUAGES.includes(localeState.value as string);

  const prevDisabled = navLocked || isBeginning;
  const nextDisabled = navLocked || isEnd;

  const moveBtn = (side: "prev" | "next") => {
    const isPrev = side === "prev";
    const disabled = isPrev ? prevDisabled : nextDisabled;
    const onClick = isPrev ? goToPrevSlide : goToNextSlide;
    const rounded = isPrev ? "rounded-l-full" : "rounded-r-full";
    return (
      <button
        type="button"
        aria-label={isPrev ? "Previous" : "Next"}
        disabled={disabled}
        onClick={onClick}
        className={`${styles.moveButton} ${rounded} ${
          !disabled ? "border-[#ffffff55] text-[#FFFFFF55]" : "border-[#ffffff22] text-[#FFFFFF22]"
        }`}
      >
        {isPrev ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>
    );
  };

  const viewAllBtn = (
    <button
      type="button"
      className={styles.viewAllButton}
      onClick={() => setExpanded(true)}
    >
      {t("view_all")}
    </button>
  );

  const carouselActions = (
    <>
      {moveBtn("prev")}
      {moveBtn("next")}
      {viewAllBtn}
    </>
  );

  return (
    <div
      className={`${styles.providerGroup} ${expanded ? styles.isExpanded : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className={styles.titleBar}>
        <div className={styles.title}>
          <div className={styles.text}>
            <Users aria-hidden="true" className="w-[20px] h-[20px]" />
            {t("Providers")}
          </div>
        </div>

        {!expanded ? (
          <div className={styles.action}>{carouselActions}</div>
        ) : (
          <button
            type="button"
            className={styles.backButton}
            onClick={() => setExpanded(false)}
          >
            <ArrowLeft
              size={18}
              className={isRTL ? styles.backIconRtl : undefined}
              aria-hidden
            />
            <span>{t("providers_back")}</span>
          </button>
        )}
      </div>

      {!expanded ? (
        <Swiper
          onSwiper={(instance) => {
            swiperRef.current = instance;
            syncNavState(instance);
          }}
          modules={[Mousewheel, Navigation]}
          className={styles.providers}
          dir={isRTL ? "rtl" : "ltr"}
          loop={false}
          loopAddBlankSlides={false}
          slidesPerView="auto"
          slidesPerGroup={1}
          spaceBetween={isMobile ? 4 : 8}
          watchSlidesProgress
          watchOverflow
          onSlideChange={(instance) => syncNavState(instance)}
          onReachBeginning={(instance) => syncNavState(instance)}
          onReachEnd={(instance) => syncNavState(instance)}
        >
          {providerList.map((p) => (
            <SwiperSlide key={p.id} className={styles.providerSlider}>
              <ProviderTile p={p} tileClassName={styles.provider} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className={styles.gridPanel}>
          <div className={styles.providerGrid}>
            {providerList.map((p) => (
              <ProviderTile
                key={p.id}
                p={p}
                tileClassName={`${styles.provider} ${styles.providerGridTile}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
