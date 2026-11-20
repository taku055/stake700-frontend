import type { ReactNode } from "react";
import { Link } from "@/components/common/Link";
import { parseMarkdown, type Inline } from "@/lib/markdown";

/** Renders a Markdown post body. All text goes through React, so it is escaped. */

function renderInline(nodes: Inline[], keyBase = ""): ReactNode[] {
  return nodes.map((n, i) => {
    const key = `${keyBase}${i}`;
    switch (n.t) {
      case "text":
        return n.v;
      case "strong":
        return (
          <strong key={key} className="font-semibold text-white">
            {renderInline(n.c, `${key}-`)}
          </strong>
        );
      case "em":
        return <em key={key}>{renderInline(n.c, `${key}-`)}</em>;
      case "code":
        return (
          <code key={key} className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[0.9em] text-white">
            {n.v}
          </code>
        );
      case "link":
        return n.href.startsWith("/") ? (
          <Link key={key} href={n.href} className="font-medium text-[var(--primary-color)] underline-offset-2 hover:underline">
            {renderInline(n.c, `${key}-`)}
          </Link>
        ) : (
          <a
            key={key}
            href={n.href}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="font-medium text-[var(--primary-color)] underline-offset-2 hover:underline"
          >
            {renderInline(n.c, `${key}-`)}
          </a>
        );
    }
  });
}

export default function MarkdownBody({ source }: { source: string }) {
  const blocks = parseMarkdown(source);
  return (
    <div className="flex flex-col gap-4 text-[15px] leading-[1.75] text-[var(--text-muted-color)] md:text-[16px]">
      {blocks.map((b, i) => {
        switch (b.t) {
          case "h": {
            const Tag = `h${b.level}` as "h2" | "h3" | "h4";
            const size = b.level === 2 ? "text-[22px] md:text-[24px]" : b.level === 3 ? "text-[18px] md:text-[20px]" : "text-[16px]";
            return (
              <Tag key={i} id={b.id} className={`mt-4 scroll-mt-28 font-bold leading-snug text-white ${size}`}>
                {renderInline(b.c)}
              </Tag>
            );
          }
          case "p":
            return <p key={i}>{renderInline(b.c)}</p>;
          case "ul":
          case "ol": {
            const Tag = b.t;
            return (
              <Tag key={i} className={`flex flex-col gap-1.5 ps-6 ${b.t === "ul" ? "list-disc" : "list-decimal"}`}>
                {b.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </Tag>
            );
          }
          case "quote":
            return (
              <blockquote key={i} className="border-s-4 border-[var(--primary-color)] ps-4 italic text-white/90">
                {renderInline(b.c)}
              </blockquote>
            );
          case "img":
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={b.src} alt={b.alt} loading="lazy" decoding="async" className="w-full rounded-xl" />
            );
          case "hr":
            return <hr key={i} className="border-[var(--background-secondary)]" />;
        }
      })}
    </div>
  );
}
