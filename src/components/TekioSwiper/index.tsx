import { useMemo } from "preact/hooks";
import { Swiper, SwiperProps, SwiperRef } from "swiper/react";
import { ArrowLeft, ArrowRight } from "lucide-preact";
import { PropsWithChildren, RefAttributes } from "preact/compat";
import styles from "./TekioSwiper.module.scss";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";

export default function TekioSwiper(
  props: RefAttributes<SwiperRef> & PropsWithChildren<SwiperProps>
) {
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const isFadeEffect = props.effect === "fade";

  const props1 = useMemo(() => {
    const { children, ...rest } = props;
    // For fade effect, don't set dir="rtl" as it breaks the fade transition
    // Fade effect uses opacity transitions, not horizontal sliding
    const shouldUseRTLDir = isRTL && !isFadeEffect;
    
    return {
      ...rest,
      dir: (shouldUseRTLDir ? "rtl" : "ltr") as "rtl" | "ltr",
      // Ensure Swiper respects RTL direction
      allowTouchMove: true,
    };
  }, [props, isRTL, isFadeEffect]);

  return (
    <Swiper
      {...props1}
      navigation={{
        prevEl: "." + styles.prev,
        nextEl: "." + styles.next,
      }}
      className={
        props1.className +
        " " +
        styles.tekio_swiper +
        " " +
        styles.hide_nav_mobile +
        (isRTL ? " " + styles.rtl : "") +
        (isFadeEffect ? " " + styles.fade_effect : "")
      }
    >
      {props.children}
      <div className={styles.prev}>
        {isRTL ? (
          <ArrowRight size={16} color="white" className="block" />
        ) : (
          <ArrowLeft size={16} color="white" className="block" />
        )}
      </div>
      <div className={styles.next}>
        {isRTL ? (
          <ArrowLeft size={16} color="white" className="block" />
        ) : (
          <ArrowRight size={16} color="white" className="block" />
        )}
      </div>
    </Swiper>
  );
}
