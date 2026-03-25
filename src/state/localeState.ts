import { signal } from "@preact/signals";

export const localeState = signal<string>(
  window.localStorage.getItem("locale") || "ar"
);
