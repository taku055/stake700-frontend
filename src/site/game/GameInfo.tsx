import { Link } from "@/components/common/Link";
import type { Crumb } from "@/lib/jsonld";

/**
 * Server-rendered game details below the player: breadcrumbs, heading,
 * description and links to the provider and section. Gives crawlers real text
 * and internal links on pages that are otherwise just an iframe.
 */
export default function GameInfo({
  crumbs,
  title,
  description,
  provider,
  section,
  labels,
}: {
  crumbs: Crumb[];
  title: string;
  description: string;
  provider?: { name: string; path: string };
  section?: { name: string; path: string };
  labels: { provider: string; section: string; moreFrom?: string };
}) {
  return (
    <section className="mx-2 mb-6 rounded-2xl border border-[var(--background-secondary)] bg-[var(--bar-background-color)] p-5 md:mx-3 md:p-6">
      <nav aria-label="Breadcrumb" className="mb-3">
        <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-[var(--text-muted-color)]">
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className="font-semibold text-white">
                    {c.name}
                  </span>
                ) : (
                  <>
                    <Link href={c.path} className="transition-colors hover:text-white">
                      {c.name}
                    </Link>
                    <span aria-hidden className="text-[var(--background-tertiary)]">
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <h1 className="text-[22px] font-bold leading-tight text-white md:text-[26px]">{title}</h1>
      <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-[var(--text-muted-color)]">{description}</p>

      {(provider || section) && (
        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-[14px]">
          {provider && (
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--background-tertiary)]">
                {labels.provider}
              </dt>
              <dd className="mt-0.5">
                <Link href={provider.path} className="font-semibold text-white transition-colors hover:text-[var(--primary-color)]">
                  {provider.name}
                </Link>
              </dd>
            </div>
          )}
          {section && (
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--background-tertiary)]">
                {labels.section}
              </dt>
              <dd className="mt-0.5">
                <Link href={section.path} className="font-semibold text-white transition-colors hover:text-[var(--primary-color)]">
                  {section.name}
                </Link>
              </dd>
            </div>
          )}
        </dl>
      )}
    </section>
  );
}
