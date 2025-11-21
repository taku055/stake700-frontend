import { useEffect, useState } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import LocaleSelection from "../LocaleSelection";
import { userState } from "@/state/userState";
import { OfficialLinkGroup } from "./OfficialLinkGroup";
import { PaymentMethodSwiper } from "./PaymentMethodSwiper";
import { FOOTER_LINK_DATA } from "./data";
import { Link } from "../common";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";

export const Footer = () => {
  const t = useTranslations("Footer");
  const [time, setTime] = useState(new Date());
  const isRTL = RTL_LANGUAGES.includes(localeState.value);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="flex flex-col items-center justify-center mt-10 md:px-10 py-5 gap-5 bg-[var(--footer-background)]">
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
      <div className={`flex flex-col md:flex-row gap-10`}>
        <div className={`flex flex-col gap-4 flex-1 ${
          isRTL ? "text-right" : "text-left"
        }`} dir={isRTL ? "rtl" : "ltr"}>
          <img
            src={`https://tekio.s3.eu-north-1.amazonaws.com/${
              import.meta.env.VITE_SITE_NAME as string
            }/logo.png`}
            alt="logo"
            className="w-[200px]"
          />
          <p className="text-[12px] text-[var(--passive-color)]">
            {t("legal_text")}
          </p>
        </div>
        <div className={`flex gap-12 justify-center flex-1 ${
          isRTL ? "text-right" : "text-left"
        }`} dir={isRTL ? "rtl" : "ltr"}>
          {FOOTER_LINK_DATA.map((item) => (
            <div className="flex flex-col gap-[9px]">
              {item.links.map((link) => (
                <Link
                  scrollToTop={true}
                  href={link.href}
                  className="text-[var(--passive-color)] text-[16px] font-semibold"
                >
                  {t(link.title)}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex flex-row justify-between items-center pt-[32px] pb-[48px]">
        <div className="w-[42px] h-[42px] rounded-[9999px] border-[var(--pink-color)] border-2 text-center items-center flex justify-center">
          <span className="text-[18px] font-semibold text-[var(--pink-color)] align-middle text-center">
            18+
          </span>
        </div>
        <div className="flex flex-row items-center gap-2 text-[var(--text-transparent-color)]">
          2003 - 2025 ichancy.com
        </div>
      </div>
    </footer>
  );
};
