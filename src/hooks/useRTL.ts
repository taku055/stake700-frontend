import { useEffect } from "preact/hooks";
import { localeState } from "@/state/localeState";
import { effect } from "@preact/signals";
import { RTL_LANGUAGES } from "@/config/constants";

export function useRTL() {
  useEffect(() => {
    const updateDirection = () => {
      const htmlElement = document.documentElement;
      const currentLocale = localeState.value;
      const isRTL = RTL_LANGUAGES.includes(currentLocale);
      
      if (isRTL) {
        htmlElement.setAttribute("dir", "rtl");
        htmlElement.setAttribute("lang", currentLocale);
      } else {
        htmlElement.setAttribute("dir", "ltr");
        htmlElement.setAttribute("lang", currentLocale);
      }
    };

    // Initial update
    updateDirection();

    // Watch for locale changes using effect
    const dispose = effect(() => {
      // Access localeState.value to subscribe to changes
      const _ = localeState.value;
      updateDirection();
    });

    return () => {
      dispose();
    };
  }, []);
}

