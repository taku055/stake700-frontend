import { ArrowUp } from "lucide-react";
import { useTranslations } from "@/context/I18nContext";
import LocaleSelection from "../LocaleSelection";
import { FOOTER_LINK_DATA } from "./data";
import { Link } from "../common";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";
import { capitalize } from "@/helpers/capitalize";

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

const linkClass =
  "text-start text-sm text-[var(--text-muted-color)] transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none";

function backToTop() {
  const container = document.querySelector(".body-content");
  if (container) container.scrollTo({ top: 0, behavior: "smooth" });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

export const Footer = () => {
  const t = useTranslations("Footer");
  const isRTL = RTL_LANGUAGES.includes(localeState.value);

  return (
    <footer
      className="mt-16 bg-[var(--footer-background)] px-4 pb-28 md:px-8 md:pb-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* gold hairline that echoes the logo */}
      <div
        aria-hidden
        className="mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-[var(--brand-gold)] to-transparent opacity-50"
      />

      <div className="mx-auto w-full max-w-6xl pt-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-16">
          {/* Brand block */}
          <div className="flex flex-col gap-5">
            <img
              src="/images/brand/logo.png"
              alt={capitalize(process.env.NEXT_PUBLIC_SITE_NAME)}
              className="h-12 w-auto self-start object-contain"
            />
            <p className="text-sm leading-relaxed text-[var(--text-muted-color)]">
              {t("ResponsibleGamblingText")}{" "}
              <Link
                href="/support/responsible-gambling"
                scrollToTop={true}
                className="font-semibold text-[var(--brand-gold)] hover:underline"
              >
                {t("Responsible Gambling")}
              </Link>
              .
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span
                aria-label="18+"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-[var(--fire-color)] text-[13px] font-black text-[var(--fire-color)]"
              >
                18+
              </span>
              <LocaleSelection headerMode={false} />
            </div>
          </div>

          {/* Link columns */}
          <nav className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {FOOTER_LINK_DATA.map((group) => (
              <div key={group.title}>
                <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-gold)]">
                  {t(group.title)}
                </h2>
                <ul className="flex flex-col gap-2.5">
                  {group.links.map((link) => (
                    <li key={link.title}>
                      {link.href ? (
                        <Link
                          scrollToTop={true}
                          href={link.href}
                          onClick={link.onClick}
                          className={linkClass}
                        >
                          {t(link.title)}
                        </Link>
                      ) : (
                        <button type="button" onClick={link.onClick} className={linkClass}>
                          {t(link.title)}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Payment methods */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/5 pt-6 md:flex-row md:items-center md:justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--background-tertiary)]">
            {t("payment_methods")}
          </span>
          <div className="flex flex-wrap items-center gap-4">
            {paymentImages.map((item) => (
              <img
                key={item.alt}
                src={item.src}
                alt={item.alt}
                title={item.alt}
                className="h-7 w-7 object-contain opacity-60 grayscale transition duration-200 hover:opacity-100 hover:grayscale-0"
              />
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col-reverse gap-4 border-t border-white/5 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-[var(--background-tertiary)]">{t("Copyright")}</p>
          <button
            type="button"
            onClick={backToTop}
            className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-[var(--text-muted-color)] transition-colors hover:border-[var(--brand-gold)] hover:text-white md:self-auto"
          >
            <ArrowUp size={14} />
            {t("back_to_top")}
          </button>
        </div>
      </div>
    </footer>
  );
};
