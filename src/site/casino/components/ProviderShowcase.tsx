"use client";

import { ArrowRight } from "lucide-react";
import { Link } from "@/components/common/Link";
import { useTranslations } from "@/context/I18nContext";
import { routes } from "@/config/routes";
import { providerHref } from "@/helpers/providerHref";
import type { tProvider } from "@/types/tProvider";
import { byPopularity } from "../hooks/useProviders";
import { ProviderCard } from "@/components/ProviderCard";

const LIMIT = 12;

/** Lobby footer: the section's biggest studios as a logo grid. */
export function ProviderShowcase({ providers }: { providers: tProvider[] | undefined }) {
  const t = useTranslations("CasinoPage");
  if (providers && providers.length === 0) return null;
  const top = providers ? byPopularity(providers).slice(0, LIMIT) : undefined;

  return (
    <section aria-labelledby="top-providers">
      <div className="mb-3 flex items-center gap-3 md:mb-4">
        <span className="h-5 w-1 shrink-0 rounded-full bg-[var(--primary-color)] shadow-[0_0_12px_var(--primary-color)] md:h-6" />
        <h2 id="top-providers" className="text-[17px] font-bold leading-tight text-white md:text-[20px]">
          {t("top_providers")}
        </h2>
        <Link
          href={routes.providers()}
          className="group ms-auto inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-[var(--text-muted-color)] transition-colors hover:bg-[var(--bar-background-color)] hover:text-white"
        >
          {t("all_providers")}
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
        </Link>
      </div>

      <ul className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {top
          ? top.map((p, i) => (
              <li key={p.id}>
                <ProviderCard name={p.name} href={providerHref(p.id)} count={p.count} rank={i + 1} />
              </li>
            ))
          : Array.from({ length: LIMIT }).map((_, i) => (
              <li key={i} className="h-[88px] animate-pulse rounded-2xl bg-[var(--bar-background-color)]" />
            ))}
      </ul>
    </section>
  );
}
