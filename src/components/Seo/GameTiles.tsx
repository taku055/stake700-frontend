import { Link } from "@/components/common/Link";
import { routes } from "@/config/routes";
import type { BlogGame, ProviderWithSlug } from "@/lib/server-data";

/**
 * Server-rendered game links with artwork (rankings, articles). Plain links,
 * so crawlers follow them; clicking opens the game page.
 */
export default function GameTiles({
  games,
  providers,
  ranked = false,
  playLabel,
}: {
  games: BlogGame[];
  providers: ProviderWithSlug[];
  ranked?: boolean;
  playLabel: string;
}) {
  const byId = new Map(providers.map((p) => [p.id, p]));
  return (
    <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {games.map((g, i) => {
        const provider = byId.get(g.providerId);
        const name = g.name.trim();
        const img = g.img_custom || g.img;
        return (
          <li key={g.id} className="group relative">
            <Link
              href={routes.game(g.id, name)}
              prefetch={false}
              className="block overflow-hidden rounded-xl border border-[var(--background-secondary)] bg-[var(--bar-background-color)] transition-colors hover:border-[var(--primary-color)]"
            >
              <span className="relative block aspect-[4/3] overflow-hidden bg-black/20">
                {img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img}
                    alt={provider ? `${name} – ${provider.name}` : name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                {ranked && (
                  <span className="absolute start-2 top-2 flex h-8 min-w-8 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#ffd76a,#ff9f43)] px-2 text-[14px] font-extrabold text-[#1a1200] shadow">
                    {i + 1}
                  </span>
                )}
                <span className="absolute inset-x-0 bottom-0 translate-y-full bg-[var(--primary-color)] py-1.5 text-center text-[12px] font-bold uppercase tracking-wider text-white transition-transform group-hover:translate-y-0">
                  {playLabel}
                </span>
              </span>
              <span className="block px-3 py-2.5">
                <span className="block truncate text-[14px] font-semibold text-white">{name}</span>
                {provider && <span className="block truncate text-[12px] text-[var(--text-muted-color)]">{provider.name}</span>}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
