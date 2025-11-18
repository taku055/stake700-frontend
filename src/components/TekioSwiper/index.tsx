import { useMemo } from "preact/hooks";
import { Swiper, SwiperProps, SwiperRef } from "swiper/react";
import { ArrowLeft, ArrowRight } from "lucide-preact";
import { PropsWithChildren, RefAttributes } from "preact/compat";
import styles from "./TekioSwiper.module.scss";

export default function TekioSwiper(
  props: RefAttributes<SwiperRef> & PropsWithChildren<SwiperProps>
) {
  const props1 = useMemo(() => ({ ...props, children: undefined }), [props]);

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
        styles.hide_nav_mobile
      }
    >
      {props.children}
      <div className={styles.prev}>
        <ArrowLeft size={16} color="white" className="block" />
      </div>
      <div className={styles.next}>
        <ArrowRight size={16} color="white" className="block" />
      </div>
    </Swiper>
  );
}
