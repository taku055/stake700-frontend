import { tPayment } from "@/types/tPayment";
import { signal } from "@preact/signals";

type tPaymentState = {
  array: tPayment[];
  map: { [id: string]: tPayment };
};

export const paymentState = signal<tPaymentState>({
  array: [],
  map: {},
});
