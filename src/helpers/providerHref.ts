import { providerState } from "@/state/providerState";
import { buildProviderSlugs } from "@/config/catalog";
import { routes } from "@/config/routes";

let cache: { source: unknown; slugs: Map<string, string> } | null = null;

function slugs(): Map<string, string> {
  const list = providerState.value.array;
  if (!cache || cache.source !== list) cache = { source: list, slugs: buildProviderSlugs(list) };
  return cache.slugs;
}

/**
 * Link to a provider landing page using the same slug the server routes on.
 * Before providers are loaded it falls back to the id, which the page
 * permanently redirects to the slug URL.
 */
export function providerHref(providerId: string): string {
  const id = providerId.trim();
  return routes.provider(slugs().get(id) || id);
}
