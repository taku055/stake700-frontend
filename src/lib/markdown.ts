/**
 * Minimal, dependency-free Markdown parser for blog posts.
 *
 * Produces a small AST that is rendered with React (which escapes all text),
 * so post bodies can never inject HTML or scripts. Supported:
 *   # / ## / ###  headings (rendered one level down: the page title is the H1)
 *   paragraphs, - / * bullet lists, 1. numbered lists, > quotes, --- rules
 *   ![alt](https://image) on its own line
 *   inline: **bold**, *italic*, `code`, [text](https://… or /internal-path)
 * Keep in sync with the back office copy (platform-backoffice-seven/lib/markdown.ts).
 */

export type Inline =
  | { t: "text"; v: string }
  | { t: "strong"; c: Inline[] }
  | { t: "em"; c: Inline[] }
  | { t: "code"; v: string }
  | { t: "link"; href: string; c: Inline[] };

export type Block =
  | { t: "h"; level: 2 | 3 | 4; c: Inline[]; id: string }
  | { t: "p"; c: Inline[] }
  | { t: "ul" | "ol"; items: Inline[][] }
  | { t: "quote"; c: Inline[] }
  | { t: "img"; src: string; alt: string }
  | { t: "hr" };

/** Only https URLs and site-internal paths are allowed as link/image targets. */
export function safeHref(href: string): string | null {
  const h = href.trim();
  if (/^https:\/\/[^\s]+$/i.test(h)) return h;
  if (/^\/(?!\/)[^\s]*$/.test(h)) return h;
  return null;
}

export function slugifyHeading(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "section"
  );
}

const INLINE_RE = /(\*\*([^*]+)\*\*|\*([^*\s][^*]*)\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\))/;

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let rest = text;
  while (rest) {
    const m = INLINE_RE.exec(rest);
    if (!m) {
      out.push({ t: "text", v: rest });
      break;
    }
    if (m.index > 0) out.push({ t: "text", v: rest.slice(0, m.index) });
    if (m[2] !== undefined) out.push({ t: "strong", c: parseInline(m[2]) });
    else if (m[3] !== undefined) out.push({ t: "em", c: parseInline(m[3]) });
    else if (m[4] !== undefined) out.push({ t: "code", v: m[4] });
    else {
      const href = safeHref(m[6]);
      const label = parseInline(m[5]);
      if (href) out.push({ t: "link", href, c: label });
      else out.push(...label);
    }
    rest = rest.slice(m.index + m[0].length);
  }
  return out;
}

export function inlineText(nodes: Inline[]): string {
  return nodes.map((n) => (n.t === "text" || n.t === "code" ? n.v : inlineText(n.c))).join("");
}

export function parseMarkdown(src: string): Block[] {
  const lines = src.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  const usedIds = new Set<string>();
  let para: string[] = [];

  const flush = () => {
    if (para.length) blocks.push({ t: "p", c: parseInline(para.join(" ").trim()) });
    para = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      flush();
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      flush();
      const c = parseInline(heading[2].replace(/\s*#+\s*$/, ""));
      let id = slugifyHeading(inlineText(c));
      for (let n = 2; usedIds.has(id); n++) id = `${slugifyHeading(inlineText(c))}-${n}`;
      usedIds.add(id);
      blocks.push({ t: "h", level: (heading[1].length + 1) as 2 | 3 | 4, c, id });
      continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(line)) {
      flush();
      blocks.push({ t: "hr" });
      continue;
    }

    const img = /^!\[([^\]]*)\]\(([^)\s]+)\)$/.exec(line);
    if (img) {
      flush();
      const src = safeHref(img[2]);
      if (src) blocks.push({ t: "img", src, alt: img[1] });
      continue;
    }

    if (/^>\s?/.test(line)) {
      flush();
      const quote: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) quote.push(lines[i++].trim().replace(/^>\s?/, ""));
      i--;
      blocks.push({ t: "quote", c: parseInline(quote.join(" ")) });
      continue;
    }

    const bullet = /^[-*]\s+/;
    const numbered = /^\d+[.)]\s+/;
    if (bullet.test(line) || numbered.test(line)) {
      flush();
      const re = bullet.test(line) ? bullet : numbered;
      const items: Inline[][] = [];
      while (i < lines.length && re.test(lines[i].trim())) items.push(parseInline(lines[i++].trim().replace(re, "")));
      i--;
      blocks.push({ t: re === bullet ? "ul" : "ol", items });
      continue;
    }

    para.push(line);
  }
  flush();
  return blocks;
}

/** Plain-text summary of a Markdown body (for meta descriptions). */
export function markdownExcerpt(src: string, max = 155): string {
  const text = parseMarkdown(src)
    .filter((b): b is Extract<Block, { t: "p" }> => b.t === "p")
    .map((b) => inlineText(b.c))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

/** Rough reading time in minutes (≈ 200 words per minute). */
export function readingMinutes(src: string): number {
  return Math.max(1, Math.round(src.split(/\s+/).filter(Boolean).length / 200));
}
