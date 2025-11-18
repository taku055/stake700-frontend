import { FunctionalComponent } from "preact";
import TekioSwiper from "@/components/TekioSwiper";
import { Autoplay, Mousewheel, Navigation } from "swiper/modules";
import { SwiperSlide } from "swiper/react";
import { bannerState } from "@/state/bannerState";
import { mobileMediaQuery } from "@/config/constants";
import { useMediaQuery } from "usehooks-ts";
import { useMemo } from "preact/hooks";
import { gameCategoryImagesState } from "@/state/gameCategoryImagesState";

export const PromotionSection: FunctionalComponent<{
  showAppleImage: boolean;
  category?: string;
}> = ({ showAppleImage, category = "all" }) => {
  const getImageUrl = (originalUrl: string) => gameCategoryImagesState.value[originalUrl] || originalUrl;
  const isMobile = useMediaQuery(mobileMediaQuery);
  const banners = useMemo(
    () =>
      bannerState.value
        .filter((banner) => banner.size === (isMobile ? "sm" : "lg"))
        .filter((banner) => category === "all" || banner.type?.includes(category))
        .filter((banner) => !banner.type?.includes("promotion"))
        .map((banner) => banner.img) || [],
    [bannerState.value, isMobile]
  );

  if (banners.length === 0 && !showAppleImage) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {banners.length > 0 && (
        <TekioSwiper
          modules={[Mousewheel, Navigation, Autoplay]}
          spaceBetween={16}
          loop={true}
          slidesPerView={1}
          className="w-full"
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          {banners.map((item, index) => (
            <SwiperSlide key={item + "_" + index} className="flex">
              <div className="w-full h-full flex">
                <img
                  className={"w-full h-full object-cover rounded-lg"}
                  src={getImageUrl(item)}
                  alt={item}
                />
              </div>
            </SwiperSlide>
          ))}
        </TekioSwiper>
      )}
    </div>
  );
};
