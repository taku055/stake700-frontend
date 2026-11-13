import type { Metadata } from "next";
import HomePage from "@/site/home";
import SeedCustomGames from "@/provider/SeedCustomGames";
import { getCustomGamesSeed } from "@/lib/server-data";
import { buildMetadata, resolveLang, translate } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = await resolveLang(params);
  return buildMetadata({
    lang,
    path: "/",
    title: translate(lang, "Seo.home_title"),
    description: translate(lang, "Seo.home_description"),
    absoluteTitle: true,
  });
}

export default async function Page() {
  const seed = await getCustomGamesSeed();
  return (
    <SeedCustomGames entries={seed}>
      <HomePage />
    </SeedCustomGames>
  );
}
