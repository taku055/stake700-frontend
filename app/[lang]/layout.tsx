import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import AppProviders from "@/provider/AppProviders";
import { isLocale, isRtlLocale } from "@/config/i18n";
import { SITE_NAME, siteUrl, translate } from "@/lib/seo";
import { JsonLd, organizationLd, websiteLd } from "@/lib/jsonld";
import "@/styles/index.css";
import "@/styles/globals.scss";

const FAVICON = "/images/brand/favicons";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "en";
  return {
    metadataBase: siteUrl(),
    applicationName: SITE_NAME,
    title: {
      default: translate(locale, "Seo.home_title"),
      template: `%s | ${SITE_NAME}`,
    },
    description: translate(locale, "Seo.site_description"),
    manifest: "/manifest.json",
    formatDetection: { telephone: false },
    // Search Console / Webmaster ownership tags, set per deployment
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
      other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
        : undefined,
    },
    other: { "msapplication-TileColor": "#232323" },
    // Brand icon set in public/images/brand/favicons (the old S3 URLs return 403).
    icons: {
      shortcut: `${FAVICON}/favicon.ico`,
      apple: { url: `${FAVICON}/stake700-favicon-180.png`, sizes: "180x180", type: "image/png" },
      icon: [
        { url: `${FAVICON}/favicon.ico`, sizes: "any" },
        { url: `${FAVICON}/stake700-favicon-16.png`, sizes: "16x16", type: "image/png" },
        { url: `${FAVICON}/stake700-favicon-32.png`, sizes: "32x32", type: "image/png" },
        { url: `${FAVICON}/stake700-favicon-48.png`, sizes: "48x48", type: "image/png" },
        { url: `${FAVICON}/stake700-favicon-192.png`, sizes: "192x192", type: "image/png" },
        { url: `${FAVICON}/stake700-favicon-512.png`, sizes: "512x512", type: "image/png" },
      ],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1a2c38",
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  // Pages depend on the request (session, search params), so render them per request
  await connection();

  return (
    <html lang={lang} dir={isRtlLocale(lang) ? "rtl" : "ltr"} className="dark">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/css/flag-icons.min.css" />
      </head>
      <body>
        <JsonLd data={[organizationLd(), websiteLd(lang, translate(lang, "Seo.site_description"))]} />
        <AppProviders lang={lang}>{children}</AppProviders>
      </body>
    </html>
  );
}
