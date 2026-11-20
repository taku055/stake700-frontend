"use client";

import SearchWidget from "@/components/Header/SearchWidget";
import { useTranslations } from "@/context/I18nContext";
import { SECTION_META, type CatalogSection } from "@/config/catalog";
import { pickCustomGames } from "@/helpers/customGames";
import { SectionRows } from "./components/SectionRows";
import { useAgentRedirect } from "@/hooks/useAgentRedirect";
import { SectionHero } from "./components/SectionHero";
import { CategoryRail } from "./components/CategoryRail";
import { CategoryTiles } from "./components/CategoryTiles";
import { ProviderShowcase } from "./components/ProviderShowcase";
import { useProviders } from "./hooks/useProviders";
import {
  CategoryCountsContext,
  useSectionCategories,
} from "./hooks/useSectionCategories";

/** Curated category whose games are fanned out in the hero artwork. */
const HERO_ART: Record<CatalogSection, string[]> = {
  casino: ["top-games", "slot-popular"],
  "live-casino": ["rouletteglobal", "show", "tablegames"],
};

/** /casino and /live-casino landing pages. */
export default function LobbyPage({
  section,
  categoryCounts,
}: {
  section: CatalogSection;
  /** Games per category slug, from the server */
  categoryCounts?: Record<string, number>;
}) {
  const t = useTranslations("CasinoPage");
  const redirecting = useAgentRedirect();
  const providers = useProviders({ gameType: SECTION_META[section].gameType });
  const categories = useSectionCategories(section);

  const covers =
    HERO_ART[section]
      .map((c) => pickCustomGames(c, 3).filter((g) => g.img || g.img_custom))
      .find((g) => g.length >= 3) ?? [];
  const gameTotal = providers?.reduce((sum, p) => sum + (p.count || 0), 0);

  if (redirecting) return null;

  return (
    <CategoryCountsContext.Provider value={categoryCounts}>
      <div className="flex w-full flex-col gap-6 p-2 md:gap-8">
        <SectionHero
          section={section}
          variant="lobby"
          title={t(SECTION_META[section].titleKey)}
          subtitle={t(section === "casino" ? "casino_tagline" : "live_tagline")}
          covers={covers}
          stats={[
            {
              label: t("stat_games"),
              value:
                providers && gameTotal
                  ? gameTotal.toLocaleString("en-US")
                  : providers
                    ? "—"
                    : undefined,
            },
            {
              label: t("Providers"),
              value: providers ? String(providers.length || "—") : undefined,
            },
            { label: t("stat_categories"), value: String(categories.length) },
          ]}
        >
          <SearchWidget scope={section === "casino" ? "SLOT" : "LIVECASINO"} />
        </SectionHero>

        <CategoryRail section={section} active="lobby" />

        <CategoryTiles
          section={section}
          counts={categoryCounts}
          total={gameTotal}
        />

        <SectionRows section={section} />

        <ProviderShowcase providers={providers} />
      </div>
    </CategoryCountsContext.Provider>
  );
}
