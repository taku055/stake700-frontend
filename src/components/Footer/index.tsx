import { useEffect, useState } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import LocaleSelection from "../LocaleSelection";
import { userState } from "@/state/userState";
import { OfficialLinkGroup } from "./OfficialLinkGroup";
import { PaymentMethodSwiper } from "./PaymentMethodSwiper";
import { FOOTER_LINK_DATA } from "./data";
import { Link } from "../common";

export const Footer = () => {
  const t = useTranslations("Footer");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="flex flex-col items-center justify-center md:px-10 py-5 gap-5 bg-[var(--footer-background)]">
      <div className="w-full flex flex-row justify-between items-center py-5 border-b border-[var(--bar-background-color)]">
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
      </div>
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
      <PaymentMethodSwiper />
      <div className="w-full flex flex-row justify-between items-center pt-[32px] pb-[48px]">
        <div className="w-[42px] h-[42px] rounded-[9999px] border-[var(--pink-color)] border-2 text-center items-center flex justify-center">
          <span className="text-[18px] font-semibold text-[var(--pink-color)] align-middle text-center">
            18+
          </span>
        </div>
        <div className="flex flex-row items-center gap-2 text-[var(--text-transparent-color)]">
          2003 - 2025 betinbet.com
        </div>
      </div>
    </footer>
  );
};
