import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { routes } from "@/config/routes";
import { buildMetadata, resolveLang } from "@/lib/seo";
import { seoFill, seoSection } from "@/lib/seo-content";
import { getTopMonths } from "@/lib/server-data";
import TopGamesPage, { monthLabel } from "@/site/best-slots/TopGamesPage";

type Props = { params: Promise<{ lang: string; month: string }> };

/** Archive page for one month. The newest month's canonical is the hub. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await resolveLang(params);
  const { month } = await params;
  const months = await getTopMonths();
  if (!months.includes(month)) return {};
  const copy = seoSection(lang, "top");
  const label = monthLabel(lang, month);
  return buildMetadata({
    lang,
    path: routes.bestSlots(month),
    canonicalPath: month === months[0] ? routes.bestSlots() : undefined,
    title: seoFill(copy.meta_title, { month: label }),
    description: seoFill(copy.meta_description, { month: label }),
  });
}

export default async function Page({ params }: Props) {
  const lang = await resolveLang(params);
  const { month } = await params;
  const months = await getTopMonths();
  if (!months.includes(month)) notFound();
  return <TopGamesPage lang={lang} month={month} months={months} path={routes.bestSlots(month)} />;
}
