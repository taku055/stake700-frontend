import { tCurrencyBalance } from "@/types/tCurrencyBalance";
import { numberRound } from "./numberRound";
import { CURRENCY_LIST } from "@/config/constants";

export const multipleBalance = (cashDetails: tCurrencyBalance[]) =>
  CURRENCY_LIST
    .map(
      (e) =>
        `${e.unit}${numberRound(cashDetails.find((c) => e.unit === c.currency)?.amount ?? 0, 100)}`
    )
    .join(" ");
