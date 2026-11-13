import type { Metadata } from "next";
import AgentPage from "@/site/agent";
import { RouteBase } from "@/router";
import { buildMetadata, resolveLang, translate } from "@/lib/seo";

type Props = { params: Promise<{ lang: string; rest?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await resolveLang(params);
  const { rest } = await params;
  const path = ["/agent", ...(rest ?? [])].join("/");
  return buildMetadata({
    lang,
    path,
    title: translate(lang, "Seo.agent_title"),
    noindex: true,
  });
}

export default function Page() {
  return (
    <RouteBase base="/agent">
      <AgentPage />
    </RouteBase>
  );
}
