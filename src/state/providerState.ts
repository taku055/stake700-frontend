import { tProvider } from "@/types/tProvider";
import { signal } from "@preact/signals-react";

type tProviderState = {
  array: tProvider[];
  map: { [id: string]: tProvider };
};

export const providerState = signal<tProviderState>({
  array: [],
  map: {},
});
