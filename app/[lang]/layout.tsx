import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import AppProviders from "@/provider/AppProviders";
import { isLocale, isRtlLocale } from "@/config/i18n";
import { SITE_NAME, siteUrl, translate } from "@/lib/seo";
import { JsonLd, organizationLd, websiteLd } from "@/lib/jsonld";
import "@/styles/index.css";
import "@/styles/globals.scss";

const FAVICON = "https://tekio.s3.eu-north-1.amazonaws.com/stake700/logos";

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
    other: { "msapplication-TileColor": "#232323" },
    icons: {
      shortcut: `${FAVICON}/favicon.ico`,
      apple: `${FAVICON}/apple-touch-icon.png`,
      icon: [
        { url: `${FAVICON}/favicon.ico` },
        { url: `${FAVICON}/favicon-16x16.png`, sizes: "16x16", type: "image/png" },
        { url: `${FAVICON}/favicon-32x32.png`, sizes: "32x32", type: "image/png" },
        { url: `${FAVICON}/favicon-192x192.png`, sizes: "192x192", type: "image/png" },
        { url: `${FAVICON}/favicon-512x512.png`, sizes: "512x512", type: "image/png" },
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
        <Script
          src="https://ta-betinovio-wr5yui56.btgpub.online/assets/sdk/shadow/init.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
