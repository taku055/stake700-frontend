#!/usr/bin/env node
/**
 * Submit site URLs to IndexNow (Bing, Yandex, Seznam, Naver share submissions).
 *
 *   npm run indexnow                      all URLs from the live sitemaps
 *   npm run indexnow -- --only=blog,best-slots,promotions
 *                                         only URLs whose path contains one of these
 *   npm run indexnow -- --since=2026-11-20
 *                                         only URLs with <lastmod> on/after that date
 *                                         (URLs without lastmod are skipped)
 *   npm run indexnow -- --no-games        skip the game sitemaps (thousands of URLs)
 *   npm run indexnow -- https://site/en/blog/x https://site/ar/blog/x
 *                                         submit exactly these URLs
 *   add --dry-run to print what would be sent without sending it
 *
 * Needs INDEXNOW_KEY (also served at /indexnow-key.txt) and the public site URL:
 * NEXT_PUBLIC_SITE_URL, or NEXT_PUBLIC_SITE_DOMAIN (https is assumed).
 */

const ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH = 10_000; // protocol limit per request

const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
const flagValue = (name) => flag(name)?.split("=").slice(1).join("=") || "";
const dryRun = !!flag("dry-run");
const noGames = !!flag("no-games");
const only = flagValue("only").split(",").map((s) => s.trim()).filter(Boolean);
const since = flagValue("since");
const explicit = args.filter((a) => !a.startsWith("--"));

function fail(msg) {
  console.error(`indexnow: ${msg}`);
  process.exit(1);
}

function siteOrigin() {
  const explicitUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN;
  // Same rule as the site (src/lib/seo.ts): http only for local hosts
  const scheme = /^(localhost|127\.|0\.0\.0\.0)/.test(domain ?? "") ? "http" : "https";
  const raw = explicitUrl || (domain ? `${scheme}://${domain}` : "");
  if (!raw) fail("set NEXT_PUBLIC_SITE_URL or NEXT_PUBLIC_SITE_DOMAIN");
  const url = new URL(raw);
  if (/^(localhost|127\.|0\.0\.0\.0)/.test(url.hostname) && !dryRun) {
    fail(`site is ${url.origin} – IndexNow only accepts public URLs (use --dry-run to test locally)`);
  }
  return url.origin;
}

async function fetchText(url) {
  let res;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  } catch (e) {
    throw new Error(`${url} unreachable (${e?.cause?.code ?? e?.message ?? e})`);
  }
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.text();
}

/** All <url> entries from a sitemap: { loc, lastmod } */
function parseSitemap(xml) {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => ({
    loc: block.match(/<loc>\s*([^<\s]+)\s*<\/loc>/)?.[1]?.replace(/&amp;/g, "&"),
    lastmod: block.match(/<lastmod>\s*([^<\s]+)\s*<\/lastmod>/)?.[1],
  })).filter((u) => u.loc);
}

async function sitemapUrls(origin) {
  // robots.txt lists the main sitemap plus every game sitemap that has games
  let sitemaps = [`${origin}/sitemap.xml`];
  try {
    const robots = await fetchText(`${origin}/robots.txt`);
    const listed = [...robots.matchAll(/^\s*sitemap:\s*(\S+)/gim)].map((m) => m[1]);
    if (listed.length) sitemaps = listed;
  } catch (e) {
    console.warn(`indexnow: robots.txt unavailable (${e.message}); using /sitemap.xml only`);
  }
  if (noGames) sitemaps = sitemaps.filter((s) => !s.includes("games-sitemap"));
  // Fetch from the configured origin even if robots.txt names another host
  sitemaps = sitemaps.map((s) => {
    const u = new URL(s);
    return `${origin}${u.pathname}${u.search}`;
  });

  const entries = [];
  for (const sm of sitemaps) {
    const list = parseSitemap(await fetchText(sm));
    console.log(`  ${sm}: ${list.length} URLs`);
    entries.push(...list);
  }
  return entries;
}

async function submit(origin, key, urls) {
  const host = new URL(origin).host;
  const keyLocation = `${origin}/indexnow-key.txt`;
  for (let i = 0; i < urls.length; i += BATCH) {
    const urlList = urls.slice(i, i + BATCH);
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key, keyLocation, urlList }),
      signal: AbortSignal.timeout(60_000),
    });
    const text = await res.text().catch(() => "");
    // 200 = accepted, 202 = accepted, key validation pending
    if (res.status !== 200 && res.status !== 202) {
      fail(`batch ${i / BATCH + 1}: HTTP ${res.status} ${text.slice(0, 300)}`);
    }
    console.log(`  batch ${i / BATCH + 1}: ${urlList.length} URLs → HTTP ${res.status}`);
  }
}

const key = process.env.INDEXNOW_KEY?.trim() ?? "";
if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) fail("set INDEXNOW_KEY (8–128 characters: letters, digits, dashes)");
const origin = siteOrigin();

let urls;
try {
if (explicit.length) {
  urls = explicit;
} else {
  console.log(`Reading sitemaps from ${origin}`);
  let entries = await sitemapUrls(origin);
  if (since) {
    const from = new Date(since);
    if (Number.isNaN(from.getTime())) fail(`--since: invalid date "${since}"`);
    entries = entries.filter((e) => e.lastmod && new Date(e.lastmod) >= from);
  }
  urls = entries.map((e) => e.loc);
  const foreign = urls.find((u) => new URL(u).origin !== origin);
  if (foreign) {
    fail(
      `the sitemap lists ${new URL(foreign).origin} URLs but the site is ${origin}. ` +
        "Set NEXT_PUBLIC_SITE_DOMAIN (or NEXT_PUBLIC_SITE_URL) to the public domain in the site's environment and rebuild.",
    );
  }
}
} catch (e) {
  fail(e.message);
}
if (only.length) urls = urls.filter((u) => only.some((o) => new URL(u).pathname.includes(o)));
urls = [...new Set(urls)].filter((u) => {
  try {
    return new URL(u).origin === origin;
  } catch {
    return false;
  }
});

if (!urls.length) {
  console.log("Nothing to submit.");
  process.exit(0);
}
if (dryRun) {
  console.log(`Dry run: ${urls.length} URLs would be submitted, for example:`);
  for (const u of urls.slice(0, 15)) console.log(`  ${u}`);
  process.exit(0);
}
console.log(`Submitting ${urls.length} URLs to IndexNow…`);
await submit(origin, key, urls);
console.log("Done. Bing, Yandex, Seznam and Naver share IndexNow submissions.");
