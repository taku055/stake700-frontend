import { useTranslations } from "@/context/I18nContext";
import LocaleSelection from "../LocaleSelection";
import { FOOTER_LINK_DATA, FOOTER_SOCIAL_DATA } from "./data";
import { Link } from "../common";
import { localeState } from "@/state/localeState";
import {
  ASSET_BASE_URL,
  mobileMediaQuery,
  RTL_LANGUAGES,
} from "@/config/constants";
import { useMediaQuery } from "usehooks-ts";
import { useBtcUsdPrice } from "@/hooks/useBtcUsdPrice";
import { numberRound } from "@/helpers/numberRound";

const visaImages = [
  `https://upload.wikimedia.org/wikipedia/commons/7/72/MasterCard_early_1990s_logo.png`,
  `https://static.vecteezy.com/system/resources/thumbnails/020/975/570/small/visa-logo-visa-icon-transparent-free-png.png`,
  `https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/tokens/bnb-bnb-logo.png`,
  `https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/tokens/ethereum-eth-logo.png`,
  `https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/tokens/litecoin-ltc-logo.png`,
  `https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/tokens/bitcoin-btc-logo.png`,
  `https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/tokens/polygon-matic-logo.png`,
  `https://tekio.s3.eu-north-1.amazonaws.com/betalarab/images/tokens/solana-sol-logo.png`,
];

export const Footer = () => {
  const t = useTranslations("Footer");
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const { price } = useBtcUsdPrice();

  return (
    <footer className="flex flex-col w-full items-center justify-center pb-[100px] md:pb-8 mt-[60px] pt-8 gap-5 bg-[var(--footer-background)] overflow-x-hidden scrollbar-hide">
      <div className="flex w-full md:justify-center items-center overflow-x-auto scrollbar-hide gap-4 px-4 mb-4">
        {visaImages.map((src, index) => (
          <div key={index} className="h-[40px] flex-shrink-0">
            <img src={src} className="h-full" alt="Visa" />
          </div>
        ))}
      </div>
      <div
        className={`max-w-[1200px] px-4 md:px-0 overflow-x-hidden scrollbar-hide mx-auto gap-[32px] flex flex-col items-center${
          isRTL ? "text-right" : "text-left"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div
          className={`flex md:flex-row flex-col md:gap-[16px] gap-[32px] justify-between w-full ${
            isRTL ? "text-right" : "text-left"
          }`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {FOOTER_LINK_DATA.map((item) => (
            <div className="flex flex-col gap-[8px] md:max-w-[187px] w-full">
              <h2 className="text-[16px] font-semibold uppercase text-[var(--text-footer-title-color)]">
                {t(item.title)}
              </h2>
              <div className="flex flex-col gap-[6px]">
                {item.links.map((link) => (
                  <Link
                    scrollToTop={true}
                    href={link?.href || "#"}
                    onClick={link?.onClick}
                    className="flex items-center gap-2 text-[var(--passive-color)] text-[14px] font-semibold"
                  >
                    {t(link.title)}
                    {link?.icon && (
                      <img
                        src={link.icon}
                        alt={link.title}
                        className="w-4 h-4"
                      />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="w-full h-[2px] bg-[var(--background)]" />

        <div
          className={`flex w-full justify-center items-center ${
            isRTL ? "text-right" : "text-left"
          }`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <h2 className="text-[14px] font-normal leading-[20px] text-[var(--passive-color)]">
            1 BTC = $
            {price ? numberRound(price, 100).toLocaleString() : "93,023.26"}
          </h2>
        </div>

        <div
          className={`flex justify-center items-center w-full h-[44px] ${
            isRTL ? "text-right" : "text-left"
          }`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="h-[44px]">
            <LocaleSelection headerMode={false} />
          </div>
        </div>
        <div className="w-full h-[36px] flex justify-center items-center">
          <img
            src={`${ASSET_BASE_URL}/images/icons/logo.svg`}
            alt="Betalarab"
            className="w-full h-full"
          />
        </div>
      </div>
    </footer>
  );
};
