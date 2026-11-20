import { Link } from "@/components/common/Link";
import { routes } from "@/config/routes";
import type { Locale } from "@/config/i18n";
import type { BlogListItem } from "@/lib/server-data";

export function formatDate(lang: Locale, iso: string) {
  return new Intl.DateTimeFormat(lang, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(iso),
  );
}

export default function PostCard({ lang, post, label }: { lang: Locale; post: BlogListItem; label: string }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--background-secondary)] bg-[var(--bar-background-color)] transition-colors hover:border-[var(--primary-color)]">
      <Link href={routes.blogPost(post.slug)} prefetch={false} className="flex h-full flex-col">
        <span className="relative block aspect-[16/9] overflow-hidden bg-[linear-gradient(135deg,#1f3a4d,#0f212e)]">
          {post.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImage}
              alt={post.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
          <span className="absolute start-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
            {label}
          </span>
        </span>
        <span className="flex flex-1 flex-col gap-2 p-4">
          <h2 className="line-clamp-2 text-[17px] font-bold leading-snug text-white">{post.title}</h2>
          {post.excerpt && (
            <p className="line-clamp-3 text-[14px] leading-relaxed text-[var(--text-muted-color)]">{post.excerpt}</p>
          )}
          <time dateTime={post.publishedAt} className="mt-auto pt-2 text-[12px] text-[var(--text-muted-color)]">
            {formatDate(lang, post.publishedAt)}
          </time>
        </span>
      </Link>
    </article>
  );
}

