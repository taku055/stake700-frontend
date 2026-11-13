import type { Metadata } from "next";
import AffiliatePage from "@/site/affiliates";
import { RouteBase } from "@/router";
import { buildMetadata, resolveLang, translate } from "@/lib/seo";

type Props = { params: Promise<{ lang: string; rest?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await resolveLang(params);
  const { rest } = await params;
  const path = ["/affiliate", ...(rest ?? [])].join("/");
  return buildMetadata({
    lang,
    path,
    title: translate(lang, "Seo.affiliate_title"),
    noindex: true,
  });
}

export default function Page() {
  return (
    <RouteBase base="/affiliate">
      <AffiliatePage />
    </RouteBase>
  );
}
