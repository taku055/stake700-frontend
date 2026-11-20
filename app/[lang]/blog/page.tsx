import type { Metadata } from "next";
import { Link } from "@/components/common/Link";
import { routes } from "@/config/routes";
import { buildMetadata, resolveLang, translate } from "@/lib/seo";
import { JsonLd, breadcrumbLd, itemListLd } from "@/lib/jsonld";
import { seoFill, seoSection } from "@/lib/seo-content";
import { BLOG_CATEGORIES, getBlogList, type BlogCategory } from "@/lib/server-data";
import PostCard from "@/components/Seo/PostCard";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const PAGE_SIZE = 12;

async function readQuery(searchParams: Props["searchParams"]) {
  const q = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const cat = one(q.category).toUpperCase() as BlogCategory;
  const category = BLOG_CATEGORIES.includes(cat) ? cat : undefined;
  const page = Math.max(1, Number.parseInt(one(q.page), 10) || 1);
  return { category, page };
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const lang = await resolveLang(params);
  const { category, page } = await readQuery(searchParams);
  const copy = seoSection(lang, "blog");
  const base = seoFill(copy.meta_title);
  const title = [base, category ? copy.categories[category] : null, page > 1 ? seoFill(copy.page, { page }) : null]
    .filter(Boolean)
    .join(" – ");
  // Filtered and later pages stay crawlable but out of the index; posts are in the sitemap
  return buildMetadata({
    lang,
    path: routes.blog(),
    title,
    description: seoFill(copy.meta_description),
    noindex: !!category || page > 1,
    follow: true,
  });
}

export default async function Page({ params, searchParams }: Props) {
  const lang = await resolveLang(params);
  const { category, page } = await readQuery(searchParams);
  const copy = seoSection(lang, "blog");
  const data = await getBlogList(lang, { page, pageSize: PAGE_SIZE, category });
  const items = data?.items ?? [];
  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;
  const title = seoFill(copy.title);

  const tabs: { key?: BlogCategory; name: string }[] = [
    { name: copy.all },
    ...BLOG_CATEGORIES.map((c) => ({ key: c, name: copy.categories[c] })),
  ];

  return (
    <div className="w-full px-4 pb-6 pt-6 md:px-8">
      <JsonLd
        data={[
          breadcrumbLd(lang, [
            { name: translate(lang, "Seo.home"), path: routes.home() },
            { name: title, path: routes.blog() },
          ]),
          ...(items.length
            ? [itemListLd(lang, title, items.map((p) => ({ name: p.title, path: routes.blogPost(p.slug), image: p.coverImage ?? undefined })))]
            : []),
        ]}
      />
      <header className="border-b border-[var(--background-secondary)] pb-5">
        <h1 className="text-[28px] font-extrabold leading-tight text-white md:text-[40px]">{title}</h1>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-[var(--text-muted-color)]">{seoFill(copy.intro)}</p>
        <nav aria-label={copy.all} className="mt-5 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const active = tab.key === category;
            return (
              <Link
                key={tab.name}
                href={routes.blog({ category: tab.key })}
                prefetch={false}
                aria-current={active ? "page" : undefined}
                className={`rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                  active
                    ? "border-[var(--primary-color)] bg-[var(--primary-color)] text-white"
                    : "border-[var(--background-secondary)] text-[var(--text-muted-color)] hover:text-white"
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </header>

      {items.length === 0 ? (
        <p className="py-16 text-center text-[15px] text-[var(--text-muted-color)]">{copy.empty}</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((post) => (
            <PostCard key={post.slug} lang={lang} post={post} label={copy.categories[post.category] ?? post.category} />
          ))}
        </div>
      )}

      {pages > 1 && (
        <nav aria-label={seoFill(copy.page, { page })} className="mt-8 flex items-center justify-center gap-3">
          {page > 1 && (
            <Link
              href={routes.blog({ category, page: page - 1 })}
              rel="prev"
              className="rounded-full border border-[var(--background-secondary)] px-4 py-2 text-[14px] font-semibold text-white hover:border-[var(--primary-color)]"
            >
              {copy.prev}
            </Link>
          )}
          <span className="text-[13px] text-[var(--text-muted-color)]">
            {page} / {pages}
          </span>
          {page < pages && (
            <Link
              href={routes.blog({ category, page: page + 1 })}
              rel="next"
              className="rounded-full border border-[var(--background-secondary)] px-4 py-2 text-[14px] font-semibold text-white hover:border-[var(--primary-color)]"
            >
              {copy.next}
            </Link>
          )}
        </nav>
      )}

    </div>
  );
}
