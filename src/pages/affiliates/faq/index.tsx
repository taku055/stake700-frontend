import { useState } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import { ChevronDown, ChevronUp } from "lucide-preact";

export default function FAQ() {
  const t = useTranslations("Affiliate");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("General");

  const tabs = ["General", "Affiliate Program", "Earnings"];

  const faqItems = [
    {
      question: t("What is the Vistabet777 Affiliate Program?"),
      answer: t("FAQAffiliateProgramAnswer"),
    },
    {
      question: t("Who can join the Vistabet777 Affiliate Program?"),
      answer: t("Anyone can join the Vistabet777 Affiliate Program."),
    },
    {
      question: t("How do I join the Vistabet777 Affiliate Program?"),
      answer: t("FAQJoinAnswer"),
    },
    {
      question: t("What are the benefits of joining the Vistabet777 Affiliate Program?"),
      answer: t("FAQBenefitsAnswer"),
    },
  ];

  return (
    <div className="flex flex-col p-6 gap-6">
      <h1 className="text-white text-[32px] font-semibold">{t("FAQ")}</h1>

      {/* Tabs */}
      <div className="flex">
        <div className="flex bg-[var(--background)] p-2 gap-2 rounded-full items-center justify-start">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-[16px] rounded-full font-medium transition-colors ${activeTab === tab
                  ? "text-white bg-[var(--background-secondary)]"
                  : "text-white/60 hover:text-white/80"
                }`}
            >
              {t(tab)}
            </button>
          ))}
        </div>
      </div>


      {/* FAQ Items */}
      <div className="flex flex-col gap-2">
        {faqItems.map((item, index) => {
          const isExpanded = expandedItem === `item-${index}`;
          return (
            <div
              key={index}
              className="bg-[var(--background)] rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setExpandedItem(isExpanded ? null : `item-${index}`)}
                className="w-full flex items-center justify-between p-4 transition-colors"
              >
                <span className="text-white text-[16px] font-medium text-left">{item.question}</span>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-white shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white shrink-0" />
                )}
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 pt-4 border-t-[2px] border-[var(--bar-background-color)]">
                  <p className="text-white/70 text-[16px] leading-[24px]">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
