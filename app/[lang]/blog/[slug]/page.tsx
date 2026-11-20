import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Link } from "@/components/common/Link";
import { routes } from "@/config/routes";
import { LOCALES, type Locale } from "@/config/i18n";
import { buildMetadata, resolveLang, siteUrl, translate } from "@/lib/seo";
import { JsonLd, absoluteUrl, breadcrumbLd } from "@/lib/jsonld";
import { markdownExcerpt, readingMinutes } from "@/lib/markdown";
import { seoFill, seoSection } from "@/lib/seo-content";
import { getBlogList, getBlogPost, getProviders } from "@/lib/server-data";
import MarkdownBody from "@/components/Seo/MarkdownBody";
import GameTiles from "@/components/Seo/GameTiles";
import PostCard, { formatDate } from "@/components/Seo/PostCard";

type Props = { params: Promise<{ lang: string; slug: string }> };

const availableLocales = (langs: string[]): Locale[] => LOCALES.filter((l) => langs.includes(l));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await resolveLang(params);
  const { slug } = await params;
  const post = await getBlogPost(slug, lang);
  const t = post?.translation;
  if (!post || !t) return {};
  const copy = seoSection(lang, "blog");
  return buildMetadata({
    lang,
    path: routes.blogPost(post.slug),
    title: t.metaTitle || t.title,
    description: t.metaDescription || t.excerpt || markdownExcerpt(t.body),
    image: post.coverImage ?? undefined,
    languages: availableLocales(post.langs),
    article: {
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      section: copy.categories[post.category] ?? post.category,
    },
  });
}

export default async function Page({ params }: Props) {
  const lang = await resolveLang(params);
  const { slug } = await params;
  const post = await getBlogPost(slug, lang);
  if (!post) notFound();

  const t = post.translation;
  if (!t) {
    // Not written in this language: send readers to a language it exists in
    const fallback = availableLocales(post.langs);
    const target = fallback.includes("en") ? "en" : fallback[0];
    if (!target) notFound();
    redirect(`/${target}${routes.blogPost(post.slug)}`);
  }

  const copy = seoSection(lang, "blog");
  const categoryName = copy.categories[post.category] ?? post.category;
  const [providers, latest] = await Promise.all([getProviders(), getBlogList(lang, { pageSize: 4 })]);
  const more = (latest?.items ?? []).filter((p) => p.slug !== post.slug).slice(0, 3);
  const blogTitle = seoFill(copy.title);
  const updated = post.updatedAt && new Date(post.updatedAt).getTime() - new Date(post.publishedAt).getTime() > 86_400_000;

  const crumbs = [
    { name: translate(lang, "Seo.home"), path: routes.home() },
    { name: blogTitle, path: routes.blog() },
    { name: t.title, path: routes.blogPost(post.slug) },
  ];

  return (
    <div className="w-full px-4 pb-10 pt-6 md:px-8">
      <JsonLd
        data={[
          breadcrumbLd(lang, crumbs),
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: t.title,
            description: t.excerpt || markdownExcerpt(t.body),
            inLanguage: lang,
            url: absoluteUrl(lang, routes.blogPost(post.slug)),
            mainEntityOfPage: absoluteUrl(lang, routes.blogPost(post.slug)),
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            articleSection: categoryName,
            ...(post.coverImage ? { image: post.coverImage } : {}),
            author: { "@type": "Organization", name: seoFill(copy.author), url: siteUrl().origin },
            publisher: { "@id": `${siteUrl().origin}/#organization` },
            ...(post.games.length
              ? {
                  about: post.games.map((g) => ({
                    "@type": "VideoGame",
                    name: g.name.trim(),
                    url: absoluteUrl(lang, routes.game(g.id, g.name.trim())),
                  })),
                }
              : {}),
          },
        ]}
      />

      <article className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-[var(--text-muted-color)]">
            {crumbs.slice(0, -1).map((c) => (
              <li key={c.path} className="flex items-center gap-1.5">
                <Link href={c.path} className="hover:text-white">
                  {c.name}
                </Link>
                <span aria-hidden>/</span>
              </li>
            ))}
            <li>
              <Link href={routes.blog({ category: post.category })} className="font-semibold text-[var(--primary-color)]">
                {categoryName}
              </Link>
            </li>
          </ol>
        </nav>

        <h1 className="text-[28px] font-extrabold leading-tight text-white md:text-[40px]">{t.title}</h1>
        <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-[var(--text-muted-color)]">
          <span>{seoFill(copy.author)}</span>
          <span aria-hidden>·</span>
          <time dateTime={post.publishedAt}>{seoFill(copy.published, { date: formatDate(lang, post.publishedAt) })}</time>
          {updated && (
            <>
              <span aria-hidden>·</span>
              <time dateTime={post.updatedAt}>{seoFill(copy.updated, { date: formatDate(lang, post.updatedAt) })}</time>
            </>
          )}
          <span aria-hidden>·</span>
          <span>{seoFill(copy.read_time, { min: readingMinutes(t.body) })}</span>
        </p>

        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={t.title}
            className="mt-6 aspect-[16/9] w-full rounded-2xl object-cover"
            fetchPriority="high"
          />
        )}

        {t.excerpt && <p className="mt-6 text-[17px] font-medium leading-relaxed text-white/90">{t.excerpt}</p>}

        <div className="mt-6">
          <MarkdownBody source={t.body} />
        </div>
      </article>

      {post.games.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-[20px] font-bold text-white md:text-[22px]">{copy.games_title}</h2>
          <GameTiles games={post.games} providers={providers} playLabel={copy.play} />
        </section>
      )}

      {more.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-[20px] font-bold text-white md:text-[22px]">{copy.latest}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {more.map((p) => (
              <PostCard key={p.slug} lang={lang} post={p} label={copy.categories[p.category] ?? p.category} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
