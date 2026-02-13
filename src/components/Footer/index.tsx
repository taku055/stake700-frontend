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
  `https://cryptologos.cc/logos/bitcoin-btc-logo.png`,
  `https://cryptologos.cc/logos/ethereum-eth-logo.png`,
  `https://cryptologos.cc/logos/tether-usdt-logo.png?v=002`,
  `https://cryptologos.cc/logos/binance-coin-bnb-logo.png?v=002`,
  `https://cryptologos.cc/logos/tron-trx-logo.png?v=002`,
  `https://cryptologos.cc/logos/solana-sol-logo.png`,
  `https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/1280px-Google_Pay_Logo.svg.png`,
];

export const Footer = () => {
  const t = useTranslations("Footer");
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const { price } = useBtcUsdPrice();

  return (
    <footer className="flex flex-col w-full items-center justify-center pb-16 md:pb-8 mt-[60px] pt-8 gap-5 bg-[var(--footer-background)] overflow-x-hidden scrollbar-hide">
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
        {!isMobile && (
          <div
            className={`flex gap-[16px] justify-between w-full ${
              isRTL ? "text-right" : "text-left"
            }`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {FOOTER_LINK_DATA.map((item) => (
              <div className="flex flex-col gap-[8px] max-w-[187px]">
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
        )}
        <div className="w-full flex justify-center">
          <div className="flex w-[202px] h-[24px] justify-between">
            {FOOTER_SOCIAL_DATA.map((item) => (
              <Link
                href={item.href}
                className="w-[16px] h-[16px] rounded-[4px]"
              >
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-full h-full"
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="w-full h-[2px] bg-[var(--background)]" />

        <div
          className={`flex flex-col gap-[16px] w-full h-full ${
            isRTL ? "text-right" : "text-left"
          }`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <h2 className="text-[14px] font-normal leading-[20px] text-[var(--passive-color)]">
            © 2026 Betalarab.com | All Rights Reserved
          </h2>
          <p className=" text-[14px] font-normal leading-[20px] text-[var(--passive-color)]">
            Betalarab is owned and operated by Betalarab N.V., registration
            number: 145353, registered address: Seru Loraweg 17 B, Curaçao.
            Payment agent companies are Medium Rare Limited and MRS Tech
            Limited. Contact us at support@betalarab.com.
          </p>
          <h2 className="text-[14px] font-normal leading-[20px] text-[var(--passive-color)]">
            Betalarab is committed to responsible gambling, for more
            information visit&nbsp;
            <Link
              href="/support/responsible-gambling"
              className="text-[var(--passive-color)] text-[14px] font-semibold"
            >
              Responsible Gambling
            </Link>
          </h2>
        </div>

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
