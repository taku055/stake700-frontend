import { mobileMediaQuery } from "@/config/constants";
import { useMediaQuery } from "usehooks-ts";
import TekioSwiper from "@/components/TekioSwiper";
import { Mousewheel, Navigation } from "swiper/modules";
import { SwiperSlide } from "swiper/react";

const images = [
  {
    title: "Wheel of Luck",
    image: "/images/categories/wheel-of-luck.png",
    link: "/promotions",
  },
  {
    title: "Games",
    image: "/images/categories/games.png",
    link: "/casino/games",
  },
  {
    title: "Live Casino",
    image: "/images/categories/live-casino.png",
    link: "/casino/live-casino",
  },
  {
    title: "Slot Games",
    image: "/images/categories/slot-games.png",
    link: "/casino/slots",
  },
  {
    title: "Sports Betting",
    image: "/images/categories/sports-betting.png",
    link: "/live?sportsBookPath=%2Flive",
  },
];

export default function CategoryImageGroup() {
  const isMobile = useMediaQuery(mobileMediaQuery);

  return (
    <TekioSwiper
      slidesPerView={isMobile ? 3 : 5}
      loop={true}
      modules={[Mousewheel, Navigation]}
      className={"w-full flex flex-row gap-3"}
      spaceBetween={6}
      navigation={true}
    >
      {images.map((image) => (
        <SwiperSlide key={image.title} className="max-w-fit w-18">
          <a href={image.link} className="w-full h-full">
            <img
              src={image.image}
              alt={image.title}
              className="w-full h-full object-fill"
            />
          </a>
        </SwiperSlide>
      ))}
    </TekioSwiper>
  );
}
