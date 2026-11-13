"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Link } from "@/components/common";
import { useTranslations } from "@/context/I18nContext";
import { routes } from "@/config/routes";
import { CasinoHeader } from "@/site/casino/components/CasinoHeader";

export type ProviderCard = { id: string; slug: string; name: string; img?: string | null; count: number };

/** /providers — every studio as a crawlable link, with an instant client-side filter. */
export default function ProvidersPage({ providers }: { providers: ProviderCard[] }) {
  const t = useTranslations("CasinoPage");
  const [filter, setFilter] = useState("");

  const visible = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return q ? providers.filter((p) => p.name.toLowerCase().includes(q)) : providers;
  }, [providers, filter]);

  return (
    <div className="flex w-full flex-col gap-5 p-2 md:gap-6">
      <CasinoHeader
        section={null}
        title={t("all_providers")}
        eyebrow={t("Casino")}
        icon="/images/sidebar/casino.webp"
        total={providers.reduce((sum, p) => sum + (p.count || 0), 0)}
      />

      <div className="group flex h-12 items-center gap-2.5 rounded-lg border border-[var(--background-secondary)] bg-[var(--bar-background-color)] px-3.5 transition-[border-color,box-shadow] focus-within:border-[var(--primary-color)] focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary-color)_25%,transparent)]">
        <Search size={18} className="shrink-0 text-[var(--text-muted-color)] group-focus-within:text-[var(--primary-color)]" />
        <input
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={t("search_providers")}
          aria-label={t("search_providers")}
          className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-[var(--background-tertiary)] [&::-webkit-search-cancel-button]:hidden"
        />
        {filter && (
          <button
            type="button"
            aria-label="Clear"
            onClick={() => setFilter("")}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--background-secondary)] text-[var(--text-muted-color)] hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-[14px] text-[var(--text-muted-color)]">{t("no_providers_found")}</p>
      ) : (
        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {visible.map((p) => (
            <li key={p.id}>
              <Link
                href={routes.provider(p.slug)}
                className="group flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-[var(--background-secondary)] bg-[var(--bar-background-color)] px-4 py-5 text-center transition-colors hover:border-[var(--primary-color)] hover:bg-[var(--background)]"
              >
                <span className="flex h-12 w-full items-center justify-center">
                  {p.img ? (
                    <img
                      src={p.img}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="max-h-12 max-w-[85%] object-contain opacity-90 transition-opacity group-hover:opacity-100"
                    />
                  ) : (
                    <span className="text-[16px] font-bold text-white">{p.name}</span>
                  )}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="truncate text-[14px] font-semibold text-white">{p.name}</span>
                  {p.count > 0 && (
                    <span className="text-[12px] text-[var(--text-muted-color)]">
                      {t("provider_games", { count: p.count })}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
