import { FunctionalComponent } from "preact";
import TekioSwiper from "@/components/TekioSwiper";
import { Autoplay, Mousewheel, Navigation, EffectFade } from "swiper/modules";
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
  
  // Temporary banner images as fallback
  const bannerTemp = [
    "https://tekio.s3.eu-north-1.amazonaws.com/ichancy/promotions/desktop/promotion-cashback.webp",
    "https://tekio.s3.eu-north-1.amazonaws.com/ichancy/promotions/desktop/promotion-loyalty.webp",
  ];

  const bannerTempMobile = [
    "https://tekio.s3.eu-north-1.amazonaws.com/ichancy/promotions/mobile/promotion-cashback-mobile.webp",
    "https://tekio.s3.eu-north-1.amazonaws.com/ichancy/promotions/mobile/promotion-loyalty-mobile.webp",
  ];

  const banners = useMemo(
    () => {
      // Get banners from API
      const apiBanners = bannerState.value
        .filter((banner) => banner.size === (isMobile ? "sm" : "lg"))
        .filter((banner) => category === "all" || banner.type?.includes(category))
        .filter((banner) => !banner.type?.includes("promotion"))
        .map((banner) => banner.img) || [];

      // If no API banners, use temporary banners
      if (apiBanners.length === 0) {
        return isMobile ? bannerTempMobile : bannerTemp;
      }

      return apiBanners;
    },
    [bannerState.value, isMobile, category]
  );

  if (banners.length === 0 && !showAppleImage) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {banners.length > 0 && (
        <TekioSwiper
          modules={[Mousewheel, Navigation, Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{
            crossFade: true,
          }}
          spaceBetween={0}
          loop={true}
          slidesPerView={1}
          className="w-full"
          speed={1000}
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
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
          ))}
        </TekioSwiper>
      )}
    </div>
  );
};
