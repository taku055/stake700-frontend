import { useTranslations } from "@/context/I18nContext";
import { Button } from "@heroui/react";
import { FunctionalComponent } from "preact";
import { FaBolt, FaPhone, FaVideo } from "react-icons/fa";
import { useState, useEffect } from "preact/hooks";
import { apiGetTokenPrice } from "@/api/common/apiGetTokenPrice";
import { numberRound } from "@/helpers/numberRound";

export const HeaderPhoneVideo: FunctionalComponent = () => {
  const [ethPrice, setEthPrice] = useState(0);

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const price = await apiGetTokenPrice(1, "0x");
        setEthPrice(price);
      } catch (ex) {
        console.error(ex);
      }
    };
    fetchEthPrice();
  }, []);

  const t = useTranslations("Header");

  return (
    <div className="flex flex-row items-center gap-1 md:gap-3 ml-auto">
      <Button
        isIconOnly
        size="sm"
        className="rounded-sm bg-[var(--green-color)] p-1"
      >
        <FaBolt color="black" size={24} />
      </Button>
      <div className="flex flex-col text-[12px] text-[#eee]">
        <span>1 ETH = {numberRound(ethPrice, 100).toLocaleString()} USDT</span>
        <span>coinmarketcap.com</span>
      </div>
      <Button
        className="ml-auto bg-[var(--green-color)] text-white rounded-sm min-w-[unset]"
        size="sm"
      >
        <span className="hidden md:block!">{t("Phone")}</span>
        <FaPhone className="md:hidden" color="white" size={16} />
      </Button>
      <Button
        className="bg-[var(--green-color)] text-white rounded-sm min-w-[unset]"
        size="sm"
      >
        <span className="hidden md:block!">{t("Video")}</span>
        <FaVideo className="md:hidden" color="white" size={16} />
      </Button>
      <Button
        className="bg-[var(--green-color)] text-white rounded-sm min-w-[unset]"
        size="sm"
      >
        <img src="/images/icons/lucky-wheel.svg" alt={t("Lucky Wheel")} />
        <span className="hidden md:block!">{t("Lucky Wheel")}</span>
      </Button>
    </div>
  );
};
