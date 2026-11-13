import { notFound } from "next/navigation";
import ArticlePage from "@/site/promotions/ArticlePage";
import { promotionArticles } from "@/site/promotions/articleData";
import { buildMetadata, resolveLang, translate } from "@/lib/seo";
import { routes } from "@/config/routes";

type Props = { params: Promise<{ lang: string; articleId: string }> };

function findArticle(articleId: string) {
  return promotionArticles[Number.parseInt(articleId, 10)];
}

/** First ~155 characters of the article body as plain text, for the meta description. */
function excerpt(html: string): string {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > 155 ? `${text.slice(0, 152).trimEnd()}…` : text;
}

export async function generateMetadata({ params }: Props) {
  const lang = await resolveLang(params);
  const { articleId } = await params;
  const article = findArticle(articleId);
  if (!article) return {};
  return buildMetadata({
    lang,
    path: routes.promotion(articleId),
    title: `${article.title} – ${translate(lang, "Seo.promotions_title")}`,
    description: excerpt(article.content),
    image: encodeURI(article.image),
  });
}

export default async function Page({ params }: Props) {
  const { articleId } = await params;
  if (!findArticle(articleId)) notFound();
  return <ArticlePage articleId={articleId} />;
}
