import { useState } from "preact/hooks";
import { ChevronDown, ChevronUp } from "lucide-preact";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";

interface FAQAccordionProps {
  question: string;
  answer: string;
  defaultExpanded?: boolean;
}

export default function FAQAccordion({
  question,
  answer,
  defaultExpanded = false,
}: FAQAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const isRTL = RTL_LANGUAGES.includes(localeState.value);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`w-full font-["Proxima Nova"] rounded-[8px] overflow-hidden ${
        isRTL ? "text-right" : "text-left"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <button
        onClick={handleToggle}
        className={`w-full h-[56px] flex items-center gap-4  text-[16px] text-[#ffffff] font-weight-600 p-4 md:p-6 bg-[var(--background-secondary)] transition-all duration-300 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <span className={`flex-1 ${
          isRTL ? "text-right" : "text-left"
        }`}>
          {question}
        </span>
        <div
          className={`flex items-center justify-center transition-transform duration-300 flex-shrink-0 w-[24px] h-[24px] ${
            isExpanded ? "rotate-180" : ""
          } ${isRTL && !isExpanded ? "scale-x-[-1]" : ""}`}
        >
          <ChevronDown width={24} height={24} />
        </div>
      </button>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out bg-[var(--background-secondary)] ${
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 md:p-6">
          <p className="font-weight-400 md:text-base leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

