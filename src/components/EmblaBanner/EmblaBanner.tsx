import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import EmblaCarousel, { EmblaCarouselType } from "embla-carousel";
import "./embla.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Autoplay from "embla-carousel-autoplay";
import {
  mobilePortraitMediaQuery,
  RTL_LANGUAGES,
} from "@/config/constants";
import { localeState } from "@/state/localeState";
import { bannerState } from "@/state/bannerState";
import { useMediaQuery } from "usehooks-ts";

export const EmblaBanner = () => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const emblaApi = useRef<EmblaCarouselType | null>(null);
  const [isRTL, setIsRTL] = useState(RTL_LANGUAGES.includes(localeState.value));
  const isMobile = useMediaQuery(mobilePortraitMediaQuery);

  useEffect(() => {
    setIsRTL(RTL_LANGUAGES.includes(localeState.value));
  }, [localeState.value]);

  useEffect(() => {
    if (!viewportRef.current) return;

    const api = EmblaCarousel(
      viewportRef.current,
      {
        loop: true,
        align: "center",
        direction: isRTL ? "rtl" : "ltr",
      },
      [Autoplay({ delay: 5000, stopOnInteraction: false })]
    );
    emblaApi.current = api;

    return () => {
      api.destroy();
    };
  }, [isRTL]);

  const scrollPrev = useCallback(() => {
    emblaApi.current?.scrollPrev();
  }, []);

  const scrollNext = useCallback(() => {
    emblaApi.current?.scrollNext();
  }, []);

  return (
    <div class="embla">
      <div class="embla__viewport" ref={viewportRef}>
        <div class="embla__container">
          {bannerState.value
            .filter((banner) => banner.size === (isMobile ? "sm" : "lg"))
            .map((slide) => {
              return (
                <div key={slide.id} class="embla__slide relative">
                  <img
                    src={slide.img}
                    className="w-full h-full object-cover [object-position:right_bottom]"
                    alt={slide.buttonTitle || "Banner"}
                  />
                </div>
              );
            })}
        </div>
      </div>

      <button
        type="button"
        class="embla__button embla__button--prev items-center justify-center w-8 h-8 rounded-full text-[13px]"
        onClick={scrollPrev}
      >
        <FaChevronLeft color="#ffffff" size={16} />
      </button>
      <button
        type="button"
        class="embla__button embla__button--next items-center justify-center w-8 h-8 rounded-full text-[13px]"
        onClick={scrollNext}
      >
        <FaChevronRight color="#ffffff" size={16} />
      </button>
    </div>
  );
};
