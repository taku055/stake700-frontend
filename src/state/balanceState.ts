import { signal } from "@preact/signals-react";
import { tUserBalance } from "@/types/tUserLedger";

export const balanceState = signal<Record<string, tUserBalance>>({});
