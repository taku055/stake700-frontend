"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import GlobalServiceProvider from "./GlobalServiceProvider";
import { SocketProvider } from "@/context/SocketContext";
import { localeState } from "@/state/localeState";
import { LOCALE_COOKIE, isLocale, splitLocale, type Locale } from "@/config/i18n";

/**
 * Keeps the URL locale prefix and `localeState` in sync:
 * - URL changes (navigation, back/forward) update the signal.
 * - Language pickers set the signal; we then move to the same page under the new prefix.
 */
function LocaleSync({ lang }: { lang: Locale }) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const lastUrlLang = useRef(lang);

  // URL -> signal
  useEffect(() => {
    lastUrlLang.current = lang;
    if (localeState.value !== lang) localeState.value = lang;
    document.cookie = `${LOCALE_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
  }, [lang]);

  // signal -> URL
  useEffect(() => {
    return localeState.subscribe((next) => {
      if (!isLocale(next) || next === lastUrlLang.current) return;
      const { path } = splitLocale(window.location.pathname);
      const qs = window.location.search;
      lastUrlLang.current = next;
      router.replace(`/${next}${path === "/" ? "" : path}${qs}`, { scroll: false });
    });
  }, [router, pathname, searchParams]);

  return null;
}

export default function AppProviders({ lang, children }: { lang: Locale; children: ReactNode }) {
  // Seed the signal for the server render (the client seeds itself from the URL in localeState.ts).
  if (typeof window === "undefined") localeState.value = lang;

  return (
    <SocketProvider>
      <GlobalServiceProvider>
        <LocaleSync lang={lang} />
        {children}
      </GlobalServiceProvider>
    </SocketProvider>
  );
}
