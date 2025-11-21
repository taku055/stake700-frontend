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
      className={`w-full border border-[var(--highlight-background)] rounded-lg overflow-hidden ${
        isRTL ? "text-right" : "text-left"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <button
        onClick={handleToggle}
        className={`w-full flex items-center gap-4 p-4 md:p-6 bg-[var(--bar-background-color)] hover:bg-[var(--bar-background-color-hover)] transition-all duration-300 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <span className={`text-[var(--foreground)] text-base md:text-lg font-semibold flex-1 ${
          isRTL ? "text-right" : "text-left"
        }`}>
          {question}
        </span>
        <div
          className={`flex items-center justify-center text-[var(--primary-color)] transition-transform duration-300 flex-shrink-0 ${
            isExpanded ? "rotate-180" : ""
          } ${isRTL && !isExpanded ? "scale-x-[-1]" : ""}`}
        >
          <ChevronDown width={24} height={24} />
        </div>
      </button>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 md:p-6 border-t border-[var(--highlight-background)]">
          <p className="text-[var(--passive-color)] text-sm md:text-base leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

