import { useEffect } from "react";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";

export function useRTL() {
  const currentLocale = localeState.value;

  useEffect(() => {
    const htmlElement = document.documentElement;
    const isRTL = RTL_LANGUAGES.includes(currentLocale);
    htmlElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
    htmlElement.setAttribute("lang", currentLocale);
  }, [currentLocale]);
}
