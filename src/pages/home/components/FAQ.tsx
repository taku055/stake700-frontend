import React from "react";
import styles from "./FAQ.module.scss";
import { Accordion, AccordionItem } from "@heroui/react";
import { useTranslations } from "@/context/I18nContext";
import { RTL_LANGUAGES } from "@/config/constants";
import { localeState } from "@/state/localeState";
// import { useTranslations } from "next-intl";
// import { useDirection } from "@/hooks/useDirection";

export default function FAQ() {
  const t = useTranslations("VIP");
  const isRTL = RTL_LANGUAGES.includes(localeState.value);


  return (
    <div className={styles.faqSection}>
      <div className={styles.faqHeader}>
        <div className={styles.headerIcon}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor" />
          </svg>
        </div>
        <h2 className={styles.faqTitle}>{t("faqTitle")}</h2>
        <p className={styles.faqSubtitle}>
          {t("faqSubtitle")}
        </p>
      </div>

      <div className={styles.accordionContainer}>
        <Accordion
          selectionMode="single"
          className={styles.accordion}
          showDivider={false}
        >
          <AccordionItem
            key="1"
            title={t("faq1_title")}
            className={styles.accordionItem}
            classNames={{
              title: styles.accordionTitle,
              content: styles.accordionContent,
              trigger: styles.accordionTrigger,
              indicator: styles.accordionIndicator,
            }}
          >
            <div className={styles.accordionText}>
              <p>{t("faq1_body")}</p>
            </div>
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="Accordion 2"
            title={t("faq2_title")}
            className={styles.accordionItem}
            classNames={{
              title: styles.accordionTitle,
              content: styles.accordionContent,
              trigger: styles.accordionTrigger,
              indicator: styles.accordionIndicator,
            }}
          >
            <div className={styles.accordionText}>
              <p>{t("faq2_body")}</p>
            </div>
          </AccordionItem>
          <AccordionItem
            key="3"
            aria-label="Accordion 3"
            title={t("faq3_title")}
            className={styles.accordionItem}
            classNames={{
              title: styles.accordionTitle,
              content: styles.accordionContent,
              trigger: styles.accordionTrigger,
              indicator: styles.accordionIndicator,
            }}
          >
            <div className={`${styles.accordionText} ${isRTL ? styles.textRight : styles.textLeft}`}>
              <p>{t("faq3_body")}</p>
            </div>
          </AccordionItem>
          <AccordionItem
            key="4"
            aria-label="Accordion 4"
            title={t("faq4_title")}
            className={styles.accordionItem}
            classNames={{
              title: styles.accordionTitle,
              content: styles.accordionContent,
              trigger: styles.accordionTrigger,
              indicator: styles.accordionIndicator,
            }}
          >
            <div className={`${styles.accordionText} ${isRTL ? styles.textRight : styles.textLeft}`}>
              <p>{t("faq4_body")}</p>
            </div>
          </AccordionItem>
          <AccordionItem
            key="5"
            aria-label="Accordion 5"
            title={t("faq5_title")}
            className={styles.accordionItem}
            classNames={{
              title: styles.accordionTitle,
              content: styles.accordionContent,
              trigger: styles.accordionTrigger,
              indicator: styles.accordionIndicator,
            }}
          >
            <div className={`${styles.accordionText} ${isRTL ? styles.textRight : styles.textLeft}`}>
              <p>{t("faq5_body")}</p>
            </div>
          </AccordionItem>
          <AccordionItem
            key="6"
            aria-label="Accordion 6"
            title={t("faq6_title")}
            className={styles.accordionItem}
            classNames={{
              title: styles.accordionTitle,
              content: styles.accordionContent,
              trigger: styles.accordionTrigger,
              indicator: styles.accordionIndicator,
            }}
          >
            <div className={`${styles.accordionText} ${isRTL ? styles.textRight : styles.textLeft}`}>
              <p>{t("faq6_body")}</p>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
