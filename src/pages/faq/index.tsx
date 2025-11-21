import { localeState } from "@/state/localeState";
import FAQAccordion from "./components/FAQAccordion";
import { getFAQData } from "./data";
import { RTL_LANGUAGES } from "@/config/constants";
import { useTranslations } from "@/context/I18nContext";

export default function FAQ() {
  const t = useTranslations("FAQ");
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const faqData = getFAQData(t);

  return (
    <div
      className={`w-full px-4 py-8 md:px-24 md:py-12 max-w-4xl mx-auto ${
        isRTL ? "text-right" : "text-left"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h1 className="text-[var(--primary-color)] text-3xl md:text-4xl font-bold mb-8">
        {t("title") || "Frequently Asked Questions"}
      </h1>

      <div className="flex flex-col gap-4">
        {faqData.map((faq, index) => (
          <FAQAccordion
            key={index}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>
    </div>
  );
}

