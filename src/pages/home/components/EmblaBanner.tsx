/** @jsxImportSource preact */
import { useCallback, useEffect, useRef } from 'preact/hooks';
import EmblaCarousel, { EmblaCarouselType } from 'embla-carousel';
import './embla.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Autoplay from 'embla-carousel-autoplay';


const slides = [
  {
    id: '1',
    image: '/buffer/banner1.png',
    title: '100% Welcome Bonus',
  },
  {
    id: '2',
    image: '/buffer/banner2.png',
  },
  {
    id: '3',
    image: '/buffer/banner3.png',
  },
  {
    id: '4',
    image: '/buffer/banner4.png',
  }, 
];

export const EmblaBanner = () => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const emblaApi = useRef<EmblaCarouselType | null>(null);

  useEffect(() => {
    if (!viewportRef.current) return;

    const api = EmblaCarousel(
      viewportRef.current,
      {
        loop: true,
        align: 'center',
      },
      [Autoplay({ delay: 5000, stopOnInteraction: false })]
    );
    emblaApi.current = api;

    return () => {
      api.destroy();
    };
  }, []);

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
          {slides.map((slide, index) => {
            return (
              <div key={slide.id} class="embla__slide relative">
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
