"use client";

import { X } from "lucide-react";
import { useTranslations } from "@/context/I18nContext";
import type { tProvider } from "@/types/tProvider";
import { byPopularity } from "../hooks/useProviders";
import { ProviderMonogram } from "@/components/ProviderCard";

const LIMIT = 14;

/**
 * One-tap provider filter: selected providers first, then the biggest studios.
 * The full list stays available in the "Providers" dropdown next to it.
 */
export function ProviderQuickFilter({
  providers,
  value,
  onChange,
}: {
  providers: tProvider[] | undefined;
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const t = useTranslations("CasinoPage");

  if (!providers) {
    return (
      <div className="flex gap-2 overflow-hidden" aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="h-10 w-[104px] shrink-0 animate-pulse rounded-full bg-[var(--bar-background-color)]" />
        ))}
      </div>
    );
  }
  if (providers.length < 2) return null;

  const selected = providers.filter((p) => value.includes(p.id));
  const rest = byPopularity(providers.filter((p) => !value.includes(p.id)));
  const shown = [...selected, ...rest].slice(0, Math.max(LIMIT, selected.length));
  const toggle = (id: string) => onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);

  return (
    <div className="flex items-center gap-2">
      <ul
        aria-label={t("Providers")}
        className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {shown.map((p) => {
          const on = value.includes(p.id);
          return (
            <li key={p.id} className="shrink-0">
              <button
                type="button"
                aria-pressed={on}
                title={p.name}
                onClick={() => toggle(p.id)}
                className={`flex h-10 items-center gap-2 rounded-full border ps-1.5 pe-3.5 transition-colors ${
                  on
                    ? "border-[var(--primary-color)] bg-[color-mix(in_srgb,var(--primary-color)_18%,var(--bar-background-color))] text-white"
                    : "border-[var(--background-secondary)] bg-[var(--bar-background-color)] text-[var(--text-muted-color)] hover:border-[var(--background-tertiary)] hover:text-white"
                }`}
              >
                <ProviderMonogram name={p.name} size="xs" />
                <span className="text-[13px] font-semibold whitespace-nowrap">{p.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange([])}
          className="flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-[var(--primary-color)] transition-colors hover:text-white"
        >
          <X size={14} />
          {t("Clear all")}
        </button>
      )}
    </div>
  );
}
