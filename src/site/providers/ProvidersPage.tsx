"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useTranslations } from "@/context/I18nContext";
import { routes } from "@/config/routes";
import { SectionHero } from "@/site/casino/components/SectionHero";
import { ProviderCard } from "@/components/ProviderCard";

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
      <SectionHero
        section={null}
        variant="page"
        title={t("all_providers")}
        subtitle={t("providers_tagline")}
        crumbs={[{ label: t("Casino"), href: routes.casino() }, { label: t("all_providers") }]}
        icon="/images/sidebar/casino.webp"
        stats={[
          { label: t("Providers"), value: providers.length.toLocaleString() },
          { label: t("stat_games"), value: providers.reduce((sum, p) => sum + (p.count || 0), 0).toLocaleString() },
        ]}
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
        <ul className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {visible.map((p) => (
            <li key={p.id}>
              <ProviderCard name={p.name} href={routes.provider(p.slug)} count={p.count} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
