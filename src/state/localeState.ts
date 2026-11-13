import { signal } from "@preact/signals-react";

export const localeState = signal<string>(
  window.localStorage.getItem("locale") || "ar"
);
