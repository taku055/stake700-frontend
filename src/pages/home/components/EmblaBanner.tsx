/** @jsxImportSource preact */
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import EmblaCarousel, { EmblaCarouselType } from 'embla-carousel';
import './embla.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Autoplay from 'embla-carousel-autoplay';
import { BASE_URL, mobileMediaQuery, RTL_LANGUAGES } from '@/config/constants';
import { localeState } from '@/state/localeState';
import { bannerState } from '@/state/bannerState';
import { useMediaQuery } from 'usehooks-ts';


const slides = [
  // {
  //   id: '1',
  //   image: '/buffer/banner1.png',
  //   title: '100% Welcome Bonus',
  // },
  {
    id: '3',
    image: `${BASE_URL}/images/banner/banner2.png`,
  },
  // {
  //   id: '3',
  //   image: '/buffer/banner3.png',
  // },
  
  {
    id: '1',
    image: `${BASE_URL}/images/banner/Banner 1.png`,
    title: '100% Welcome Bonus',
  }, 
  {
    id: '2',
    image: `${BASE_URL}/images/banner/Banner 2.png`,
  }, 
];

const MobileSlides = [
  {
    id: '1',
    image: `${BASE_URL}/images/banner/Banner1m.png`,
    title: '100% Welcome Bonus',
  }, 
  {
    id: '2',
    image: `${BASE_URL}/images/banner/Banner2m.png`,
  },  
  // {
  //   id: '3',
  //   image: `${BASE_URL}/images/banner/Banner2m.png`,
  // }, 
];

export const EmblaBanner = () => {
  const isMobile = useMediaQuery(mobileMediaQuery);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const emblaApi = useRef<EmblaCarouselType | null>(null);
  const [isRTL, setIsRTL] = useState(RTL_LANGUAGES.includes(localeState.value));
  
  useEffect(() => {
    setIsRTL(RTL_LANGUAGES.includes(localeState.value));
  }, [localeState.value]);

  // Get the slides array based on mobile/desktop
  const currentSlides = isMobile ? MobileSlides : slides;
  
  // Duplicate slides if there are only 2 to enable proper looping
  const displaySlides = currentSlides.length === 2 
    ? [...currentSlides, ...currentSlides] 
    : currentSlides;

  useEffect(() => {
    if (!viewportRef.current) return;

    const api = EmblaCarousel(
      viewportRef.current,
      {
        loop: true,
        align: 'center',
        direction: isRTL ? 'rtl' : 'ltr',
      },
      [Autoplay({ delay: 5000, stopOnInteraction: false })]
    );
    emblaApi.current = api;

    return () => {
      api.destroy();
    };
  }, [isRTL, isMobile]);

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
          {displaySlides.map((slide, index) => {
            return (
              <div key={`${slide.id}-${index}`} class="embla__slide relative">
                <img
                  src={slide.image}
                  className="w-full h-full object-cover [object-position:right_bottom]"
                  alt={slide.title || 'Banner'}
                />
              </div>
            );
          })}
        </div>
      </div>

      <button type="button" class="embla__button embla__button--prev items-center justify-center w-8 h-8 rounded-full text-[13px]" onClick={scrollPrev}>
        <FaChevronLeft color="#ffffff" size={16} />
      </button>
      <button type="button" class="embla__button embla__button--next items-center justify-center w-8 h-8 rounded-full text-[13px]" onClick={scrollNext}>
        <FaChevronRight color="#ffffff" size={16} />
      </button>
    </div>
  );
};
