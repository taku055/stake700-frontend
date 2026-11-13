import type { Metadata } from "next";
import MyBetsPage from "@/site/betHistory";
import { RouteBase } from "@/router";
import { buildMetadata, resolveLang, translate } from "@/lib/seo";

type Props = { params: Promise<{ lang: string; rest?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await resolveLang(params);
  const { rest } = await params;
  const path = ["/my-bets", ...(rest ?? [])].join("/");
  return buildMetadata({
    lang,
    path,
    title: translate(lang, "Seo.my_bets_title"),
    noindex: true,
  });
}

export default function Page() {
  return (
    <RouteBase base="/my-bets">
      <MyBetsPage />
    </RouteBase>
  );
}
