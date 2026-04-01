import { tCurrencyBalance, tLedger } from "@/types/tCurrencyBalance";
import { numberRound } from "./numberRound";
import { CURRENCY_LIST } from "@/config/constants";

export const isLedgerCashDetailRow = (
  c: tCurrencyBalance | tLedger
): c is tLedger =>
  "currencyCode" in c && "cashBalance" in c;

/** Cash amount for one currency (agent `currency`+`amount` or ledger `currencyCode`+`cashBalance`). */
export const cashDetailAmountForUnit = (
  rows: (tCurrencyBalance | tLedger)[] | undefined | null,
  unit: string
): number => {
  if (!rows?.length) return 0;
  const c = rows.find((r) =>
    isLedgerCashDetailRow(r)
      ? String(r.currencyCode) === String(unit)
      : String(r.currency) === String(unit)
  );
  if (!c) return 0;
  return Number(
    isLedgerCashDetailRow(c) ? c.cashBalance : c.amount
  );
};

/** Table/list display: supports both agent balance rows and ledger-shaped `cashDetails`. */
export const multipleBalanceRows = (
  rows?: (tCurrencyBalance | tLedger)[] | null
) => {
  if (!rows?.length) return "";
  if (isLedgerCashDetailRow(rows[0])) {
    return multipleBalanceLedger(rows as tLedger[]);
  }
  return multipleBalance(rows as tCurrencyBalance[]);
};

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
