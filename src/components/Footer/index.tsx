import { useEffect, useState } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import LocaleSelection from "../LocaleSelection";
import { userState } from "@/state/userState";
import { OfficialLinkGroup } from "./OfficialLinkGroup";
import { PaymentMethodSwiper } from "./PaymentMethodSwiper";
import { FOOTER_LINK_DATA, FOOTER_SOCIAL_DATA } from "./data";
import { Link } from "../common";
import { localeState } from "@/state/localeState";
import { BASE_URL, mobileMediaQuery, RTL_LANGUAGES } from "@/config/constants";
import { useMediaQuery } from "usehooks-ts";

export const Footer = () => {
  const t = useTranslations("Footer");
  // const [time, setTime] = useState(new Date());
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const isMobile = useMediaQuery(mobileMediaQuery);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTime(new Date());
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <footer className="flex flex-col w-full items-center justify-center pb-16 md:pb-8 pt-8 gap-5 bg-[var(--footer-background)] overflow-x-hidden scrollbar-hide">
      {/* <div className="w-full flex flex-row justify-between items-center py-5 border-b border-[var(--bar-background-color)]">
        <OfficialLinkGroup />
        <div className="flex flex-row items-center gap-2">
          <div className="text-[var(--text-transparent-color)] bg-[var(--bar-background-color)] rounded-sm py-1 px-2">
            {time.toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
          {!userState.value?.isAgent && <LocaleSelection headerMode={false} />}
        </div>
      </div>\
      <div className="flex w-full pl-[40px] md:pl-0 md:justify-center md:flex-row flex-col gap-12 text-[11px] mb-[108px] mt-[20px]">
        {FOOTER_LINK_DATA.map((item) => (
          <div className="flex flex-col gap-[9px]">
            <h2 className="text-[14px] font-semibold uppercase text-[var(--text-footer-title-color)]">
              {t(item.title)}
            </h2>
            {item.links.map((link) => (
              <Link
                scrollToTop={true}
                href={link.href}
                className="text-[11px] text-[var(--text-transparent-color)]"
              >
                {t(link.title)}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-row gap-[36px] text-[12px] text-[var(--text-transparent-color)] overflow-x-auto">
        <a
          href="/about_us"
          className="text-[12px] text-[var(--text-transparent-color)]"
        >
          {t("payment_methods")}
        </a>
      </div>
      <PaymentMethodSwiper /> */}
      <div className={`max-w-[1200px] px-4 md:px-0 overflow-x-hidden scrollbar-hide mx-auto gap-[32px] flex flex-col items-center${isRTL ? "text-right" : "text-left"}`} dir={isRTL ? "rtl" : "ltr"}>
        {!isMobile && (
          <div className={`grid grid-cols-2 md:grid-cols-6 gap-[16px] justify-between w-full ${isRTL ? "text-right" : "text-left"
            }`} dir={isRTL ? "rtl" : "ltr"}>
            {FOOTER_LINK_DATA.map((item) => (
              <div className="flex flex-col gap-[8px] max-w-[187px]">
                <h2 className="text-[16px] font-semibold uppercase text-[var(--text-footer-title-color)]">
                  {t(item.title)}
                </h2>
                <div className="flex flex-col gap-[6px]">
                  {item.links.map((link) => (
                    <Link
                      scrollToTop={true}
                      href={link?.href}
                      onClick={() => {
                        link?.onClick?.();
                      }}
                      className="flex items-center gap-2 text-[var(--passive-color)] text-[14px] font-semibold"
                    >
                      {t(link.title)}
                      {link?.icon && <img src={link.icon} alt={link.title} className="w-4 h-4" />}
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
              <Link href={item.href} className="w-[16px] h-[16px] rounded-[4px]">
                <img src={item.icon} alt={item.title} className="w-full h-full" />
              </Link>
            ))}
          </div>
        </div>

        <div className="w-full h-[2px] bg-[var(--background)]" />

        <div className={`flex flex-col gap-[16px] w-full h-[120px] ${isRTL ? "text-right" : "text-left"}`} dir={isRTL ? "rtl" : "ltr"}>
          <h2 className="text-[14px] font-normal leading-[20px] text-[var(--passive-color)]">
            © 2025 Betalarab.com | All Rights Reserved
          </h2>
          <p className="text-[14px] font-normal leading-[20px] text-[var(--passive-color)]">
            Betalarab is owned and operated by Betalarab N.V., registration number: 145353, registered address: Seru Loraweg 17 B, Curaçao.
            Payment agent companies are Medium Rare Limited and MRS Tech Limited. Contact us at support@betalarab.com.
          </p>
          <h2 className="text-[14px] font-normal leading-[20px] text-[var(--passive-color)]">
            Betalarab is committed to responsible gambling, for more information visit <Link href="/responsible-gambling" className="text-[var(--passive-color)] text-[14px] font-semibold">Responsible Gambling</Link>
          </h2>
        </div>

        <div className={`flex w-full justify-center items-center ${isRTL ? "text-right" : "text-left"}`} dir={isRTL ? "rtl" : "ltr"}>
          <h2 className="text-[14px] font-normal leading-[20px] text-[var(--passive-color)]">1 BTC = $93,023.26</h2>
        </div>

        <div className={`flex justify-center items-center w-full h-[44px] ${isRTL ? "text-right" : "text-left"}`} dir={isRTL ? "rtl" : "ltr"}>
          <div className="h-[44px]">
            <LocaleSelection headerMode={false} />
          </div>
        </div>
        <div className="w-full h-[36px] flex justify-center items-center">
          <img src={`${BASE_URL}/images/icons/logo.svg`} alt="Betalarab" className="w-full h-full" />
        </div>
        <div className="w-full h-[64px] flex justify-center items-center">
          {/* <Link href="/" className="p-[2px]"> */}
            <div
              id="anj-6f593292-7c58-4346-9757-715a8036599c"
              data-anj-seal-id="6f593292-7c58-4346-9757-715a8036599c"
              data-anj-image-size="64"
              data-anj-image-type="basic-small"
            ></div>
          {/* </Link> */}
        </div>
      </div>
    </footer>
  );
};
