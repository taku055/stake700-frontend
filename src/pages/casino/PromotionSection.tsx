import { FunctionalComponent } from "preact";
import TekioSwiper from "@/components/TekioSwiper";
import { Autoplay, Mousewheel, Navigation, EffectFade } from "swiper/modules";
import { SwiperSlide } from "swiper/react";
import { bannerState } from "@/state/bannerState";
import { mobileMediaQuery } from "@/config/constants";
import { useMediaQuery } from "usehooks-ts";
import { useMemo } from "preact/hooks";
import { gameCategoryImagesState } from "@/state/gameCategoryImagesState";
import { useLocation } from "preact-iso";

export const PromotionSection: FunctionalComponent<{
  showAppleImage: boolean;
  category?: string;
}> = ({ showAppleImage, category = "all" }) => {
  const getImageUrl = (originalUrl: string) => gameCategoryImagesState.value[originalUrl] || originalUrl;
  const isMobile = useMediaQuery(mobileMediaQuery);
  const location = useLocation();
  const currentPath = location.path;
  
  // Determine which banner set to use based on path
  const getBannerTemp = () => {
    if (currentPath === "/") {
      // Home page banners
      return {
        desktop: [
          "https://tekio.s3.eu-north-1.amazonaws.com/betalarab/promotions/desktop/power-chance.jpg",
        ],
        mobile: [
          "https://tekio.s3.eu-north-1.amazonaws.com/betalarab/promotions/mobile/power-chance-mobile.jpg",
        ],
      };
    } else if (currentPath.startsWith("/casino")) {
      // Casino page banners
      // return {
      //   desktop: [
      //     "https://tekio.s3.eu-north-1.amazonaws.com/betalarab/promotions/desktop/promotion-cashback.webp",
      //     "https://tekio.s3.eu-north-1.amazonaws.com/betalarab/promotions/desktop/promotion-loyalty.webp",
      //   ],
      //   mobile: [
      //     "https://tekio.s3.eu-north-1.amazonaws.com/betalarab/promotions/mobile/promotion-cashback-mobile.webp",
      //     "https://tekio.s3.eu-north-1.amazonaws.com/betalarab/promotions/mobile/promotion-loyalty-mobile.webp",
      //   ],
      // };
      return {
        desktop: [
          "https://tekio.s3.eu-north-1.amazonaws.com/ichancy/promotions/desktop/cashback.webp",
          "https://tekio.s3.eu-north-1.amazonaws.com/ichancy/promotions/desktop/personal-offer.webp",
        ],
        mobile: [
          "https://tekio.s3.eu-north-1.amazonaws.com/ichancy/promotions/mobile/cashback-mobile.webp",
          "https://tekio.s3.eu-north-1.amazonaws.com/ichancy/promotions/mobile/personal-offer-mobile.webp",
        ],
      };

    } else if (currentPath.startsWith("/live-casino")) {
      // Live casino page banners
      return {
        desktop: [
          "https://tekio.s3.eu-north-1.amazonaws.com/betalarab/promotions/desktop/cashback.webp",
          "https://tekio.s3.eu-north-1.amazonaws.com/betalarab/promotions/desktop/personal-offer.webp",
        ],
        mobile: [
          "https://tekio.s3.eu-north-1.amazonaws.com/betalarab/promotions/mobile/cashback-mobile.webp",
          "https://tekio.s3.eu-north-1.amazonaws.com/betalarab/promotions/mobile/personal-offer-mobile.webp",
        ],
      };
    } else {
      // Default banners
      return {
        desktop: [
          "https://tekio.s3.eu-north-1.amazonaws.com/betalarab/promotions/desktop/promotion-cashback.webp",
          "https://tekio.s3.eu-north-1.amazonaws.com/betalarab/promotions/desktop/promotion-loyalty.webp",
        ],
        mobile: [
          "https://tekio.s3.eu-north-1.amazonaws.com/betalarab/promotions/mobile/promotion-cashback-mobile.webp",
          "https://tekio.s3.eu-north-1.amazonaws.com/betalarab/promotions/mobile/promotion-loyalty-mobile.webp",
        ],
      };
    }
  };

  const bannerTempData = getBannerTemp();
  const bannerTemp = bannerTempData.desktop;
  const bannerTempMobile = bannerTempData.mobile;

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
        <div className="w-full" style={{ minHeight: "200px" }}>
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
              <SwiperSlide key={item + "_" + index} className="flex !w-full">
                <div className="w-full h-full flex" style={{ width: "100%", minHeight: "200px" }}>
                  <img
                    className={"w-full h-full object-cover rounded-lg"}
                    src={getImageUrl(item)}
                    alt={item}
                    loading="lazy"
                    style={{ display: "block", width: "100%", height: "auto" }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </TekioSwiper>
        </div>
      )}
    </div>
  );
};
