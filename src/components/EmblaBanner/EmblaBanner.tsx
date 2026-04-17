import { useEffect, useRef, useState } from "preact/hooks";
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

  const [selectedIndex, setSelectedIndex] = useState(0);

  const slides = bannerState.value.filter((banner) => banner.size === (isMobile ? "sm" : "lg"));

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

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };
    api.on("select", onSelect);
    onSelect();

    return () => {
      api.destroy();
    };
  }, [isRTL, isMobile]);

  return (
    <div class="embla">
      <div class="embla__viewport" ref={viewportRef}>
        <div class="embla__container">
          {slides.map((slide) => {
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
      <div class="flex justify-center items-center gap-3 mt-4">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => {
              emblaApi.current?.scrollTo(idx);
            }}
            style={{ outline: 'none', border: 'none', padding: 0, margin: 0, background: 'none', cursor: 'pointer' }}
          >
            <span
              className={
                selectedIndex === idx
                  ? "w-6 md:w-10 h-1.5 md:h-[9px] rounded-full bg-[#01A825] inline-block transition-all"
                  : "w-6 md:w-10 h-1.5 md:h-[9px] rounded-full bg-white inline-block transition-all"
              }
            />
          </button>
        ))}
      </div>
    </div>
  );
};
