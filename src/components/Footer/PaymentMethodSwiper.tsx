import { FunctionalComponent } from "preact";
import TekioSwiper from "@/components/TekioSwiper";
import { Mousewheel, Navigation } from "swiper/modules";
import { SwiperSlide } from "swiper/react";
import { paymentState } from "@/state/paymentState";
import PaymentCard from "@/components/PaymentCard";

export const PaymentMethodSwiper: FunctionalComponent = () => {
  return (
    <TekioSwiper
      slidesPerView="auto"
      loop={true}
      modules={[Mousewheel, Navigation]}
      className={"w-full flex flex-row gap-3"}
      spaceBetween={6}
    >
      {paymentState.value.array.map((item) => (
        <SwiperSlide key={item.key} className="max-w-fit min-w-[120px] mx-1">
          <PaymentCard key={item.key} title={item.title} image={item.logo} />
        </SwiperSlide>
      ))}
    </TekioSwiper>
  );
};
