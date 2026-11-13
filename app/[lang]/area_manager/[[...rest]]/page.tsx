import type { Metadata } from "next";
import AreaManagerPage from "@/site/area_manager";
import { RouteBase } from "@/router";
import { buildMetadata, resolveLang, translate } from "@/lib/seo";

type Props = { params: Promise<{ lang: string; rest?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await resolveLang(params);
  const { rest } = await params;
  const path = ["/area_manager", ...(rest ?? [])].join("/");
  return buildMetadata({
    lang,
    path,
    title: translate(lang, "Seo.area_manager_title"),
    noindex: true,
  });
}

export default function Page() {
  return (
    <RouteBase base="/area_manager">
      <AreaManagerPage />
    </RouteBase>
  );
}
