import { signal } from "@preact/signals";
import { tUserBalance } from "@/types/tUserLedger";

export const balanceState = signal<Record<string, tUserBalance>>({});
