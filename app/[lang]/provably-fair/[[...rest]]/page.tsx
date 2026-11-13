import type { Metadata } from "next";
import ProvablyFairPage from "@/site/support/provably-fair";
import { RouteBase } from "@/router";
import { buildMetadata, resolveLang, translate } from "@/lib/seo";

type Props = { params: Promise<{ lang: string; rest?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await resolveLang(params);
  const { rest } = await params;
  const path = ["/provably-fair", ...(rest ?? [])].join("/");
  return buildMetadata({
    lang,
    path,
    title: translate(lang, "Seo.provably_fair_title"),
    description: translate(lang, "Seo.provably_fair_description"),
    noindex: false,
  });
}

export default function Page() {
  return (
    <RouteBase base="/provably-fair">
      <ProvablyFairPage />
    </RouteBase>
  );
}
