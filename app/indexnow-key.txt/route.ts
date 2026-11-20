/**
 * IndexNow ownership file. Search engines (Bing, Yandex, Seznam, Naver) fetch
 * this URL (sent as `keyLocation`) and check it contains the submitted key.
 * Set INDEXNOW_KEY (8–128 characters: a-z, A-Z, 0-9, dashes) per deployment.
 */
export const dynamic = "force-dynamic";

export function GET() {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key || !/^[a-zA-Z0-9-]{8,128}$/.test(key)) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(key, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}
