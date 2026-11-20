import type { Metadata } from "next";
import { routes } from "@/config/routes";
import { buildMetadata, resolveLang } from "@/lib/seo";
import { seoFill, seoSection } from "@/lib/seo-content";
import { currentMonth } from "@/lib/top-months";
import { getTopMonths } from "@/lib/server-data";
import TopGamesPage, { monthLabel } from "@/site/best-slots/TopGamesPage";

type Props = { params: Promise<{ lang: string }> };

/** Hub: always shows the newest month that has a ranking. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await resolveLang(params);
  const months = await getTopMonths();
  const month = months[0] ?? currentMonth();
  const copy = seoSection(lang, "top");
  const label = monthLabel(lang, month);
  return buildMetadata({
    lang,
    path: routes.bestSlots(),
    title: seoFill(copy.meta_title, { month: label }),
    description: seoFill(copy.meta_description, { month: label }),
    noindex: months.length === 0,
    follow: true,
  });
}

export default async function Page({ params }: Props) {
  const lang = await resolveLang(params);
  const months = await getTopMonths();
  return <TopGamesPage lang={lang} month={months[0] ?? currentMonth()} months={months} path={routes.bestSlots()} />;
}
