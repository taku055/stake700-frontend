import { useEffect } from "react";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";
import { LOCALE_HREFLANG, isLocale } from "@/config/i18n";

export function useRTL() {
  const currentLocale = localeState.value;

  useEffect(() => {
    const htmlElement = document.documentElement;
    const isRTL = RTL_LANGUAGES.includes(currentLocale);
    htmlElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
    htmlElement.setAttribute("lang", isLocale(currentLocale) ? LOCALE_HREFLANG[currentLocale] : currentLocale);
  }, [currentLocale]);
}
