import { Lock } from "lucide-preact";
import { useTranslations } from "@/context/I18nContext";

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
      <p className="text-xs text-[#64748B]">
        {t("powered_by")}{" "}
        <span className="font-medium text-[#94A3B8]">
          ePay<span className="text-[#00C16A]">Club</span>
        </span>
      </p>
      <nav
        className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs"
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
    <div className="text-center">
      <p className="text-[22px] font-bold leading-none tracking-tight text-[#F8FAFC]">
        ePay<span className="text-[#00C16A]">Club</span>
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
