import { tCurrencyBalance, tLedger } from "@/types/tCurrencyBalance";
import { numberRound } from "./numberRound";
import { CURRENCY_LIST } from "@/config/constants";

export const multipleBalance = (cashDetails?: tCurrencyBalance[] | null) =>
  CURRENCY_LIST
    .map(
      (e) =>
        `${e.symbol}${numberRound(
          Number(
            cashDetails?.find((c) => String(e.unit) === String(c.currency))
              ?.amount ?? 0
          ),
          100
        )}`
    )
    .join(" ");

export const multipleBalanceLedger = (ledgers?: tLedger[] | null) =>
  CURRENCY_LIST
    .map(
      (e) =>
        `${e.symbol}${numberRound(
          Number(
            ledgers?.find((c) => String(e.unit) === String(c.currencyCode))
              ?.cashBalance ?? 0
          ),
          100
        )}`
    )
    .join(" ");
