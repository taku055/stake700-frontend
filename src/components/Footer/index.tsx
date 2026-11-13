import { useTranslations } from "@/context/I18nContext";
import LocaleSelection from "../LocaleSelection";
import { FOOTER_LINK_DATA } from "./data";
import { Link } from "../common";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";
import { useBtcUsdPrice } from "@/hooks/useBtcUsdPrice";
import { numberRound } from "@/helpers/numberRound";
import { capitalize } from "@/helpers/capitalize";

const sectionIcons: Record<string, string> = {
  Casino: "/images/sidebar/casino.webp",
  Support: "/images/sidebar/support.webp",
  "About Us": "/images/sidebar/providers.webp",
  FAQ: "/images/sidebar/payment-methods.webp",
};

const paymentImages = [
  { src: "/images/payments/visa.webp", alt: "Visa" },
  { src: "/images/payments/mastercard.webp", alt: "Mastercard" },
  { src: "/images/payments/binance.webp", alt: "Binance" },
  { src: "/images/payments/bitcoin.webp", alt: "Bitcoin" },
  { src: "/images/payments/ethereum.webp", alt: "Ethereum" },
  { src: "/images/payments/litecoin.webp", alt: "Litecoin" },
  { src: "/images/payments/polygon.webp", alt: "Polygon" },
  { src: "/images/payments/solana.webp", alt: "Solana" },
];

export const Footer = () => {
  const t = useTranslations("Footer");
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const { price } = useBtcUsdPrice();

  return (
    <footer
      className="mt-16 border-t border-[#2f4553] bg-[#0f212e] px-4 pb-28 pt-8 md:px-8 md:pb-10"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <img
            src="/images/brand/logo.png"
            alt={capitalize(process.env.NEXT_PUBLIC_SITE_NAME)}
            className="h-16 w-auto object-contain"
          />
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#1a2c38] px-4 py-2 text-sm font-semibold text-white">
              1 BTC = ${price ? numberRound(price, 100).toLocaleString() : "93,023.26"}
            </span>
            <LocaleSelection headerMode={false} />
          </div>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto rounded-2xl bg-[#1a2c38] px-4 py-3">
          {paymentImages.map((item) => (
            <img
              key={item.alt}
              src={item.src}
              alt={item.alt}
              className="h-10 w-10 shrink-0 object-contain"
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {FOOTER_LINK_DATA.map((item) => (
            <div key={item.title} className="rounded-2xl bg-[#1a2c38] p-4">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase text-white">
                {sectionIcons[item.title] ? (
                  <img src={sectionIcons[item.title]} alt="" className="h-6 w-6 object-contain" />
                ) : null}
                {t(item.title)}
              </h2>
              <div className="flex flex-col gap-2">
                {item.links.map((link) => (
                  <Link
                    key={link.title}
                    scrollToTop={true}
                    href={link?.href || "#"}
                    onClick={link?.onClick}
                    className="flex items-center gap-2 text-sm font-semibold text-[#b1bad3] transition-colors hover:text-white"
                  >
                    {t(link.title)}
                    {link?.icon && (
                      <img src={link.icon} alt={link.title} className="h-4 w-4" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};
