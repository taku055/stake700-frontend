import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import GamePageComponent from "@/site/game";
import GameInfo from "@/site/game/GameInfo";
import { getGame, getProviders } from "@/lib/server-data";
import { buildMetadata, resolveLang, translate } from "@/lib/seo";
import { JsonLd, breadcrumbLd, gameLd, type Crumb } from "@/lib/jsonld";
import { parseGameParam, routes } from "@/config/routes";
import type { Locale } from "@/config/i18n";
import type { tGame } from "@/types/tGame";

type Props = { params: Promise<{ lang: string; id: string }> };

const BY: Record<Locale, string> = { en: " by", ar: " من", de: " von", fr: " de", ru: " от" };

async function loadGame(param: string) {
  const { id } = parseGameParam(param);
  const game = await getGame(id);
  if (!game) return { id, game: null, provider: undefined };
  const provider = (await getProviders()).find((p) => p.id === game.providerId);
  return { id, game, provider };
}

function sectionOf(game: tGame) {
  if (game.gameType === "LIVECASINO") return { key: "Live Casino", path: routes.liveCasino() };
  if (game.gameType === "SLOT") return { key: "Casino", path: routes.casino() };
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await resolveLang(params);
  const { id: param } = await params;
  const { id, game, provider } = await loadGame(param);
  if (!game) {
    // Backend unavailable or unknown id: keep it out of the index rather than 404-ing a live game
    return buildMetadata({ lang, path: routes.game(id), title: translate(lang, "Seo.game_fallback_title"), noindex: true });
  }
  return buildMetadata({
    lang,
    path: routes.game(game.id, game.name),
    title: translate(lang, "Seo.game_title", { game: game.name }),
    description: translate(lang, "Seo.game_description", {
      game: game.name,
      by: provider ? `${BY[lang]} ${provider.name}` : "",
    }),
    image: game.img_custom || game.img || undefined,
  });
}

export default async function Page({ params }: Props) {
  const lang = await resolveLang(params);
  const { id: param } = await params;
  const { id, game, provider } = await loadGame(param);

  if (!game) return <GamePageComponent gameId={id} />;

  // One canonical URL per game: old /game/<id> links and renamed slugs redirect permanently
  const canonical = routes.game(game.id, game.name);
  if (`/game/${param}` !== canonical) permanentRedirect(`/${lang}${canonical}`);

  const section = sectionOf(game);
  const sectionName = section ? translate(lang, `CasinoPage.${section.key}`) : undefined;
  const description = translate(lang, "Seo.game_description", {
    game: game.name,
    by: provider ? `${BY[lang]} ${provider.name}` : "",
  });

  const crumbs: Crumb[] = [
    { name: translate(lang, "Seo.home"), path: routes.home() },
    ...(section && sectionName ? [{ name: sectionName, path: section.path }] : []),
    ...(provider ? [{ name: provider.name, path: routes.provider(provider.slug) }] : []),
    { name: game.name, path: canonical },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd(lang, crumbs),
          gameLd(lang, {
            name: game.name,
            path: canonical,
            image: game.img_custom || game.img || undefined,
            description,
            provider: provider?.name,
            genre: sectionName,
          }),
        ]}
      />
      <GamePageComponent gameId={game.id} initialGame={game} />
      <GameInfo
        crumbs={crumbs}
        title={game.name}
        description={description}
        provider={provider ? { name: provider.name, path: routes.provider(provider.slug) } : undefined}
        section={section && sectionName ? { name: sectionName, path: section.path } : undefined}
        labels={{ provider: translate(lang, "Seo.game_provider_label"), section: translate(lang, "Seo.game_section_label") }}
      />
    </>
  );
}
