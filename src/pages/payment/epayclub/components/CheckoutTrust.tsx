import { Lock } from "lucide-preact";
import { useTranslations } from "@/context/I18nContext";
import { VisaIcon } from "./PaymentBrandIcons";

export function CheckoutTrustBadges() {
  const t = useTranslations("EpayclubCheckout");

  const items = [
    { icon: "🔒", label: t("trust_ssl") },
    { label: t("trust_pci") },
    { label: t("trust_encryption") },
    { label: t("trust_money_back") },
  ];

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] leading-relaxed text-[#64748B]"
      aria-label={t("trust_section_label")}
    >
      {items.map((item, index) => (
        <span key={item.label} className="inline-flex items-center gap-1">
          {index > 0 ? (
            <span className="mr-3 text-[#334155]" aria-hidden>
              ·
            </span>
          ) : null}
          {item.icon ? <span aria-hidden>{item.icon}</span> : null}
          {item.label}
        </span>
      ))}
    </div>
  );
}

export function CheckoutFooter() {
  const t = useTranslations("EpayclubCheckout");

  return (
    <footer className="mt-8 text-center">
      <nav
        className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs"
        aria-label={t("footer_nav_label")}
      >
        <a
          href="/privacy-policy"
          className="text-[#64748B] transition-colors duration-200 hover:text-[#94A3B8]"
        >
          {t("privacy_policy")}
        </a>
        <a
          href="/other-rules"
          className="text-[#64748B] transition-colors duration-200 hover:text-[#94A3B8]"
        >
          {t("terms")}
        </a>
        <a
          href="/support/help-center"
          className="text-[#64748B] transition-colors duration-200 hover:text-[#94A3B8]"
        >
          {t("support")}
        </a>
      </nav>
    </footer>
  );
}

export function CheckoutLogo() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex h-12 w-[76px] items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-white px-3"
        aria-label="Visa"
      >
        <VisaIcon className="h-5 w-auto text-[#1A1F71]" />
      </div>
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#64748B]">
        Secure Checkout
      </p>
    </div>
  );
}

export function CheckoutSecureNote() {
  const t = useTranslations("EpayclubCheckout");
  return (
    <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#64748B]">
      <Lock className="h-3 w-3" aria-hidden />
      {t("secured_by")}
    </p>
  );
}
