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
      className={`w-full font-["Proxima Nova"] py-8 px-3 md:px-0 md:py-12 mx-auto ${
        isRTL ? "text-right" : "text-left"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h1 className="text-[#ffffff] text-[20px] font-semibold leading-[24px] mb-8 flex items-center gap-2 h-[28px]">
        {<img src={'images/icons/icons/info-icon.svg'} className="w-8 h-8" alt="FAQ"/>}{t("title") || "Still Have Questions?"}
      </h1>

      <div className="flex flex-col gap-[8px]">
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

