import { useEffect, useRef, useState } from "preact/hooks";
import EmblaCarousel, { EmblaCarouselType } from "embla-carousel";
import "./embla.css";
import Autoplay from "embla-carousel-autoplay";
import {
  mobilePortraitMediaQuery,
  RTL_LANGUAGES,
} from "@/config/constants";
import { localeState } from "@/state/localeState";
import { bannerState } from "@/state/bannerState";
import { useMediaQuery } from "usehooks-ts";
import { isVisibleOnValidDays } from "@/helpers/bannerUtils";

export const EmblaBanner = () => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const emblaApi = useRef<EmblaCarouselType | null>(null);
  const [isRTL, setIsRTL] = useState(RTL_LANGUAGES.includes(localeState.value));
  const isMobile = useMediaQuery(mobilePortraitMediaQuery);

  useEffect(() => {
    setIsRTL(RTL_LANGUAGES.includes(localeState.value));
  }, [localeState.value]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const slides = bannerState.value.filter(
    (banner) =>
      banner.size === (isMobile ? "sm" : "lg") &&
      isVisibleOnValidDays(banner.validDays),
  );

  useEffect(() => {
    if (!viewportRef.current) return;

    const api = EmblaCarousel(
      viewportRef.current,
      {
        loop: true,
        align: "start",
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
      <div class="flex justify-center items-center gap-[6px] ">
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
                  ? "w-5 md:w-10 h-[4px] rounded-sm bg-[var(--green-color)] inline-block transition-all duration-300"
                  : "w-5 md:w-10 h-[4px] rounded-sm bg-white inline-block transition-all duration-300"
              }
            />
          </button>
        ))}
      </div>
    </div>
  );
};
