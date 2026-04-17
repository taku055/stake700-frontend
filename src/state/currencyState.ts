import { signal } from "@preact/signals";
import { CURRENCY_LIST, DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";

// Initialize with saved currency from localStorage, or default currency
const getInitialCurrency = () => {
  if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem("currency");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const found = CURRENCY_LIST.find((c) => c.unit === parsed.unit);
        if (found) return found;
      } catch (e) {
        // Invalid saved currency, use default
      }
    }
  }
  // Default to the currency matching DEFAULT_CURRENCY_SYMBOL, or first in list
  return (
    CURRENCY_LIST.find(
      (currency) => currency.symbol === DEFAULT_CURRENCY_SYMBOL
    ) || CURRENCY_LIST[0]
  );
};

export const currencyState = signal<typeof CURRENCY_LIST[0]>(
  getInitialCurrency()
);

