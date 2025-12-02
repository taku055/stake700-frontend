import { tCurrencyBalance } from "@/types/tCurrencyBalance";
import { numberRound } from "./numberRound";
import { CURRENCY_LIST } from "@/config/constants";

export const multipleBalance = (cashDetails: tCurrencyBalance[]) =>
  cashDetails
    .map(
      (e) =>
        `${CURRENCY_LIST.find((c) => c.unit === e.currency)?.symbol}${numberRound(e.amount, 100)}`
    )
    .join(" ");
