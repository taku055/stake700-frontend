import { mobileMediaQuery } from "@/config/constants";
import { useTranslations } from "@/context/I18nContext";
import { tProvider } from "@/types/tProvider";
import { Image, Input } from "@heroui/react";
import { FunctionalComponent } from "preact";
import { useLocation } from "preact-iso";
import { useMemo, useState } from "preact/hooks";
import queryString from "query-string";
import { useMediaQuery } from "usehooks-ts";
import TekioSwiper from "@/components/TekioSwiper";
import { Mousewheel, Navigation } from "swiper/modules";
import { SwiperSlide } from "swiper/react";
import { FaCircleXmark } from "react-icons/fa6";
import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";

interface IProviderSidebarProps {
  providers: tProvider[];
}

const ProviderItem: FunctionalComponent<{
  provider: tProvider;
  selectedProviders: string[];
  onClickProvider: (providerId: string) => void;
}> = ({ provider, selectedProviders, onClickProvider }) => {
  return (
    <a
      onClick={() => onClickProvider(provider.id)}
      className={`${
        selectedProviders.includes(provider.id)
          ? "bg-[var(--background-color-active)]"
          : "bg-[var(--bar-background-color)]"
      } border-[1px] border-[var(--bar-background-color)] rounded-sm p-1 overflow-hidden aspect-square flex items-center justify-center max-w-18 cursor-pointer hover:bg-[var(--bar-background-color-hover)] transition-all duration-300 w-18 md:w-auto`}
    >
      {provider.img ? (
        <Image
          src={provider.img}
          alt={provider.name}
          classNames={{
            img:
              "w-full h-full object-contain brightness-0" +
              (selectedProviders.includes(provider.id) ? "" : " invert"),
          }}
          loading="lazy"
        />
      ) : (
        <span className="text-center">{provider.name}</span>
      )}
    </a>
  );
};

export default function ProviderSidebar({ providers }: IProviderSidebarProps) {
  const pathname = useLocation();
  const selectedProviders = useMemo(
    () => pathname.query.provider?.split(",") || [],
    [pathname.query.provider]
  );
  const t = useTranslations("CasinoDetailPage");
  const [searchProvider, setSearchProvider] = useState("");
  const isMobile = useMediaQuery(mobileMediaQuery);
  const { handleNavigate } = useAffiliateNavigation();
  
  const onClickProvider = (providerId: string) => {
    const newSelectedProviders = selectedProviders.includes(providerId)
      ? selectedProviders.filter((id) => id !== providerId)
      : [...selectedProviders, providerId];

    const params = {
      // ...pathname.query,
      provider: newSelectedProviders.filter((id) => id !== "").join(","),
    };

    handleNavigate(`${pathname.path}?${queryString.stringify(params)}`);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row uppercase gap-2">
        <Input
          size="sm"
          endContent={
            <FaCircleXmark
              size={16}
              color="#FFFFFF7D"
              onClick={() => setSearchProvider("")}
            />
          }
          placeholder={t("Search Providers")}
          value={searchProvider}
          variant="bordered"
          classNames={{
            inputWrapper:
              "bg-[#fff1] border-none rounded-sm! hover:bg-[#fff2] focus-within:hover:bg-[#fff2]",
            input: "text-[#FFFFFF7D] text-[16px]",
          }}
          onChange={(e) => {
            const target = e.target as HTMLInputElement | null;
            setSearchProvider(target?.value ?? "");
          }}
        />
      </div>
      {isMobile ? (
        <TekioSwiper
          slidesPerView="auto"
          loop={true}
          modules={[Mousewheel, Navigation]}
          className={"w-full flex flex-row gap-3"}
          spaceBetween={6}
        >
          {providers
            .filter((provider) =>
              provider.name.toLowerCase().includes(searchProvider.toLowerCase())
            )
            .map((provider) => (
              <SwiperSlide key={provider.id} className="max-w-fit w-18">
                <ProviderItem
                  key={provider.id}
                  provider={provider}
                  selectedProviders={selectedProviders}
                  onClickProvider={onClickProvider}
                />
              </SwiperSlide>
            ))}
        </TekioSwiper>
      ) : (
        <div className="flex flex-col h-[calc(var(--viewport-height)-208px)] overflow-y-auto">
          <div className="grid grid-cols-3 gap-2">
            {providers
              .filter((provider) =>
                provider.name
                  .toLowerCase()
                  .includes(searchProvider.toLowerCase())
              )
              .map((provider) => (
                <ProviderItem
                  key={provider.id}
                  provider={provider}
                  selectedProviders={selectedProviders}
                  onClickProvider={onClickProvider}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
